<template>
    <div class="card_product--V01">
        <div class="card_product-wrapper">
            <RouterLink :to="`/product/${product?.slug}`" class="product-img">
                <img :src="product?.image" :alt="product?.name" class="lazyload img-product">
                <img :src="product?.hover_image || product?.image" :alt="product?.name" class="lazyload img-hover">
            </RouterLink>
            <ul class="list-product-btn d-none d-md-flex">
                <li class="wishlist">
                    <a href="javascript:void(0);" class="hover-tooltip tooltip-left box-icon"
                       :class="{ 'active': isWishlisted, 'loading': loadingWishlist }"
                       @click.prevent="handleWishlist">
                        <span class="icon">
                            <i v-if="loadingWishlist" class="icon-spinner spinner-border-spin"></i>
                            <i v-else-if="successWishlist" class="icon-check"></i>
                            <i v-else class="icon-heart-2"></i>
                        </span>
                        <span class="tooltip">{{ isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist' }}</span>
                    </a>
                </li>
                <li>
                    <a href="javascript:void(0);" class="hover-tooltip tooltip-left box-icon"
                       @click.prevent="handleAddToCart"
                       :disabled="loadingCart">
                        <span class="icon">
                            <i v-if="loadingCart" class="icon-spinner spinner-border-spin"></i>
                            <i v-else-if="successCart" class="icon-check"></i>
                            <i v-else class="icon-shop-cart"></i>
                        </span>
                        <span class="tooltip">Quick Add</span>
                    </a>
                </li>
                <li>
                    <a href="#quickView" data-bs-toggle="modal"
                       class="hover-tooltip tooltip-left box-icon quickview"
                       @click="openQuickView">
                        <span class="icon icon-view"></span>
                        <span class="tooltip">Quick View</span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="product-details">
            <h3 class="product-name">
                <RouterLink :to="`/product/${product?.slug}`">{{ product?.name }}</RouterLink>
            </h3>
            <div class="product-price">
                <span class="price">₹{{ product?.price }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWishlistStore } from '@/stores/wishlist'
import { useCartStore } from '@/stores/cart'
import { useQuickViewStore } from '@/stores/quickView'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const router = useRouter()
const wishlist = useWishlistStore()
const cart = useCartStore()
const quickView = useQuickViewStore()
const auth = useAuthStore()

// Loading and success states
const loadingWishlist = ref(false)
const loadingCart = ref(false)
const successWishlist = ref(false)
const successCart = ref(false)
const isWishlisted = ref(false)

// Check if product is in wishlist
onMounted(async () => {
    if (auth.isAuthenticated && props.product?.id) {
        try {
            isWishlisted.value = await wishlist.isWishlisted(props.product.id)
        } catch (error) {
            console.error('Check wishlist error:', error)
        }
    }
})

// Methods
const handleWishlist = async () => {
    if (!auth.isAuthenticated) {
        router.push('/login')
        return
    }

    loadingWishlist.value = true
    try {
        if (isWishlisted.value) {
            await wishlist.removeFromWishlist(props.product.id)
            isWishlisted.value = false
        } else {
            await wishlist.addToWishlist(props.product.id)
            isWishlisted.value = true
        }
        successWishlist.value = true
        setTimeout(() => {
            successWishlist.value = false
        }, 2000)
    } catch (error) {
        console.error('Wishlist error:', error)
    } finally {
        loadingWishlist.value = false
    }
}

const handleAddToCart = async () => {
    if (!auth.isAuthenticated) {
        router.push('/login')
        return
    }

    loadingCart.value = true
    try {
        await cart.addToCart(props.product.id, 1)
        successCart.value = true
        setTimeout(() => {
            successCart.value = false
        }, 2000)
    } catch (error) {
        console.error('Add to cart error:', error)
    } finally {
        loadingCart.value = false
    }
}

const openQuickView = () => {
    quickView.openQuickView(props.product)
}
</script>

<style scoped>
.card_product--V01 {
    position: relative;
    margin-bottom: 30px;
}

.card_product-wrapper {
    position: relative;
    overflow: hidden;
}

.product-img {
    display: block;
    position: relative;
    overflow: hidden;
}

.product-img img {
    width: 100%;
    height: auto;
    transition: transform 0.3s ease;
}

.product-img:hover img.img-product {
    transform: scale(1.1);
}

.img-hover {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.product-img:hover .img-hover {
    opacity: 1;
}

.list-product-btn {
    position: absolute;
    top: 10px;
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
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
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

.spinner-border-spin {
    animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
    to { transform: rotate(360deg); }
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

.product-details {
    padding: 15px 0;
}

.product-name {
    margin: 0 0 5px;
    font-size: 16px;
    font-weight: 500;
}

.product-name a {
    color: #333;
    text-decoration: none;
    transition: color 0.3s ease;
}

.product-name a:hover {
    color: #ff6b6b;
}

.product-price {
    font-size: 16px;
    font-weight: 600;
    color: #ff6b6b;
}
</style> 