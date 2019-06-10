import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import './styl/header.styl';

interface HeaderProps {
  signedIn: boolean;
}

export const Header = (_: HeaderProps): VNode => {
  return h('.content', {},
    h('.global-header', {},
      h('p', {}, '')
    )
  );
};
