import { Response } from './client';

export const inputFieldsLocker = (ids: string[]): () => void => {
  return (): void => {
    ids.forEach((id: string): void => {
      const e = document.querySelector('#' + id) as HTMLInputElement;
      e.blur();

      const disabled = e.getAttribute('disabled');
      if (disabled === 'disabled') {
        e.removeAttribute('disabled');
        e.classList.remove('disabled');
      } else {
        e.setAttribute('disabled', 'disabled');
        e.classList.add('disabled');
      }
    });
  };
};

export const cleanErrors = (form: Element, inputIds: string[]): void => {
  const msgContainer = document.getElementById('message');
  msgContainer.innerHTML = '';
  msgContainer.classList.remove('critical', 'error', 'warn');
  msgContainer.classList.add('hidden');

  inputIds.forEach((id: string): void => {
    const field = form.querySelector('#' + id).parentElement
        , errors = field.querySelector('.errors')
        ;
    if (errors !== null) {
      field.removeChild(errors);
    }
  });
};

export interface ValidationError {
  field: string;
  messages: string[];
}

export const displayMessage = (message: string): void => {
  const msgContainer = document.getElementById('message');
  const msg = document.createElement('p');
  msg.innerHTML = message;
  msgContainer.innerHTML = '';
  msgContainer.appendChild(msg);
  msgContainer.classList.remove('hidden', 'critical', 'warn');
  msgContainer.classList.add('error');
};

export const handleErrors = (form: Element, data: Response): void => {
  if (data.message !== undefined) {
    displayMessage(data.message);
  }

  if (data.errors !== undefined) {
    data.errors.forEach((e: ValidationError): void => {
      const id = e.field;
      const field = form.querySelector('#' + id).parentNode
          , errors = document.createElement('ul')
          ;
      errors.classList.add('errors');

      e.messages.forEach((m: string): void => {
        const error = document.createElement('li');
        error.innerHTML = m;
        errors.appendChild(error);
      });
      field.appendChild(errors);
    });
  }
};
