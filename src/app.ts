import * as H from 'history';
import { Component, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { BrowserRouter, Redirect, Route, Switch } from 'inferno-router';

import { applyTheme, matchTheme, Theme } from './util/theme';
import { readToken, saveToken } from './util/token';

// components
import { PasswordReset } from './password_reset';
import { PasswordResetRequest } from './password_reset_request';
import { PersonalToken } from './personal_token';
import { Signin } from './signin';
import { Signup } from './signup';
import { Top } from './top';
import { UserActivation } from './user/activation';

interface AppProps {
  history: H.History;
}

interface AppState {
  stamp?: string;
  theme?: Theme;
}

const tokenKey = 'header.payload';

export class App extends Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props);

    this.state = {
      stamp: undefined
    , theme: Theme.Light
    };
  }

  public componentWillMount () {
    this.state.stamp = this.getStamp();
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
    let theme = window.localStorage.getItem('theme');
    if (theme === null) {
      theme = Theme.Light;
    }
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

  public getToken(): string {
    const token = readToken(tokenKey);
    if (token !== undefined) {
      return token.value;
    }
    return undefined;
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
            console.debug('/');
            return this.signedIn() ? h(Top, {
                delStamp: this.delStamp.bind(this)
              , getToken: this.getToken.bind(this)
              , history: this.props.history
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
            console.debug('/password/reset');
            const props = {
              history: this.props.history
            , setTheme: this.setTheme.bind(this)
            , theme: this.state.theme
            };
            const params = new URLSearchParams(props.history.location.search);
            if (params.has('s') && params.has('t')) {
              const aProps = { params, ...props };
              return h(PasswordReset, aProps);
            } else {
              return h(PasswordResetRequest, props);
            }
          }
        })
      , h(Route, {
          exact: true
        , path: '/signout'
        , render: () => {
            console.debug('/signout');
            this.delStamp();
            return h(Redirect, { to: '/signin' });
          }
        })
      , h(Route, {
          exact: true
        , path: '/signin'
        , render: () => {
            console.debug('/signin');
            return this.signedIn() ? h(Redirect, { to: '/' }) : h(Signin, {
              history: this.props.history
            , putStamp: this.putStamp.bind(this)
            , setStamp: this.setStamp.bind(this)
            , setTheme: this.setTheme.bind(this)
            , theme: this.state.theme
            });
          }
        })
      , h(Route, {
          exact: true
        , path: '/signup'
        , render: () => {
            console.debug('/signup');
            return this.signedIn() ? h(Redirect, { to: '/' }) : h(Signup, {
              history: this.props.history
            , setTheme: this.setTheme.bind(this)
            , theme: this.state.theme
            });
          }
        })
      , h(Route, {
          exact: true
        , path: '/user/activate'
        , render: () => {
            console.debug('/user/activate');
            const props = {
              history: this.props.history
            , activated: false
            };
            return h(UserActivation, props);
          }
        })
      , h(Route, {
          exact: true
        , path: '/token'
        , render: () => {
            console.debug('/token');
            const props = {
              history: this.props.history
            , activated: false
            };
            return h(PersonalToken, props);
          }
        })
      ])
    );
  }

  private delStamp (): void {
    this.state.stamp = this.putStamp(undefined);
  }

  private getStamp (): string {
    const token = readToken(tokenKey);
    // TODO: consider this (for now, just return limit as stamp)
    if (token !== undefined) {
      return token.limit.toString();
    }
    return undefined;
  }

  private putStamp (value: string): string {
    saveToken(tokenKey, value);
    return this.getStamp();
  }

  private setStamp (stamp: string): void {
    this.setState({ stamp });
  }

  private signedIn (): boolean {
    return (this.state.stamp !== null && this.state.stamp !== undefined);
  }
}
