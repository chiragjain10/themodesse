import axios from '@/api/axios';

export const cartService = {
    async addToCart(productId, quantity, userId) {
        try {
            const response = await axios.get(`/api/users/cart/add/${userId}/${productId}/${quantity}`);
            if (response.data.status === 'error') {
                throw new Error(response.data.message);
            }
            return response.data;
        } catch (error) {
            console.error('Add to cart error:', error.response?.data || error);
            throw error;
        }
    },

    async getCart(userId) {
        try {
            // Using the inbox route to get cart data
            const response = await axios.get(`/api/users/cart/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Get cart error:', error.response || error);
            throw error;
        }
    },

    async updateCartItem(cartId, productId, quantity) {
        try {
            const response = await axios.put(`/api/users/cart/${cartId}/${productId}/${quantity}`);
            if (response.data.status === 'error') {
                throw new Error(response.data.message);
            }
            return response.data;
        } catch (error) {
            console.error('Update cart error:', error.response || error);
            throw error;
        }
    },

    async removeCartItem(id) {
        try {
            const response = await axios.delete(`/api/users/cart/${id}`);
            return response.data;
        } catch (error) {
            console.error('Remove cart error:', error.response || error);
            throw error;
        }
    },

    async getCartCount(userId) {
        try {
            const response = await axios.get(`/api/users/cart/count/${userId}`);
            return response?.data?.cartItemNumber?.cart_items_count;
        } catch (error) {
            console.error('Get cart count error:', error.response || error);
            throw error;
        }
    }
}; 