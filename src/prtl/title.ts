import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

export const renderTitle = (): VNode => {
  return h('.title', {},
    h('a', { href: '/' },
      h('img.logo', {
        alt: 'Eloquentlog'
      , src: '/img/wolf-paw-72x72.png'
      , width: 36
      , height: 36
      })));
};
