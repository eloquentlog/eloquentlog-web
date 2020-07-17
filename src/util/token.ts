import Cookies from 'js-cookie';

import * as cfg from '../../config.json';

export interface Token {
  limit: Date;
  value: string;
}

const tokenKey = 'header.payload';

export const extendToken = (): boolean => {
  const token = readToken();
  if (token && token.value) {
    return saveToken(token.value) !== null;
  }
  return false;
};

export const readToken = (): Token => {
  return Cookies.getJSON(tokenKey);
};

export const saveToken = (value: string): string => {
  const path = '/'
      , domain = cfg.Cookie.Domain
      , secure = cfg.Cookie.Secure
      , expires = cfg.Cookie.Expires
      ;
  Cookies.remove(tokenKey, { path, domain });
  if (value !== undefined) {
    // NOTE:
    // The value should contain only first 2 parts of
    // `heaher.payload.signature`.
    const parts: string[] = value.split('.', 2);
    if (parts.length !== 2) {
      console.error('invalid token value');
      return null;
    } else {
      // e.g.
      // - expires: 1 / 8 (0.125) * 864e+5 / 1000 / 60 = 180.0 (3 hours)
      // - expires: 3 * 864e+5 / 1000 / 60 = 4320.0 (3 days)
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

      Cookies.set(tokenKey, token, attributes);
    }
  }
  return value;
};
