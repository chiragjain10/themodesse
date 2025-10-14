<template>
    <div class="checkout-page">
        <div class="container">
            <div class="row">
                <!-- Left Column - Order Summary -->
                <div class="col-lg-4">
                    <div class="order-summary">
                        <h3 class="mb-3">Order Summary</h3>
                        <div class="cart-items">
                            <div v-for="item in cartItems" :key="item.id" class="cart-item">
                                <div class="item-image">
                                    <img :src="item.product?.image" :alt="item.product?.name">
                                </div>
                                <div class="item-details">
                                    <h4>{{ item.product?.name }}</h4>
                                    <p v-if="item.variants">Size: {{ item.variants?.size }}</p>
                                    <p>Quantity: {{ item.qty }}</p>
                                    <p class="price">₹{{ (item.product?.price || 0) * item.qty }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="order-total">
                            <div class="subtotal">
                                <span>Subtotal</span>
                                <span>₹{{ subtotal }}</span>
                            </div>
                            <div class="shipping">
                                <span>Shipping</span>
                                <span>₹{{ shipping }}</span>
                            </div>
                            <div class="total">
                                <span>Total</span>
                                <span>₹{{ total }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Column - Checkout Form -->
                <div class="col-lg-8">
                    <div class="checkout-form">
                        <h3>Shipping Information</h3>
                        
                        <form @submit.prevent="handleDirectPayment">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="firstName">First Name</label>
                                        <input type="text" id="firstName" v-model="form.firstName" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="lastName">Last Name</label>
                                        <input type="text" id="lastName" v-model="form.lastName" required>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="email">Email</label>
                                <input type="email" id="email" v-model="form.email" required>
                            </div>

                            <div class="form-group">
                                <label for="phone">Phone</label>
                                <input type="tel" id="phone" v-model="form.phone" required>
                            </div>

                            <div class="form-group">
                                <label for="address">Address</label>
                                <input type="text" id="address" v-model="form.address" required>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="city">City</label>
                                        <input type="text" id="city" v-model="form.city" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="pincode">Pincode</label>
                                        <input type="text" id="pincode" v-model="form.pincode" required>
                                    </div>
                                </div>
                            </div>

                            <div class="form-group">
                                <label for="state">State</label>
                                <input type="text" id="state" v-model="form.state" required>
                            </div>

                            <p class="text-caption text-center text-we-accept mb-2">We accept</p>
                            <ul class="paymend-method-list justify-content-center">
                                <li><a href="#"><img src="/src/assets/images/payment/visa-2.svg" alt=""></a></li>
                                <li><a href="#"><img src="/src/assets/images/payment/dinner-2.svg" alt=""></a></li>
                                <li><a href="#"><img src="/src/assets/images/payment/master-3.svg" alt=""></a></li>
                                <li><a href="#"><img src="/src/assets/images/payment/stripe.svg" alt=""></a></li>
                                <li><a href="#"><img src="/src/assets/images/payment/paypal.svg" alt=""></a></li>
                                <li><a href="#"><img src="/src/assets/images/payment/gg-pay-2.svg" alt=""></a></li>
                                <li><a href="#"><img src="/src/assets/images/payment/apple-pay-2.svg" alt=""></a></li>
                            </ul>

                            <!-- Single Unified Button for Account Creation and Payment -->
                            <button type="submit"
                                class="tf-btn btn-fill-2 text-uppercase fw-medium animate-btn w-100 mt-4"
                                :disabled="isSubmitting">
                                <span v-if="isSubmitting" class="d-flex align-items-center justify-content-center">
                                    <div class="spinner-border spinner-border-sm me-2" role="status">
                                        <span class="visually-hidden">Loading...</span>
                                    </div>
                                    Processing Payment...
                                </span>
                                <span v-else>Pay ₹{{ total }}</span>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import axios from '@/api/axios';
import { orderService } from '@/services/order';
import { authService } from '@/services/auth';
import { razorpayService } from '@/services/razorpay';

const router = useRouter();
const cart = useCartStore();
const auth = useAuthStore();
const toast = useToast();

const isSubmitting = ref(false);
const shipping = ref(0);


const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    country: 'India'
});

