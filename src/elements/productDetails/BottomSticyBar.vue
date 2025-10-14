<template>
    <div class="tf-sticky-bar">
        <div class="row align-items-center">
            <div class="col-lg-3 col-md-4">
                <div class="tf-sticky-product">
                    <img :src="product?.thumbnail_image" 
                         :alt="product?.name" 
                         class="sticky-thumb"
                         @error="handleImageError">
                    <div class="sticky-info">
                        <h6 class="sticky-name">{{ product?.name }}</h6>
                        <div class="sticky-price">
                            <span class="price-new">${{ product?.price }}</span>
                            <span v-if="product?.discount_price" class="price-old">${{ product?.price }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 col-md-4">
                <div class="tf-sticky-actions">
                    <div class="quantity-selector">
                        <button class="btn-quantity btn-decrease" @click="decreaseQuantity">
                            <i class="icon-minus"></i>
                        </button>
                        <input type="text" v-model="quantity" readonly>
                        <button class="btn-quantity btn-increase" @click="increaseQuantity">
                            <i class="icon-plus"></i>
                        </button>
                    </div>
                    <button 
                       class="tf-btn btn-fill-2 text-uppercase fw-medium animate-btn"
                       @click="handleAddToCartClick"
                       :disabled="loading"
                    >
                       <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                       <span v-else-if="success" class="icon icon-check"></span>
                       <span v-else>
                           add to bag
                           <i class="icon-minus d-none d-sm-block"></i>
                           <span class="price-add d-none d-sm-block">${{ calculateTotal }}</span>
                       </span>
                    </button>
                </div>
            </div>
            <div class="col-lg-3 col-md-4">
                <div class="tf-sticky-actions-right">
                    <a href="javascript:void(0);" 
                       class="tf-btn-icon hover-tooltip btn-add-wishlist"
                       @click="addToWishlist">
                        <span class="icon icon-heart-2"></span>
                        <span class="tooltip">Add to Wishlist</span>
                    </a>
                    <a href="#compare" 
                       data-bs-toggle="modal" 
                       class="tf-btn-icon hover-tooltip"
                       @click="addToCompare">
                        <span class="icon icon-compare"></span>
                        <span class="tooltip">Compare</span>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toast-notification'
import { storeToRefs } from 'pinia'

const productStore = useProductStore()
const cart = useCartStore()
const toast = useToast()
const { product } = storeToRefs(productStore)

const quantity = ref(1)

const loading = ref(false)
const success = ref(false)

const calculateTotal = computed(() => {
    return (product.value?.price * quantity.value).toFixed(2)
})

const increaseQuantity = () => {
    if (quantity.value < product.value?.stock_quantity) {
        quantity.value++
    }
}

const decreaseQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--
    }
}

const handleImageError = (event) => {
    event.target.src = '/images/placeholder.jpg'
}

const handleAddToCartClick = async () => {
    if (!product.value) return

    loading.value = true
    success.value = false

    try {
        const cartData = {
            productId: product.value.id,
            quantity: quantity.value,
            selectedVariant: {},
            cartToken: localStorage.getItem('cartToken') || generateCartToken()
        }

        const response = await cart.addToCart(cartData)

        if (response.status === 'success') {
            if (response.cartToken) {
                localStorage.setItem('cartToken', response.cartToken)
            }

            await cart.getCartCount()

            toast.success('Product added to cart successfully')

            success.value = true
            setTimeout(() => {
                success.value = false
            }, 2000)

        } else {
            toast.error(response.message || 'Failed to add product to cart')
        }
    } catch (error) {
        console.error('Error adding to cart from Sticky Bar:', error)
        toast.error('Failed to add product to cart')
    } finally {
        loading.value = false
    }
}

const generateCartToken = () => {
    return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

const addToWishlist = () => {
    productStore.addToWishlist(product.value)
}

const addToCompare = () => {
    productStore.addToCompare(product.value)
}
</script>

<style scoped>
.tf-sticky-bar {
    background: #fff;
    padding: 15px 0;
    /* box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1); */
    position: sticky;
    bottom: 0;
    z-index: 100;
}

.tf-sticky-product {
    display: flex;
    align-items: center;
    gap: 15px;
}

.sticky-thumb {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
}

.sticky-info {
    flex: 1;
}

.sticky-name {
    margin: 0;
    font-size: 14px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.sticky-price {
    margin-top: 5px;
}

.price-new {
    font-weight: 600;
    color: #333;
}

.price-old {
    text-decoration: line-through;
    color: #999;
    margin-left: 8px;
    font-size: 12px;
}

.tf-sticky-actions {
    display: flex;
    align-items: center;
    gap: 15px;
    justify-content: center;
}

.quantity-selector {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.btn-quantity {
    background: none;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-quantity:hover {
    background: #f5f5f5;
}

.quantity-selector input {
    width: 40px;
    text-align: center;
    border: none;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    padding: 8px 0;
}

.tf-sticky-actions-right {
    display: flex;
    justify-content: flex-end;
    gap: 15px;
}

.tf-btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #f8f8f8;
    color: #333;
    transition: all 0.3s ease;
}

.tf-btn-icon:hover {
    background: #333;
    color: #fff;
}

@media (max-width: 991px) {
    .tf-sticky-bar {
        padding: 10px 0;
    }

    .sticky-thumb {
        width: 50px;
        height: 50px;
    }

    .sticky-name {
        font-size: 12px;
    }

    .tf-sticky-actions {
        gap: 10px;
    }

    .quantity-selector input {
        width: 30px;
    }

    .btn-quantity {
        padding: 6px 10px;
    }
}

@media (max-width: 767px) {
    .tf-sticky-product {
        display: none;
    }

    .tf-sticky-actions {
        justify-content: flex-start;
    }

    .tf-sticky-actions-right {
        display: none;
    }
}

.tf-btn .icon-check {
    font-size: 18px;
    vertical-align: middle;
}
</style>