import * as H from 'history';
import { Component, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { BrowserRouter, Redirect, Route, Switch } from 'inferno-router';

import { applyTheme, matchTheme, Theme } from './util/theme';

// components
import { PasswordReset } from './password_reset';
import { Signin } from './signin';
import { Signup } from './signup';
import { Top } from './top';

interface AppProps {
  history: H.History;
}

interface AppState {
  token?: string;
  theme?: Theme;
}

export class App extends Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props);

    this.state = {
      token: undefined
    , theme: Theme.Light
    };
  }

  public componentWillMount () {
    this.state.token = this.getToken();
    this.state.theme = this.getTheme();
  }

  public handleTheme (): void {
    const { location } = this.props.history;

    matchTheme(
      location
    , (): void => this.setTheme(Theme.Dark, false)
    , (): void => this.setTheme(Theme.Light, false)
    );
    applyTheme(this.state.theme);
  }

  public getTheme (): Theme {
    const theme = window.localStorage.getItem('theme');
    return theme as Theme;
  }

  public setTheme (theme: Theme, update = true): void {
    window.localStorage.setItem('theme', theme);
    if (!update) {
      this.state.theme = theme;
    } else {
      this.setState({ theme });
    }
  }

  public getToken (): string {
    const token = window.localStorage.getItem('authorization_token');
    return token;
  }

  public removeToken (): void {
    window.localStorage.removeItem('authorization_token');
    this.setState({ token: undefined });
  }

  public setToken (token: string): void {
    window.localStorage.setItem('authorization_token', token);
    this.setState({ token });
  }

  public render (): VNode {
    this.handleTheme();

    return h(BrowserRouter, {},
      h(Switch, {}, [
        h(Route, {
          strict: true
        , exact: true
        , path: '/'
        , render: () => {
            return this.signedIn() ? h(Top, {
                removeToken: this.removeToken.bind(this)
              , signedIn: true
              , setTheme: this.setTheme.bind(this)
              , theme: this.state.theme
              }) :
              h(Redirect, { to: {
                pathname: '/signin'
              , state: {
                  flash: 'Please sign in'
                }
              }});
          }
        })
      , h(Route, {
          exact: true
        , path: '/password/reset'
        , render: () => {
            const props = {
              history: this.props.history
            , setTheme: this.setTheme.bind(this)
            , theme: this.state.theme
            };
            return h(PasswordReset, props);
          }
        })
      , h(Route, {
          exact: true
        , path: '/signout'
        , render: () => {
            return h(Redirect, { to: '/signin' });
          }
        })
      , h(Route, {
          exact: true
        , path: '/signin'
        , render: () => {
            return this.signedIn() ? h(Redirect, { to: '/' }) : h(Signin, {
              history: this.props.history
            , setTheme: this.setTheme.bind(this)
            , setToken: this.setToken.bind(this)
            , theme: this.state.theme
            });
          }
        })
      , h(Route, {
          exact: true
        , path: '/signup'
        , render: () => {
            return this.signedIn() ? h(Redirect, { to: '/' }) : h(Signup, {
              history: this.props.history
            , setTheme: this.setTheme.bind(this)
            , theme: this.state.theme
            });
          }
        })
      ])
    );
  }

  private signedIn (): boolean {
    return (this.state.token !== null && this.state.token !== undefined);
  }
}
