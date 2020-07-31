import * as H from 'history';
import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { RouteProps } from './routing';

import { renderError } from './util/error';
import { webClient } from './util/client';
import {
  clearErrors
, displayMessage
, handleErrors
, highlightFields
, inputFieldsLocker
, removeMessage
, ValidationError
} from './util/form';
import { Theme } from './util/theme';

import { message as msg } from './util/message';

import './styl/signup.styl';

interface SignupProps  extends RouteProps {
  errors: ValidationError[];
  head: boolean;
}

const client = webClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [400, 401, 403, 404, 422].some((n: number): boolean => n === status);
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

const fieldIds = [
  'email'
, 'name'
, 'username'
, 'password'
];

const lockFields = inputFieldsLocker(fieldIds.concat('submit'));
const lock = (f: Element): void => {
        const loader = f.querySelector('.loading');
        loader.classList.toggle('hidden');
        lockFields();
      }
    , unlock = lock
    ;

const headRequest = (props: SignupProps): void => {
  client.head('/register')
    .then((res: any): void => {
      if (res.status !== 200) {
        throw new Error('Something went wrong. Please try it later :\'(');
      }
      props.head = true;
    })
    .catch((err: any): void => {
      renderError(err);
    });
};

const handleSubmit = (props: SignupProps, event: Event): void => {
  event.preventDefault();
  if (!props.head) { return; }

  const f = event.target as Element;

  props.errors = [];
  fieldIds.forEach((id: string) => {
    const field = f.querySelector('#' + id);
    field.classList.remove('has-errors');
  });
  removeMessage();
  clearErrors(f, fieldIds);
  lock(f);

  const [
    email
  , name
  , username
  , password
  ] = fieldIds.map(
    (id: string): string =>
      (f.querySelector('#' + id) as HTMLInputElement).value
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
    return fieldIds.indexOf(e.field) > -1;
  })) {
    displayMessage(msg.flash.signup.failure);

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
        data.message = msg.flash.signup.failure;
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

    props.history.push('/signin', {
      flash: msg.flash.signup.success
    });
  })
  .catch((err: any) => {
    unlock(f);

    // TODO
    console.log(err);
  });
};

const handleThemeLinkClick = (
  props: SignupProps
, event: Event
): void => {
  event.preventDefault();

  props.setTheme(props.theme === Theme.Light ? Theme.Dark : Theme.Light, true);
};

export const Signup = (
  props: SignupProps
, route: any
): VNode => {
  props.history = route.router.history as H.History;

  return h('#content', [
    h('#header', {}, h('.global-header'))
  , h('#signup.content', {},
      h('.signup.grid', {},
        h('.row', {},
          h(`.column-6.offset-5
.column-v-8.offset-v-4
.column-l-10.offset-l-3
.column-m-16`, {},
            h('.transparent.box', [
              h('.header', {},
                h('a', { href: '/' },
                  h('img.logo', {
                    alt: 'Eloquentlog'
                  , src: '/img/wolf-paw-72x72.png'
                  , width: 36
                  , height: 36
                  }))
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
                , h('p.description', {}, msg.description.signup.email)
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
                , h('p.description', {}, msg.description.signup.name)
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
                , h('p.description', {}, msg.description.signup.username)
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
                , h('p.description', {}, msg.description.shared.password)
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
            , h('p.options', [
                'Already have an account?'
              , h('a.signin', { href: '/signin' }, 'Sign in')
              , '.'
              ])
            , h('p.links', [
                'Set theme as'
              , h('a.theme', {
                  onClick: linkEvent(props, handleThemeLinkClick)
                }, props.theme === Theme.Light ? 'Dark' : 'Light')
              , '.'
              ])
            ])
          )
        )
      )
    )
  ]);
};

Signup.defaultProps = {
  errors: []
, head: false
};

Signup.defaultHooks = {
  onComponentDidMount (_: any, props: SignupProps): void {
    document.title = 'Sign up - Eloquentlog';
    headRequest(props);
  }
, onComponentDidUpdate (
    _lastProps: SignupProps
  , nextProps: SignupProps
  ): void {
    headRequest(nextProps);
  }
};
