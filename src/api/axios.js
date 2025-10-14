import axios from 'axios';

const isDev = import.meta.env.DEV;

const axiosInstance = axios.create({
  // Use relative baseURL in dev so Vite proxy handles requests
  // In prod, prefer relative as well so Vercel rewrites handle '/api/*'.
  // If VITE_API_BASE_URL is explicitly set, we will use it.
  baseURL: isDev
    ? '/api'
    : (import.meta.env.VITE_API_BASE_URL || ''),

  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },

  // Only enable credentials if backend needs cookies (like Sanctum)
  withCredentials: false,
  timeout: 10000,
});

// 🟢 REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    // Avoid baseURL + '/api' + '/api/...'
    const base = config.baseURL || '';
    if (/\/api\/?$/.test(base) && typeof config.url === 'string' && config.url.startsWith('/api')) {
      config.url = config.url.replace(/^\/api/, ''); // drop leading /api
    }

    console.log('➡️ Requesting:', (config.baseURL || '') + config.url);

    // Add token only if exists
    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/cart/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// 🟢 RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response received from:', response.config.url);
    return response;
  },
  (error) => {
    if (error.response) {
      console.error(`❌ Response error [${error.response.status}]:`, error.response.data);
    } else if (error.request) {
      console.error('🚫 No response received from server:', error.request);
    } else {
      console.error('⚠️ Request setup error:', error.message);
    }

    // Auto logout on 401 (except cart)
    if (error.response?.status === 401 && !error.config.url.includes('/cart/')) {
      localStorage.removeItem('token');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
