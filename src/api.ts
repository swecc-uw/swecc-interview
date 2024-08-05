import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:8000',  
  withCredentials: true,             
});


const fetchCsrfToken = async () => {
  try {
    const response = await api.get('/api/user/csrf/');
    const csrfToken = response.headers['x-csrftoken'];
    api.defaults.headers.common['X-CSRFToken'] = csrfToken;
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
};

fetchCsrfToken();

export default api;