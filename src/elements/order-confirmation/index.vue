<template>
    <div class="order-confirmation-page">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="confirmation-box text-center">
                        <div class="success-icon">
                            <i class="icon-check"></i>
                        </div>
                        <h1>Thank You for Your Order!</h1>
                        <p class="order-number">Order #{{ orderId }}</p>
                        <p class="message">
                            Your order has been successfully placed. We'll send you an email confirmation shortly.
                        </p>
                        <div class="order-details" v-if="order">
                            <h3>Order Details</h3>
                            <div class="shipping-info">
                                <h4>Shipping Information</h4>
                                <p>{{ order.shipping.firstName }} {{ order.shipping.lastName }}</p>
                                <p>{{ order.shipping.address }}</p>
                                <p>{{ order.shipping.city }}, {{ order.shipping.state }} {{ order.shipping.pincode }}</p>
                                <p>Phone: {{ order.shipping.phone }}</p>
                                <p>Email: {{ order.shipping.email }}</p>
                            </div>
                            <div class="order-summary">
                                <h4>Order Summary</h4>
                                <div class="items">
                                    <div v-for="item in order.items" :key="item.id" class="item">
                                        <div class="item-image">
                                            <img :src="item.image" :alt="item.name">
                                        </div>
                                        <div class="item-details">
                                            <h5>{{ item.name }}</h5>
                                            <p>Size: {{ item.selectedVariant.size }}</p>
                                            <p>Quantity: {{ item.quantity }}</p>
                                            <p class="price">₹{{ item.price * item.quantity }}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="totals">
                                    <div class="subtotal">
                                        <span>Subtotal</span>
                                        <span>₹{{ order.subtotal }}</span>
                                    </div>
                                    <div class="shipping">
                                        <span>Shipping</span>
                                        <span>₹{{ order.shipping }}</span>
                                    </div>
                                    <div class="total">
                                        <span>Total</span>
                                        <span>₹{{ order.total }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="actions">
                            <router-link to="/shop" class="btn btn-primary">Continue Shopping</router-link>
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
import { orderService } from '@/services/order';
import { useToast } from '@/composables/useToast';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const orderId = ref(route.params.orderId);
const order = ref(null);

onMounted(async () => {
    if (!orderId.value) {
        router.push('/');
        return;
    }

    try {
        const response = await orderService.getOrder(orderId.value);
        if (response.status === 'success') {
            order.value = response.order;
        } else {
            throw new Error(response.message || 'Failed to fetch order details');
        }
    } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to fetch order details');
        router.push('/');
    }
});
</script>

<style scoped>
.order-confirmation-page {
    padding: 60px 0;
}

.confirmation-box {
    background: #fff;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(0,0,0,0.1);
}

.success-icon {
    font-size: 48px;
    color: #28a745;
    margin-bottom: 20px;
}

.success-icon i {
    display: inline-block;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border-radius: 50%;
    background: #e8f5e9;
}

h1 {
    font-size: 32px;
    margin-bottom: 10px;
    color: #333;
}

.order-number {
    font-size: 18px;
    color: #666;
    margin-bottom: 20px;
}

.message {
    font-size: 16px;
    color: #666;
    margin-bottom: 30px;
}

.order-details {
    text-align: left;
    margin-top: 40px;
    padding-top: 40px;
    border-top: 1px solid #eee;
}

.shipping-info, .order-summary {
    margin-bottom: 30px;
}

.shipping-info h4, .order-summary h4 {
    font-size: 20px;
    margin-bottom: 15px;
    color: #333;
}

.shipping-info p {
    margin: 5px 0;
    color: #666;
}

.item {
    display: flex;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.item-image {
    width: 100px;
    margin-right: 20px;
}

.item-image img {
    width: 100%;
    height: auto;
    object-fit: cover;
}

.item-details {
    flex: 1;
}

.item-details h5 {
    margin: 0 0 5px;
    font-size: 16px;
}

.item-details p {
    margin: 0;
    color: #666;
}

.price {
    font-weight: bold;
    color: #333 !important;
}

.totals {
    margin-top: 20px;
}

.totals > div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    color: #666;
}

.total {
    font-weight: bold;
    font-size: 18px;
    color: #333 !important;
    border-top: 1px solid #eee;
    padding-top: 10px;
    margin-top: 10px;
}

.actions {
    margin-top: 30px;
}

.btn-primary {
    padding: 12px 30px;
    font-size: 16px;
    font-weight: 500;
}

@media (max-width: 767px) {
    .confirmation-box {
        padding: 20px;
    }

    h1 {
        font-size: 24px;
    }

    .item {
        flex-direction: column;
    }

    .item-image {
        width: 100%;
        margin-right: 0;
        margin-bottom: 15px;
    }
}
</style>