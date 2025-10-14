import axios from '@/api/axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://backend.themodesse.com';

export const authService = {
    async register(userData) {
        try {
            // Transform the data to match backend expectations
            const registerData = {
                name: `${userData.firstName} ${userData.lastName}`,
                email: userData.email,
                password: userData.password,
                password_confirmation: userData.confirmPassword, // Use confirmPassword for confirmation
                phone: userData.phone
            };
            
            const response = await axios.post(`/api/register`, registerData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async login(credentials) {
        try {
            const response = await axios.post(`/api/login`, credentials);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async checkEmailExists(email) {
        try {
            const response = await axios.post(`/api/check-email`, { email });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    async checkPhoneExists(phone) {
        try {
            const response = await axios.post(`/api/check-phone`, { phone });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};