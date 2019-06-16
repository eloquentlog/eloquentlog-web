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

import { message as msg } from './util/message';

import './styl/password_reset.styl';

interface PasswordResetProps {
  errors: ValidationError[];
  history: H.History;
  requested: boolean;
}

const client = getClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [401, 422].some((n: number): boolean => n === status);
});

// Checks if required field is not empty
const validate = (_: string, v: string): boolean => {
  return v !== '';
};

const handleRequired = (
  props: PasswordResetProps
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

const handleChange = (props: PasswordResetProps, event: Event): void => {
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
];

const lockFields = inputFieldsLocker(fieldNames.concat('submit'));
const lock = (f: Element): void => {
        const loader = f.querySelector('.loading');
        loader.classList.toggle('hidden');
        lockFields();
      }
    , unlock = lock
    ;

const handleSubmit = (props: PasswordResetProps, event: Event): void => {
  event.preventDefault();

  const f = event.target as Element;

  props.errors = [];
  fieldNames.forEach((n: string) => {
    const field = f.querySelector('#' + n);
    field.classList.remove('has-errors');
  });
  clearErrors(f, fieldNames);
  removeMessage();
  lock(f);

  const [
    email
  ] = fieldNames.map(
    (n: string): string => (f.querySelector('#' + n) as HTMLInputElement).value
  );

  // required
  const requiredValues: { [idx: string]: string; } = {
    email
  };
  Object.keys(requiredValues).forEach((k: string): void => {
    handleRequired(props, f.querySelector('#' + k));
  });

  if (props.errors.some((e: ValidationError): boolean => {
    return fieldNames.indexOf(e.field) > -1;
  })) {
    displayMessage(msg.flash.password_reset.failure);

    highlightFields(f, props.errors.map((e) => e.field));
    handleErrors(f, props.errors);
    unlock(f);
    return;
  }

  client.post('/password/reset', {
    email
  })
  .then((res: any): void => {
    if (res.status !== 200) {
      const data = res.data;

      if (data.message === undefined) {
        data.message = msg.flash.password_reset.failure;
      }
      displayMessage(data.message);

      handleErrors(f, data);
      unlock(f);
      return;
    }

    props.history.push('/password/reset', {
      flash: msg.flash.password_reset.success
    });
  })
  .catch((err: any): void => {
    unlock(f);

    // TODO
    console.log(err);
  });
};

const hasRequested = (history: H.History): boolean => {
  const message = getFlashMessage(history);
  return message !== undefined || (
    history.action === 'PUSH' &&
    history.location.pathname === '/password/reset'
  );
};

const getFlashMessage = (history: H.History): string => {
  const { location } = history;
  if ((typeof location.state) === 'object' &&
     location.state.flash !== undefined) {
    return location.state.flash;
  }
  return undefined;
};

const renderMessage = (message: string): VNode => {
  return (message === undefined) ?
    h('#message.message.hidden', { role: 'alert' }) :
    h('#message.message.success', { role: 'alert' },
      h('p', {}, message));
};

export const PasswordReset = (
  props: PasswordResetProps
, route: any
): VNode => {
  const history = route.router.history as H.History;

  props.history = history;
  props.requested = hasRequested(history);

  const flashMessage = getFlashMessage(props.history);

  return h('#password_reset.content', {},
    h('.password-reset.grid', {},
      h('.row', {},
        h(`.column-6.offset-5
.column-v-8.offset-v-4
.column-l-10.offset-l-3
.column-m-16`, {},
          h('.transparent.box', props.requested ? [
            h('.title', {},
              h('a', { href: '/' }, 'Eloquentlog'))
          , h('.container', [
              h('h4.header', {}, 'Reset password')
            , renderMessage(flashMessage)
            , h('h6', {}, 'NOTE')
            , h('p.note', {},
                `If you don't receive any email, and it's not in your spam
folder, this could mean you have signed up with a different address.`)
            ])
          , h('p.options', [
              'Back to'
            , h('a.signin', { href: '/signin' }, 'Sign in')
            ])
          ] : [ // request form
            h('.title', {},
              h('a', { href: '/' }, 'Eloquentlog'))
          , h('form.form', {
              noValidate: true
            , onSubmit: linkEvent(props, handleSubmit)
            }, [
              h('h4.header', {}, 'Reset password')
            , renderMessage(flashMessage)
            , h('.required.field', [
                h('label.label', { for: 'email' }, 'E-mail address')
              , h('p.description', {},
                  msg.description.password_reset.email)
              , h('input#email', {
                  type: 'text'
                , name: 'email'
                , autocomplete: 'email'
                , placeHolder: 'ahoj@eloquentlog.com'
                , onInput: linkEvent(props, handleChange)
                })
              ])
            , h('button#submit.secondary.flat.button', { type: 'submit' },
                'Request')
            , h('span.loading.hidden')
            ])
          , h('p.options', [
              'Do you back to the'
            , h('a.signin', { href: '/signin' }, 'Sign in')
            , '?'
            ])
          ])
        )
      )
    )
  );
};

PasswordReset.defaultProps = {
  errors: []
, requested: false
};

PasswordReset.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Reset password - ' + document.title;
  }
};
