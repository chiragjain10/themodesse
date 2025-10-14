<template>
    <div class="payment-cancelled-page">
        <div class="container">
            <div class="cancelled-card">
                <div class="cancelled-icon">
                    <i class="fas fa-times-circle"></i>
                </div>
                <h1>Payment Cancelled</h1>
                <p>Your payment was not completed. No charges have been made to your account.</p>
                
                <div class="order-info" v-if="orderData">
                    <h3>Order Details</h3>
                    <div class="info">
                        <p><strong>Order ID:</strong> {{ orderId }}</p>
                        <p><strong>Customer:</strong> {{ orderData.customer_name }}</p>
                        <p><strong>Total Amount:</strong> ₹{{ orderData.total }}</p>
                    </div>
                </div>

                <div class="actions">
                    <button @click="retryPayment" class="btn btn-primary">
                        <i class="fas fa-redo me-2"></i>
                        Try Payment Again
                    </button>
                    <button @click="goToCart" class="btn btn-secondary">
                        <i class="fas fa-shopping-cart me-2"></i>
                        Back to Cart
                    </button>
                </div>

                <div class="help-text">
                    <p><strong>Need help?</strong></p>
                    <p>If you're having trouble with payment, please contact our support team.</p>
                    <p>Email: support@themodesse.com</p>
                    <p>Phone: +91-XXXXXXXXXX</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';

const router = useRouter();
const toast = useToast();

const orderData = ref(null);
const orderId = ref(null);

onMounted(() => {
    // Retrieve order data from localStorage
    const pendingOrder = localStorage.getItem('pendingOrder');
    const currentOrderId = localStorage.getItem('currentOrderId');

    if (pendingOrder) {
        orderData.value = JSON.parse(pendingOrder);
    }

    if (currentOrderId) {
        orderId.value = currentOrderId;
    }

    // Show cancellation message
    toast.info('Payment was cancelled. You can try again or return to cart.');
});

const retryPayment = () => {
    // Clear any existing payment data
    localStorage.removeItem('paymentResponse');
    localStorage.removeItem('currentOrderId');
    
    // Redirect back to checkout
    router.push('/checkout');
};

const goToCart = () => {
    // Clear all payment related data
    localStorage.removeItem('pendingOrder');
    localStorage.removeItem('paymentResponse');
    localStorage.removeItem('currentOrderId');
    
    // Redirect to cart
    router.push('/cart');
};
</script>

<style scoped>
.payment-cancelled-page {
    padding: 50px 0;
    background-color: #f8f4ec;
    min-height: 100vh;
}

.cancelled-card {
    max-width: 600px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.cancelled-icon {
    font-size: 80px;
    color: #dc3545;
    margin-bottom: 20px;
}

.cancelled-card h1 {
    color: #dc3545;
    margin-bottom: 10px;
}

.cancelled-card p {
    color: #666;
    margin-bottom: 30px;
}

.order-info {
    text-align: left;
    margin: 20px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #dc3545;
}

.order-info h3 {
    margin-bottom: 15px;
    color: #333;
}

.info p {
    margin: 8px 0;
    color: #555;
}

.actions {
    margin: 30px 0;
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
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 160px;
}

.btn-primary {
    background: #007bff;
    color: white;
}

.btn-primary:hover {
    background: #0056b3;
    transform: translateY(-2px);
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #545b62;
    transform: translateY(-2px);
}

.help-text {
    margin-top: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    text-align: left;
}

.help-text p {
    margin: 8px 0;
    color: #666;
    font-size: 14px;
}

.help-text strong {
    color: #333;
}

@media (max-width: 768px) {
    .actions {
        flex-direction: column;
        align-items: center;
    }
    
    .btn {
        width: 100%;
        max-width: 250px;
    }
}
</style> 