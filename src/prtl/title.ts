import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { Link } from 'inferno-router';

export const renderTitle = (): VNode => {
  return h('.title', {},
    h(Link, { to: '/' },
      h('img.logo', {
        alt: 'Eloquentlog'
      , src: '/img/wolf-paw-72x72.png'
      , width: 36
      , height: 36
      })));
};
