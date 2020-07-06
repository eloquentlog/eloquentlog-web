import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { RouteProps } from '../routing';
import { Sidebar, SidebarToggleButton } from './sidebar';

interface LayoutProps extends RouteProps {
  sidebarItems: VNode[];
  children: VNode | VNode[];
}

export const Layout = (props: LayoutProps): VNode[] => {
  return [
    h(Sidebar, {
      items: props.sidebarItems
    , ...props
    })
  , h('#content', {}, [
      h('#header', {}, [
        h('.global-header')
      , h(SidebarToggleButton)
      ])
    , props.children
    ])
  ];
};
