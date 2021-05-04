import { Component, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { Link } from 'inferno-router';

import { sidebarItems } from './_sidebar';
import { RouteProps } from '../routing';
import { Layout } from '../prtl/layout';
import { NamespaceObject } from '../prtl/namespace';

import { validateUUID } from '../util/uuid';
import { appClient, Headers } from '../util/client';

import '../styl/namespace/show.styl';

interface NamespaceShowProps extends RouteProps {
  id: string;
}

interface NamespaceShowState {
  namespace: NamespaceObject;
}

// tslint:disable-next-line
const client = appClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [400, 404, 422].some((n: number): boolean => n === status);
});

export class NamespaceShow extends
  Component<NamespaceShowProps, NamespaceShowState> {
  constructor(props: NamespaceShowProps) {
    super(props);

    this.state = {
      namespace: null,
    };
  }

  public componentDidMount() {
    document.title = 'Namespace - Eloquentlog';
    this.fetchNamespace();
  }

  private fetchNamespace() {
    const id = this.props.id;
    if (!validateUUID(id)) {
      return;
    }

    const t = this.props.getToken();
    client.get(`/namespace/hget/${id}`, {
      withCredentials: true
    , transformRequest: [(_: any, headers: Headers) => {
        headers.Authorization = `Bearer ${t}`;
      }]
    })
    .then((res: any): void => {
      if (res.status === 200) {
        const data = res.data;
        this.setState({
          namespace: data.namespace ?
            NamespaceObject.deserialize(data.namespace) : null
        });
        return;
      }
      throw new Error(`unexpected response: ${res}`);
    })
    .catch((err: any): void => {
      // TODO
      console.log(err);
    });
  }

  public render(props: NamespaceShowProps): VNode {
    const ns = this.state.namespace;
    return ns === null ?
      h(Layout, {
        sidebarItems
      , children: h('#namespace.show.content', {})
      , ...props
      }) :
      h(Layout, {
        sidebarItems
      , children: h('#namespace.show.content', {},
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
                    , h('a.item.active', { href: '#' },
                        ns.uuid)
                  ])
                , h('h4.header', {}, ns.name)
                , h('.container', [
                    h('.status', [
                      // TODO: archived
                      h('label.primary.label', {}, 'Opened')
                    , h('span', {}, 'created at')
                    , h('span', {}, ns.createdAt)
                    , h('span', {}, 'by')
                    , h('span', {}, 'System')
                    ])
                  , h('p', {}, ns.description)
                  , h('.description', {}, ns.description)
                  , h('.field', [
                      h('label.label', {}, 'Updated')
                    , h('span.updated', {}, ns.updatedAt)
                    ])
                  ])
                ])
              ))
            )
          )
        )
      , ...props
      });
  }
}
