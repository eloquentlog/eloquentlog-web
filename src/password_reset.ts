import * as H from 'history';
import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { renderError } from './util/error';
import { webClient, Headers } from './util/client';
import {
  clearErrors
, displayMessage
, handleErrors
, highlightFields
, inputFieldsLocker
, removeMessage
, ValidationError
} from './util/form';
import { getFlashMessage } from './util/flash';
import { message as msg } from './util/message';
import { Theme } from './util/theme';
import { renderTitle } from './prtl/title';
import { renderMessage } from './prtl/message';

import './styl/password_reset.styl';

interface PasswordResetProps {
  errors: ValidationError[];
  history: H.History;
  reset: boolean;
  setTheme: (theme: Theme, update?: boolean) => void;
  theme: Theme;
  params: URLSearchParams;
}

const client = webClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [400, 401, 403, 404, 422].some((n: number): boolean => n === status);
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

const fieldIds = [
  'new_password'
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

const handleSubmit = async (props: PasswordResetProps, event: Event) => {
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
    newPassword
  ] = fieldIds.map(
    (id: string): string =>
      (f.querySelector('#' + id) as HTMLInputElement).value
  );

  // required
  const requiredValues: { [idx: string]: string; } = {
    'new_password': newPassword
  };
  Object.keys(requiredValues).forEach((k: string): void => {
    handleRequired(props, f.querySelector('#' + k));
  });

  if (props.errors.some((e: ValidationError): boolean => {
    return fieldIds.indexOf(e.field) > -1;
  })) {
    displayMessage(msg.flash.password_reset.failure);

    highlightFields(f, props.errors.map((e) => e.field));
    handleErrors(f, props.errors);
    unlock(f);
    return;
  }

  if (!props.params.has('s') || !props.params.has('t')) {
    return;
  }
  const s = props.params.get('s')
      , t = props.params.get('t')
      ;

  await client.patch(`/password/reset/${s}`, {}, {
    withCredentials: true
  , transformRequest: [(data: object, headers: Headers) => {
      headers.Authorization = `Bearer ${t}`;
      data = {
        'new_password': newPassword
      , ...data
      };
      return JSON.stringify(data);
    }]
  })
  .then((res: any): void => {
    if (res.status !== 200) {
      const data = res.data;

      if (data.message === undefined) {
        data.message = msg.flash.password_reset.failure;
      }
      displayMessage(data.message);

      handleErrors(f, data.errors);
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

const handleThemeLinkClick = (
  props: PasswordResetProps
, event: Event
): void => {
  event.preventDefault();

  props.setTheme(props.theme === Theme.Light ? Theme.Dark : Theme.Light);
};

const hasReset = (history: H.History): boolean => {
  const message = getFlashMessage(history);
  return message !== undefined || (
    history.action === 'PUSH' &&
    history.location.pathname === '/password/reset'
  );
};

const verify = (props: PasswordResetProps): void => {
  const params = new URLSearchParams(props.history.location.search);

  if (!params.has('s') || !params.has('t')) {
    return;
  }

  const s = params.get('s')
      , t = params.get('t')
      ;

  client.get(`/password/reset/${s}`, {
    withCredentials: true
  , transformRequest: [function (_, headers) {
      headers.Authorization = `Bearer ${t}`;
    }]
  })
  .then((res: any): void => {
    if (res.status === 422) {
      props.history.push('/signin', {
        flash: msg.flash.password_reset.expired
      });
    } else if (res.status !== 200) {
      props.history.push('/signin', {
        flash: msg.flash.password_reset.failure
      });
    }
  })
  .catch((err: any): void => {
    props.history.push('/signin', {
      flash: msg.flash.password_reset.failure
    });
    // TODO
    console.log(err);
  });
};

export const PasswordReset = (
  props: PasswordResetProps
, route: any
): VNode => {
  props.history = route.router.history as H.History;

  if (!props.reset) {
    // FIXME: Promise
    verify(props);
  }
  props.reset = hasReset(props.history) && props.errors.length === 0;

  const flashMessage = getFlashMessage(props.history);
  return h('#content', [
    h('#header', {}, h('.global-header'))
  , h('#password_reset.content', {},
      h('.password-reset.grid', {},
        h('.row', {},
          h(`.column-6.offset-5
.column-v-8.offset-v-4
.column-l-10.offset-l-3
.column-m-16`, {},
            h('.transparent.box', props.reset ? [
              renderTitle()
            , h('.container', [
                h('h4.header', {}, 'Reset password')
              , renderMessage(
                  flashMessage
                , props.errors.length !== 0 ? 'failure' : 'success'
                )
              ])
            , h('p.options', [
                'Back to'
              , h('a.signin', { href: '/signin' }, 'Sign in')
              ])
            ] : [
              renderTitle()
            , h('form.form', {
                noValidate: true
              , onSubmit: linkEvent(props, handleSubmit)
              }, [
                h('h4.header', {}, 'Reset password')
              , renderMessage(
                  flashMessage
                , props.errors.length !== 0 ? 'failure' : 'success'
                )
              , h('.required.field', [
                  h('label.label', { for: 'new_password' }, 'New password')
                , h('p.description', {},
                    msg.description.shared.password)
                , h('input#new_password', {
                    type: 'password'
                  , name: 'new-password'
                  , autocomplete: 'off'
                  , placeHolder: 'Don\'t foget ;)'
                  , onInput: linkEvent(props, handleChange)
                  })
                ])
              , h('button#submit.secondary.flat.button', { type: 'submit' },
                  'Change')
              , h('span.loading.hidden')
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

PasswordReset.defaultProps = {
  errors: []
, reset: false
};

PasswordReset.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Reset password - Eloquentlog';
    headRequest();
  }
, onComponentDidUpdate (
    _lastProps: PasswordResetProps
  , _nextProps: PasswordResetProps
  ): void {
    headRequest();
  }
};
