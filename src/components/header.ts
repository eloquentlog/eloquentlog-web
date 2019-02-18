import * as h from 'react-hyperscript';

import Link, { LinkProps } from 'next/link';

import './header.styl';

const Header = function () {
  const home: LinkProps = {href: '/', children: h('a', 'Home')}
      , about: LinkProps = {href: '/about', children: h('a', 'About')}
      ;

  return h('.header', [
    h(Link, home)
  , h(Link, about)
  ]);
};

export default Header;
