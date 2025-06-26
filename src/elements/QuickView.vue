<template>
    <!-- Quick View -->
    <div class="modal modalCentered fade modal-quick-view" id="quickView">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <span class="icon-close icon-close-popup" data-bs-dismiss="modal"></span>
                <!-- Show loader when product is loading -->
                <div v-if="loading">
                    <div class="col-xs-6 col-lg-3 mb-4" v-for="n in 4" :key="n">
                        <div class="category shimmer-loader">
                            <div class="skeleton-img"></div>
                            <div class="skeleton-text mt-2"></div>
                        </div>
                    </div>
                </div>
                <template v-else>
                    <div class="tf-product-media-wrap tf-btn-swiper-item">
                        <div dir="ltr" class="swiper tf-single-slide">
                            <div class="swiper-wrapper">
                                <div v-for="(image, index) in productImages" :key="index" class="swiper-slide" :data-color="image.color">
                                    <div class="item">
                                        <img class="lazyload" :data-src="image.url" :src="image.url" :alt="product?.name">
                                    </div>
                                </div>
                            </div>
                            <div class="nav-swiper-group style-3">
                                <div class="nav-thumbs thumbs-prev single-slide-prev">
                                    <span class="fw-normal">PRE</span>
                                </div>
                                <span class="text-main">/</span>
                                <div class="nav-thumbs thumbs-next single-slide-next">
                                    <span class="fw-normal">NEXT</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="tf-product-info-wrap">
                        <div class="tf-product-info-inner tf-product-info-list">
                            <div class="tf-product-info-heading">
                                <RouterLink :to="`/product/${product?.slug}`" class="product-info-name h4 fw-normal text-uppercase link">
                                    {{ product?.name }}
                                </RouterLink>
                                <div class="product-info-price">
                                    <div class="price-wrap">
                                        <span class="price-new price-on-sale h4">${{ parseFloat(product?.sale_price || 0).toFixed(2) }}</span>
                                        <span v-if="product?.discount > 0" class="price-old compare-at-price fw-normal h6">${{ calculateOriginalPrice(product?.sale_price, product?.discount, product?.type) }}</span>
                                        <p v-if="product?.discount > 0" class="badges-on-sale">
                                            <i class="icon-tag"></i>
                                            <span class="number-sale">
                                                {{ product?.discount }}{{ product?.type === 'percentage' ? '%' : '' }} OFF
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <p class="product-infor-sub text-main-4">
                                    {{ product?.description }}
                                </p>
                            </div>
                            <div class="tf-product-info-variant">
                                <!-- Material/Variant Selection -->
                                <div v-if="product?.variants?.materials" class="variant-picker-item variant-color">
                                    <div class="variant-picker-label h6 fw-normal">
                                        Material:
                                        <span class="variant-picker-label-value value-currentColor">{{ selectedMaterial }}</span>
                                    </div>
                                    <div class="variant-picker-values">
                                        <div v-for="material in product.variants.materials" :key="material.id"
                                            class="hover-tooltip color-btn style-image-square"
                                            :class="{ active: selectedMaterial === material.name }"
                                            @click="selectMaterial(material)">
                                            <span class="check-color">
                                                <img :src="material.image" :alt="material.name">
                                            </span>
                                            <span class="tooltip">{{ material.name }}</span>
                                        </div>
                                    </div>
                                </div>
                                <!-- Size Selection -->
                                <div v-if="product?.variants?.sizes" class="variant-picker-item variant-size">
                                    <div class="variant-picker-label h6 fw-normal">
                                        Size:
                                        <span class="variant-picker-label-value value-currentSize">{{ selectedSize }}</span>
                                    </div>
                                    <div class="variant-picker-values">
                                        <div class="btn-group">
                                            <span v-for="size in product.variants.sizes" :key="size.id"
                                                class="size-btn"
                                                :class="{ active: selectedSize === size.name }"
                                                @click="selectSize(size)">
                                                {{ size.name }}
                                            </span>
                                        </div>
                                        <a href="#sizeGuide" data-bs-toggle="offcanvas" class="tf-btn-line style-line-2 fw-normal">
                                            Size Guide
                                        </a>
                                    </div>
                                </div>
                                <!-- Quantity Selection -->
                                <div class="variant-picker-item">
                                    <div class="variant-picker-label h6 fw-normal">Quantity</div>
                                    <div class="variant-picker-values">
                                        <div class="wg-quantity">
                                            <button class="btn-quantity btn-decrease" @click="decreaseQuantity">
                                                <i class="icon-minus"></i>
                                            </button>
                                            <input class="quantity-product" type="text" name="number" v-model="quantity">
                                            <button class="btn-quantity btn-increase" @click="increaseQuantity">
                                                <i class="icon-plus"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="tf-product-total-quantity">
                                <div class="group-btn">
                                    <button 
                                        class="tf-btn btn-fill animate-btn add-to-cart-button"
                                        @click="handleAddToCartClick"
                                        :disabled="loading"
                                    >
                                        <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                        <span v-else-if="success" class="icon icon-check"></span>
                                        <span v-else class="fw-medium">ADD TO BAG</span>
                                    </button>
                                    <div class="group-btn-action">
                                        <a href="javascript:void(0);" @click="handleWishlist" 
                                            class="tf-btn-icon hover-tooltip btn-add-wishlist"
                                            :class="{ 'active': isWishlisted }">
                                            <span class="icon icon-heart-2"></span>
                                            <span class="tooltip">{{ isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist' }}</span>
                                        </a>
                                        <a href="#compare" data-bs-toggle="modal" aria-controls="compare"
                                            class="tf-btn-icon hover-tooltip">
                                            <span class="icon icon-compare"></span>
                                            <span class="tooltip">Compare</span>
                                        </a>
                                    </div>
                                </div>
                                <RouterLink :to="`/checkout?product=${product?.id}&quantity=${quantity}`" 
                                    class="tf-btn w-100 text-uppercase fw-medium">
                                    buy it now
                                </RouterLink>
                            </div>
                            <RouterLink :to="`/product/${product?.slug}`" class="tf-btn-line">
                                <span class="text-body">View full details</span>
                                <i class="icon icon-arrow-top-right"></i>
                            </RouterLink>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
    <!-- /Quick View -->
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useWishlistStore } from '@/stores/wishlist';
import { useQuickViewStore } from '@/stores/quickView';
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import * as bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useToast } from '@/composables/useToast';
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
import { Modal } from 'bootstrap';

