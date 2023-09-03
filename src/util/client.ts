import axios from 'axios';

import * as cfg from '../../config.json';
import { ValidationError } from './form';
import { extendToken } from './token';

export interface Response {
  message: string;
  errors: ValidationError[];
}

export interface Headers {
  [key: string]: string;
}

const headers: Headers = {
    'Accept': 'application/json'
  , 'Content-Type': 'application/json; charset=utf-8'
  , 'X-Requested-With': 'XMLHttpRequest' // this needs CORS
};

const authURL = `${cfg.API.Protocol}://
${cfg.API.Host}:${cfg.API.Port}/_`;

const baseURL = `${cfg.API.Protocol}://
${cfg.API.Host}:${cfg.API.Port}/v1`;

const siteURL = `${cfg.Server.Protocol}://
${cfg.Server.Host}:${cfg.Server.Port}`;

const getClient = (
  validateStatus: (status: number) => boolean
, aURL: string
) => {
  const client = axios.create({
    baseURL: aURL
  , timeout: 0
  , headers
  , validateStatus
  , withCredentials: true
  , xsrfCookieName: 'csrf_token'
  , xsrfHeaderName: 'X-CSRF-TOKEN'
  });

  client.interceptors.response.use((res: any) => {
    if (res && res.status === 200) {
      extendToken();
    }
    return res;
  }, (err: any) => {
    return new Promise((_, reject) => {
      if (err && err.response) {
        // TODO: do we need to implement "Are you still there?"
        if ([400, 401, 403].some((n: number): boolean => {
          return n === err.response.status;
        })) {
          // NOTE: In dev mode, `secret key` will be regenerated on the boot
          // of backend server.
          window.location.replace(`${siteURL}/signout`);
        } else if (err.code === 'ERR_NETWORK') {
          // TODO: show the static error page
          console.log(err);
        }
      }
      reject(err);
    });
  });
  return client;
};

export const webClient = (fn: (status: number) => boolean) => {
  return getClient(fn, authURL);
};

export const appClient = (fn: (status: number) => boolean) => {
  return getClient(fn, baseURL);
};