const cartItems = computed(() => cart.items);
const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
        return total + ((item.product?.price || 0) * (item.qty || 0));
    }, 0);
});

const total = computed(() => subtotal.value + shipping.value);

// Unified function to handle account creation and Razorpay payment
const handleAccountCreationAndPayment = async () => {
    try {
        isSubmitting.value = true;
        
        // Step 1: Create account if user is not authenticated
        if (!auth.isAuthenticated) {
            console.log('Guest checkout - no account creation needed');
        }

        // Step 2: Create order in backend
        console.log('Creating order...');
        const orderData = {
                firstName: form.value.firstName,
                lastName: form.value.lastName,
                email: form.value.email,
                phone: form.value.phone,
                address: form.value.address,
                city: form.value.city,
            state: form.value.state,
            zip_code: form.value.pincode,
            country: form.value.country,
            subtotal: subtotal.value,
            shipping: shipping.value,
            total: total.value,
            discount: 0,
            coupon_id: null,
            payment_method: 'razorpay',
            items: cart.items.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        const orderResponse = await orderService.createOrder(orderData);
        console.log('Order created:', orderResponse);

        // Step 3: Initialize Razorpay with order details
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;

        script.onload = () => {
            if (window.Razorpay) {
        const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_kpxRbZQeKReXjx',
                    amount: total.value * 100, // Dynamic amount in paise
                    currency: 'INR',
                    name: 'The Modesse',
                    description: `Order #${orderResponse.order_id || 'ORDER'}`,
                    order_id: orderResponse.razorpay_order_id, // If backend creates Razorpay order
                    handler: function (response) {
                        // Handle successful payment
                        console.log('Payment successful:', response);

                        // Verify payment with backend
                        verifyPaymentWithBackend(response, orderResponse.order_id);
            },
            prefill: {
                name: `${form.value.firstName} ${form.value.lastName}`,
                email: form.value.email,
                contact: form.value.phone
            },
            theme: {
                color: '#3399cc'
            },
            modal: {
                ondismiss: function () {
                    toast.info('Payment cancelled by user');
                    isSubmitting.value = false;
                    
                    // Redirect to payment cancelled page
                    router.push('/payment-cancelled');
                }
            }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        };

        document.head.appendChild(script);
        
    } catch (error) {
        console.error('Error in account creation and payment:', error);
        toast.error(error.response?.data?.message || 'Something went wrong');
        isSubmitting.value = false;
    }
};

// Simplified function to handle direct Razorpay payment
const handleDirectPayment = async () => {
    try {
        isSubmitting.value = true;
        
        // Collect order data for tracking
        const orderData = {
            customer_name: `${form.value.firstName} ${form.value.lastName}`,
            email: form.value.email,
            phone: form.value.phone,
            address: form.value.address,
            city: form.value.city,
            state: form.value.state,
            zip_code: form.value.pincode,
            country: form.value.country,
            subtotal: subtotal.value,
            shipping: shipping.value,
            total: total.value,
            items: cart.items.map(item => ({
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }))
        };

        // Store order data in localStorage for later retrieval
        localStorage.setItem('pendingOrder', JSON.stringify(orderData));
        
        // Generate a unique order ID
        const orderId = 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('currentOrderId', orderId);

        // Initialize Razorpay directly
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;

        script.onload = () => {
            if (window.Razorpay) {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_kpxRbZQeKReXjx',
                    amount: total.value * 100, // Amount in paise
                    currency: 'INR',
                    name: 'The Modesse',
                    description: `Order #${orderId}`,
                    order_id: null, // We'll let Razorpay generate this
                    handler: function (response) {
                        // Handle successful payment
                        console.log('Payment successful:', response);
                        
                        // Store payment response
                        localStorage.setItem('paymentResponse', JSON.stringify(response));
                        
                        // Send order notification email to admin
                        sendOrderNotificationEmail(orderData, response, orderId);
                        
                        // Send order confirmation email to customer
                        sendCustomerOrderEmail(orderData, response, orderId);
                        
                        // Redirect to success page
                        router.push('/payment-success');
                    },
                    prefill: {
                        name: `${form.value.firstName} ${form.value.lastName}`,
                        email: form.value.email,
                        contact: form.value.phone
                    },
                    theme: {
                        color: '#3399cc'
                    },
                    modal: {
                        ondismiss: function () {
                            toast.info('Payment cancelled by user');
                            isSubmitting.value = false;
                            
                            // Redirect to payment cancelled page
                            router.push('/payment-cancelled');
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        };

        document.head.appendChild(script);
        
    } catch (error) {
        console.error('Error in direct payment:', error);
        toast.error('Something went wrong. Please try again.');
        isSubmitting.value = false;
    }
};

// Function to send order notification email
const sendOrderNotificationEmail = async (orderData, paymentResponse, orderId) => {
    try {
        const emailData = {
            to: 'hello@themodesse.com',
            subject: `New Order Received - ${orderId}`,
            orderData: {
                orderId: orderId,
                customerName: orderData.customer_name,
                email: orderData.email,
                phone: orderData.phone,
                address: orderData.address,
                city: orderData.city,
                state: orderData.state,
                zipCode: orderData.zip_code,
                country: orderData.country,
                subtotal: orderData.subtotal,
                shipping: orderData.shipping,
                total: orderData.total,
                items: orderData.items,
                paymentId: paymentResponse.razorpay_payment_id,
                paymentOrderId: paymentResponse.razorpay_order_id,
                paymentSignature: paymentResponse.razorpay_signature,
                paymentStatus: 'completed',
                paymentMethod: 'razorpay',
                orderDate: new Date().toISOString()
            }
        };

        // Send email to backend
        await axios.post('/api/orders/send-notification', emailData);
        console.log('Order notification email sent successfully');
        
    } catch (error) {
        console.error('Error sending order notification email:', error);
        // Don't show error to user as this is background process
    }
};

// Function to send customer order confirmation email
const sendCustomerOrderEmail = async (orderData, paymentResponse, orderId) => {
    try {
        const emailData = {
            to: orderData.email,
            subject: `Order Confirmation - ${orderId}`,
            orderData: {
                orderId: orderId,
                customerName: orderData.customer_name,
                email: orderData.email,
                phone: orderData.phone,
                address: orderData.address,
                city: orderData.city,
                state: orderData.state,
                zipCode: orderData.zip_code,
                country: orderData.country,
                subtotal: orderData.subtotal,
                shipping: orderData.shipping,
                total: orderData.total,
                items: orderData.items,
                paymentId: paymentResponse.razorpay_payment_id,
                paymentOrderId: paymentResponse.razorpay_order_id,
                paymentSignature: paymentResponse.razorpay_signature,
                paymentStatus: 'completed',
                paymentMethod: 'razorpay',
                orderDate: new Date().toISOString(),
                trackingUrl: `${window.location.origin}/track-order`
            }
        };

        // Send email to customer
        await axios.post('/api/orders/send-customer-email', emailData);
        console.log('Customer order confirmation email sent successfully');
        
    } catch (error) {
        console.error('Error sending customer order email:', error);
        // Don't show error to user as this is background process
    }
};

// Verify payment with backend
const verifyPaymentWithBackend = async (paymentResponse, orderId) => {
    try {
        const verificationData = {
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            order_id: orderId
        };

        const verificationResponse = await razorpayService.verifyPayment(verificationData);
        console.log('Payment verified:', verificationResponse);

        if (verificationResponse.success) {
            toast.success('Payment successful! Order placed successfully.');
            cart.clearCart();
            router.push('/order-confirmation');
        } else {
            toast.error('Payment verification failed');
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        toast.error('Payment verification failed');
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(async () => {
    if (cartItems.value.length === 0) {
        toast.error('Your cart is empty');
        router.push('/cart');
        return;
    }
    // Set default shipping
    shipping.value = 0;
    if (auth.user) {
        form.value.email = auth.user.email || '';
        form.value.firstName = auth.user.firstName || '';
        form.value.lastName = auth.user.lastName || '';
    }
});

const handleSubmit = async () => {
    try {
        isSubmitting.value = true;

        // Validate form data
        if (!form.value.firstName || !form.value.lastName || !form.value.email ||
            !form.value.phone || !form.value.address || !form.value.city ||
            !form.value.pincode || !form.value.state) {
            toast.error('Please fill in all required fields');
            return;
        }

        // Validate payment method
        if (!selectedPaymentMethod.value) {
            toast.error('Please select a payment method');
            return;
        }

        // Handle user registration for guest users
        if (!auth.isAuthenticated) {
            // No password validation needed for guest checkout
            console.log('Processing guest checkout');
        }

        // Prepare order data for database
        const orderData = {
            // User details
                phone: form.value.phone,
            city: form.value.city,
            state: form.value.state,
            zip_code: form.value.pincode,
                address: form.value.address,
            address_2: '', // Optional field

            // Order details
            discount: 0, // No discount for now
            subtotal: subtotal.value,
            total: total.value,
            shipping_method_id: selectedShippingMethod.value,
            coupon_id: null, // No coupon for now
            payment_method: selectedPaymentMethod.value
        };

        // Create order in database
        const response = await orderService.createOrder(orderData);

        if (response.success) {
            // Clear cart after successful order
            await cart.clearCart();

            toast.success('Order placed successfully!');

            // Redirect to order confirmation page
            router.push(`/order-confirmation/${response.order_id}`);
        } else {
            throw new Error(response.message || 'Failed to place order');
        }
    } catch (error) {
        console.error('Order submission error:', error);
        toast.error(error.response?.data?.message || 'Failed to process your request. Please try again.');
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<style scoped>
.checkout-page {
    padding: 40px 0;
}

.order-summary {
  background: #fafbfc;
  border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 28px 24px 24px 24px;
  max-width: 340px;
  margin: 0 auto;
}

.order-summary h3 {
  font-weight: 700;
  font-size: 1.2rem;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}

.cart-items {
  margin-bottom: 18px;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eee;
}

.cart-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.item-image img {
  width: 64px;
  height: 64px;
  object-fit: cover;
  object-position: top;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #eee;
}

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.item-details h4 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 2px 0;
}

.item-details p {
  margin: 0;
  color: #888;
  font-size: 0.97em;
}

.item-details .price {
  color: #222;
  font-weight: 700;
  margin-top: 2px;
}

.order-total {
  margin-top: 18px;
  border-top: 1px solid #e5e5e5;
  padding-top: 16px;
}

.order-total>div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.order-total .total {
  font-weight: 700;
  color: #222;
  font-size: 1.08em;
  margin-top: 8px;
}

.checkout-form {
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.form-group input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ced4da;
    border-radius: 4px;
}

.payment-methods {
    margin-top: 20px;
}

.payment-method {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fafafa;
    transition: all 0.3s ease;
}

.payment-method:hover {
    border-color: #007bff;
    background: #f8f9ff;
}

.payment-method input[type="radio"] {
    margin-right: 10px;
}

.payment-method label {
    display: flex;
    flex-direction: column;
    cursor: pointer;
    margin: 0;
}

.method-name {
    font-weight: 600;
    color: #333;
    margin-bottom: 2px;
}

.method-description {
    font-size: 0.9rem;
    color: #666;
}

.btn-primary {
    width: 100%;
    padding: 12px;
    font-size: 16px;
    font-weight: 500;
}

@media (max-width: 991px) {
    .order-summary {
        margin-bottom: 30px;
    }
}

/* Loading spinner styles */
.spinner-border-sm {
    width: 1rem;
    height: 1rem;
    border-width: 0.125em;
}

.d-flex {
    display: flex !important;
}

.align-items-center {
    align-items: center !important;
}

.justify-content-center {
    justify-content: center !important;
}

.me-2 {
    margin-right: 0.5rem !important;
}

.visually-hidden {
    position: absolute !important;
    width: 1px !important;
    height: 1px !important;
    padding: 0 !important;
    margin: -1px !important;
    overflow: hidden !important;
    clip: rect(0, 0, 0, 0) !important;
    white-space: nowrap !important;
    border: 0 !important;
}
</style>