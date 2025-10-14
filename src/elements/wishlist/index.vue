<template>
    <div class="wishlist-page">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <h1 class="page-title">My Wishlist</h1>
                </div>
            </div>
            <div class="row">
                <div v-if="loading" class="col-12">
                    <div class="col-xs-6 col-lg-3 mb-4" v-for="n in 4" :key="n">
                        <div class="category shimmer-loader">
                            <div class="skeleton-img"></div>
                            <div class="skeleton-text mt-2"></div>
                        </div>
                    </div>
                </div>
                <div v-else-if="wishlist.isEmpty" class="col-12 text-center py-5">
                    <div class="empty-wishlist">
                        <i class="icon icon-heart-2 mb-4" style="font-size: 48px; color: #ff6b6b;"></i>
                        <h3>Your wishlist is empty</h3>
                        <p>Add items to your wishlist to keep track of products you love.</p>
                        <RouterLink to="/shop" class="tf-btn btn-fill-2 text-uppercase fw-medium animate-btn">Continue
                            Shopping</RouterLink>
                    </div>
                </div>
                <div v-else class="col-12">
                    <div class="row">
                        <div v-for="item in wishlist.items" :key="item.id" class="col-6 col-md-4 col-lg-3 mb-4">
                            <div class="card_product--V01 card p-2">
                                <div class="card_product-wrapper">
                                    <RouterLink :to="`/product/${item.product?.slug}`" class="product-img">
                                        <img :src="item.product?.thumbnail_image" :alt="item.product?.name"
                                            class="lazyload img-product">
                                        <img :src="item.product?.gallery_images[2] || item.product?.thumbnail_image"
                                            :alt="item.product?.name" class="lazyload img-hover">
                                    </RouterLink>
                                    <ul class="list-product-btn">
                                        <li class="wishlist">
                                            <a href="javascript:void(0);" class="hover-tooltip tooltip-left box-icon"
                                                @click.prevent="handleRemoveFromWishlist(item.product_id)">
                                                <span class="fa fa-trash"></span>
                                                <span class="tooltip">Remove from Wishlist</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="javascript:void(0);" class="hover-tooltip tooltip-left box-icon"
                                                @click.prevent="handleAddToCartClick(product)"
                                                :disabled="loadingProductId === product?.id">
                                                <i v-if="loadingProductId === product?.id"
                                                    class="fas fa-spinner fa-spin"></i>
                                                <i v-else-if="successProductId === product?.id"
                                                    class="icon icon-check"></i>
                                                <i v-else class="icon icon-shop-cart"></i>
                                                <span class="tooltip">Quick Add</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#quickView" data-bs-toggle="modal"
                                                class="hover-tooltip tooltip-left box-icon quickview"
                                                @click="openQuickViewClick(product)">
                                                <span class="icon icon-view"></span>
                                                <span class="tooltip">Quick View</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="product-details">
                                    <h3 class="product-name">
                                        <RouterLink :to="`/product/${item.product?.slug}`">{{ item.product?.name }}
                                        </RouterLink>
                                    </h3>
                                    <div class="product-price">
                                        <span class="price">₹{{ item.product?.price }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import { useQuickViewStore } from '@/stores/quickView'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const wishlist = useWishlistStore()
const cart = useCartStore()
const quickView = useQuickViewStore()
const toast = useToast()

const loading = computed(() => wishlist.loading)
const loadingProductId = ref(null)
const successProductId = ref(null)

const handleAddToCartClick = async (product) => {
    if (!product) return;

    loadingProductId.value = product?.id;
    successProductId.value = null;

    try {
        const cartData = {
            productId: product?.id,
            quantity: 1,
            cartToken: localStorage.getItem('cartToken') || generateCartToken()
        };

        const response = await cart.addToCart(cartData);

        if (response.status === 'success') {
        
            if (response.cartToken) {
                localStorage.setItem('cartToken', response.cartToken);
            }

        
            await cart.getCartCount();

        
            toast.success('Product added to cart successfully');

            successProductId.value = product?.id;
            setTimeout(() => {
                successProductId.value = null;
            }, 2000);

        } else {
            toast.error(response.message || 'Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add product to cart');
    } finally {
        loadingProductId.value = null;
    }
};

const handleRemoveFromWishlist = async (productId) => {
    try {
        await wishlist.removeFromWishlist(productId);
        toast.success('Product removed from wishlist');
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        toast.error('Failed to remove from wishlist');
    }
};

const openQuickViewClick = (product) => {
    openQuickView(product);
};

const generateCartToken = () => {
    return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const openQuickView = (product) => {
    quickView.openQuickView(product)
}

onMounted(async () => {
    try {
        await wishlist.fetchWishlist()
    } catch (error) {
        console.error('Error fetching wishlist:', error)
    }
})
</script>

<style scoped>
.wishlist-page {
    padding: 40px 0;
}

.page-title {
    margin-bottom: 30px;
    font-size: 24px;
    font-weight: 600;
}

.empty-wishlist {
    padding: 40px;
    text-align: center;
}

.empty-wishlist i {
    display: block;
    margin-bottom: 20px;
}

.empty-wishlist h3 {
    margin-bottom: 10px;
    font-size: 20px;
}

.empty-wishlist p {
    color: #666;
    margin-bottom: 20px;
}

.spinner-border-spin {
    animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
    to {
        transform: rotate(360deg);
    }
}

.icon-spinner {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    border: 0.2em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
}

.icon-check {
    color: #28a745;
}

.wishlist.active .icon-heart-2 {
    color: #ff6b6b;
}

.list-product-btn {
    position: absolute;
    top: 25%;
    right: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    z-index: 2;
}

.list-product-btn li {
    margin: 0;
}

.list-product-btn .box-icon {
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.list-product-btn .box-icon:hover {
    background: #ff6b6b;
    color: white;
}

.list-product-btn .box-icon.active {
    background: #ff6b6b;
    color: white;
}

.tooltip {
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    background: #333;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    margin-right: 10px;
}

.box-icon:hover .tooltip {
    opacity: 1;
    visibility: visible;
}

.tooltip::after {
    content: '';
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%);
    border-left: 5px solid #333;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
}

.tf-btn-line .icon-check {
    font-size: 16px;
    vertical-align: middle;
}
</style>