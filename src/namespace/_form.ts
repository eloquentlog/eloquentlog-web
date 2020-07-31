import * as H from 'history';
import { linkEvent, VNode } from 'inferno';
import { h } from 'inferno-hyperscript';

import { RouteProps } from '../routing';
import { appClient } from '../util/client';
import {
  clearErrors
, displayMessage
, handleErrors
, highlightFields
, inputFieldsLocker
, removeMessage
, ValidationError
} from '../util/form';
import { message as msg } from '../util/message';

export enum NamespaceFormContext {
  Create,
  Update,
}

interface NamespaceFormProps {
  errors: ValidationError[];
  parent: RouteProps;
  context: NamespaceFormContext;
}

// a check if required field is not empty
const validate = (_: string, v: string): boolean => {
  return v !== '';
};

const fieldIds = [
  'name'
, 'description'
];

const lockFields = inputFieldsLocker(fieldIds.concat('submit'));
const lock = (f: Element): void => {
        const loader = f.querySelector('.loading');
        loader.classList.toggle('hidden');
        lockFields();
      }
    , unlock = lock
    ;

const client = appClient((status: number): boolean => {
  return (status >= 200 && status < 300) ||
         [400, 404, 422].some((n: number): boolean => n === status);
});

const handleRequired = (
  props: NamespaceFormProps
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

const handleChange = (props: NamespaceFormProps, event: Event): void => {
  event.preventDefault();
  const target = event.target as HTMLInputElement;

  handleRequired(props, target);
};


const handleSubmit = (props: NamespaceFormProps, event: Event): void => {
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
    name
  , description
  ] = fieldIds.map(
    (id: string): string =>
      (f.querySelector('#' + id) as HTMLInputElement).value
  );

  // required
  const requiredValues: { [idx: string]: string; } = {
    name
  };
  Object.keys(requiredValues).forEach((k: string): void => {
    handleRequired(props, f.querySelector('#' + k));
  });

  if (props.errors.some((e: ValidationError): boolean => {
    return fieldIds.indexOf(e.field) > -1;
  })) {
    displayMessage(msg.flash.namespace.create.failure);

    highlightFields(f, props.errors.map((e) => e.field));
    handleErrors(f, props.errors);
    unlock(f);
    return;
  }

  client.put('/namespace/hset', {
    name
  , description
  })
  .then((res: any): void => {
    if (res.status !== 200) {
      const data = res.data ? res.data : {};

      if (data.message === undefined) {
        data.message = msg.flash.namespace.create.failure;
      }
      displayMessage(data.message);

      handleErrors(f, data.errors);
      unlock(f);
      return;
    }

    const uuid = res.data.uuid;
    props.parent.history.push(`/namespace/${uuid}`);
  })
  .catch((err: any): void => {
    unlock(f);

    // TODO
    console.log(err);
  });
};

const getFlashMessage = (history: H.History): string => {
  const { location } = history;
  if ((typeof location.state) === 'object' &&
     location.state.flash !== undefined) {
    return location.state.flash;
  }
  return undefined;
};


export const NamespaceForm = (props: NamespaceFormProps): VNode => {
  const flashMessage = getFlashMessage(props.parent.history);
  return h('form.form', {
      noValidate: true
    , onSubmit: linkEvent(props, handleSubmit)
    }, [
      (flashMessage === undefined) ?
        h('#message.message.hidden', { role: 'alert' }) :
        h('#message.message.warn', { role: 'alert' },
          h('p', {}, flashMessage))
    , h('.required.field', [
        h('label.label', { for: 'name' }, 'Name')
      , h('input#name', {
          type: 'text'
        , name: 'name'
        , placeHolder: 'Name'
        , onInput: linkEvent(props, handleChange)
        })
      ])
    , h('.required', [
        h('label.label', { for: 'description' }, 'Description')
      , h('textarea#description', {
          name: 'description'
        , onInput: linkEvent(props, handleChange)
        })
      ])
    , h('button#submit.primary.flat.button', { type: 'submit' },
        'Create')
    , h('span.loading.hidden')
    ]);
};
