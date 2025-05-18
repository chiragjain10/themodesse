import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
    config => {
        console.log('Making request to:', config.url);
        console.log('Request config:', config);
        
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    response => {
        console.log('Response received:', response);    
        return response;
    },
    error => {
        console.error('Response error:', error);
        console.error('Response error config:', error.config);
        console.error('Response error response:', error.response);
        
        if (error.response?.status === 401) {
            // Handle unauthorized access
            localStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;