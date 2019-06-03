import axios from 'axios';
import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

interface LoginProps {
  username: string;
  password: string;
  errors: string[];
  [index: string]: any;
}

// TODO
const BACKEND_API_PROTOCOL: string = 'http';
const BACKEND_API_HOST: string = '127.0.0.1';
const BACKEND_API_PORT: string = '8000';

const validate = (name: string, v: string): boolean => {
  if (name === 'username') {
    return (v !== null && v.includes('@') && v.length >= 6);
  } else if (name === 'password') {
    return (v !== null && v.length >= 8);
  }
  return false;
};

const handleChange = (props: LoginProps, event: Event): void => {
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
    props[target.id] = undefined;
    props.errors.push(target.id);
    return;
  }
  props[target.id] = value;
};

const handleSubmit = (props: LoginProps, event: Event): void => {
  event.preventDefault();

  if (props.errors.length > 0 ||
      props.username === undefined || props.password === undefined) {
    return;
  }

  const client = axios.create({
    baseURL: `${BACKEND_API_PROTOCOL}://
${BACKEND_API_HOST}:${BACKEND_API_PORT}/_api`
  , timeout: 1800
  , headers: {
      'Accept': 'application/json'
    , 'Content-Type': 'application/json; charset=utf-8'
    }
  });

  client.post('/login', {
    username: props.username
  , password: props.password
  })
  .then((res: any) => {
    console.log(res);
  })
  .catch((err: any) => {
    console.log(err);
  });
};

// TODO:
// * should we have a loading state? (as component)
// * validators
export const Login = (props: LoginProps): VNode => {
  props.errors = [];

  return h('.content', [
    h('form', {
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
    , h('button#submit', { type: 'submit' }, 'Login')
    ])
  ]);
};

Login.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Login - ' + document.title;
  }
};
