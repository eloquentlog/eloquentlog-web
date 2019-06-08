export const inputFieldsLocker = (ids: string[]) => {
  return () => {
    ids.forEach((id: string) => {
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
