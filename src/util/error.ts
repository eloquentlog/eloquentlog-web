export const renderError = (message: string) => {
  const container = document.createElement('div');
  container.classList.add('modal-container');
  container.setAttribute('id', 'error_message');

  const modal = document.createElement('div');
  modal.classList.add('modal');

  const btn = document.createElement('a');
  btn.classList.add('close');
  btn.setAttribute('href', '#');
  btn.innerText = 'x';

  const msg = document.createElement('p');
  msg.classList.add('message');
  msg.innerText = message;
  msg.prepend(btn);

  modal.appendChild(msg);
  container.appendChild(modal);
  document.body.appendChild(container);
  window.location.href = '#error_message';
};
