import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const authService = {
    async register(userData) {
        try {
            const response = await axios.post(`${API_URL}/auth/register`, userData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async login(email, password) {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async checkEmailExists(email) {
        try {
            const response = await axios.post(`${API_URL}/auth/check-email`, { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async checkPhoneExists(phone) {
        try {
            const response = await axios.post(`${API_URL}/auth/check-phone`, { phone });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};