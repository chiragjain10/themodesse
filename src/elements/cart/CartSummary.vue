<template>
    <div class="right">
        <div class="checkout-sidebar">
            <form class="form-checkout-sidebar" @submit.prevent="handleApplyCoupon">
                <div class="form-content">
                    <h4 class="title-total">
                        TOTAL:
                        <span class="each-total-price">₹{{ totalAfterDiscount.toFixed(2) }}</span>
                    </h4>
                    <div v-if="cart.couponData">
                        <div class="alert alert-success py-2">
                            Coupon <b>{{ cart.couponCode }}</b> applied!
                            <span v-if="cart.couponData.discount_type === 'percentage'">
                                ({{ cart.couponData.discount_value }}% off)
                            </span>
                            <span v-else>
                                (₹{{ cart.couponData.discount_value }} off)
                            </span>
                            <button type="button" class="btn btn-link btn-sm p-0 ms-2"
                                @click="removeCoupon">Remove</button>
                        </div>
                    </div>
                    <!-- <div v-else class="mb-2">
                        <div class="input-group">
                            <input v-model="couponInput" type="text" class="form-control" placeholder="Coupon code">
                            <button class="tf-btn btn-fill-2 text-uppercase fw-medium animate-btn" type="submit" :disabled="couponLoading">
                                <span v-if="couponLoading" class="spinner-border spinner-border-sm me-1"></span>
                                Apply
                            </button>
                        </div>
                        <div v-if="cart.couponError" class="text-danger small mt-1">{{ cart.couponError }}</div>
                    </div> -->
                    <p class="tax-text">
                        Taxes and shipping calculated at checkout
                    </p>
                    <span class="br-line"></span>
                    <div class="checkbox-wrap">
                        <input id="agree-term" type="checkbox" class="tf-check style-4" v-model="termsAccepted"
                            required>
                        <label for="agree-term">I agree Terms and conditions</label>
                    </div>
                </div>
                <div v-if="checkoutError" class="alert alert-danger mt-2">{{ checkoutError }}</div>
                <button type="button" id="checkout-btn" class="tf-btn btn-fill-2 text-uppercase fw-medium animate-btn w-100"
                    :disabled="cartItems.length === 0" @click="handleCheckout">
                    CHECKOUT
                </button>
            </form>
            <!-- <p class="text-caption text-center text-we-accept">We accept</p> -->
            <!-- <ul class="payment-methods-pills-row">
                <li v-for="method in paymentMethods" :key="method.id" class="payment-method-pill-small">
                    <span v-if="method.name === 'cod'" class="pm-icon"><i class="fa fa-money-bill-wave"></i></span>
                    <span v-else-if="method.name === 'razorpay'" class="pm-icon"><img src="/src/assets/images/payment/razorpay.svg" alt="Razorpay" height="18" /></span>
                    <span v-else-if="method.name === 'stripe'" class="pm-icon"><img src="/src/assets/images/payment/stripe.svg" alt="Stripe" height="18" /></span>
                    <span v-else class="pm-icon"><i class="fa fa-credit-card"></i></span>
                    <span class="pm-name">{{ method.name.replace(/^(.)/, (c) => c.toUpperCase()) }}</span>
                </li>
            </ul> -->
            <!-- <div class="accepted-networks-row mt-2">
                <img :src="visa" alt="Visa" class="network-icon" />
                <img :src="mastercared" alt="Mastercard" class="network-icon" />
                <img :src="amex" alt="Amex" class="network-icon" />
                <img :src="paypal" alt="PayPal" class="network-icon" />
                <img :src="upi" alt="UPI" class="network-icon" />
            </div> -->
        </div>
        <!-- Testimonial slider can remain static or be made dynamic if needed -->
        <!-- <div class="tes-slider tf-btn-swiper-item">
            <div dir="ltr" class="swiper tf-swiper" data-space-lg="30" data-space-md="20" data-space="15">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="testimonial in testimonials" :key="testimonial.id">
                        <div class="box_testimonial--V04">
                            <div class="tes-top">
                                <i class="icon icon-quote-3 text-primary"></i>
                                <ul class="rate-wrap">
                                    <li v-for="star in 5" :key="star">
                                        <i class="icon-star"
                                            :class="{ 'text-star': star <= (testimonial.rating || 0) }"></i>
                                    </li>
                                </ul>
                            </div>
                            <p class="tes-text">
                                {{ testimonial.text }}
                            </p>
                            <div class="tes-author">
                                <div class="author-avt">
                                    <img :src="testimonial.avatar" alt="" />
                                </div>
                                <span class="author-name fw-medium">{{ testimonial.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="group-btn-slider">
                    <i class="tf-sw-nav icon-arrow-left nav-prev-swiper"></i>
                    <i class="tf-sw-nav icon-arrow-right nav-next-swiper"></i>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useRouter } from 'vue-router';
import { getData } from '@/stores/getApi';

// import visa from '@/assets/images/visa.png';
// import amex from '@/assets/images/amex.jpg';
// import mastercared from '@/assets/images/mastercard.png';
// import paypal from '@/assets/images/paypal.png';
// import upi from '@/assets/images/upi.png';
import logoimage from '@/assets/images/themodesse.jpg'

const props = defineProps({
    paymentMethods: {
        type: Array,
        required: true
    }
});

const cart = useCartStore();
const cartItems = computed(() => cart.items);
const totalAfterDiscount = computed(() => cart.totalAfterDiscount);
const couponInput = ref(cart.couponCode || '');
const couponLoading = ref(false);
const termsAccepted = ref(false);
const testimonials = ref([]);
const checkoutError = ref('');
const router = useRouter();

const handleApplyCoupon = async () => {
    if (!couponInput.value) return;
    couponLoading.value = true;
    try {
        await cart.applyCoupon(couponInput.value);
    } catch (e) { }
    couponLoading.value = false;
};

const removeCoupon = () => {
    cart.removeCoupon();
    couponInput.value = '';
};

const handleCheckout = () => {
    if (!termsAccepted.value) {
        checkoutError.value = 'Please accept the Terms & Conditions to proceed.';
        return;
    }
    checkoutError.value = '';
    router.push('/checkout');
};

onMounted(async () => {
    try {
        const { data } = await getData('/api/home');
        const reviews = [];
        if (data.topRatings) {
            data.topRatings.forEach(product => {
                if (product.reviews && Array.isArray(product.reviews)) {
                    product.reviews.forEach(review => {
                        reviews.push({
                            id: review.id,
                            name: review.user?.name || 'Anonymous',
                            avatar: review.user?.avatar || logoimage,
                            rating: review.rating,
                            text: review.comment
                        });
                    });
                }
            });
        }
        testimonials.value = reviews;
    } catch (e) {
        testimonials.value = [];
    }
});
</script>

<style scoped>
/* Add any specific styles for the cart summary here */
.payment-methods-pills-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin: 0 0 8px 0;
    padding: 0;
    list-style: none;
}

.payment-method-pill-small {
    background: #f8f9fa;
    border-radius: 18px;
    padding: 6px 14px;
    min-width: 80px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
    display: flex;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    border: 1px solid #e0e0e0;
    transition: box-shadow 0.2s, background 0.2s;
}

.payment-method-pill-small:hover {
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    border-color: #bdbdbd;
}

.pm-icon {
    margin-right: 6px;
    display: flex;
    align-items: center;
}

.pm-name {
    font-weight: 500;
    font-size: 14px;
    color: #222;
}

.accepted-networks-row {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    margin-top: 2px;
}

.network-icon {
    height: 28px;
    width: auto;
    background: #fff;
    border-radius: 6px;
    border: 1px solid #e0e0e0;
    padding: 2px 6px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}
</style>