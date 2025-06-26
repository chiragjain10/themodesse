<template>
    <!-- Header -->
    <header class="tf-header bg-light">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-md-4 col-3 d-xl-none">
                    <a href="#mobileMenu" data-bs-toggle="offcanvas" class="btn-mobile-menu">
                        <span></span>
                    </a>
                </div>
                <div class="col-xl-2 col-md-4 col-6">
                    <RouterLink to="/" class="logo-site">
                        <img :src="Logo" alt="" style="width: 325px;">
                    </RouterLink>
                </div>
                <div class="col-xl-8 d-none d-xl-block">
                    <NavigationMenu />
                </div>
                <div class="col-xl-2 col-md-4 col-3">
                    <HeaderIcons />
                </div>
            </div>
        </div>
    </header>
    <!-- /Header -->
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/wishlist'
import { useAppLoadingStore } from '@/stores/appLoading'
import NavigationMenu from './NavigationMenu.vue'
import HeaderIcons from './HeaderIcons.vue'

import Logo from '@/assets/images/banner/Logo.png'

const wishlist = useWishlistStore()
const cart = useCartStore()
const auth = useAuthStore()
const appLoading = useAppLoadingStore()

// Initialize wishlist and cart
onMounted(async () => {
    try {
        // Set global loading to true when starting fetch
        appLoading.startLoading();

        // Fetch wishlist
        await wishlist.fetchWishlist()

        // Initialize cart and user data if authenticated
    if (auth.token) {
            await auth.fetchUser()
            if (auth.user?.id) {
                await cart.fetchCart()
            }
        }
    } catch (error) {
        console.error('Error initializing header data:', error)
    } finally {
        // Set global loading to false when done
        appLoading.stopLoading();
    }
})
</script>

<style scoped>
/* Add any specific styles for the header here */
</style>