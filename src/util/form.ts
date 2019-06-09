import { Response } from './client';

export const inputFieldsLocker = (ids: string[]): () => void => {
  return (): void => {
    ids.forEach((id: string): void => {
      const e = document.querySelector('#' + id) as HTMLInputElement;
      e.blur();

      const disabled = e.getAttribute('disabled');
      if (disabled === 'disabled') {
        e.removeAttribute('disabled');
      } else {
        e.setAttribute('disabled', 'disabled');
      }
    });
  };
};

export const cleanErrors = (form: Element, fields: string[]): void => {
  const msgContainer = document.getElementById('message');
  msgContainer.innerHTML = '';
  msgContainer.classList.remove('error');

  fields.forEach((field: string): void => {
    const group = form.querySelector('#' + field).parentElement
        , errors = group.querySelector('.errors')
        ;
    if (errors !== null) {
      group.removeChild(errors);
    }
  });
};

export interface ValidationError {
  field: string;
  messages: string[];
}

export const handleErrors = (form: Element, data: Response): void => {
  if (data.message !== undefined) {
    const msgContainer = document.getElementById('message');
    const message = document.createElement('p');
    message.innerHTML = data.message;
    msgContainer.innerHTML = '';
    msgContainer.appendChild(message);
    msgContainer.classList.add('error');
  }

  if (data.errors !== undefined) {
    data.errors.forEach((e: ValidationError): void => {
      const group = form.querySelector('#' + e.field).parentNode
          , errors = document.createElement('ul')
          ;
      errors.classList.add('errors');

      e.messages.forEach((m: string): void => {
        const error = document.createElement('li');
        error.innerHTML = m;
        errors.appendChild(error);
      });
      group.appendChild(errors);
    });
  }
};
