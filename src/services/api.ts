import axios from 'axios';
import { devPrint } from '../components/utils/RandomUtils';

const api = axios.create({
  baseURL: 'https://api.swecc.org',
  withCredentials: true,
});

export const getCSRF = async () => {
  try {
    const response = await api.get('/auth/csrf/');
    const csrfToken = response.headers['x-csrftoken'];
    if (csrfToken) {
      api.defaults.headers.common['X-CSRFToken'] = csrfToken;
      devPrint('CSRF token updated:', csrfToken);
    }
  } catch (error) {
    devPrint('Failed to fetch CSRF token:', error);
  }
};

api.interceptors.request.use(async (config) => {
  if (config.url === '/auth/csrf/') {
    return config;
  }
  if (!api.defaults.headers.common['X-CSRFToken']) {
    await getCSRF(); 
  }
  return config;
});

export default api;
