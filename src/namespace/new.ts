import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { Link } from 'inferno-router';

import { sidebarItems } from './_sidebar';
import { NamespaceForm, NamespaceFormContext } from './_form';
import { RouteProps } from '../routing';
import { Layout } from '../prtl/layout';

import '../styl/namespace/index.styl';

interface NamespaceNewProps extends RouteProps {}

export const NamespaceNew = (props: NamespaceNewProps): VNode => {
  return h(Layout, {
    sidebarItems
  , children: h('#namespace.content', {},
      h('.grid.namespace', {},
        h('.row', {},
          h(`.column-10.offset-3
.column-v-12.offset-v-2
.column-l-10.offset-l-3
.column-m-16`, {}, h('.transparent.box', {},
            h('.container', [
              h('.breadcrumb', [
                  h('span.divider', {}, '/')
                , h(Link, {
                    to: '/namespace/'
                  , className: 'item'
                  }, 'Namespaces')
                , h('span.divider', {}, '/')
                , h('a.item.active', { href: '#' }, 'New')
              ])
            , h('h4.header', {}, 'New Namespace')
            , h(NamespaceForm, {
                context: NamespaceFormContext.Create
              , parent: props 
              })
            ])
          ))
        )
      )
    )
  , ...props
  });
};

NamespaceNew.defaultProps = {};

NamespaceNew.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'New Namespace - Eloquentlog';
  }
};
