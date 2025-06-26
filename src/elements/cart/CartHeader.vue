<template>
    <!-- Page Title -->
    <section class="flat-spacing-2 pb-0">
        <div class="container">
            <div class="page-title">
                <div class="breadcrumbs">
                    <ul class="bread-wrap">
                        <li><RouterLink to="/" class="text-main-4 link">Home</RouterLink></li>
                        <li class="br-line w-12 bg-main"></li>
                        <li>Cart</li>
                    </ul>
                    <h1 class="heading fw-normal">
                        shopping cart
                    </h1>
                </div>
                <div class="box-delivery">
                    <h6 class="text fw-normal text-uppercase">Spend <span class="fw-medium">₹100</span> more to get
                        <span class="fw-medium">Free
                            Shipping</span>
                    </h6>
                    <div class="progress-cart tf-progress-ship">
                        <div class="value" :style="`width: ${shippingProgress}%;`" data-progress="66">
                            <i class="icon icon-delivery"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- /Page Title -->
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { RouterLink } from 'vue-router';

const cart = useCartStore();
const cartTotal = computed(() => cart.total);

// Calculate shipping progress (e.g., for a free shipping threshold of $200)
const freeShippingThreshold = 200;
const shippingProgress = computed(() => {
    const progress = (cartTotal.value / freeShippingThreshold) * 100;
    return Math.min(progress, 100); // Cap at 100%
});
</script>

<style scoped>
</style> 