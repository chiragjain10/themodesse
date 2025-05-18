<template>
    <div v-if="product" class="ready-to-buy">
        <div class="quantity-selector">
            <button @click="decrementQty" :disabled="loading || qty <= 1" class="qty-btn">
                <i class="fas fa-minus"></i>
            </button>
            <span class="qty-display">{{ qty }}</span>
            <button @click="incrementQty" :disabled="loading || qty >= (product.stock_quantity || 1)" class="qty-btn">
                <i class="fas fa-plus"></i>
            </button>
        </div>

        <div class="price-display" v-if="!loading">
            <span class="total-price">₹{{ totalPrice }}</span>
            <span class="per-item">(₹{{ product.price || 0 }} per item)</span>
        </div>
        <div class="price-display" v-else>
            <span class="loading-price">Updating price...</span>
        </div>

        <div class="error-message" v-if="error">{{ error }}</div>

        <button @click="addToCart" :disabled="loading" class="add-to-cart-btn">
            <span v-if="!loading">Add to Cart</span>
            <span v-else>Adding...</span>
        </button>
    </div>
    <div v-else>
        Loading product details...
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
    product: {
        type: Object,
        required: true,
        default: () => ({})
    }
});

const router = useRouter();
const cart = useCartStore();
const auth = useAuthStore();
const qty = ref(1);
const loading = ref(false);
const error = ref(null);
let updateTimeout = null;

const totalPrice = computed(() => {
    if (!props.product || !props.product.price) return '0.00';
    return (props.product.price * qty.value).toFixed(2);
});

const incrementQty = () => {
    console.log('Incrementing quantity', props.product);
    if (props.product && qty.value < (props.product.stock_quantity || 1)) {
        qty.value++;
        updatePriceWithDelay();
    }
};

const decrementQty = () => {
    if (qty.value > 1) {
        qty.value--;
        updatePriceWithDelay();
    }
};

const updatePriceWithDelay = () => {
    loading.value = true;
    if (updateTimeout) {
        clearTimeout(updateTimeout);
    }
    updateTimeout = setTimeout(() => {
        loading.value = false;
    }, 500);
};

const addToCart = async () => {
    if (!auth.user) {
        router.push('/login');
        return;
    }

    loading.value = true;
    error.value = null;

    try {
        await cart.addToCart(props.product.id, qty.value);
        qty.value = 1;
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

watch(qty, () => {
    error.value = null;
});
</script>

<style scoped>
.ready-to-buy {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
}

.quantity-selector {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.qty-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
}

.qty-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.qty-btn:hover:not(:disabled) {
    background: #f8fafc;
}

.qty-display {
    font-size: 1.1rem;
    font-weight: 500;
    min-width: 2rem;
    text-align: center;
}

.price-display {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.total-price {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1a202c;
}

.per-item {
    font-size: 0.875rem;
    color: #718096;
}

.loading-price {
    color: #718096;
    font-style: italic;
}

.error-message {
    color: #e53e3e;
    font-size: 0.875rem;
}

.add-to-cart-btn {
    padding: 0.75rem 1.5rem;
    background: #4f46e5;
    color: white;
    border: none;
    border-radius: 0.375rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.add-to-cart-btn:hover:not(:disabled) {
    background: #4338ca;
}

.add-to-cart-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>