import * as H from 'history';
import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { getClient } from './util/client';
import {
  clearErrors
, displayMessage
, handleErrors
, highlightFields
, inputFieldsLocker
, removeMessage
, ValidationError
} from './util/form';

import { message } from './util/message';

import './styl/signup.styl';

interface SignupProps {
  errors: ValidationError[];
  history: H.History;
  setRoute: (route: string) => void;
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
    case 'username':
    case 'password':
      result = (v !== '');
      break;
    case 'name':
      result = true;
      break;
    default:
      break;
  }
  return result;
};

const handleRequired = (
  props: SignupProps
, target: HTMLInputElement
): void  => {
  if (!validate(target.id, target.value)) {
    let err = props.errors.find((e: ValidationError): boolean => {
      return target.id === e.field;
    });
    if (err === undefined) {
      err = {
        field: target.id
      , messages: ['Must not be blank']
      };
    } else {
      err.messages = ['Must not be blank'];
    }
    props.errors.push(err);
  }
};

const handleChange = (props: SignupProps, event: Event): void => {
  event.preventDefault();
  const target = event.target as HTMLInputElement;

  const i = props.errors.findIndex(
    (e: ValidationError): boolean => e.field === target.id
  );
  if (i > -1) {
    props.errors.splice(i, 1);
  }
  handleRequired(props, target);
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

  props.errors = [];
  fieldNames.forEach((n: string) => {
    const field = f.querySelector('#' + n);
    field.classList.remove('has-errors');
  });
  removeMessage();
  clearErrors(f, fieldNames);
  lock(f);

  const [
    email
  , name
  , username
  , password
  ] = fieldNames.map(
    (n: string): string => (f.querySelector('#' + n) as HTMLInputElement).value
  );
  // required
  const requiredValues: { [idx: string]: string; } = {
    email
  , username
  , password
  };
  Object.keys(requiredValues).forEach((k: string): void => {
    handleRequired(props, f.querySelector('#' + k));
  });

  if (props.errors.some((e: ValidationError): boolean => {
    return fieldNames.indexOf(e.field) > -1;
  })) {
    displayMessage(message.flash.signup);

    highlightFields(f, props.errors.map((e) => e.field));
    handleErrors(f, props.errors);
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
    // TODO: define an interface for Response
    if (res.status !== 200) {
      const data = res.data;

      if (data.message === undefined) {
        data.message = message.flash.signup;
      }
      displayMessage(data.message);

      if (data.errors !== undefined) {
        props.errors = data.errors;
      }
      highlightFields(f, props.errors.map((e) => e.field));
      handleErrors(f, props.errors);
      unlock(f);
      return;
    }

    props.setRoute('/');
    props.history.push('/');
  })
  .catch((err: any) => {
    unlock(f);

    // TODO
    console.log(err);
  });
};

export const Signup = (
  props: SignupProps
, route: any
): VNode => {
  props.history = route.router.history as H.History;

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
              , h('p.description', {}, message.description.signup.email)
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
              , h('p.description', {}, message.description.signup.name)
              , h('input#name', {
                  type: 'text'
                , name: 'name'
                , placeHolder: 'Albrecht Dürer'
                , autocomplete: 'off'
                , onInput: linkEvent(props, handleChange)
                })
              ])
            , h('.required.field', [
                h('label.label', { for: 'username' }, 'Username')
              , h('p.description', {}, message.description.signup.username)
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
              , h('p.description', {}, message.description.signup.password)
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
