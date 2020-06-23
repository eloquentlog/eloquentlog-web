import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { getClient } from './util/client';

import { RouteProps } from './routing';

interface TopProps extends RouteProps {}

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
    console.log(res.data);
  })
  .catch((err: any): void => {
    // TODO
    console.log(err);
  });
};

export const Top = (_: TopProps): VNode => {
  return h('.content');
};

Top.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Top - ' + document.title;
  }
, onComponentWillMount (props: TopProps): void {
    fetchMessages(props);
  }
};
