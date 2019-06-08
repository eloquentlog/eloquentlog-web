import * as H from 'history';
import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { getClient } from './util/client';
import { inputFieldsLocker } from './util/form';

interface SignupProps {
  errors: string[];
  history: H.History;
}

const client = getClient();

const validate = (name: string, v: string): boolean => {
  let result = false;
  switch (name) {
    case 'email':
      result = (v !== null && v.includes('@') && v.length >= 6);
      break;
    case 'name':
      result = (v === null || (v.length >= 6 && v.length <= 64));
      break;
    case 'username':
      result = (v === null || (v.length >= 3 && v.length <= 32));
      break;
    case 'password':
      result = (v !== null && v.length >= 8 && v.length <= 1024);
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

  const [
    email
  , name
  , username
  , password
  ] = fields.map(f => (t.querySelector('#' + f) as HTMLInputElement).value);

  if (props.errors.length > 0 ||
     [email, password].some((e) => e === '')) {
    unlock();
    return;
  }

  client.post('/register', {
    email
  , name
  , username
  , password
  })
  .then((_: any) => {
    unlock();
    props.history.push('/signin');
  })
  .catch((err: any) => {
    unlock();

    // TODO
    // * display validation messages
    console.log(err);
  });
};

// TODO:
// * should we have a loading state? (as component)
// * validators
export const Signup = (props: SignupProps): VNode => {
  return h('.content', [
    h('ul', [
      h('li', {}, h('a', { href: '/' }, 'Top'))
    , h('li', {}, h('a', { href: '/signin' }, 'Sign in'))
    ])
  , h('form#signup', {
      noValidate: true
    , autocomplete: 'off'
    , onSubmit: linkEvent(props, handleSubmit)
    }, [
      h('.control-group', [
        h('label.label', { for: 'email' }, 'E-mail Address')
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
        h('label.label', { for: 'password' }, 'Password')
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
