<template>
    <div class="order-tracking-page">
        <!-- Header -->
        <div class="tracking-header">
            <div class="container">
                <h1>Track Your Order</h1>
                <p>Enter your Order ID and Email to track your order status</p>
                <div class="tracking-help">
                    <p><strong>📧 Check your email:</strong> We sent your Order ID in the confirmation email</p>
                    <p><strong>📱 No login required:</strong> Track anytime using Order ID + Email</p>
                </div>
            </div>
        </div>

        <!-- Tracking Form -->
        <div class="tracking-form-section">
            <div class="container">
                <div class="tracking-form">
                    <div class="form-group">
                        <label for="orderId">Order ID</label>
                        <input 
                            type="text" 
                            id="orderId" 
                            v-model="trackingForm.orderId" 
                            placeholder="Enter your Order ID (e.g., ORDER_1234567890_abc123)"
                            class="form-control"
                        />
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input 
                            type="email" 
                            id="email" 
                            v-model="trackingForm.email" 
                            placeholder="Enter the email used for order"
                            class="form-control"
                        />
                    </div>
                    
                    <button 
                        @click="trackOrder" 
                        :disabled="isLoading"
                        class="track-btn"
                    >
                        {{ isLoading ? 'Tracking...' : 'Track Order' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Order Details -->
        <div v-if="orderDetails" class="order-details-section">
            <div class="container">
                <div class="order-card">
                    <div class="order-header">
                        <h2>Order Details</h2>
                        <span class="order-id">#{{ orderDetails.order_id }}</span>
                    </div>
                    
                    <!-- Order Status Timeline -->
                    <div class="status-timeline">
                        <div class="timeline-item" :class="{ active: orderDetails.status === 'pending' }">
                            <div class="timeline-icon">
                                <i class="fas fa-shopping-cart"></i>
                            </div>
                            <div class="timeline-content">
                                <h4>Order Placed</h4>
                                <p>Your order has been received</p>
                                <span class="date">{{ formatDate(orderDetails.created_at) }}</span>
                            </div>
                        </div>
                        
                        <div class="timeline-item" :class="{ active: orderDetails.status === 'confirmed' }">
                            <div class="timeline-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <div class="timeline-content">
                                <h4>Order Confirmed</h4>
                                <p>Payment verified and order confirmed</p>
                                <span class="date" v-if="orderDetails.status === 'confirmed'">{{ formatDate(orderDetails.updated_at) }}</span>
                            </div>
                        </div>
                        
                        <div class="timeline-item" :class="{ active: orderDetails.status === 'processing' }">
                            <div class="timeline-icon">
                                <i class="fas fa-cog"></i>
                            </div>
                            <div class="timeline-content">
                                <h4>Processing</h4>
                                <p>Your order is being prepared</p>
                                <span class="date" v-if="orderDetails.status === 'processing'">{{ formatDate(orderDetails.updated_at) }}</span>
                            </div>
                        </div>
                        
                        <div class="timeline-item" :class="{ active: orderDetails.status === 'shipped' }">
                            <div class="timeline-icon">
                                <i class="fas fa-shipping-fast"></i>
                            </div>
                            <div class="timeline-content">
                                <h4>Shipped</h4>
                                <p>Your order is on its way</p>
                                <span class="date" v-if="orderDetails.status === 'shipped'">{{ formatDate(orderDetails.updated_at) }}</span>
                            </div>
                        </div>
                        
                        <div class="timeline-item" :class="{ active: orderDetails.status === 'delivered' }">
                            <div class="timeline-icon">
                                <i class="fas fa-home"></i>
                            </div>
                            <div class="timeline-content">
                                <h4>Delivered</h4>
                                <p>Your order has been delivered</p>
                                <span class="date" v-if="orderDetails.status === 'delivered'">{{ formatDate(orderDetails.updated_at) }}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Order Information -->
                    <div class="order-info">
                        <div class="info-grid">
                            <div class="info-item">
                                <h5>Customer Details</h5>
                                <p><strong>Name:</strong> {{ orderDetails.customer_name }}</p>
                                <p><strong>Email:</strong> {{ orderDetails.email }}</p>
                                <p><strong>Phone:</strong> {{ orderDetails.phone }}</p>
                            </div>
                            
                            <div class="info-item">
                                <h5>Shipping Address</h5>
                                <p>{{ orderDetails.address }}</p>
                                <p>{{ orderDetails.city }}, {{ orderDetails.state }} {{ orderDetails.zip_code }}</p>
                                <p>{{ orderDetails.country }}</p>
                            </div>
                            
                            <div class="info-item">
                                <h5>Payment Details</h5>
                                <p><strong>Payment ID:</strong> {{ orderDetails.payment_id }}</p>
                                <p><strong>Payment Status:</strong> 
                                    <span class="status-badge" :class="orderDetails.payment_status">
                                        {{ orderDetails.payment_status }}
                                    </span>
                                </p>
                                <p><strong>Payment Method:</strong> {{ orderDetails.payment_method }}</p>
                            </div>
                            
                            <div class="info-item" v-if="orderDetails.courier_name || orderDetails.tracking_url">
                                <h5>Shipping Details</h5>
                                <p v-if="orderDetails.courier_name"><strong>Courier:</strong> {{ orderDetails.courier_name }}</p>
                                <p v-if="orderDetails.awb_code"><strong>AWB Code:</strong> {{ orderDetails.awb_code }}</p>
                                <p v-if="orderDetails.tracking_url">
                                    <strong>Tracking:</strong> 
                                    <a :href="orderDetails.tracking_url" target="_blank" class="tracking-link">
                                        Track Package
                                    </a>
                                </p>
                            </div>
                            
                            <div class="info-item">
                                <h5>Order Summary</h5>
                                <p><strong>Subtotal:</strong> ₹{{ orderDetails.subtotal }}</p>
                                <p><strong>Shipping:</strong> ₹{{ orderDetails.shipping }}</p>
                                <p><strong>Total:</strong> ₹{{ orderDetails.total }}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Order Items -->
                    <div class="order-items">
                        <h5>Order Items</h5>
                        <div class="items-list">
                            <div v-for="item in orderItems" :key="item.id" class="item-card">
                                <div class="item-image">
                                    <img :src="item.product_image || '/placeholder.jpg'" :alt="item.product_name" />
                                </div>
                                <div class="item-details">
                                    <h6>{{ item.product_name }}</h6>
                                    <p>Quantity: {{ item.quantity }}</p>
                                    <p>Price: ₹{{ item.price }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="error-message">
            <div class="container">
                <div class="alert alert-danger">
                    {{ errorMessage }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/api/axios'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const toast = useToast()

const trackingForm = reactive({
    orderId: '',
    email: ''
})

const orderDetails = ref(null)
const orderItems = ref([])
const isLoading = ref(false)
const errorMessage = ref('')

const trackOrder = async () => {
    if (!trackingForm.orderId || !trackingForm.email) {
        toast.error('Please enter both Order ID and Email')
        return
    }

    isLoading.value = true
    errorMessage.value = ''

    try {
        const response = await axios.post('/api/orders/track', {
            order_id: trackingForm.orderId,
            email: trackingForm.email
        })

        if (response.data.success) {
            orderDetails.value = response.data.order
            orderItems.value = response.data.items
            toast.success('Order found successfully!')
        } else {
            errorMessage.value = response.data.message || 'Order not found'
        }
    } catch (error) {
        console.error('Error tracking order:', error)
        errorMessage.value = 'Failed to track order. Please try again.'
        toast.error('Failed to track order')
    } finally {
        isLoading.value = false
    }
}

const formatDate = (dateString) => {
    if (!dateString) return ''
    return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>

<style scoped>
.order-tracking-page {
    min-height: 100vh;
    background: #f8f9fa;
}

.tracking-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 60px 0;
    text-align: center;
}

.tracking-header h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
    font-weight: 700;
}

.tracking-header p {
    font-size: 1.1rem;
    opacity: 0.9;
}

.tracking-help {
    margin-top: 20px;
    background: rgba(255,255,255,0.1);
    padding: 15px;
    border-radius: 8px;
}

.tracking-help p {
    margin: 5px 0;
    font-size: 0.95rem;
    opacity: 0.95;
}

.tracking-form-section {
    padding: 60px 0;
}

.tracking-form {
    max-width: 500px;
    margin: 0 auto;
    background: white;
    padding: 40px;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.form-group {
    margin-bottom: 25px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #333;
}

.form-control {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e1e5e9;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;
}

.form-control:focus {
    outline: none;
    border-color: #667eea;
}

.track-btn {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.track-btn:hover:not(:disabled) {
    transform: translateY(-2px);
}

.track-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.order-details-section {
    padding: 40px 0;
}

.order-card {
    background: white;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    overflow: hidden;
}

.order-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.order-header h2 {
    margin: 0;
    font-size: 1.8rem;
}

.order-id {
    font-size: 1.1rem;
    opacity: 0.9;
}

.status-timeline {
    padding: 40px;
    position: relative;
}

.status-timeline::before {
    content: '';
    position: absolute;
    left: 50px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #e1e5e9;
    z-index: 1;
}

.timeline-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 30px;
    position: relative;
    z-index: 2;
}

.timeline-item.active .timeline-icon {
    background: #28a745;
    color: white;
}

.timeline-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #e1e5e9;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 20px;
    flex-shrink: 0;
    transition: all 0.3s ease;
}

.timeline-content h4 {
    margin: 0 0 5px 0;
    font-size: 1.2rem;
    font-weight: 600;
}

.timeline-content p {
    margin: 0 0 5px 0;
    color: #666;
}

.timeline-content .date {
    font-size: 0.9rem;
    color: #999;
}

.order-info {
    padding: 0 40px 40px;
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
}

.info-item {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
}

.info-item h5 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 1.1rem;
}

.info-item p {
    margin: 0 0 8px 0;
    color: #666;
}

.status-badge {
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-badge.completed {
    background: #d4edda;
    color: #155724;
}

.status-badge.pending {
    background: #fff3cd;
    color: #856404;
}

.status-badge.failed {
    background: #f8d7da;
    color: #721c24;
}

.tracking-link {
    color: #007bff;
    text-decoration: none;
    font-weight: 600;
}

.tracking-link:hover {
    text-decoration: underline;
}

.order-items {
    padding: 0 40px 40px;
}

.order-items h5 {
    margin: 0 0 20px 0;
    font-size: 1.2rem;
    color: #333;
}

.items-list {
    display: grid;
    gap: 15px;
}

.item-card {
    display: flex;
    align-items: center;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 10px;
}

.item-image {
    width: 60px;
    height: 60px;
    margin-right: 15px;
    flex-shrink: 0;
}

.item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
}

.item-details h6 {
    margin: 0 0 5px 0;
    font-size: 1rem;
    color: #333;
}

.item-details p {
    margin: 0 0 3px 0;
    color: #666;
    font-size: 0.9rem;
}

.error-message {
    padding: 20px 0;
}

.alert {
    padding: 15px 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.alert-danger {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

@media (max-width: 768px) {
    .tracking-header h1 {
        font-size: 2rem;
    }
    
    .tracking-form {
        margin: 0 20px;
        padding: 30px 20px;
    }
    
    .order-header {
        flex-direction: column;
        text-align: center;
        gap: 10px;
    }
    
    .status-timeline {
        padding: 20px;
    }
    
    .info-grid {
        grid-template-columns: 1fr;
    }
    
    .order-info,
    .order-items {
        padding: 0 20px 20px;
    }
}
</style> 