import axios from '@/api/axios';

export const razorpayService = {
    // Create Razorpay order
    createOrder: async (amount) => {
        try {
            const response = await axios.post('/api/users/checkout/create-razorpay-order', {
                amount: amount
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Verify payment
    verifyPayment: async (paymentData) => {
        try {
            const response = await axios.post('/api/users/checkout/verify-payment', paymentData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get Razorpay configuration
    getConfig: () => {
        const key = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!key) {
            console.error('Razorpay key not found in environment variables');
            throw new Error('Razorpay configuration missing');
        }
        
        return {
            key: key,
            currency: 'INR',
            name: 'The Modesse',
            description: 'Order Payment'
        };
    }
}; 