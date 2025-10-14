import { defineStore } from 'pinia';
import axios from '../api/axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: localStorage.getItem('token') ? true : false,
        user: null,
        token: localStorage.getItem('token') || null,
        userLoaded: false
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
                    this.userLoaded = true;
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
                this.userLoaded = true;
                
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
                }
                throw error;
            }
        },
        
        setUser(user) {
            this.user = user;
            this.isAuthenticated = true;
        },
        
        setToken(token) {
            this.token = token;
            localStorage.setItem('token', token);
            this.isAuthenticated = true;
        },
        async register(userData) {
            try {
                const response = await axios.post('/api/register', {
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    password_confirmation: userData.confirmPassword,
                    phone: userData.phone
                });
                this.userLoaded = true;
                return response.data;
            } catch (error) {
                this.userLoaded = true;
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
                this.userLoaded = true;
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
                    this.userLoaded = true;
                } catch (error) {
                    this.isAuthenticated = false;
                    this.user = null;
                    this.token = null;
                    this.userLoaded = true;
                    localStorage.removeItem('token');
                    const router = useRouter();
                    router.push('/login');
                }
            } else {
                this.userLoaded = true;
            }
        },
    },
});