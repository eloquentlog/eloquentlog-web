import * as H from 'history';
import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

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
import { renderTitle } from './prtl/title';
import { renderMessage } from './prtl/message';

import './styl/password_reset_request.styl';

interface PasswordResetRequestProps {
  errors: ValidationError[];
  history: H.History;
  requested: boolean;
  setTheme: (theme: Theme, update?: boolean) => void;
  theme: Theme;
}

const client = webClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [400, 401, 404, 422].some((n: number): boolean => n === status);
});

// Checks if required field is not empty
const validate = (_: string, v: string): boolean => {
  return v !== '';
};

const handleRequired = (
  props: PasswordResetRequestProps
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

const handleChange = (props: PasswordResetRequestProps, event: Event): void => {
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
];

const lockFields = inputFieldsLocker(fieldIds.concat('submit'));
const lock = (f: Element): void => {
        const loader = f.querySelector('.loading');
        loader.classList.toggle('hidden');
        lockFields();
      }
    , unlock = lock
    ;

const headRequest = (): void => {
  client.head('/password/reset')
    .then((res: any): void => {
      if (res.status !== 200) {
        throw new Error('Something went wrong. Please try it later :\'(');
      }
    })
    .catch((err: any): void => {
      renderError(err);
    });
};

const handleSubmit = (props: PasswordResetRequestProps, event: Event): void => {
  event.preventDefault();

  const f = event.target as Element;

  props.errors = [];
  fieldIds.forEach((id: string) => {
    const field = f.querySelector('#' + id);
    field.classList.remove('has-errors');
  });
  clearErrors(f, fieldIds);
  removeMessage();
  lock(f);

  const [
    email
  ] = fieldIds.map(
    (id: string): string =>
      (f.querySelector('#' + id) as HTMLInputElement).value
  );

  // required
  const requiredValues: { [idx: string]: string; } = {
    email
  };
  Object.keys(requiredValues).forEach((k: string): void => {
    handleRequired(props, f.querySelector('#' + k));
  });

  if (props.errors.some((e: ValidationError): boolean => {
    return fieldIds.indexOf(e.field) > -1;
  })) {
    displayMessage(msg.flash.password_reset_request.failure);

    highlightFields(f, props.errors.map((e) => e.field));
    handleErrors(f, props.errors);
    unlock(f);
    return;
  }

  client.put('/password/reset', {
    email
  })
  .then((res: any): void => {
    // handle other errors as success
    if (res.status !== 200 && res.data !== null) {
      const data = res.data;

      if (data.message === undefined) {
        data.message = msg.flash.password_reset_request.failure;
      }
      displayMessage(data.message);

      handleErrors(f, data.errors);
      unlock(f);
      return;
    }

    props.history.push('/password/reset', {
      flash: msg.flash.password_reset_request.success
    });
  })
  .catch((err: any): void => {
    unlock(f);

    // TODO
    console.log(err);
  });
};

const handleThemeLinkClick = (
  props: PasswordResetRequestProps
, event: Event
): void => {
  event.preventDefault();

  props.setTheme(props.theme === Theme.Light ? Theme.Dark : Theme.Light);
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

export const PasswordResetRequest = (
  props: PasswordResetRequestProps
, route: any
): VNode => {
  props.history = route.router.history as H.History;
  props.requested = hasRequested(props.history);

  const flashMessage = getFlashMessage(props.history);
  return h('#content', [
    h('#header', {}, h('.global-header'))
  , h('#password_reset_request.content', {},
      h('.password-reset-request.grid', {},
        h('.row', {},
          h(`.column-6.offset-5
.column-v-8.offset-v-4
.column-l-10.offset-l-3
.column-m-16`, {},
            h('.transparent.box', props.requested ? [
              renderTitle()
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
              renderTitle()
            , h('form.form', {
                noValidate: true
              , onSubmit: linkEvent(props, handleSubmit)
              }, [
                h('h4.header', {}, 'Reset password')
              , renderMessage(flashMessage)
              , h('.required.field', [
                  h('label.label', { for: 'email' }, 'E-mail address')
                , h('p.description', {},
                    msg.description.password_reset_request.email)
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

PasswordResetRequest.defaultProps = {
  errors: []
, requested: false
};

PasswordResetRequest.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Reset password - Eloquentlog';
    headRequest();
  }
, onComponentDidUpdate (
    _lastProps: PasswordResetRequestProps
  , _nextProps: PasswordResetRequestProps
  ): void {
    headRequest();
  }
};
