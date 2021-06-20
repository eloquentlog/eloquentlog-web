import { Component, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { Redirect, Link } from 'inferno-router';

import { sidebarItems } from './_sidebar';
import { RouteProps } from '../routing';
import { Layout } from '../prtl/layout';

import { message as msg } from '../util/message';

import { NamespaceForm, NamespaceFormContext } from './_form';

import '../styl/namespace/index.styl';

export interface NamespaceNewProps extends RouteProps {}

interface NamespaceNewState {
  nextURL: string;
}

export class NamespaceNew extends
  Component<NamespaceNewProps, NamespaceNewState> {
  constructor(props: NamespaceNewProps) {
    super(props);

    this.state = {
      nextURL: undefined
    };
  }

  public componentDidMount() {
    document.title = 'New Namespace - Eloquentlog';
  }

  // FIXME:
  // This change on props.history won't make any redirect
  public redirectAction(url?: string) {
    let nextURL = '/namespace';
    if (url !== undefined || url !== '') {
      nextURL = url;
    }
    this.props.history.push(url, {
      flash: msg.flash.namespace.create.success
    });
    // workaround
    this.setState({ nextURL });
  }

  public render(props: NamespaceNewProps): VNode {
    const { nextURL } = this.state;
    if (nextURL !== undefined) {
      return h(Redirect, { to: nextURL });
    }
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
                , redirect: this.redirectAction.bind(this)
                })
              ])
            ))
          )
        )
      )
    , ...props
    });
  }
}
