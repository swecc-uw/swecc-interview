import axios from 'axios';

const api = axios.create({
  baseURL: 'http://54.187.200.205:8000',
  withCredentials: true,
});

const fetchCsrfToken = async () => {
  try {
    const response = await api.get('/api/auth/csrf/');
    const csrfToken = response.headers['x-csrftoken'];
    api.defaults.headers.common['X-CSRFToken'] = csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
};

fetchCsrfToken();

export default api;
