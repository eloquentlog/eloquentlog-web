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

import './styl/signup.styl';

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

const fieldNames = [
  'email'
, 'name'
, 'username'
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

const handleSubmit = (props: SignupProps, event: Event): void => {
  event.preventDefault();

  const f = event.target as Element;

  lock(f);

  const [
    email
  , name
  , username
  , password
  ] = fieldNames.map(
    (n: string): string => (f.querySelector('#' + n) as HTMLInputElement).value
  );

  if (props.errors.length > 0 ||
     [email, password].some((v: string): boolean => v === '')) {
    displayMessage(messages.errors.registration);
    unlock(f);
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
      data.message = messages.errors.registration;

      cleanErrors(f, fieldNames);
      handleErrors(f, data);
      unlock(f);
      return;
    }

    // FIXME
    props.history.push('/signout');
  })
  .catch((err: any) => {
    cleanErrors(f, fieldNames);
    unlock(f);

    // TODO
    console.log(err);
  });
};

export const Signup = (props: SignupProps): VNode => {
  return h('#signup.content', {},
    h('.signup.grid', {},
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
            , autocomplete: 'off'
            , onSubmit: linkEvent(props, handleSubmit)
            }, [
              h('h4.header', {}, 'Sign up to Eloquentlog')
            , h('#message.message.hidden')
            , h('.required.field', [
                h('label.label', { for: 'email' }, 'E-mail Address')
              , h('p.description', {}, messages.descriptions.email)
              , h('input#email', {
                  type: 'text'
                , name: 'email'
                , placeHolder: 'ahoj@eloquentlog.com'
                , autocomplete: 'off'
                , onInput: linkEvent(props, handleChange)
                })
              ])
            , h('.field', [
                h('label.label', { for: 'name' }, 'Name')
              , h('p.description', {}, messages.descriptions.name)
              , h('input#name', {
                  type: 'text'
                , name: 'name'
                , placeHolder: 'Albrecht Dürer'
                , autocomplete: 'off'
                , onInput: linkEvent(props, handleChange)
                })
              ])
            , h('.field', [
                h('label.label', { for: 'username' }, 'Username')
              , h('p.description', {}, messages.descriptions.username)
              , h('input#username', {
                  type: 'text'
                , name: 'username'
                , placeHolder: 'albrecht'
                , autocomplete: 'off'
                , onInput: linkEvent(props, handleChange)
                })
              ])
            , h('.required.field', [
                h('label.label', { for: 'password' }, 'Password')
              , h('p.description', {}, messages.descriptions.password)
              , h('input#password', {
                  type: 'password'
                , name: 'password'
                , placeHolder: 'Make it strong ;)'
                , autocomplete: 'new-password'
                , onInput: linkEvent(props, handleChange)
                })
              ])
            , h('button#submit.primary.flat.button', { type: 'submit' },
                'Sign up')
            , h('span.loading.hidden')
            ])
          , h('p', [
              'Already have an account?'
            , h('a.signin', { href: '/signin' }, 'Sign in')
            , '.'
            ])
          ])
        )
      )
    )
  );
};

Signup.defaultProps = {
  errors: []
};

Signup.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Sign up - ' + document.title;
  }
};
