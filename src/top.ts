import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { sidebarItems } from './_sidebar';
import { Layout } from './prtl/layout';
import { appClient } from './util/client';

import { RouteProps } from './routing';

interface TopProps extends RouteProps {}

const client = appClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [422].some((n: number): boolean => n === status);
});

const fetchMessages = (props: TopProps): void => {
  // FIXME
  const ns = 'namespace';
  const s = '_recent';
  client.get(`/message/${ns}/lrange/${s}/0/19`, {
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

export const Top = (props: TopProps): VNode => {
  return h(Layout, {
    sidebarItems
  , children: h('.content')
  , ...props
  });
};

Top.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Eloquentlog';
  }
, onComponentWillMount (props: TopProps): void {
    fetchMessages(props);
  }
};
