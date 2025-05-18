import { defineStore } from 'pinia';
import axios from '../api/axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: localStorage.getItem('token') ? true : false,
        user: null,
        token: localStorage.getItem('token') || null,
    }),
    actions: {
        async login(credentials) {
            try {
                const response = await axios.post('/api/login', {
                    email: credentials.email,
                    password: credentials.password
                });
                
                console.log('Auth store: Login response:', response.data);
                
                if (response.data.access_token) {
                    this.token = response.data.access_token;
                    localStorage.setItem('token', this.token);
                    this.isAuthenticated = true;
                    this.user = response.data.user;
                    console.log('Auth store: Login successful:');
                    return response.data;
                } else {
                    console.error('Auth store: No token in response');
                    throw new Error('Invalid response from server');
                }
            } catch (error) {
                console.error('Auth store: Full error object:', error);
                console.error('Auth store: Error response:', error.response);
                console.error('Auth store: Error request:', error.request);
                console.error('Auth store: Error message:', error.message);
                
                this.isAuthenticated = false;
                this.token = null;
                localStorage.removeItem('token');
                this.user = null;
                
                // Format error message
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Auth store: Error response data:', error.response.data);
                    console.error('Auth store: Error response status:', error.response.status);
                    
                    // Handle specific error cases
                    if (error.response.status === 422) {
                        // Validation error
                        const errors = error.response.data.errors;
                        const firstError = Object.values(errors)[0];
                        throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
                    } else if (error.response.status === 401) {
                        throw new Error('Invalid email or password');
                    } else {
                        throw new Error(error.response.data.message || 'Login failed. Please try again.');
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('Auth store: No response received');
                    throw new Error('No response from server. Please check your internet connection.');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Auth store: Error setting up request:', error.message);
                    throw new Error('An error occurred. Please try again.');
                }
            }
        },
        async register(userData) {
            try {
                const response = await axios.post('/api/register', {
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    password_confirmation: userData.confirmPassword
                });
                return response.data;
            } catch (error) {
                if (error.response) {
                    if (error.response.status === 422) {
                        // Validation error
                        const errors = error.response.data.errors;
                        const firstError = Object.values(errors)[0];
                        throw new Error(Array.isArray(firstError) ? firstError[0] : firstError);
                    }
                    throw new Error(error.response.data.message || 'Registration failed. Please try again.');
                }
                throw error;
            }
        },
        async logout() {
            try {
                await axios.post('/api/logout');
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.isAuthenticated = false;
                this.user = null;
                this.token = null;
                localStorage.removeItem('token');
                const router = useRouter();
                router.push('/login');
            }
        },
        async fetchUser() {
            if (this.token) {
                try {
                    const response = await axios.get('/api/user', {
                        headers: {
                            Authorization: `Bearer ${this.token}`,
                        },
                    });
                    this.user = response.data;
                    this.isAuthenticated = true;
                } catch (error) {
                    this.isAuthenticated = false;
                    this.user = null;
                    this.token = null;
                    localStorage.removeItem('token');
                    const router = useRouter();
                    router.push('/login');
                }
            }
        },
    },
});