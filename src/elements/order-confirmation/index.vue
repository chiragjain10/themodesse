<template>
    <div class="order-confirmation-page">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="confirmation-card">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h2>Order Confirmed!</h2>
                        <p class="order-id">Order ID: #{{ orderId }}</p>
                        
                        <div class="order-details">
                            <h4>Order Details</h4>
                            <div class="detail-row">
                                <span>Order Date:</span>
                                <span>{{ orderDate }}</span>
                            </div>
                            <div class="detail-row">
                                <span>Payment Status:</span>
                                <span class="status-paid">Paid</span>
                            </div>
                            <div class="detail-row">
                                <span>Payment Method:</span>
                                <span>{{ paymentMethod }}</span>
                            </div>
                            <div class="detail-row">
                                <span>Total Amount:</span>
                                <span class="amount">₹{{ totalAmount }}</span>
                            </div>
                        </div>

                        <div class="shipping-info">
                            <h4>Shipping Information</h4>
                            <p>{{ shippingAddress }}</p>
                        </div>

                        <div class="actions">
                            <button @click="goToOrders" class="btn btn-primary">View My Orders</button>
                            <button @click="goToHome" class="btn btn-outline-primary">Continue Shopping</button>
                        </div>

                        <div class="email-notice">
                            <p>A confirmation email has been sent to your email address.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import { orderService } from '@/services/order';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const orderId = ref(route.params.orderId || '');
const orderDate = ref('');
const paymentMethod = ref('');
const totalAmount = ref(0);
const shippingAddress = ref('');

onMounted(async () => {
    if (!orderId.value) {
        toast.error('Order ID not found');
        router.push('/');
        return;
    }

    try {
        const order = await orderService.getOrder(orderId.value);
        if (order.success) {
            orderDate.value = new Date(order.data.created_at).toLocaleDateString();
            paymentMethod.value = order.data.payment_method;
            totalAmount.value = order.data.total;
            shippingAddress.value = `${order.data.shipping_address}, ${order.data.shipping_city}, ${order.data.shipping_state} - ${order.data.shipping_pincode}`;
        }
    } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Failed to load order details');
    }
});

const goToOrders = () => {
    router.push('/my-account/orders');
};

const goToHome = () => {
    router.push('/');
};
</script>

<style scoped>
.order-confirmation-page {
    padding: 60px 0;
    background: #f8f9fa;
    min-height: 100vh;
}

.confirmation-card {
    background: white;
    border-radius: 16px;
    padding: 40px;
    text-align: center;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.success-icon {
    font-size: 4rem;
    color: #28a745;
    margin-bottom: 20px;
}

.confirmation-card h2 {
    color: #28a745;
    font-weight: 700;
    margin-bottom: 10px;
}

.order-id {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 30px;
}

.order-details, .shipping-info {
    text-align: left;
    margin: 30px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

.order-details h4, .shipping-info h4 {
    color: #333;
    margin-bottom: 15px;
    font-weight: 600;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.detail-row:last-child {
    border-bottom: none;
}

.status-paid {
    color: #28a745;
    font-weight: 600;
}

.amount {
    font-weight: 700;
    color: #333;
    font-size: 1.1rem;
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
    border-radius: 8px;
    font-weight: 500;
    text-decoration: none;
    display: inline-block;
}

.btn-primary {
    background: #007bff;
    color: white;
    border: none;
}

.btn-outline-primary {
    background: transparent;
    color: #007bff;
    border: 2px solid #007bff;
}

.email-notice {
    margin-top: 20px;
    padding: 15px;
    background: #e7f3ff;
    border-radius: 8px;
    color: #0056b3;
}

@media (max-width: 768px) {
    .confirmation-card {
        padding: 30px 20px;
    }
    
    .actions {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
}
</style>