// Register Swiper modules
Swiper.use([Navigation]);

const router = useRouter();
const cart = useCartStore();
const auth = useAuthStore();
const wishlist = useWishlistStore();
const quickView = useQuickViewStore();
const toast = useToast();
const productStore = useProductStore();

const { currentProduct } = storeToRefs(quickView);

// Reactive state
const quantity = ref(1);
const selectedMaterial = ref('');
const selectedSize = ref('');
const productImages = ref([]);
let quickViewSwiper = null;

// Add loading states
const loading = ref(false);
const success = ref(false);

// Computed properties
const product = computed(() => quickView.currentProduct);

const calculateTotalPrice = computed(() => {
    if (!product.value) return 0;
    // Ensure sale_price is treated as a number
    const price = parseFloat(product.value.sale_price || 0);
    return (price * quantity.value).toFixed(2);
});

const isWishlisted = computed(() => {
    return product.value ? wishlist.isWishlisted(product.value.id) : false;
});

// Watcher for product data
watch(product, async (newProduct) => {
    console.log('Product updated:', newProduct);
    if (newProduct) {
        loading.value = true;
        try {
            // Initialize product images
            const images = [];
            if (Array.isArray(newProduct.gallery_images)) {
                newProduct.gallery_images.forEach(url => {
                    images.push({
                        url,
                        color: 'default'
                    });
                });
            } else if (newProduct.gallery_images) {
                images.push({
                    url: newProduct.gallery_images,
                    color: 'default'
                });
            }
            if (newProduct.thumbnail_image) {
                images.push({
                    url: newProduct.thumbnail_image,
                    color: 'hover'
                });
            }
            if (newProduct.variants?.materials) {
                newProduct.variants.materials.forEach(material => {
                    if (material.image) {
                        images.push({
                            url: material.image,
                            color: material.name
                        });
                    }
                });
            }
            productImages.value = images;
            console.log('QuickView: productImages populated', productImages.value);

            // Initialize Swiper after images are set and DOM is updated
            await nextTick();
            initSwiper();

            // Reset selected variants and quantity when product changes
            selectedMaterial.value = '';
            selectedSize.value = '';
            quantity.value = 1;
        } finally {
            loading.value = false;
        }
    }
});

