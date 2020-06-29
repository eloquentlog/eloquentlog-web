import Cookies from 'js-cookie';

import * as cfg from '../../config.json';

export interface Token {
  limit: Date;
  value: string;
}

export const readToken = (name: string): Token => {
  return Cookies.getJSON(name);
};

export const saveToken = (name: string, value: string): string => {
  const path = '/'
      , domain = cfg.Cookie.Domain
      , secure = cfg.Cookie.Secure
      , expires = cfg.Cookie.Expires
      ;
  Cookies.remove(name, { path, domain });
  if (value !== undefined) {
    // NOTE:
    // The value should contain only first 2 parts of
    // `heaher.payload.signature`.
    const parts: string[] = value.split('.', 2);
    if (parts.length !== 2) {
      console.error('invalid token');
    } else {
      // e.g. expires: 1 / 8 (0.125) * 864e+5 / 1000 / 60 = 180.0 (3h)
      const token: Token = {
        value: parts.slice(0, 2).join('.')
      , limit: new Date((new Date()).getTime() + (expires * 864e+5))
      };

      let attributes: Cookies.CookieAttributes = {
        path
      , domain
      , expires: token.limit
      , secure
      };
      // See: https://github.com/js-cookie/js-cookie/issues/276
      attributes = Object.assign(attributes, {
        sameSite: 'Strict'
      });

      Cookies.set(name, token, attributes);
    }
  }
  return value;
};
