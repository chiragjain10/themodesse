<template>
    <!-- Banner Fresh -->
    <section class="Banner_fresh">
        <div class="container-full-3 pe-0">
            <div class="sect-top">
                <h2 class="s-title font-2 text-capitalize wow fadeInUp">
                    <span class="fst-italic">Timeless Pieces,</span> Just Arrived
                </h2>
            </div>
            <div v-if="loading" class="row">
                <div class="col-12">
                    <div class="shimmer-loader">
                        <div class="skeleton-img"></div>
                        <div class="skeleton-text mt-2"></div>
                    </div>
                </div>
            </div>
            <div v-else-if="error" class="row">
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
                        {{ error }}
                    </div>
                </div>
            </div>
            <div v-else-if="newArrivals.length === 0" class="row">
                <div class="col-12">
                    <div class="alert alert-info" role="alert">
                        No new arrivals available at the moment.
                    </div>
                </div>
            </div>
            <div v-else dir="ltr" class="swiper tf-swiper wow fadeInUp" data-preview="3.68" data-tablet="2.7"
                data-mobile-sm="1.7" data-mobile="1.5" data-space-lg="10" data-space-md="10" data-space="10"
                data-pagination="1" data-pagination-sm="1" data-pagination-md="2" data-pagination-lg="3">
                <div class="swiper-wrapper">
                    <div v-for="product in visibleArrivals" :key="product.id" class="swiper-slide">
                        <div class="card_product--V01 type-space-30">
                            <div class="card_product-wrapper aspect-ratio-1">
                                <RouterLink :to="`/products/${product.slug}`" class="product-img">
                                    <img :src="product.image" :data-src="product.image"
                                        :alt="product.name" class="lazyload img-product">
                                    <img :src="product.hover_image || product.image" :data-src="product.hover_image || product.image"
                                        :alt="product.name" class="lazyload img-hover">
                                </RouterLink>
                                <ul class="list-product-btn">
                                    <li class="wishlist">
                                        <a href="javascript:void(0);" @click="addToWishlist(product.id)" 
                                            class="hover-tooltip tooltip-left box-icon">
                                            <span class="icon icon-heart-2"></span>
                                            <span class="tooltip">Add to Wishlist</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" @click="addToCart(product.id)"
                                            class="hover-tooltip tooltip-left box-icon">
                                            <span class="icon icon-shop-cart"></span>
                                            <span class="tooltip">Add to Cart</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" @click="openQuickView(product.id)"
                                            class="hover-tooltip tooltip-left box-icon quickview">
                                            <span class="icon icon-view"></span>
                                            <span class="tooltip">Quick View</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div class="card_product-info">
                                <RouterLink :to="`/products/${product.slug}`" class="name-product h5 fw-normal link text-line-clamp-2">
                                    {{ product.name }}
                                </RouterLink>
                                <div class="price-wrap">
                                    <span v-if="product.sale_price" class="price-new h5 text-secondary">
                                        ₹{{ product.sale_price }}
                                    </span>
                                    <span v-else class="price-new h5">₹{{ product.price }}</span>
                                    <span v-if="product.sale_price" class="price-old fw-normal">₹{{ product.price }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sw-dot-default tf-sw-pagination d-xl-none"></div>
            </div>
        </div>
    </section>
    <!-- /Banner Fresh -->
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';
import { useQuickViewStore } from '@/stores/quickView';
import Swiper from 'swiper';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Initialize stores
const cart = useCartStore();
const wishlist = useWishlistStore();
const quickViewStore = useQuickViewStore();
const router = useRouter();

// Props
const props = defineProps({
    newArrivals: {
        type: Array,
        required: true
    }
});

// Component state
const loading = ref(false);
const error = ref(null);
let bannerSwiper = null;
const swiperInitialized = ref(false);

const visibleArrivals = computed(() => props.newArrivals.slice(0, 12));

// Initialize Swiper
const initSwiper = () => {
    if (bannerSwiper) {
        bannerSwiper.destroy(true, true);
        bannerSwiper = null;
    }
    if (visibleArrivals.value.length > 0) {
        bannerSwiper = new Swiper('.Banner_fresh .tf-swiper', {
            modules: [Pagination, Autoplay],
            slidesPerView: 3.68,
            spaceBetween: 10,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.tf-sw-pagination',
                clickable: true,
            },
            breakpoints: {
                320: {
                    slidesPerView: 1.5,
                    spaceBetween: 10,
                },
                480: {
                    slidesPerView: 1.7,
                    spaceBetween: 10,
                },
                768: {
                    slidesPerView: 2.7,
                    spaceBetween: 10,
                },
                1024: {
                    slidesPerView: 3.68,
                    spaceBetween: 10,
                },
            },
        });
        swiperInitialized.value = true;
    }
};

// Event handlers
const addToCart = async (productId) => {
    try {
        await cart.addToCart(productId);
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
};

const addToWishlist = async (productId) => {
    try {
        await wishlist.addToWishlist(productId);
    } catch (error) {
        console.error('Error adding to wishlist:', error);
    }
};

const openQuickView = (productId) => {
    quickViewStore.openQuickView(productId);
};

// Watch for changes in newArrivals
watch(() => props.newArrivals, (newVal, oldVal) => {
    if (newVal !== oldVal) {
        setTimeout(() => {
            initSwiper();
        }, 100);
    }
}, { immediate: true });

// Lifecycle hooks
onUnmounted(() => {
    if (bannerSwiper) {
        bannerSwiper.destroy(true, true);
        bannerSwiper = null;
    }
    swiperInitialized.value = false;
});
</script>

<style scoped>
.shimmer-loader {
    background: #f6f7f8;
    background-image: linear-gradient(
        to right,
        #f6f7f8 0%,
        #edeef1 20%,
        #f6f7f8 40%,
        #f6f7f8 100%
    );
    background-repeat: no-repeat;
    background-size: 800px 104px;
    animation: shimmer 1.5s linear infinite;
    height: 300px;
    border-radius: 8px;
}

.skeleton-img {
    height: 200px;
    background: #eee;
    border-radius: 8px;
}

.skeleton-text {
    height: 20px;
    background: #eee;
    border-radius: 4px;
    margin-top: 10px;
}

@keyframes shimmer {
    0% {
        background-position: -468px 0;
    }
    100% {
        background-position: 468px 0;
    }
}
</style>