import * as H from 'history';
import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { Redirect, Route, Switch } from 'inferno-router';

import { Theme } from './util/theme';

import { PasswordReset } from './password_reset';
import { PasswordResetRequest } from './password_reset_request';
import { Signin } from './signin';
import { Signup } from './signup';
import { Top } from './top';
import { UserActivation } from './user/activation';
import { AccessToken } from './settings/access_token';

interface AppProps {
  history: H.History;
  theme: Theme;
  handleTheme: () => void;
  getTheme: () => Theme;
  setTheme: (theme: Theme, update: boolean) => void;
  getToken: () => string;
  delStamp: () => void;
  getStamp: () => string;
  putStamp: (value: string) => string;
  setStamp: (stamp: string) => void;
  signedIn: () => boolean;
}

export const App = (props: AppProps): VNode => {
  props.handleTheme();

  return h(Switch, {}, [
    h(Route, {
      strict: true
    , exact: true
    , path: '/'
    , render: () => {
        console.debug('/');
        return props.signedIn() ?
          h(Top, {
            delStamp: props.delStamp
          , getToken: props.getToken
          , history: props.history
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
        const routeProps = {
          history: props.history
        , setTheme: props.setTheme
        , getTheme: props.getTheme
        , theme: props.theme
        };
        const params = new URLSearchParams(props.history.location.search);
        if (params.has('s') && params.has('t')) {
          return h(PasswordReset, {
            params
          , ...routeProps
          });
        } else {
          return h(PasswordResetRequest, routeProps);
        }
      }
    })
  , h(Route, {
      exact: true
    , path: '/settings/token'
    , render: () => {
        console.debug('/settings/token');
        return props.signedIn() ?
          h(AccessToken, {
            delStamp: props.delStamp
          , getToken: props.getToken
          , history: props.history
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
    , path: '/signout'
    , render: () => {
        console.debug('/signout');
        props.delStamp();

        const showLbl =
          document.getElementById('sidebar_show_lbl') as HTMLLabelElement;
        if (showLbl !== null && !props.signedIn()) {
          showLbl.classList.add('hidden');
        }
        return h(Redirect, { to: '/signin' });
      }
    })
  , h(Route, {
      exact: true
    , path: '/signin'
    , render: () => {
        console.debug('/signin');
        return props.signedIn() ? h(Redirect, { to: '/' }) : h(Signin, {
          history: props.history
        , theme: props.theme
        , putStamp: props.putStamp
        , setStamp: props.setStamp
        , setTheme: props.setTheme
        , getTheme: props.getTheme
        });
      }
    })
  , h(Route, {
      exact: true
    , path: '/signup'
    , render: () => {
        console.debug('/signup');
        return props.signedIn() ? h(Redirect, { to: '/' }) : h(Signup, {
          history: props.history
        , theme: props.theme
        , setTheme: props.setTheme
        , getTheme: props.getTheme
        });
      }
    })
  , h(Route, {
      exact: true
    , path: '/user/activate'
    , render: () => {
        console.debug('/user/activate');
        return h(UserActivation, {
          history: props.history
        , activated: false
        });
      }
    })
  ]);
};

App.defaultProps = {};
App.defaultHooks = {};
