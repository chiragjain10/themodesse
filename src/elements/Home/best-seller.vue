<template>
    <!-- Best Seller -->
    <section class="flat-spacing-9 px-xxl_15 py-5 best_seller">
        <div class="">
            <div class="sect-top wow fadeInUp animated" style="visibility: visible; animation-name: fadeInUp;">
                <h3 class="s-title text-capitalize d-md-none ms-md-5">Best Sellers</h3>
                <h1 class="s-title text-capitalize d-none d-md-block ms-md-5">Best Sellers</h1>
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
                    <div v-else-if="displayedBestSellers.length > 0" v-for="product in displayedBestSellers"
                        :key="product.id" class="swiper-slide">
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
                                    <li>
                                        <a href="#quickView" data-bs-toggle="modal"
                                            class="hover-tooltip tooltip-left box-icon quickview"
                                            @click="openQuickViewClick(product)">
                                            <span class="icon icon-view"></span>
                                            <span class="tooltip">Quick View</span>
                                        </a>
                                    </li>
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
                    <RouterLink to="/shop" class="view-all-btn">View All <span>&rarr;</span></RouterLink>
                </div>
            </div>

        </div>
    </section>
    <!-- /Best Seller -->
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, watch, nextTick, computed } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { getData } from '@/stores/getApi';
import { useCartStore } from '@/stores/cart';
import { useWishlistStore } from '@/stores/wishlist';
import { useProductActions } from '@/composables/useProductActions';
import { useToast } from 'vue-toast-notification';

import Swiper from 'swiper';
import { Pagination, Navigation, Autoplay, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

Swiper.use([Pagination, Navigation, Autoplay, Mousewheel]);

const { openQuickView, calculateOriginalPrice } = useProductActions();

const cart = useCartStore();
const wishlist = useWishlistStore();
const toast = useToast();

const bestSellerProducts = ref([]);
const loadingSection = ref(true);
const loadingProductId = ref(null);
const successProductId = ref(null);
let bestSellerSwiperInstance = null;

// Add a computed property to limit to first 7 products
const displayedBestSellers = computed(() => bestSellerProducts.value.slice(0, 7));

const route = useRoute();

// Example: Data fetch function (replace with your actual fetch logic)
const fetchBestSellers = async () => {
    loadingSection.value = true;
    try {
        const response = await getData('/api/home');
        bestSellerProducts.value = response.topSales || [];
        nextTick(() => {
            initSwiper();
        });
    } catch (error) {
        console.error('Error loading best sellers:', error);
        bestSellerProducts.value = [];
    } finally {
        loadingSection.value = false;
    }
};

// Swiper Init
const initSwiper = () => {
    if (bestSellerSwiperInstance && typeof bestSellerSwiperInstance.destroy === 'function') {
        bestSellerSwiperInstance.destroy(true, true);
        bestSellerSwiperInstance = null;
    }
    
    // Add delay for iOS to ensure DOM is ready
    const initDelay = /iPad|iPhone|iPod/.test(navigator.userAgent) ? 100 : 0;
    
    setTimeout(() => {
        if (bestSellerProducts.value.length > 0 && !loadingSection.value) {
            const swiperElement = document.querySelector('.best_seller .tf-swiper');
            if (swiperElement) {
                bestSellerSwiperInstance = new Swiper('.best_seller .tf-swiper', {
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
                        sensitivity: .5,
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
            }
        }
    }, initDelay);
};

watch([bestSellerProducts, loadingSection], () => {
    nextTick(() => {
        initSwiper();
    });
});

watch(() => route.fullPath, () => {
    fetchBestSellers();
});

const calculateCountdown = (expireDate) => {
    const now = new Date();
    const expiry = new Date(expireDate);
    const diffInSeconds = Math.max(0, Math.floor((expiry - now) / 1000));
    return diffInSeconds;
};

const handleAddToCartClick = async (product) => {
    if (!product) return;

    loadingProductId.value = product.id; // Set loading for this product
    successProductId.value = null; // Reset success state

    try {
        const cartData = {
            productId: product.id,
            quantity: 1,
            cartToken: localStorage.getItem('cartToken') || generateCartToken()
        };

        const response = await cart.addToCart(cartData);

        if (response.status === 'success') {
            // Store cart token if it's a new one
            if (response.cartToken) {
                localStorage.setItem('cartToken', response.cartToken);
            }

            // Update cart count
            await cart.getCartCount();

            // Show success message
            toast.success('Product added to cart successfully');

            successProductId.value = product.id; // Set success for this product
            setTimeout(() => {
                successProductId.value = null; // Reset success after a delay
            }, 2000); // 2 second delay for checkmark

        } else {
            toast.error(response.message || 'Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add product to cart');
    } finally {
        loadingProductId.value = null; // Set loading to false
    }
};

// Helper function to generate a cart token
const generateCartToken = () => {
    return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const handleWishlistClick = async (product) => {
    try {
        if (wishlist.isWishlisted(product.id)) {
            await wishlist.removeFromWishlist(product.id);
        } else {
            await wishlist.addToWishlist(product.id);
        }
    } catch (error) {
        console.error('Error updating wishlist:', error);
    }
};

const openQuickViewClick = (product) => {
    openQuickView(product);
};

onMounted(() => {
    fetchBestSellers();
    wishlist.fetchWishlist();
});
onActivated(() => {
    fetchBestSellers();
});
onUnmounted(() => {
    if (bestSellerSwiperInstance && typeof bestSellerSwiperInstance.destroy === 'function') {
        bestSellerSwiperInstance.destroy(true, true);
        bestSellerSwiperInstance = null;
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