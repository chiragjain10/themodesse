<template>
    <section class="flat-spacing-9 px-xxl_15 py-5 best_seller">
        <div class="">
            <div class="sect-top wow fadeInUp animated" style="visibility: visible; animation-name: fadeInUp;">
                <h3 class="s-title text-capitalize d-md-none ms-md-5">New Arrivals</h3>
                <h1 class="s-title text-capitalize d-none d-md-block ms-md-5">New Arrivals</h1>
                <div class="group-btn-slider type-2">
                    <div class="nav-prev-swiper tf-sw-nav"><i class="icon-arrow-left"></i></div>
                    <div class="nav-next-swiper tf-sw-nav swiper-button-disabled"><i class="icon-arrow-right"></i></div>
                </div>
            </div>
            <div dir="ltr" class="swiper tf-swiper wow fadeInUp" data-preview="4" data-tablet="3" data-mobile-sm="2"
                data-mobile="2" data-space-lg="30" data-space-md="20" data-space="15" data-pagination="2"
                data-pagination-sm="2" data-pagination-md="3" data-pagination-lg="1">
                <div :class="loadingSection ? 'swiper-wrapper d-block' : 'swiper-wrapper'">
                    <div v-if="loadingSection">
                        <div class="row">
                            <div class="col-xs-6 col-lg-3 mb-4" v-for="n in 4" :key="n">
                                <div class="category shimmer-loader">
                                    <div class="skeleton-img"></div>
                                    <div class="skeleton-text mt-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="displayedArrivals.length > 0" v-for="product in displayedArrivals" :key="product.id"
                        class="swiper-slide">
                        <div class="card_product--V01 type-space-35 border p-2 bg-white">
                            <div class="card_product-wrapper">
                                <RouterLink :to="`/product/${product.slug}`" class="product-img">
                                    <img :src="product.thumbnail_image" :data-src="product.image" :alt="product.name"
                                        class="lazyload img-product">
                                    <!-- Assuming a second image for hover effect exists in product data -->
                                    <img v-if="product.gallery_images[2]" :src="product.gallery_images[2]"
                                        :data-src="product.gallery_images[2]" :alt="product.name"
                                        class="lazyload img-hover">
                                </RouterLink>
                                <ul class="list-product-btn">
                                    <!-- <li class="wishlist">
                                        <a href="javascript:void(0);" class="hover-tooltip tooltip-left box-icon"
                                            @click.prevent="handleWishlistClick(product)">
                                            <span class="icon icon-heart-2"></span>
                                            <span class="tooltip">Add to Wishlist</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" class="hover-tooltip tooltip-left box-icon"
                                            @click.prevent="handleAddToCartClick(product)"
                                            :disabled="loadingProductId === product.id">
                                            <i v-if="loadingProductId === product.id"
                                                class="fas fa-spinner fa-spin"></i>
                                            <i v-else-if="successProductId === product.id" class="icon icon-check"></i>
                                            <i v-else class="icon icon-shop-cart"></i>
                                            <span class="tooltip">Quick Add</span>
                                        </a>
                                    </li> -->
                                    <!-- <li>
                                        <a href="#quickView" data-bs-toggle="modal"
                                            class="hover-tooltip tooltip-left box-icon quickview"
                                            @click="openQuickViewClick(product)">
                                            <span class="icon icon-view"></span>
                                            <span class="tooltip">Quick View</span>
                                        </a>
                                    </li> -->
                                </ul>
                                <div class="badge-box">
                                    <!-- Display badges based on product data (e.g., new, sale) -->
                                    <span v-if="product.is_new" class="badge-item new">NEW IN</span>
                                    <span v-if="product.discount > 0" class="badge-item sale">{{ product.discount }}{{
                                        product.type === 'percentage' ? '%' : '' }} OFF</span>
                                </div>
                                <!-- Variant box - make dynamic if product has variants -->
                                <div v-if="product.has_variants" class="variant-box">
                                    <p class="size-box text-center text-caption">
                                        {{ product.variant_count }} sizes are available
                                    </p>
                                </div>
                                <!-- Countdown for sales - make dynamic based on offer data -->
                                <div v-if="product.offer && product.offer.expire_date" class="variant-box count-down">
                                    <div class="countdown-V02">
                                        <div class="js-countdown"
                                            :data-timer="calculateCountdown(product.offer.expire_date)"
                                            data-labels="d : ,h : ,m : , s">
                                        </div>
                                    </div>
                                </div>
                                <!-- Out of stock variant box - make dynamic based on stock status -->
                                <RouterLink v-if="product.stock_status === 'out_of_stock'"
                                    :to="`/product/${product.slug}`"
                                    class="variant-box stock bg-main link text-white py-10">
                                    <p class="text-center h5 d-none d-md-block">Notify Me When Available</p>
                                    <p class="text-center h5 d-md-none">Notify Me</p>
                                </RouterLink>
                            </div>
                            <div class="card_product-info">
                                <RouterLink :to="`/product/${product.slug}`"
                                    class="name-product h5 fw-normal link text-line-clamp-2">
                                    {{ product.name }}
                                </RouterLink>
                                <div class="price-wrap">
                                    <span class="price-new h5" :class="{ 'text-secondary': product.discount > 0 }">₹{{
                                        product.price }}</span>
                                    <span v-if="product.discount > 0" class="price-old fw-normal">₹{{
                                        calculateOriginalPrice(product.price, product.discount, product.type)
                                        }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-4">No best seller products available.</div>
                </div>
                <div class="sw-dot-default tf-sw-pagination type-space-2"></div>
                <div class=" mt-3 d-flex justify-content-center">
                    <RouterLink :to="{ path: '/product-collection', query: { key: 'newArrivals', label: 'New Arrivals' } }" class="view-all-btn">View All <span>&rarr;</span></RouterLink>
                </div>
            </div>

        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, watch, nextTick, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { getData } from '@/stores/getApi';
import { useWishlistStore } from '@/stores/wishlist';
import { useProductActions } from '@/composables/useProductActions';
import Swiper from 'swiper';
import { Pagination, Navigation, Autoplay, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

Swiper.use([Pagination, Navigation, Autoplay, Mousewheel]);

const { calculateOriginalPrice } = useProductActions();
const wishlist = useWishlistStore();

const newArrivals = ref([]);
const loadingSection = ref(true);
let newArrivalsSwiperInstance = null;

const route = useRoute();

const fetchNewArrivals = async () => {
    loadingSection.value = true;
    try {
        const response = await getData('/api/home');
        newArrivals.value = response.newArrivals || [];
        nextTick(() => {
            forceVisible();
            initSwiper();
        });
    } catch (error) {
        console.error('Error loading New Arrivals:', error);
        newArrivals.value = [];
    } finally {
        loadingSection.value = false;
    }
};

const displayedArrivals = computed(() => newArrivals.value.slice(8, 15));

// Swiper Init
const initSwiper = () => {
    if (newArrivalsSwiperInstance && typeof newArrivalsSwiperInstance.destroy === 'function') {
        newArrivalsSwiperInstance.destroy(true, true);
        newArrivalsSwiperInstance = null;
    }

    // Add delay for iOS to ensure DOM is ready
    const initDelay = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 100 : 0;

    setTimeout(() => {
        if (displayedArrivals.value.length > 0 && !loadingSection.value) {
            const swiperElement = document.querySelector('.best_seller .tf-swiper');
            if (swiperElement) {
                newArrivalsSwiperInstance = new Swiper('.best_seller .tf-swiper', {
                    slidesPerView: 4,
                    spaceBetween: 12,
                    autoplay: {
                        delay: 3000,
                        disableOnInteraction: false
                    },
                    freeMode: {
                        enabled: false, // Disable for iOS
                        sticky: false,
                        momentumBounce: false,
                    },
                    pagination: {
                        el: '.best_seller .tf-sw-pagination',
                        clickable: true,
                    },
                    navigation: {
                        nextEl: '.best_seller .nav-next-swiper',
                        prevEl: '.best_seller .nav-prev-swiper',
                    },
                    mousewheel: {
                        enabled: false, // Disable for iOS
                        sensitivity: 10,
                        forceToAxis: true,
                    },
                    breakpoints: {
                        320: { slidesPerView: 2, spaceBetween: 10 },
                        480: { slidesPerView: 2, spaceBetween: 10 },
                        768: { slidesPerView: 3, spaceBetween: 15 },
                        1024: { slidesPerView: 4, spaceBetween: 15 },
                    },
                    // iOS specific options
                    touchRatio: 1,
                    touchAngle: 45,
                    grabCursor: true,
                    preventClicks: false,
                    preventClicksPropagation: false,
                });
                // Ensure elements are visible even if WOW injected hidden styles
                forceVisible();
            }
        }
    }, initDelay);
};

function forceVisible() {
    try {
        const container = document.querySelector('.best_seller');
        if (!container) return;
        const targets = [
            container.querySelector('.sect-top'),
            container.querySelector('.tf-swiper'),
            ...container.querySelectorAll('.swiper-slide')
        ].filter(Boolean);
        targets.forEach(el => {
            el.style.visibility = 'visible';
            el.style.animationName = 'none';
        });
    } catch { }
}

watch([newArrivals, loadingSection], () => {
    nextTick(() => {
        initSwiper();
    });
});

const calculateCountdown = (expireDate) => {
    const now = new Date();
    const expiry = new Date(expireDate);
    const diffInSeconds = Math.max(0, Math.floor((expiry - now) / 1000));
    return diffInSeconds;
};

onMounted(() => {
    fetchNewArrivals();
    wishlist.fetchWishlist();
});
watch(() => route.fullPath, () => {
    fetchNewArrivals();
});
onActivated(() => {
    fetchNewArrivals();
});
onUnmounted(() => {
    if (newArrivalsSwiperInstance && typeof newArrivalsSwiperInstance.destroy === 'function') {
        newArrivalsSwiperInstance.destroy(true, true);
        newArrivalsSwiperInstance = null;
    }
});
</script>

<style scoped>
.view-all-btn {
    background: #222;
    color: #fff;
    font-weight: 600;
    padding: 0.5rem 1.5rem;
    border-radius: 2px;
    text-decoration: none;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.10);
}

.view-all-btn:hover {
    background: #fff;
    color: #222;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
    border: 1px solid #222;
}

@media (max-width: 768px) {
    .view-all-btn {
        padding: 0.4rem 1.1rem;
    }
}

/* iOS specific fixes */
@supports (-webkit-touch-callout: none) {
    .card_product--V01 {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
    }

    .sect-top,
    .tf-swiper {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
    }

    .swiper-wrapper {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
    }
}
</style>