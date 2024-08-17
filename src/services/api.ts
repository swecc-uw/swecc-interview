import axios from 'axios';
import { SERVER_URL } from '../constants';

const api = axios.create({
  baseURL: SERVER_URL,
  withCredentials: true,
});

const fetchCsrfToken = async () => {
  try {
    const response = await api.get('/auth/csrf/');
    const csrfToken = response.headers['x-csrftoken'];
    api.defaults.headers.common['X-CSRFToken'] = csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
};

fetchCsrfToken();

export default api;
