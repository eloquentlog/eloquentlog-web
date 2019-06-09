import * as H from 'history';
import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { getClient } from './util/client';
import {
  cleanErrors
, handleErrors
, inputFieldsLocker
} from './util/form';

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

const fields = [
  'username'
, 'password'
];

const lock = inputFieldsLocker(fields.concat('submit'))
    , unlock = lock
    ;

const handleSubmit = (props: SigninProps, event: Event): void => {
  event.preventDefault();

  const t = event.target as Element;

  lock();
  cleanErrors(t, fields);

  const [
    username
  , password
  ] = fields.map(
    (f: string): string => (t.querySelector('#' + f) as HTMLInputElement).value
  );

  if (props.errors.length > 0 ||
     [username, password].some((v: string): boolean => v === '')) {
    unlock();
    return;
  }

  client.post('/login', {
    username
  , password
  })
  .then((res: any): void => {
    if (res.status !== 200) {
      const data = res.data;
      handleErrors(t, data);
      unlock();
      return;
    }

    const token = res.data.voucher;
    props.setToken(token);
    props.history.push('/');
  })
  .catch((err: any): void => {
    unlock();

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

  return h('#signin.content', [
    h('ul', [
      h('li', {}, h('a', { href: '/' }, 'Top'))
    ])
  , (location.state === undefined) ?
      h('#message.message.hidden') :
      h('#message.message.warn', h('p', location.state))
  , h('form.form', {
      noValidate: true
    , onSubmit: linkEvent(props, handleSubmit)
    }, [
      h('.required.field', [
        // E-mail === Username (for now)
        h('label.label', { for: 'username' }, 'E-mail address')
      , h('input#username', {
          type: 'text'
        , name: 'username'
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
    , h('button#submit.flat.button', { type: 'submit' }, 'Sign in')
    ])
  , h('p', [
      h('a.reset-password', { href: '/' }, 'Fogot your password?')
    , 'or new to Eloquentlog?'
    , h('a.signup', { href: '/signup' }, 'Sign up')
    ])
  ]);
};

Signin.defaultProps = {
  errors: []
};

Signin.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Sign in - ' + document.title;
  }
};
