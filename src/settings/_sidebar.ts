import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { Link } from 'inferno-router';

import { Icon, IconProps } from '../prtl/icon';

/**
 * Sidebar items for settings pages.
 *
 * @type {Array<VNode>}
 */
export const sidebarItems: VNode[] = [
  h('h6.section-title', 'NAVIGATION')
, h('.item-container', {},
    h(Link, { to: '/', className: 'item' }, [
      h(Icon, { name: 'milestone' } as IconProps)
    , 'Streams'
    ])
  )
, h('.item-container', {},
    h(Link, { to: '/', className: 'item' }, [
      h(Icon, { name: 'tag' } as IconProps)
    , 'Your Namespaces'
    ])
  )
, h('hr.divider')
, h('h6.section-title', 'CONFIGURATION')
, h('.item-container', {},
    h(Link, { to: '/', className: 'item' }, [
      h(Icon, { name: 'star' } as IconProps)
    , 'Preferences'
    ])
  )
, h('.item.active.expanded', {}, 
    h('.item-container', [
      h(Link, { to: '/settings/token', className: 'item' }, [
        h(Icon, { name: 'gear' } as IconProps)
      , 'Settings'
      ])
    , h('ul.item-container', [
        h(Link, { to: '/settings/token', className: 'item active' }, 'Access Tokens')
      , h(Link, { to: '/settings/token', className: 'item' }, 'Profile')
      ])
    ])
  )
];
