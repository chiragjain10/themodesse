<template>
    <div class="tf-product-total-quantity mb-3">
        <div v-if="addToCartError || addToCartSuccess" class="alert-container mb-3">
            <div v-if="addToCartError" class="alert alert-danger alert-dismissible fade show" role="alert">
                {{ addToCartError }}
                <button type="button" class="btn-close" @click="addToCartError = ''" aria-label="Close"></button>
            </div>
            <div v-if="addToCartSuccess" class="alert alert-success alert-dismissible fade show" role="alert">
                {{ addToCartSuccess }}
                <button type="button" class="btn-close" @click="addToCartSuccess = ''" aria-label="Close"></button>
            </div>
        </div>
        <div class="group-btn">
            <a href="" class="tf-btn btn-fill-2 text-uppercase fw-medium animate-btn"
                :class="{ 'loading': loadingProductId === product?.id }" @click.prevent="handleAddToCartClick()">
                <span v-if="loadingProductId === product?.id" class="spinner-border spinner-border-sm me-2"
                    role="status">
                    <span class="visually-hidden">Loading...</span>
                </span>
                <span v-else>Add to cart</span>
            </a>

            <div class="group-btn-action">
                <a href="javascript:void(0);" class="tf-btn-icon hover-tooltip btn-add-wishlist"
                    @click.prevent="handleWishlistClick()" :class="{ 'active': isProductWishlisted }">
                    <span class="icon icon-heart-2"></span>
                    <span class="tooltip">{{ isProductWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist' }}</span>
                </a>
            </div>
        </div>
        <small v-if="errorMessage" class="text-danger d-block mb-2">{{ errorMessage }}</small>
        <button class="tf-btn w-100 text-uppercase fw-medium" @click="handleBuyNow"
            :disabled="loadingProductId === props.product?.id">
            <span v-if="loadingProductId === props.product?.id">
                <i class="fas fa-spinner fa-spin me-2"></i>Processing...
            </span>
            <span v-else>Buy now</span>
        </button>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useWishlistStore } from '@/stores/wishlist';
import { useProductActions } from '@/composables/useProductActions';
import { useToast } from '@/composables/useToast';

const { addToCart: productActionsAddToCart, handleWishlist, openQuickView, calculateOriginalPrice } = useProductActions();
const toast = useToast();

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const wishlist = useWishlistStore();

const loadingProductId = ref(null);
const successProductId = ref(null);
const isLoading = ref(false);

const props = defineProps({
    product: {
        type: Object,
        required: true
    },
    selectedVariants: {
        type: Object,
        default: () => ({})
    },
    quantity: {
        type: Number,
        default: 1
    }
})

const totalPrice = computed(() => {
    if (!props.product) return '0.00';
    const basePrice = props.product.price || props.product.price || 0;
    return (basePrice * props.quantity).toFixed(2);
});

// Computed property to check if the current product is wishlisted
const isProductWishlisted = computed(() => {
    if (!props.product?.id) return false;
    return wishlist.isWishlisted(props.product.id);
});

const errorMessage = ref('');
const addToCartError = ref('');
const addToCartSuccess = ref('');

const handleBuyNow = async () => {
    if (!props.product) return;

    // Build list of required attributes from product schema if available
    const requiredAttrs = Array.isArray(props.product?.attributes)
        ? props.product.attributes.map(a => a?.name).filter(Boolean)
        : [];

    // Validate variants
    const sv = props.selectedVariants || {};
    if (requiredAttrs.length > 0) {
        const missing = requiredAttrs.filter(k => !sv[k] || sv[k] === '');
        if (missing.length) {
            errorMessage.value = `Please select: ${missing.join(', ')}`;
            return;
        }
    } else {
        // Fallback: at least one selection should exist
        if (!Object.keys(sv).length) {
            errorMessage.value = 'Please select all options before proceeding to checkout';
            return;
        }
    }

    // Extra validation for Custom size: ensure measurements saved
    if (sv['Size'] === 'Custom' && !sv['customMeasurements']) {
        errorMessage.value = 'Please enter and save your custom measurements';
        return;
    }

    // Validate quantity
    if (!props.quantity || props.quantity < 1) {
        errorMessage.value = 'Please select a valid quantity';
        return;
    }

    errorMessage.value = '';

    try {
        // Add to cart without opening the cart UI
        const ok = await handleAddToCartClick({ suppressOpenCart: true });
        if (ok) {
            // Go directly to checkout
            await router.push({ path: '/checkout' });
        }
    } catch (error) {
        console.error('Error in buy now process:', error);
        errorMessage.value = 'Failed to proceed to checkout';
    }
};

const handleAddToCartClick = async (options = {}) => {
    if (!props.product) {
        return false;
    }

    // Validate that all selectedVariants have a value (not empty string)
    const variantKeys = Object.keys(props.selectedVariants || {});
    const allSelected = variantKeys.length > 0 && variantKeys.every(key => props.selectedVariants[key] && props.selectedVariants[key] !== '');
    if (!allSelected) {
        addToCartError.value = 'Please select all options before adding to cart';
        setTimeout(() => {
            addToCartError.value = '';
        }, 3000);
        return false;
    }

    // Validate quantity
    if (!props.quantity || props.quantity < 1) {
        addToCartError.value = 'Please select a valid quantity';
        setTimeout(() => {
            addToCartError.value = '';
        }, 3000);
        return false;
    }

    addToCartError.value = '';
    loadingProductId.value = props.product.id;
    try {
        const cartData = {
            productId: props.product.id,
            quantity: props.quantity,
            selectedVariants: props.selectedVariants,
            cartToken: localStorage.getItem('cartToken') || generateCartToken()
        };
        const response = await productActionsAddToCart(cartData);

        if (response.success) {
            // Store cart token if it's a new one
            if (response.cartToken) {
                localStorage.setItem('cartToken', response.cartToken);
            }

            // Update cart count
            await cart.getCartCount();

            // Show success state briefly
            successProductId.value = props.product.id;
            setTimeout(() => {
                successProductId.value = null;
            }, 2000);

            // Show success message
            addToCartSuccess.value = 'Product added to cart successfully';
            setTimeout(() => {
                addToCartSuccess.value = '';
            }, 3000);

            // Open cart if configured to do so
            const suppressOpenCart = options?.suppressOpenCart === true;
            if (cart.openCartAfterAdd && !suppressOpenCart) {
                cart.openCart();
            }
            return true;
        } else {
            addToCartError.value = response.message || 'Failed to add product to cart';
            setTimeout(() => {
                addToCartError.value = '';
            }, 3000);
            return false;
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        addToCartError.value = 'Failed to add product to cart';
        setTimeout(() => {
            addToCartError.value = '';
        }, 3000);
        return false;
    } finally {
        loadingProductId.value = null;
    }
};

const handleWishlistClick = async () => {
    const product = props.product;
    if (!product || !product.id) return;
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

const pincode = ref('');
const isCheckingPincode = ref(false);
const isPincodeValid = ref(false);

const checkPincode = async () => {
    if (!pincode.value || pincode.value.length !== 6) {
        toast.error('Please enter a valid 6-digit pincode');
        return;
    }

    isCheckingPincode.value = true;
    try {
        // Here you would typically make an API call to check pincode
        // For now, we'll simulate a check
        const response = await fetch(`/api/check-pincode/${pincode.value}`);
        const data = await response.json();

        if (data.isValid) {
            isPincodeValid.value = true;
            toast.success('Delivery available at this pincode');
        } else {
            isPincodeValid.value = false;
            toast.error('Delivery not available at this pincode');
        }
    } catch (error) {
        console.error('Error checking pincode:', error);
        toast.error('Failed to check pincode');
    } finally {
        isCheckingPincode.value = false;
    }
};

watch(() => props.quantity, (newQty) => {
    if (newQty < 1) {
        props.quantity = 1;
    }
});

onMounted(async () => {
    // Fetch initial wishlist status and list on mount once
    if (props.product?.id) {
        await wishlist.fetchWishlist(); // Fetch the full wishlist to populate the store's items
    }
});

// Helper function to generate a cart token
const generateCartToken = () => {
    return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Assuming isInCompare is a prop or comes from a store
const isInCompare = computed(() => false); // Placeholder: replace with actual logic
</script>

<style scoped>
.pincode-check {
    margin-top: 1rem;
}

.pincode-check .input-group {
    max-width: 300px;
}

.pincode-check input {
    border-right: none;
}

.pincode-check .btn {
    border-left: none;
}

.pincode-check small {
    display: block;
    margin-top: 0.25rem;
}

.text-danger {
    color: #dc3545;
    font-size: 0.875rem;
}

.alert-container {
    position: relative;
    z-index: 1000;
}

.alert {
    margin-bottom: 0;
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    border-radius: 4px;
    animation: slideIn 0.3s ease-out;
}

.alert-danger {
    background-color: #f8d7da;
    border-color: #f5c2c7;
    color: #842029;
}

.alert-success {
    background-color: #d1e7dd;
    border-color: #badbcc;
    color: #0f5132;
}

.btn-close {
    padding: 0.5rem;
    font-size: 0.75rem;
}

@keyframes slideIn {
    from {
        transform: translateY(-10px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}
</style>