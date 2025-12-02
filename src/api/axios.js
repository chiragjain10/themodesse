import axios from 'axios';

const isDev = import.meta.env.DEV;

const baseURL = isDev
  ? '/api'
  : (import.meta.env.VITE_API_BASE_URL || 'https://backend.themodesse.com/');

const axiosInstance = axios.create({
  baseURL: baseURL,

  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },

  withCredentials: false,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const fullUrl = (config.baseURL || '') + (config.url || '');
    console.log('Requesting:', fullUrl);

    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/cart/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response received from:', response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`Response error [${error.response.status}]:`, error.response.data);
      
      if (error.response.status === 503) {
        console.error('Service Unavailable - Backend server is down or unreachable');
      }
    } else if (error.request) {
      console.error('No response received from server:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }

    if (error.response?.status === 401 && !error.config.url.includes('/cart/')) {
      localStorage.removeItem('token');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;