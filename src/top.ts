import * as H from 'history';
import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { version } from '../package.json';

interface TopProps {
  history: H.History;
  signedIn: boolean;
  removeToken: () => void;
}

export const Top = (props: TopProps): VNode => {
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
