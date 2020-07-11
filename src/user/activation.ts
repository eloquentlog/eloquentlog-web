import * as H from 'history';
import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { webClient } from '../util/client';
import { message as msg } from '../util/message';
import { renderTitle } from '../prtl/title';
import { renderMessage } from '../prtl/message';

import '../styl/user/activation.styl';

interface UserActivationProps {
  history: H.History;
  activated: boolean;
}

const client = webClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [401, 422].some((n: number): boolean => n === status);
});

const displayNote = (message: string): void => {
  const container = document.querySelector('p.note');
  const txt = document.createElement('p');
  txt.innerHTML = message;
  container.innerHTML = '';
  container.appendChild(txt);
  container.classList.remove('hidden', 'critical', 'warn');
  container.classList.add('error');
};

const hasActivated = (history: H.History): boolean => {
  const message = getFlashMessage(history);
  return message === msg.flash.user_activation.success &&
    history.action === 'REPLACE' &&
    history.location.pathname === '/user/activate';
};

const getFlashMessage = (history: H.History): string => {
  const { location } = history;
  if ((typeof location.state) === 'object' &&
     location.state.flash !== undefined) {
    return location.state.flash;
  }
  return undefined;
};

const activate = (props: UserActivationProps): void => {
  const params = new URLSearchParams(props.history.location.search);

  if (!params.has('s') || !params.has('t')) {
    return;
  }

  const s = params.get('s')
      , t = params.get('t')
      ;

  client.patch(`/activate/${s}`, { withCredentials: true }, {
    transformRequest: [function (_, headers) {
      headers.Authorization = `Bearer ${t}`;
    }]
  })
    .then((res: any): void => {
    if (res.status === 200) {
      displayNote(msg.description.user_activation.welcome);
    } else {
      if (res.status === 422) {
        props.history.replace('/user/activate', {
          flash: msg.flash.user_activation.expired
        });
      } else {
        props.history.replace('/user/activate', {
          flash: msg.flash.user_activation.failure
        });
      }
    }

    props.history.replace('/user/activate', {
      flash: msg.flash.user_activation.success
    });
  })
  .catch((err: any): void => {
    props.history.replace('/user/activate', {
      flash: msg.flash.user_activation.failure
    });
    // TODO
    console.log(err);
  });
};

export const UserActivation = (
  props: UserActivationProps
, route: any
): VNode => {
  props.history = route.router.history as H.History;

  if (!props.activated) {
    // FIXME: Promise
    activate(props);
  }
  props.activated = hasActivated(props.history);

  const flashMessage = getFlashMessage(props.history);
  return h('#user_activation.content', {},
    h('.user-activation.grid', {},
      h('.row', {},
        h(`.column-6.offset-5
.column-v-8.offset-v-4
.column-l-10.offset-l-3
.column-m-16`, {},
          h('.transparent.box', [
            renderTitle()
          , h('.container', [
              h('h4.header', {}, 'User Activation')
            , renderMessage(
                flashMessage, props.activated ? 'success' : 'failure')
            , h('h6', {}, 'NOTE')
            , h('p.note', {}, 'The activation link seems invalid :\'(')
            ])
          , h('p.options', {}, props.activated ? [
              h('p.options', [
                'Visit'
              , h('a.signin', { href: '/signin' }, 'Sign in')
              ])
            ] : [
              h('a.signup', { href: '/signup' }, 'Sign up')
            , 'again or'
            , h('a.contact', { href: 'mailto:' }, 'Contact administrator')
            ])
          ])
        )
      )
    )
  );
};

UserActivation.defaultProps = {
  errors: []
, activated: false
};

UserActivation.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Activation - Eloquentlog';
  }
};
