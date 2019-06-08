import * as H from 'history';
import { Component, render, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { BrowserRouter, Redirect, Route } from 'inferno-router';
import { version } from '../package.json';

import { Signin } from './signin';
import { Signup } from './signup';

interface TopProps {
  history: H.History;
  signedIn: boolean;
  removeToken: () => void;
}

const Top = (props: TopProps): VNode => {
  return h('.content', [
    h('h1', [
      'Eloquentlog'
    , h('span', version)
    ])
  , h('ul', props.signedIn ? [
      h('li', {}, h('a', { href: '/signout', onClick: (e: Event) => {
        e.preventDefault();
        props.removeToken();
      }}, 'Sign out'))
    ] : [
      h('li', {}, h('a', { href: '/signin' }, 'Sign in'))
    , h('li', {}, h('a', { href: '/signup' }, 'Sign up'))
    ])
  , h('.content', 'Welcome!')
  ]);
};


interface AppProps {
  history: H.History;
}

interface AppState {
  token?: string;
}

class App extends Component<AppProps, AppState> {
  constructor (props: AppProps) {
    super(props);

    this.state = {
      token: undefined
    };
  }

  public render (): VNode {
    return h(BrowserRouter, [
      , h(Route, {
          exact: true
        , path: '/'
        , render: () => {
            return this.signedIn() ? h(Top, {
                signedIn: true
              , removeToken: this.removeToken.bind(this)
              }) :
              h(Redirect, { to: {
                pathname: '/signin'
              , state: 'Please sign in'
              }});
          }
        })
      , h(Route, {
          path: '/signout'
        , render: () => {
            return h(Redirect, { to: '/signin' });
          }
      })
      , h(Route, {
          path: '/signin'
        , render: () => {
            return this.signedIn() ? h(Redirect, { to: '/' }) : h(Signin, {
              history: this.props.history
            , setToken: this.setToken.bind(this)
            });
          }
      })
      , h(Route, {
          path: '/signup'
        , render: () => {
            return this.signedIn() ? h(Redirect, { to: '/' }) : h(Signup, {
              history: this.props.history
            , setToken: this.setToken.bind(this)
            });
          }
        })
    ]);
  }

  public componentWillMount () {
    const token = window.localStorage.getItem('authorization_token');
    this.setState({ token });
  }

  public setToken (token: string): void {
    window.localStorage.setItem('authorization_token', token);
    this.setState({ token });
  }

  public removeToken (): void {
    window.localStorage.removeItem('authorization_token');
    this.setState({ token: undefined });
  }

  private signedIn (): boolean {
    return (this.state.token !== null && this.state.token !== undefined);
  }
}

render(
  h(App, { history: H.createBrowserHistory() }),
  document.querySelector('#container')
);
