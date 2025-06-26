<template>
    <!-- Top Bar-->
    <div class="tf-topbar">
        <div class="container">
            <div class="topbar-inner">
                <swiper
                    :modules="[Autoplay]"
                    direction="vertical"
                    :loop="true"
                    :autoplay="{ delay: 3000, disableOnInteraction: false }"
                    :speed="1000"
                    :spaceBetween="10"
                    class="tf-swiper"
                >
                    <swiper-slide v-for="(msg, idx) in topbarMessages" :key="idx">
                        <p class="text-caption-3 fw-medium text-white text-line-clamp-1">
                            {{ msg }}
                        </p>
                    </swiper-slide>
                </swiper>
            </div>
        </div>
    </div>
    <!-- /Top Bar -->
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { Swiper, SwiperSlide } from 'swiper/vue';
import Swiper from 'swiper';
import { Autoplay } from 'swiper/modules';

const cart = useCartStore();
const cartCount = computed(() => cart.totalItems);

const topbarMessages = [
    'FREE STANDARD DELIVERY FOR ALL ORDERS OVER ₹15,000',
    'Timeless Elegance, Effortless Comfort – Only at Modesse',
    'Get 20% Off Your First Order – Join the Modesse Community',
    'Luxury Fabrics. Modern Silhouettes. Designed for You.'
];
</script>

<style scoped>
.tf-swiper {
    height: 40px;
}

/* Add any specific styles for the topbar here */
</style>