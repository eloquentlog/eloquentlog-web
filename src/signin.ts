import * as H from 'history';
import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { getClient } from './util/client';
import { inputFieldsLocker } from './util/form';

interface SigninProps {
  errors: string[];
  history: H.History;
  setToken: (token: string) => void;
}

const client = getClient();

const validate = (name: string, v: string): boolean => {
  if (name === 'username') {
    return (v !== null && v.includes('@') && v.length >= 6);
  } else if (name === 'password') {
    return (v !== null && v.length >= 8);
  }
  return false;
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

const lock = inputFieldsLocker(['username', 'password', 'submit'])
    , unlock = lock
    ;

const handleSubmit = (props: SigninProps, event: Event): void => {
  event.preventDefault();

  const t = event.target as Element;

  lock();

  const username = (t.querySelector('#username') as HTMLInputElement).value
      , password = (t.querySelector('#password') as HTMLInputElement).value
      ;

  if (props.errors.length > 0 ||
      username === null || password === null) {
    unlock();
    return;
  }

  client.post('/login', {
    username
  , password
  })
  .then((res: any) => {
    unlock();

    const token = res.data.voucher;
    props.setToken(token);
    props.history.push('/');
  })
  .catch((err: any) => {
    unlock();

    // TODO:
    // * display validation messages
    console.log(err);
  });
};

// TODO:
// * should we have a loading state? (as component)
// * validators
export const Signin = (
  props: SigninProps
, route: any
): VNode => {
  // for flash message (from location.state)
  props.history = route.router.history as H.History;
  const location = props.history.location;

  return h('.content', [
    h('ul', [
      h('li', {}, h('a', { href: '/' }, 'Top'))
    , h('li', {}, h('a', { href: '/signup' }, 'Sign up'))
    ])
  , (location.state === undefined) ? null : h('p.message', location.state)
  , h('form#signin', {
      noValidate: true
    , onSubmit: linkEvent(props, handleSubmit)
    }, [
      h('.control-group', [
        h('label.label', { for: 'username' }, 'Username')
      , h('input#username', {
          type: 'email'
        , name: 'username'
        , onInput: linkEvent(props, handleChange)
        })
      ])
    , h('.control-group', [
        h('label.label', { for: 'password' }, 'Password')
      , h('input#password', {
          type: 'password'
        , name: 'password'
        , onInput: linkEvent(props, handleChange)
        })
      ])
    , h('button#submit', { type: 'submit' }, 'Sign in')
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
