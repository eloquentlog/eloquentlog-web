import * as H from 'history';
import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';
import { Link } from 'inferno-router';

import { getClient } from './util/client';

import { version } from '../package.json';

interface TopProps {
  getToken: () => string;
  history: H.History;
}

const client = getClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [422].some((n: number): boolean => n === status);
});

const fetchMessages = (props: TopProps): void => {
  client.get('/message/lrange/recent/0/19', {
    withCredentials: true
  , transformRequest: [(_, headers) => {
      const t = props.getToken();
      headers.Authorization = `Bearer ${t}`;
    }]
  })
  .then((res: any): void => {
    if (res.status !== 200) {
      // TODO
      const data = res.data;
      console.log(data);
    }

    console.log('Hello, world!');
  })
  .catch((err: any): void => {
    // TODO
    console.log(err);
  });
};

export const Top = (_: TopProps): VNode => {
  return h('.content', [
    h('h1', [
      'Eloquentlog'
    , h('span', version)
    ])
  , h('ul', [
      h('li', {}, h(Link, { to: '/token', replace: true }, 'Personal tokens'))
    , h('li', {}, h(Link, { to: '/signout', replace: true }, 'Sign out'))
    ])
  , h('.content', 'Welcome!')
  ]);
};

Top.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Top - ' + document.title;
  }
, onComponentWillMount (props: TopProps): void {
    fetchMessages(props);
  }
};
