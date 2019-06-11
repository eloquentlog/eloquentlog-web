import * as H from 'history';
import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { getClient } from './util/client';
import {
  cleanErrors
, displayMessage
, handleErrors
, inputFieldsLocker
} from './util/form';

import { messages } from './util/message';

import './styl/signin.styl';

interface SigninProps {
  errors: string[];
  history: H.History;
  setToken: (token: string) => void;
}

const client = getClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [401, 422].some((n: number): boolean => n === status);
});

// Checks if required field is not empty
const validate = (_: string, v: string): boolean => {
  return v !== '';
};

const handleChange = (props: SigninProps, event: Event): void => {
  event.preventDefault();
  const target = event.target as HTMLInputElement
      , value = target.value
      ;

  // TODO: create a validator utility
  const e: number = props.errors.indexOf(target.id);
  if (e > -1) {
    props.errors.splice(e, 1);
  } else if (validate(target.id, value) !== true) {
    props.errors.push(target.id);
  }
};

const fieldNames = [
  'username'
, 'password'
];

const lockFields = inputFieldsLocker(fieldNames.concat('submit'));
const lock = (f: Element): void => {
        const loader = f.querySelector('.loading');
        loader.classList.toggle('hidden');
        lockFields();
      }
    , unlock = lock
    ;

const handleSubmit = (props: SigninProps, event: Event): void => {
  event.preventDefault();

  const f = event.target as Element;

  lock(f);

  const [
    username
  , password
  ] = fieldNames.map(
    (n: string): string => (f.querySelector('#' + n) as HTMLInputElement).value
  );

  if (props.errors.length > 0 ||
     [username, password].some((v: string): boolean => v === '')) {
    displayMessage(messages.errors.authentication);
    unlock(f);
    return;
  }

  client.post('/login', {
    username
  , password
  })
  .then((res: any): void => {
    if (res.status !== 200) {
      const data = res.data;
      cleanErrors(f, fieldNames);
      handleErrors(f, data);
      unlock(f);
      return;
    }

    const token = res.data.voucher;
    props.setToken(token);
    props.history.push('/');
  })
  .catch((err: any): void => {
    cleanErrors(f, fieldNames);
    unlock(f);

    // TODO
    console.log(err);
  });
};

export const Signin = (
  props: SigninProps
, route: any
): VNode => {
  // for flash message (from location.state)
  props.history = route.router.history as H.History;
  const location = props.history.location;

  return h('#signin.content', {},
    h('.signin.grid', {},
      h('.row', {},
        h(`.column-6.offset-5
.column-v-8.offset-v-4
.column-l-10.offset-l-3
.column-m-16`, {},
          h('.transparent.box', [
            h('.header', {},
              h('a', { href: '/' }, 'Eloquentlog')
            )
          , h('form.form', {
              noValidate: true
            , onSubmit: linkEvent(props, handleSubmit)
            }, [
              h('h4.header', {}, 'Sign in to Eloquentlog')
            , (location.state === undefined) ?
                h('#message.message.hidden', { role: 'alert' }) :
                h('#message.message.warn', { role: 'alert' },
                  h('p', location.state))
            , h('.required.field', [
                // E-mail === Username (for now)
                h('label.label', { for: 'username' }, 'E-mail address')
              , h('input#username', {
                  type: 'text'
                , name: 'username'
                , autocomplete: 'email'
                , placeHolder: 'ahoj@eloquentlog.com'
                , onInput: linkEvent(props, handleChange)
                })
              ])
            , h('.required.field', [
                h('label.label', { for: 'password' }, 'Password')
              , h('input#password', {
                  type: 'password'
                , name: 'password'
                , autocomplete: 'off'
                , placeHolder: 'Keep it secret ;)'
                , onInput: linkEvent(props, handleChange)
                })
              ])
            , h('button#submit.primary.flat.button', { type: 'submit' },
                'Sign in')
            , h('span.loading.hidden')
            ])
          , h('p', [
              h('a.reset-password', { href: '/' }, 'Fogot your password?')
            , 'or new to Eloquentlog?'
            , h('a.signup', { href: '/signup' }, 'Sign up')
            , '.'
            ])
          ])
        )
      )
    )
  );
};

Signin.defaultProps = {
  errors: []
};

Signin.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Sign in - ' + document.title;
  }
};
