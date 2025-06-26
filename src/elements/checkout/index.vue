<template>
    <div class="checkout-page">
        <div class="container">
            <div class="row">
                <!-- Left Column - Order Summary -->
                <div class="col-lg-4">
                    <div class="order-summary">
                        <h3>Order Summary</h3>
                        <div class="cart-items">
                            <div v-for="item in cartItems" :key="item.id" class="cart-item">
                                <div class="item-image">
                                    <img :src="item.product?.image" :alt="item.product?.name">
                                </div>
                                <div class="item-details">
                                    <h4>{{ item.product?.name }}</h4>
                                    <p v-if="item.variants">Size: {{ item.variants?.size }}</p>
                                    <p>Quantity: {{ item.qty }}</p>
                                    <p class="price">₹{{ (item.product?.sale_price || 0) * item.qty }}</p>
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
                        <h3>{{ auth.isAuthenticated ? 'Shipping Information' : 'Create Account & Continue' }}</h3>
                        
                        <!-- Login Button for Guest Users -->
                        <div v-if="!auth.isAuthenticated" class="mb-4">
                            <p>Already have an account?</p>
                            <button @click="handleLogin" class="btn btn-outline-primary">Login</button>
                        </div>

                        <form @submit.prevent="handleSubmit">
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

                            <!-- Password fields for new users -->
                            <div v-if="!auth.isAuthenticated" class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="password">Password</label>
                                        <input type="password" id="password" v-model="form.password" required>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="confirmPassword">Confirm Password</label>
                                        <input type="password" id="confirmPassword" v-model="form.confirmPassword" required>
                                    </div>
                                </div>
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

                            <div class="form-group">
                                <label>Shipping Method</label>
                                <div v-if="shippingMethods.length">
                                    <div v-for="method in shippingMethods" :key="method.id" class="form-check">
                                        <input class="form-check-input" type="radio" :id="'shipping-' + method.id" :value="method.id" v-model="selectedShippingMethod">
                                        <label class="form-check-label" :for="'shipping-' + method.id">
                                            {{ method.name }} - ₹{{ method.charge }} ({{ method.estimated_days }})
                                        </label>
                                    </div>
                                </div>
                                <div v-else>
                                    <span class="text-muted">No shipping methods available.</span>
                                </div>
                            </div>

                            <h3 class="mt-4">Payment Method</h3>
                            <div class="payment-methods">
                                <div v-if="paymentMethods.length">
                                    <div class="payment-method" v-for="method in paymentMethods" :key="method.type">
                                        <input type="radio" :id="'payment-' + method.type" name="payment" :value="method.type" v-model="selectedPaymentMethod">
                                        <label :for="'payment-' + method.type">{{ method.name }} - {{ method.description }}</label>
                                    </div>
                                </div>
                                <div v-else>
                                    <span class="text-muted">No payment methods available.</span>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary mt-4" :disabled="isSubmitting">
                                {{ isSubmitting ? 'Processing...' : (auth.isAuthenticated ? 'Place Order' : 'Create Account & Continue') }}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/composables/useToast';
import { orderService } from '@/services/order';
import { authService } from '@/services/auth';
import { checkoutService } from '@/services/checkout';

const router = useRouter();
const cart = useCartStore();
const auth = useAuthStore();
const toast = useToast();

const isSubmitting = ref(false);
const shipping = ref(0);
const shippingMethods = ref([]);
const selectedShippingMethod = ref(null);
const paymentMethods = ref([]);
const selectedPaymentMethod = ref('');

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    pincode: '',
    state: '',
    paymentMethod: 'cod'
});

const cartItems = computed(() => cart.items);
const subtotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
        return total + ((item.product?.sale_price || 0) * (item.qty || 0));
    }, 0);
});

const total = computed(() => subtotal.value + shipping.value);

