<template>
    <div class="tf-product-info-wrap">
        <div class="tf-zoom-main sticky-top"></div>
        <div class="tf-product-info-list other-image-zoom">
            <ShortDesc :product="props.product" :rating="props.product?.rating" :stock="props.product?.stock" />
            <Attributes :product="props.product" :attributes="props.product?.attributes"
                :variants="props.product?.variants" :quantity="quantity"
                @update:selected-variants="updateSelectedVariants" @update:quantity="updateQuantity" />
            <!-- <Buttons :product="props.product" :selected-variants="selectedVariants" :quantity="quantity"
                :is-loading="isLoading" @add-to-cart="addToCart" @add-to-wishlist="addToWishlist" /> -->
            <IconBox />
        </div>
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
import { useCartStore } from '@/stores/cart'
import { useToast } from '@/composables/useToast'
// import IconBox from '../Home/icon-box.vue';

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

const props = defineProps({
    product: {
        type: Object,
        required: true
    },
    handleAttributesUpdate: Function,
    handleQuantityUpdate: Function
});

const updateSelectedVariants = (variants) => {
    selectedVariants.value = variants
}

const updateQuantity = (newQuantity) => {
    quantity.value = newQuantity
}

const addToCart = async () => {
    try {
        const cartData = {
            productId: props.product.id,
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
        await productStore.addToWishlist(props.product);
    } catch (error) {
        console.error('Error adding to wishlist:', error);
    }
}

const shareProduct = (platform) => {
    console.log('Sharing product on:', platform)
}

onMounted(async () => {
    // No need to wait for auth state
});
</script>

<style scoped>
.tf-product-info-wrap {
    padding: 0 100px;
}

@media (max-width: 768px) {
    .tf-product-info-wrap {
        padding: 0;
    }
}
</style>