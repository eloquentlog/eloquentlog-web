import Cookie from 'js-cookie';

const inThirtyMinutes = 1 / 48;

// TODO: read from config.js
const domain = '127.0.0.1';
const secure = false;

export interface Token {
  limit: Date;
  value: string;
}

export const readToken = (name: string): Token => {
  return Cookie.getJSON(name);
};

export const saveToken = (name: string, value: string): string => {
  if (value === undefined) {
    Cookie.remove(name, { domain });
  } else {
    // NOTE:
    // The value should contain only first 2 parts of
    // `heaher.payload.signature`.
    const parts: string[] = value.split('.', 2);
    if (parts.length !== 2) {
      console.error('invalid token');
    } else {
      const token: Token = {
        value: parts.slice(0, 2).join('.')
      , limit: new Date((new Date()).getTime() + inThirtyMinutes * 864e+5)
      };

      let attributes: Cookie.CookieAttributes = {
        domain
      , expires: inThirtyMinutes
      , secure
      };
      // See: https://github.com/js-cookie/js-cookie/issues/276
      attributes = Object.assign(attributes, {
        sameSite: 'Strict'
      });

      Cookie.set(name, token, attributes as any);
    }
  }
  return value;
};
