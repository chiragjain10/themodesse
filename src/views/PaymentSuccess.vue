<template>
    <div class="payment-success-page">
        <div class="container">
            <div class="success-card">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h1>Payment Successful!</h1>
                <p>Thank you for your order. Your payment has been processed successfully.</p>
                
                <div class="order-details" v-if="orderData">
                    <h3>Order Details</h3>
                    <div class="order-info">
                        <p><strong>Order ID:</strong> {{ orderId }}</p>
                        <p><strong>Customer:</strong> {{ orderData.customer_name }}</p>
                        <p><strong>Email:</strong> {{ orderData.email }}</p>
                        <p><strong>Phone:</strong> {{ orderData.phone }}</p>
                        <p><strong>Total Amount:</strong> ₹{{ orderData.total }}</p>
                    </div>
                </div>

                <div class="payment-info" v-if="paymentResponse">
                    <h3>Payment Information</h3>
                    <div class="payment-details">
                        <p><strong>Payment ID:</strong> {{ paymentResponse.razorpay_payment_id }}</p>
                        <p><strong>Order ID:</strong> {{ paymentResponse.razorpay_order_id }}</p>
                        <p><strong>Signature:</strong> {{ paymentResponse.razorpay_signature }}</p>
                    </div>
                </div>

                <div class="tracking-info">
                    <h3>📧 Order Confirmation Email Sent!</h3>
                    <p>We've sent a confirmation email to <strong>{{ orderData?.email }}</strong> with your order details.</p>
                    <div class="order-id-display">
                        <p><strong>Your Order ID:</strong> <span class="order-id">{{ orderId }}</span></p>
                        <p><strong>Save this Order ID for future tracking</strong></p>
                    </div>
                    <div class="tracking-options">
                        <router-link to="/track-order" class="btn btn-primary">Track My Order Now</router-link>
                        <p class="tracking-note">You can track your order anytime using Order ID + Email</p>
                    </div>
                </div>

                <div class="actions">
                    <button @click="saveOrderToBackend" class="btn btn-primary" :disabled="isSaving">
                        {{ isSaving ? 'Saving Order...' : 'Save Order Details' }}
                    </button>
                    <button @click="goToHome" class="btn btn-secondary">Continue Shopping</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import axios from '@/api/axios';

const router = useRouter();
const toast = useToast();

const orderData = ref(null);
const paymentResponse = ref(null);
const orderId = ref(null);
const isSaving = ref(false);

onMounted(() => {
    // Retrieve order data from localStorage
    const pendingOrder = localStorage.getItem('pendingOrder');
    const paymentResp = localStorage.getItem('paymentResponse');
    const currentOrderId = localStorage.getItem('currentOrderId');

    if (pendingOrder) {
        orderData.value = JSON.parse(pendingOrder);
    }

    if (paymentResp) {
        paymentResponse.value = JSON.parse(paymentResp);
    }

    if (currentOrderId) {
        orderId.value = currentOrderId;
    }

    // Auto-save order after 5 seconds
    setTimeout(() => {
        saveOrderToBackend();
    }, 5000);
});

const saveOrderToBackend = async () => {
    if (!orderData.value || !paymentResponse.value) {
        toast.error('Order data not found');
        return;
    }

    try {
        isSaving.value = true;

        const orderPayload = {
            order_id: orderId.value,
            customer_name: orderData.value.customer_name,
            email: orderData.value.email,
            phone: orderData.value.phone,
            address: orderData.value.address,
            city: orderData.value.city,
            state: orderData.value.state,
            zip_code: orderData.value.zip_code,
            country: orderData.value.country,
            subtotal: orderData.value.subtotal,
            shipping: orderData.value.shipping,
            total: orderData.value.total,
            items: orderData.value.items,
            payment_id: paymentResponse.value.razorpay_payment_id,
            payment_order_id: paymentResponse.value.razorpay_order_id,
            payment_signature: paymentResponse.value.razorpay_signature,
            payment_status: 'completed',
            payment_method: 'razorpay'
        };

        // Send to backend for record keeping
        const response = await axios.post('/api/orders/save-payment', orderPayload);
        
        if (response.data.success) {
            toast.success('Order saved successfully!');
            
            // Clear localStorage
            localStorage.removeItem('pendingOrder');
            localStorage.removeItem('paymentResponse');
            localStorage.removeItem('currentOrderId');
        } else {
            toast.error('Failed to save order details');
        }
    } catch (error) {
        console.error('Error saving order:', error);
        toast.error('Failed to save order details. Please contact support.');
    } finally {
        isSaving.value = false;
    }
};

const goToHome = () => {
    router.push('/');
};
</script>

<style scoped>
.payment-success-page {
    padding: 50px 0;
    background-color: #f8f4ec;
    min-height: 100vh;
}

.success-card {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.success-icon {
    font-size: 80px;
    color: #28a745;
    margin-bottom: 20px;
}

.success-card h1 {
    color: #28a745;
    margin-bottom: 10px;
}

.success-card p {
    color: #666;
    margin-bottom: 30px;
}

.order-details, .payment-info {
    text-align: left;
    margin: 20px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

.order-details h3, .payment-info h3 {
    margin-bottom: 15px;
    color: #333;
}

.order-info p, .payment-details p {
    margin: 8px 0;
    color: #555;
}

.actions {
    margin-top: 30px;
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover {
    background: #0056b3;
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #545b62;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.tracking-info {
    margin: 30px 0;
    padding: 25px;
    background: #e8f5e8;
    border-radius: 12px;
    border-left: 4px solid #28a745;
}

.tracking-info h3 {
    color: #28a745;
    margin-bottom: 15px;
    font-size: 1.3rem;
}

.order-id-display {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin: 15px 0;
    border: 2px dashed #007bff;
}

.order-id {
    background: #007bff;
    color: white;
    padding: 4px 12px;
    border-radius: 20px;
    font-weight: bold;
    font-family: monospace;
}

.tracking-options {
    margin-top: 20px;
}

.tracking-note {
    font-size: 0.9rem;
    color: #666;
    margin-top: 10px;
    font-style: italic;
}
</style> 