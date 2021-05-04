import * as H from 'history';
import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { Redirect, Route, Switch } from 'inferno-router';

import { Theme } from './util/theme';

import { PasswordReset } from './password_reset';
import { PasswordResetRequest } from './password_reset_request';
import { Signin } from './signin';
import { Signup } from './signup';
import { UserActivation } from './user/activation';

import { Top } from './top';
import { NamespaceIndex } from './namespace/index';
import { NamespaceNew } from './namespace/new';
import { NamespaceShow } from './namespace/show';
import { AccessToken } from './settings/access_token';

import * as cfg from '../config.json';

const baseURL = `${cfg.Server.Protocol}://
${cfg.Server.Host}:${cfg.Server.Port}`;

export interface RouteProps {
  history: H.History;

  getToken: () => string;

  delStamp: () => void;
  getStamp: () => string;
  putStamp: (value: string) => string;
  setStamp: (stamp: string) => void;

  signedIn: () => boolean;

  handleTheme: () => void;
  getTheme: () => Theme;
  setTheme: (theme: Theme, update: boolean) => void;
  theme: Theme;
}

const redirectToSignin = (): VNode => {
  return h(Redirect, { to: {
    pathname: '/signin'
  , state: {
      flash: 'Please sign in'
    }
  }});
};

export const Routing = (props: RouteProps): VNode => {
  props.handleTheme();
  return h(Switch, {}, [
    h(Route, {
      strict: true
    , exact: true
    , path: '/'
    , render: () => {
        return props.signedIn() ?
          h(Top, props) :
          redirectToSignin();
      }
    })
  , h(Route, {
      exact: true
    , path: '/namespace/new'
    , render: () => {
        return props.signedIn() ?
          h(NamespaceNew, props) :
          redirectToSignin();
      }
    })
  , h(Route, {
      exact: true
    , path: '/namespace/:id'
    , render: () => {
        const url = new URL(window.location.pathname, baseURL);
        const id = url.pathname.replace('/namespace/', '');
        return props.signedIn() ?
          h(NamespaceShow, {
            id
          , ...props
          }) :
          redirectToSignin();
      }
    })
  , h(Route, {
      exact: true
    , path: '/namespace'
    , render: () => {
        return props.signedIn() ?
          h(NamespaceIndex, props) :
          redirectToSignin();
      }
    })
  , h(Route, {
      exact: true
    , path: '/password/reset'
    , render: () => {
        const params = new URLSearchParams(props.history.location.search);
        if (params.has('s') && params.has('t')) {
          return h(PasswordReset, {
            params
          , ...props
          });
        } else {
          return h(PasswordResetRequest, props);
        }
      }
    })
  , h(Route, {
      exact: true
    , path: '/settings/token'
    , render: () => {
        return props.signedIn() ?
          h(AccessToken, props) :
          redirectToSignin();
      }
    })
  , h(Route, {
      exact: true
    , path: '/signout'
    , render: () => {
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
        return props.signedIn() ?
          h(Redirect, { to: '/' }) :
          h(Signin, props);
      }
    })
  , h(Route, {
      exact: true
    , path: '/signup'
    , render: () => {
        return props.signedIn() ?
          h(Redirect, { to: '/' }) :
          h(Signup, props);
      }
    })
  , h(Route, {
      exact: true
    , path: '/user/activate'
    , render: () => {
        return h(UserActivation, {
          history
        , activated: false
        });
      }
    })
  ]);
};
