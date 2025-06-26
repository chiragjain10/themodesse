import axios from 'axios';

export const checkoutService = {
    async getCheckoutData(userId) {
        // This endpoint should return shippingMethods, paymentMethods, billingDetails, etc.
        const response = await axios.get(`/api/users/checkout/${userId}`);
        return response.data;
    },
};
