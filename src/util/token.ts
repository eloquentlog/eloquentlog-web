// FIXME: don't use localstorage (only while initial development)

export const getToken = (typeName: string): string => {
  return window.localStorage.getItem(typeName);
};

export const putToken = (typeName: string, token: string): string => {
  if (token === undefined) {
    window.localStorage.removeItem(typeName);
  } else {
    window.localStorage.setItem(typeName, token);
  }
  return token;
};
