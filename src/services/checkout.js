import axios from '@/api/axios';

export const checkoutService = {
    async getCheckoutData(userId) {
        try {
            // This endpoint should return shippingMethods, paymentMethods, billingDetails, etc.
            const response = await axios.get(`/api/users/checkout/${userId}`);
            console.log('Checkout API response:', response.data); // Debug log
            return response.data;
        } catch (error) {
            console.error('Checkout service error:', error);
            throw error;
        }
    },
};
