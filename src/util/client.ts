import axios from 'axios';

// TODO
const BACKEND_API_PROTOCOL: string = 'http';
const BACKEND_API_HOST: string = '127.0.0.1';
const BACKEND_API_PORT: string = '8000';

export const getClient = () => {
  const client = axios.create({
    baseURL: `${BACKEND_API_PROTOCOL}://
${BACKEND_API_HOST}:${BACKEND_API_PORT}/_api`
  , timeout: 1800
  , headers: {
      'Accept': 'application/json'
    , 'Content-Type': 'application/json; charset=utf-8'
    }
  });
  return client;
};
