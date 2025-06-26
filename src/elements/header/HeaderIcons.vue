<template>
    <ul class="nav-icon">
        <li class="d-inline-flex">
            <RouterLink to="#search" class="nav-icon-item text-black link" data-bs-toggle="offcanvas">
                <i class="icon icon-search"></i>
            </RouterLink>
        </li>
        <li class="br-line d-none d-xl-flex"></li>
        <li class="d-none d-md-inline-flex">
            <RouterLink to="/account" class="nav-icon-item text-black link">
                <i class="icon icon-user"></i>
            </RouterLink>
        </li>
        <li class="d-none d-md-inline-flex">
            <RouterLink to="/wishlist" class="nav-icon-item text-black link">
                <i class="icon icon-hearth"></i>
                <span v-if="wishlist.items.length > 0" class="count-notice">
                    <template>{{ wishlist.items.length }}</template>
                </span>
            </RouterLink>
        </li>
        <li class="d-inline-flex">
            <a href="#shoppingCart" 
               class="nav-icon-item text-black link" 
               data-bs-toggle="offcanvas" 
               data-bs-target="#shoppingCart" 
               aria-controls="shoppingCart">
                <i class="icon icon-cart"></i>
                <span v-if="cartCount > 0" class="count-notice">
                    <template>{{ cartCount }}</template>
                </span>
            </a>
        </li>
    </ul>

    <!-- Wishlist Loading Overlay -->
    <div v-if="wishlistLoading" class="wishlist-loading-overlay">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>

    <!-- Wishlist Success Toast -->
    <div v-if="showWishlistSuccess" class="wishlist-success-toast">
        <i class="icon icon-check"></i>
        <span>Added to wishlist successfully!</span>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/wishlist'

const cart = useCartStore()
const auth = useAuthStore()
const wishlist = useWishlistStore()
const router = useRouter()

// State for wishlist loading and success feedback
const wishlistLoading = ref(false)
const showWishlistSuccess = ref(false)

// Computed properties
const cartCount = computed(() => cart.count)

onMounted(async () => {
    try {
        await cart.fetchCart();
    } catch (error) {
        console.error('Error initializing cart:', error)
    }
})

// Watch for cart changes
watch(() => cart.count, (newCount) => {
    console.log('Cart count changed:', newCount);
});

// Watch for wishlist changes
watch(() => wishlist.loading, (newValue) => {
    wishlistLoading.value = newValue
    if (!newValue && wishlist.lastAction === 'add') {
        showWishlistSuccess.value = true
        setTimeout(() => {
            showWishlistSuccess.value = false
        }, 2000)
    }
})
</script>

<style scoped>
.count-notice {
    position: absolute;
    top: -8px;
    right: -8px;
    background-color: #ff6b6b;
    color: white;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: bold;
    z-index: 1;
}

.nav-icon-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.wishlist-loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.wishlist-success-toast {
    position: fixed;
    top: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.icon-check {
    font-size: 18px;
}
</style>