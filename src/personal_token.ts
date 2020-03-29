import * as H from 'history';
import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { getClient } from './util/client';

interface PersonalTokenProps {
  getToken: () => string;
  history: H.History;
}

// tslint:disable-next-line
const client = getClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [401, 422].some((n: number): boolean => n === status);
});

const renderTitle = (): VNode => {
  return h('.title', {},
    h('a', { href: '/' },
      h('img.logo', {
        alt: 'Eloquentlog'
      , src: '/img/wolf-paw-72x72.png'
      , width: 36
      , height: 36
      })));
};

const fetchPersonalTokens = (props: PersonalTokenProps): void => {
  client.get('/access_token/lrange/person/0/1', {
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

export const PersonalToken = (_: PersonalTokenProps): VNode => {
  return h('#personal_token.content', {},
    h('.personal-token.grid', {},
      h('.row', {},
        h(`.column-6.offset-5
.column-v-8.offset-v-4
.column-l-10.offset-l-3
.column-m-16`, {},
          h('.transparent.box', [
            renderTitle()
          , h('.container', [
              h('h4.header', {}, 'Personal Token')
            , h('p', 'TODO')
            ])
          ])
        )
      )
    )
  );
};

PersonalToken.defaultProps = {
  errors: []
};

PersonalToken.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Personal Token - ' + document.title;
  }
, onComponentWillMount (props: PersonalTokenProps): void {
    fetchPersonalTokens(props);
  }
};
