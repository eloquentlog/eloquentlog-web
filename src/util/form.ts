export interface ValidationError {
  field: string;
  messages: string[];
}

export const highlightFields = (form: Element, errors: string[]): void => {
  errors.forEach((e: string): void => {
    const field = form.querySelector('#' + e);
    field.classList.add('has-errors');
  });
};

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

export const displayMessage = (message: string): void => {
  const msgContainer = document.getElementById('message');
  if (msgContainer === null) {
    return;
  }
  const msg = document.createElement('p');
  msg.innerHTML = message;
  msgContainer.innerHTML = '';
  msgContainer.appendChild(msg);
  msgContainer.classList.remove('hidden', 'critical', 'warn');
  msgContainer.classList.add('error');
};

export const removeMessage = (): void => {
  const msgContainer = document.getElementById('message');
  if (msgContainer === null) {
    return;
  }
  msgContainer.innerHTML = '';
  msgContainer.classList.remove('critical', 'error', 'warn');
  msgContainer.classList.add('hidden');
};

export const clearErrors = (form: Element, inputIds: string[]): void => {
  inputIds.forEach((id: string): void => {
    const field = form.querySelector('#' + id).parentElement
        , ul = field.querySelector('.errors')
        ;
    if (ul !== null) {
      field.removeChild(ul);
    }
    field.classList.remove('has-errors');
  });
};

export const handleErrors = (
  form: Element
, errors: ValidationError[]
): void => {
  if (errors !== undefined) {
    errors.forEach((e: ValidationError): void => {
      const id = e.field;
      const field = form.querySelector('#' + id).parentElement
          , ul = document.createElement('ul')
          ;
      ul.classList.add('errors');

      e.messages.forEach((m: string): void => {
        const li = document.createElement('li');
        li.innerHTML = m;
        ul.appendChild(li);
      });
      field.appendChild(ul);
    });
  }
};
