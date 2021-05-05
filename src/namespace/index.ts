import { Component, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { Link } from 'inferno-router';

import { sidebarItems } from './_sidebar';
import { RouteProps } from '../routing';
import { Layout } from '../prtl/layout';
import {
  Namespace,
  NamespaceObject,
} from '../prtl/namespace';
import { appClient, Headers } from '../util/client';

import '../styl/namespace/index.styl';

export interface NamespaceIndexProps extends RouteProps {}

interface NamespaceIndexState {
  namespaces: NamespaceObject[];
}

// tslint:disable-next-line
export const client = appClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [400, 404, 422].some((n: number): boolean => n === status);
});

export class NamespaceIndex extends
  Component<NamespaceIndexProps, NamespaceIndexState> {
  constructor(props: NamespaceIndexProps) {
    super(props);

    this.state = {
      namespaces: []
    };
  }

  public componentDidMount() {
    document.title = 'Namespace - Eloquentlog';
    this.fetchNamespaces();
  }

  private async fetchNamespaces() {
    const t = this.props.getToken();
    const data = await client.get('/namespace/hgetall', {
      withCredentials: true
    , transformRequest: [(_: any, headers: Headers) => {
        headers.Authorization = `Bearer ${t}`;
      }]
    })
    .then((res: any): NamespaceObject[] => {
      if (res.status === 200 && Array.isArray(res.data)) {
        return res.data.map((obj: any) => {
          return obj.namespace ?
            NamespaceObject.deserialize(obj.namespace) : null;
        });
      }
      throw new Error(`unexpected response: ${res}`);
    })
    .catch((err: any): NamespaceObject[] => {
      console.log(err);
      return [];
    });

    this.setState({ namespaces: data });
  }

  public render(props: NamespaceIndexProps): VNode {
    return h(Layout, {
      sidebarItems
    , children: h('#namespace.content', {},
        h('.grid.namespace', {},
          h('.row', {},
            h(`.column-10.offset-3
.column-v-12.offset-v-2
.column-l-10.offset-l-3
.column-m-16`, {},
              h('.transparent.box', [
                h('.container', [
                  h('.breadcrumb', [
                      h('span.divider', {}, '/')
                    , h('a.item.active', { href: '#' }, 'Namespaces')
                  ])
                , h('h4.header', {}, 'Your Namespaces')
                , h(Link, {
                    to: '/namespace/new'
                  , className: 'primary flat button new'
                  }, 'New')
                , h('table.namespace', [
                    h('thead', {}, h('tr', [
                      h('th', {}, 'Name')
                    , h('th', {}, 'Description')
                    , h('th', {}, 'Created At')
                    , h('th', {}, '')
                    ]))
                  , h('tbody', this.state.namespaces.map(
                      (n: NamespaceObject, i: number) => {
                        return h(Namespace, {
                          index: i
                        , attribute: n
                        });
                      }
                    ))
                  ])
                ])
              ])
            )
          )
        )
      )
    , ...props
    });
  }
}
