export const ACCESS_TOKEN = 'access';
export const REFRESH_TOKEN = 'refresh';
export const ONBOARDED = 'onboarded';

const isProd = import.meta.env.PROD;

export const SERVER_URL = isProd
  ? 'https://api.swecc.org'
  : 'http://localhost:8000';

console.log('isProd:', isProd);