// Methods
const calculateOriginalPrice = (salePrice, discount, type) => {
    if (!discount || !salePrice) return salePrice; // Return original value if no discount or sale price
    let originalPrice = parseFloat(salePrice || 0);
    let disc = parseFloat(discount || 0);

    if (type === 'percentage') {
         if (disc >= 100) return 0; // Or handle as an error/special case
        originalPrice = originalPrice / (1 - disc / 100);
    } else if (type === 'fixed') {
        originalPrice = originalPrice + disc;
    }
    return originalPrice.toFixed(2);
};

const selectMaterial = (material) => {
    selectedMaterial.value = material.name;
    // Update images if material has different images
    if (material.images) {
        productImages.value = material.images;
        initSwiper();
    }
};

const selectSize = (size) => {
    selectedSize.value = size.name;
};

// Re-add local quantity update methods
const increaseQuantity = () => {
    quantity.value++;
};

const decreaseQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

const handleAddToCartClick = async () => {
    if (!product.value) return;

    loading.value = true;
    success.value = false;

    try {
        const cartData = {
            product_id: product.value.id,
            quantity: quantity.value,
            variants: {
                material: selectedMaterial.value,
                size: selectedSize.value
            },
            cart_token: localStorage.getItem('cartToken') || generateCartToken()
        };
        await cart.addToCart(cartData);
        // ... rest of your logic ...
    } catch (error) {
        console.error('Error adding to cart from QuickView:', error);
        toast.error('Failed to add product to cart');
    } finally {
        loading.value = false;
    }
};

// Helper function to generate a cart token
const generateCartToken = () => {
    return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const handleWishlist = async () => {
    try {
        const productId = product.value.id;
        if (wishlist.isWishlisted(productId)) {
            await wishlist.removeFromWishlist(productId);
        } else {
            await wishlist.addToWishlist(productId);
        }
    } catch (error) {
        console.error('Error updating wishlist:', error);
    }
};

const initSwiper = () => {
    console.log('QuickView: initSwiper called. Images count:', productImages.value.length);
    // Destroy existing Swiper instance if it exists
    if (quickViewSwiper) {
        console.log('QuickView: Destroying existing swiper');
        quickViewSwiper.destroy(true, true);
    }

    // Initialize Swiper if there are images
    if (productImages.value.length > 0) {
        nextTick(() => {
             const swiperEl = document.querySelector('.modal-quick-view .tf-single-slide');
             if (swiperEl) {
                 console.log('QuickView: Swiper element found, initializing Swiper');
                 quickViewSwiper = new Swiper(swiperEl, {
                     slidesPerView: 1,
                     loop: true,
                     navigation: {
                         nextEl: '.modal-quick-view .single-slide-next',
                         prevEl: '.modal-quick-view .single-slide-prev',
                     },
                 });
                  console.log('QuickView: Swiper initialized');
             } else {
                 console.error('QuickView: Swiper element .modal-quick-view .tf-single-slide not found');
             }
        });

    } else {
        console.log('QuickView: No images to initialize swiper');
    }
};

// Watch for modal open/close state
watch(() => quickView.isOpen, (newVal) => {
    const modalElement = document.getElementById('quickView');
    if (typeof window !== 'undefined' && typeof document !== 'undefined' && Modal && modalElement) {
        const bsModal = Modal.getInstance(modalElement) || new Modal(modalElement);
        if (newVal) {
            bsModal.show();
        } else {
            bsModal.hide();
        }
    }
});

// Watch for current product change to reset quantity and variants
watch(product, (newProduct) => {
    if (newProduct) {
        quantity.value = 1;
        selectedMaterial.value = '';
        selectedSize.value = '';
        loading.value = false;
        success.value = false;
    }
});
</script>

<style scoped>
/* Add any specific styles for the quick view modal here */
.add-to-cart-button .icon-check {
    font-size: 18px;
    vertical-align: middle;
}
</style>