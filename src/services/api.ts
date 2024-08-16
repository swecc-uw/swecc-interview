import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.swecc.org',
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
