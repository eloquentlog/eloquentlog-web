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

interface NamespaceIndexProps extends RouteProps {}

interface NamespaceIndexState {
  namespaces: { attribute: NamespaceObject }[];
}

// tslint:disable-next-line
const client = appClient((status: number): boolean => {
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

  private fetchNamespaces() {
    const t = this.props.getToken();
    client.get('/namespace/hgetall', {
      withCredentials: true
    , transformRequest: [(_: any, headers: Headers) => {
        headers.Authorization = `Bearer ${t}`;
      }]
    })
    .then((res: any): void => {
      if (res.status === 200 && Array.isArray(res.data)) {
        const data = res.data.map((obj: any) => {
          return obj.namespace ?
            { attribute: NamespaceObject.deserialize(obj.namespace) } : null;
        });
        this.setState({ namespaces: data });
        return;
      }
      throw new Error(`unexpected response: ${res}`);
    })
    .catch((err: any): void => {
      // TODO
      console.log(err);
    });
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
                      (n: any, i: number) => {
                        return h(Namespace, {
                          index: i
                        , ...n
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
