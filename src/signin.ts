import * as H from 'history';
import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { RouteProps } from './routing';

import { renderError } from './util/error';
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
import { Theme } from './util/theme';
import { message as msg } from './util/message';

import './styl/signin.styl';

interface SigninProps extends RouteProps {
  errors: ValidationError[];
}

const client = getClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [400, 401, 422].some((n: number): boolean => n === status);
});

// Checks if required field is not empty
const validate = (_: string, v: string): boolean => {
  return v !== '';
};

const handleRequired = (
  props: SigninProps
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

const handleChange = (props: SigninProps, event: Event): void => {
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
  'username'
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

const makeIgnite = (): void => {
  client.head('/login')
    .then((res: any): void => {
      if (res.status !== 200) {
        throw new Error('Something went wrong. Please try it later :\'(');
      }
    })
    .catch((err: any): void => {
      renderError(err);
    });
});

const handleSubmit = (props: SigninProps, event: Event): void => {
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
    username
  , password
  ] = fieldIds.map(
    (id: string): string =>
      (f.querySelector('#' + id) as HTMLInputElement).value
  );

  // required
  const requiredValues: { [idx: string]: string; } = {
    username
  , password
  };
  Object.keys(requiredValues).forEach((k: string): void => {
    handleRequired(props, f.querySelector('#' + k));
  });

  if (props.errors.some((e: ValidationError): boolean => {
    return fieldIds.indexOf(e.field) > -1;
  })) {
    displayMessage(msg.flash.signin.failure);

    highlightFields(f, props.errors.map((e) => e.field));
    handleErrors(f, props.errors);
    unlock(f);
    return;
  }

  // with csrf_token via cookie
  client.post('/login', {
    username
  , password
  })
  .then((res: any): void => {
    if (res.status !== 200) {
      const data = res.data ? res.data : {};

      if (data.message === undefined) {
        data.message = msg.flash.signin.failure;
      }
      displayMessage(data.message);

      handleErrors(f, data.errors);
      unlock(f);
      return;
    }

    const stamp = props.putStamp(res.data.token);
    props.setStamp(stamp);
    props.history.push('/');
  })
  .catch((err: any): void => {
    unlock(f);

    // TODO
    console.log(err);
  });
};

const handleThemeLinkClick = (
  props: SigninProps
, event: Event
): void => {
  event.preventDefault();

  props.setTheme(props.theme === Theme.Light ? Theme.Dark : Theme.Light, true);
};

const getFlashMessage = (history: H.History): string => {
  const { location } = history;
  if ((typeof location.state) === 'object' &&
     location.state.flash !== undefined) {
    return location.state.flash;
  }
  return undefined;
};

export const Signin = (
  props: SigninProps
, route: any
): VNode => {
  props.history = route.router.history as H.History;

  const flashMessage = getFlashMessage(props.history);
  return h('#signin.content', {},
    h('.signin.grid', {},
      h('.row', {},
        h(`.column-6.offset-5
.column-v-8.offset-v-4
.column-l-10.offset-l-3
.column-m-16`, {},
          h('.transparent.box', [
            h('.title', {},
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
            , onSubmit: linkEvent(props, handleSubmit)
            }, [
              h('h4.header', {}, 'Sign in to Eloquentlog')
            , (flashMessage === undefined) ?
                h('#message.message.hidden', { role: 'alert' }) :
                h('#message.message.warn', { role: 'alert' },
                  h('p', {}, flashMessage))
            , h('.required.field', [ // email === username (for now)
                h('label.label', { for: 'username' }, 'E-mail address')
              , h('input#username', {
                  type: 'text'
                , name: 'username'
                , autocomplete: 'email'
                , placeHolder: 'ahoj@eloquentlog.com'
                , onInput: linkEvent(props, handleChange)
                })
              ])
            , h('.required.field', [
                h('label.label', { for: 'password' }, 'Password')
              , h('input#password', {
                  type: 'password'
                , name: 'password'
                , autocomplete: 'off'
                , placeHolder: 'Keep it secret ;)'
                , onInput: linkEvent(props, handleChange)
                })
              ])
            , h('button#submit.primary.flat.button', { type: 'submit' },
                'Sign in')
            , h('span.loading.hidden')
            ])
          , h('p.options', [
              h('a.reset-password', {
                href: '/password/reset'
              }, 'Fogot your password')
            , '? Or are you new to Eloquentlog? then,'
            , h('a.signup', { href: '/signup' }, 'Sign up')
            , ';-)'
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
  );
};

Signin.defaultProps = {
  errors: []
};

Signin.defaultHooks = {
  onComponentDidMount (_: any): void {
    document.title = 'Sign in - ' + document.title;
    makeIgnite();
  }
, onComponentDidUpdate (
    _lastProps: SigninProps
    , nextProps: SigninProps
  ): void {
    makeIgnite();
  }
};
