import * as React from 'react';
import * as h from 'react-hyperscript';

import Header from './header';

import './layout.styl';

export interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.SFC<LayoutProps> = function (props: LayoutProps) {
  return h('.wrapper', [
    h(Header)
  , props.children
  ]);
};

export default Layout;