onMounted(async () => {
    if (cartItems.value.length === 0) {
        toast.error('Your cart is empty');
        router.push('/cart');
        return;
    }
    if (auth.user) {
        form.value.email = auth.user.email || '';
        form.value.firstName = auth.user.firstName || '';
        form.value.lastName = auth.user.lastName || '';
    }
    if (auth.isAuthenticated && auth.user && auth.user.id) {
        try {
            const data = await checkoutService.getCheckoutData(auth.user.id);
            shippingMethods.value = data.shippingMethods || [];
            paymentMethods.value = data.paymentMethods || [];
            if (shippingMethods.value.length > 0) {
                selectedShippingMethod.value = shippingMethods.value[0].id;
                shipping.value = shippingMethods.value[0].charge;
            }
            if (paymentMethods.value.length > 0) {
                selectedPaymentMethod.value = paymentMethods.value[0].type;
                form.value.paymentMethod = paymentMethods.value[0].type;
            }
        } catch (e) {
            shippingMethods.value = [];
            paymentMethods.value = [];
        }
    }
});

watch(selectedShippingMethod, (newId) => {
    const method = shippingMethods.value.find(m => m.id === newId);
    shipping.value = method ? method.charge : 0;
});

watch(selectedPaymentMethod, (newType) => {
    form.value.paymentMethod = newType;
});

const handleLogin = () => {
    localStorage.setItem('returnTo', router.currentRoute.value.fullPath);
    router.push('/login');
};

const handleSubmit = async () => {
    try {
        isSubmitting.value = true;

        if (!auth.isAuthenticated) {
            if (form.value.password !== form.value.confirmPassword) {
                toast.error('Passwords do not match');
                return;
            }

            try {
                const registerData = {
                    firstName: form.value.firstName,
                    lastName: form.value.lastName,
                    email: form.value.email,
                    phone: form.value.phone,
                    password: form.value.password
                };

                const response = await authService.register(registerData);
                
                if (response.status === 'success') {
                    await auth.login({
                        email: form.value.email,
                        password: form.value.password
                    });
                    toast.success('Account created successfully!');
                }
            } catch (error) {
                if (error.response?.data?.message?.includes('already exists')) {
                    toast.error('Email or phone already exists. Please login.');
                    return;
                }
                throw error;
            }
        }

        const orderData = {
            items: cartItems.value,
            shipping: {
                firstName: form.value.firstName,
                lastName: form.value.lastName,
                email: form.value.email,
                phone: form.value.phone,
                address: form.value.address,
                city: form.value.city,
                pincode: form.value.pincode,
                state: form.value.state
            },
            paymentMethod: form.value.paymentMethod,
            subtotal: subtotal.value,
            shipping: shipping.value,
            total: total.value
        };

        const response = await orderService.createOrder(orderData);

        if (response.status === 'success') {
            await cart.clearCart();

            toast.success('Order placed successfully!');
            router.push(`/order-confirmation/${response.orderId}`);
        } else {
            throw new Error(response.message || 'Failed to place order');
        }
    } catch (error) {
        console.error('Error:', error);
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
    background: #f8f9fa;
    padding: 20px;
    border-radius: 8px;
}

.cart-item {
    display: flex;
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #dee2e6;
}

.item-image {
    width: 80px;
    margin-right: 15px;
}

.item-image img {
    width: 100%;
    height: auto;
    object-fit: cover;
}

.item-details {
    flex: 1;
}

.item-details h4 {
    margin: 0 0 5px;
    font-size: 16px;
}

.item-details p {
    margin: 0;
    font-size: 14px;
    color: #6c757d;
}

.price {
    font-weight: bold;
    color: #000 !important;
}

.order-total {
    margin-top: 20px;
}

.order-total > div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.total {
    font-weight: bold;
    font-size: 18px;
    border-top: 1px solid #dee2e6;
    padding-top: 10px;
    margin-top: 10px;
}

.checkout-form {
    background: #fff;
    padding: 30px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0,0,0,0.1);
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
    margin-bottom: 10px;
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
</style>