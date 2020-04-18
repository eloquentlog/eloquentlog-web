import axios from 'axios';

import { ValidationError } from './form';

// TODO
const BACKEND_API_PROTOCOL: string = 'http';
const BACKEND_API_HOST: string = '127.0.0.1';
const BACKEND_API_PORT: string = '8000';

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

const baseURL = `${BACKEND_API_PROTOCOL}://
${BACKEND_API_HOST}:${BACKEND_API_PORT}/_api`;

export const getClient = (validateStatus: (status: number) => boolean) => {
  const client = axios.create({
    baseURL
  , timeout: 0
  , headers
  , validateStatus
  , withCredentials: true
  });
  return client;
};
