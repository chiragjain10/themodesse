import axios from 'axios';

export const orderService = {
    async createOrder(orderData) {
        try {
            const response = await axios.post('/api/orders', orderData);
            return response.data;
        } catch (error) {
            console.error('[Order Service] Create order error:', error.response || error);
            throw error;
        }
    },

    async getOrders() {
        try {
            const response = await axios.get('/api/orders');
            return response.data;
        } catch (error) {
            console.error('[Order Service] Get orders error:', error.response || error);
            throw error;
        }
    },

    async getOrder(orderId) {
        try {
            const response = await axios.get(`/api/orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error('[Order Service] Get order error:', error.response || error);
            throw error;
        }
    }
};