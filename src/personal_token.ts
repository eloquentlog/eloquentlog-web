import * as H from 'history';
import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { getClient } from './util/client';

interface PersonalTokenProps {
  history: H.History;
  activated: boolean;
}

const client = getClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [401, 422].some((n: number): boolean => n === status);
});

const getFlashMessage = (history: H.History): string => {
  const { location } = history;
  if ((typeof location.state) === 'object' &&
     location.state.flash !== undefined) {
    return location.state.flash;
  }
  return undefined;
};

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

const renderMessage = (message: string, context?: string): VNode => {
  return (context === undefined) ?
    h('#message.message.hidden', { role: 'alert' }) :
    h(`#message.message.${context}`, { role: 'alert' }, h('p', {}, message));
};

const activate = (props: PersonalTokenProps): void => {
  // TODO
  // tslint:disable-next-line
  const _params = new URLSearchParams(props.history.location.search);

  // tslint:disable-next-line
  const _client = client;

};

export const PersonalToken = (
  props: PersonalTokenProps
, route: any
): VNode => {
  props.history = route.router.history as H.History;

  const flashMessage = getFlashMessage(props.history);
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
            , renderMessage(
              flashMessage, props.activated ? 'success' : 'warning')
            ])
          ])
        )
      )
    )
  );
};

PersonalToken.defaultProps = {
  errors: []
, activated: false
};

PersonalToken.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Personal Token - ' + document.title;
  }
};
