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

export const getClient = (validateStatus: (status: number) => boolean) => {
  const client = axios.create({
    baseURL: `${BACKEND_API_PROTOCOL}://
${BACKEND_API_HOST}:${BACKEND_API_PORT}/_api`
  , timeout: 0
  , headers: {
      'Accept': 'application/json'
    , 'Content-Type': 'application/json; charset=utf-8'
    }
  , validateStatus
  });
  return client;
};
