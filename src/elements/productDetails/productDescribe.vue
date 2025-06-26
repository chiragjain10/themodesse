<template>
    <div class="tf-product-info-wrap">
        <div class="tf-zoom-main sticky-top"></div>
        <div class="tf-product-info-list other-image-zoom">
            <ShortDesc 
                :product="product"
                :rating="product?.rating"
                :stock="product?.stock"
            />
            <Attributes 
                :product="product"
                :attributes="product?.attributes"
                :variants="product?.variants"
                :quantity="quantity"
                @update:selected-variants="updateSelectedVariants"
                @update:quantity="updateQuantity"
            />
            <Buttons 
                :product="product"
                :selected-variants="selectedVariants"
                :quantity="quantity"
                :is-loading="isLoading"
                @add-to-cart="addToCart"
                @add-to-wishlist="addToWishlist"
                @add-to-compare="addToCompare"
            />
            <IconBox 
                :product="product"
                @share="shareProduct"
            />
        </div>
        <RelatedProducts :products="relatedProducts" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import ShortDesc from './shortDesc.vue'
import Attributes from './attributes.vue'
import Buttons from './buttons.vue'
import IconBox from './iconBox.vue'
import RelatedProducts from './relatedProducts.vue'
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'

const productStore = useProductStore()
const auth = useAuthStore()
const router = useRouter()
const { product, relatedProducts } = storeToRefs(productStore)
const cart = useCartStore()
const toast = useToast()

const selectedVariants = ref({})
const quantity = ref(1)
const isLoading = ref(false)
const openCartAfterAdd = ref(true)

const updateSelectedVariants = (variants) => {
    selectedVariants.value = variants
}

const updateQuantity = (newQuantity) => {
    quantity.value = newQuantity
}

const addToCart = async () => {
    try {
        const cartData = {
            productId: product.value.id,
            quantity: quantity.value,
            selectedVariant: selectedVariants.value,
            cartToken: localStorage.getItem('cartToken') || generateCartToken()
        };

        const response = await cart.addToCart(cartData);
        
        if (response.success) {
            // Store cart token if it's a new one
            if (response.cartToken) {
                localStorage.setItem('cartToken', response.cartToken);
            }
            
            // Update cart count
            await cart.getCartCount();
            
            // Show success message
            toast.success('Product added to cart successfully');
            
            // Open cart if configured to do so
            if (openCartAfterAdd.value) {
                cart.openCart();
            }
        } else {
            toast.error(response.message || 'Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        toast.error('Failed to add product to cart');
    }
};

// Helper function to generate a cart token
const generateCartToken = () => {
    return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const addToWishlist = async () => {
    try {
        await productStore.addToWishlist(product.value);
    } catch (error) {
        console.error('Error adding to wishlist:', error);
    }
}

const addToCompare = () => {
    productStore.addToCompare(product.value)
}

const shareProduct = (platform) => {
    console.log('Sharing product on:', platform)
}

onMounted(async () => {
    // No need to wait for auth state
});
</script>