<template>
    <!-- Toolbar -->
    <div class="tf-toolbar-bottom">
        <div class="toolbar-item">
            <RouterLink to="/shop">
                <span class="toolbar-icon">
                    <i class="icon icon-menu-home"></i>
                </span>
                <span class="toolbar-label">Shop</span>
            </RouterLink>
        </div>
        <div class="toolbar-item">
            <a href="#search" data-bs-toggle="offcanvas">
                <span class="toolbar-icon">
                    <i class="icon icon-search-2"></i>
                </span>
                <span class="toolbar-label">Search</span>
            </a>
        </div>
        <div class="toolbar-item">
            <RouterLink to="/account">
                <span class="toolbar-icon">
                    <i class="icon icon-user-2"></i>
                </span>
                <span class="toolbar-label">Account</span>
            </RouterLink>
        </div>
        <div class="toolbar-item">
            <RouterLink to="/wishlist">
                <span class="toolbar-icon">
                    <i class="icon icon-hearth-3"></i>
                    <span class="toolbar-count">{{ wishlistCount }}</span>
                </span>
                <span class="toolbar-label">Wishlist</span>
            </RouterLink>
        </div>
        <div class="toolbar-item">
            <RouterLink to="/cart">
                <span class="toolbar-icon">
                    <i class="icon icon-cart-2"></i>
                    <span class="toolbar-count">{{ cartCount }}</span>
                </span>
                <span class="toolbar-label">Cart</span>
            </RouterLink>
        </div>
    </div>
    <!-- /Toolbar -->
</template>

<script>
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'

export default {
    name: 'ToolBar',
    setup() {
        const cartStore = useCartStore()
        const wishlistStore = useWishlistStore()
        
        const cartCount = ref(0)
        const wishlistCount = ref(0)

        onMounted(() => {
            // Update counts from stores
            cartCount.value = cartStore.totalItems
            wishlistCount.value = wishlistStore.totalItems

            // Subscribe to store changes
            cartStore.$subscribe((mutation, state) => {
                cartCount.value = state.totalItems
            })

            wishlistStore.$subscribe((mutation, state) => {
                wishlistCount.value = state.totalItems
            })
        })

        return {
            cartCount,
            wishlistCount
        }
    }
}
</script>

<style scoped>
.tf-toolbar-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

.toolbar-item {
    text-align: center;
}

.toolbar-item a {
    color: #666;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.toolbar-item a:hover,
.toolbar-item a.router-link-active {
    color: var(--primary-color);
}

.toolbar-icon {
    position: relative;
    font-size: 20px;
}

.toolbar-label {
    font-size: 12px;
}

.toolbar-count {
    position: absolute;
    top: -8px;
    right: -8px;
    background: var(--primary-color);
    color: white;
    font-size: 10px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (min-width: 768px) {
    .tf-toolbar-bottom {
        display: none;
    }
}
</style>