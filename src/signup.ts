import * as H from 'history';
import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { getClient } from './util/client';
import {
  cleanErrors
, handleErrors
, inputFieldsLocker
} from './util/form';

interface SignupProps {
  errors: string[];
  history: H.History;
}

const client = getClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [422].some((n: number): boolean => n === status);
});

// Checks if required field is not empty
const validate = (name: string, v: string): boolean => {
  let result = false;
  switch (name) {
    case 'email':
    case 'password':
      result = (v !== '');
      break;
    case 'name':
    case 'username':
      result = true;
      break;
    default:
      break;
  }
  return result;
};

const handleChange = (props: SignupProps, event: Event): void => {
  event.preventDefault();
  const target = event.target as HTMLInputElement
      , value = target.value
      ;

  // TODO: create a validator utility
  const e: number = props.errors.indexOf(target.id);
  if (e > -1) {
    props.errors.splice(e, 1);
  }
  if (validate(target.id, value) !== true) {
    props.errors.push(target.id);
    return;
  }
};

const fields = [
  'email'
, 'name'
, 'username'
, 'password'
];

const lock = inputFieldsLocker(fields.concat('submit'))
    , unlock = lock
    ;

const handleSubmit = (props: SignupProps, event: Event): void => {
  event.preventDefault();

  const t = event.target as Element;

  lock();
  cleanErrors(t, fields);

  const [
    email
  , name
  , username
  , password
  ] = fields.map(
    (f: string): string => (t.querySelector('#' + f) as HTMLInputElement).value
  );

  if (props.errors.length > 0 ||
     [email, password].some((v: string): boolean => v === '')) {
    unlock();
    return;
  }

  client.post('/register', {
    email
  , name
  , username
  , password
  })
  .then((res: any) => {
    if (res.status !== 200) {
      const data = res.data;
      handleErrors(t, data);
      unlock();
      return;
    }

    props.history.push('/signin');
  })
  .catch((err: any) => {
    unlock();

    // TODO
    console.log(err);
  });
};

export const Signup = (props: SignupProps): VNode => {
  return h('.content', [
    h('ul', [
      h('li', {}, h('a', { href: '/' }, 'Top'))
    , h('li', {}, h('a', { href: '/signin' }, 'Sign in'))
    ])
  , h('#message')
  , h('form#signup', {
      noValidate: true
    , autocomplete: 'off'
    , onSubmit: linkEvent(props, handleSubmit)
    }, [
      h('.control-group', [
        h('label.label.required', { for: 'email' }, 'E-mail Address')
      , h('input#email', {
          type: 'email'
        , name: 'email'
        , onInput: linkEvent(props, handleChange)
        })
      ])
    , h('.control-group', [
        h('label.label', { for: 'name' }, 'Name')
      , h('input#name', {
          type: 'text'
        , name: 'name'
        , onInput: linkEvent(props, handleChange)
        })
      ])
    , h('.control-group', [
        h('label.label', { for: 'username' }, 'Username')
      , h('input#username', {
          type: 'text'
        , name: 'username'
        , autocomplete: 'off'
        , onInput: linkEvent(props, handleChange)
        })
      ])
    , h('.control-group', [
        h('label.label.required', { for: 'password' }, 'Password')
      , h('input#password', {
          type: 'password'
        , name: 'password'
        , autocomplete: 'new-password'
        , onInput: linkEvent(props, handleChange)
        })
      ])
    , h('button#submit', { type: 'submit' }, 'Sign up')
    ])
  ]);
};

Signup.defaultProps = {
  errors: []
};

Signup.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Sign up - ' + document.title;
  }
};
