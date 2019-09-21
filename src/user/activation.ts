import * as H from 'history';
import { VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { getClient } from '../util/client';
import { message as msg } from '../util/message';

import '../styl/user/activation.styl';

interface UserActivationProps {
  history: H.History;
  activated: boolean;
}

const client = getClient((status: number): boolean => {
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

const activate = (props: UserActivationProps): boolean => {
  const params = new URLSearchParams(props.history.location.search);

  if (!params.has('t') || !params.has('s')) {
    return true;
  } else {
    const t = params.get('t')
        , s = params.get('s')
        ;

    client.patch(`/user/activate?s=${s}`, {}, {
      transformRequest: [function (_, headers) {
        headers.Authorization = `Bearer ${t}`;
      }]
    })
    .then((res: any): boolean => {
      if (res.status === 200) {
        displayNote(msg.error.user_activation.welcome);
      } else {
        if (res.status === 422) {
          displayNote(msg.error.user_activation.expired);
        }

        props.history.replace('/user/activate', {
          flash: msg.flash.user_activation.failure
        });
        return false;
      }

      props.history.replace('/user/activate', {
        flash: msg.flash.user_activation.success
      });
      return true;
    })
    .catch((err: any): boolean => {
      props.history.replace('/user/activate', {
        flash: msg.flash.user_activation.failure
      });
      // TODO
      console.log(err);
      return false;
    });
  }
};

export const UserActivation = (
  props: UserActivationProps
, route: any
): VNode => {
  props.history = route.router.history as H.History;

  if (!props.activated) {
    props.activated = activate(props);
  }

  console.log(props.activated);
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
    document.title = 'User Activation - ' + document.title;
  }
};
