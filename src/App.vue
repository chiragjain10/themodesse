<template>
  <div id="wrapper">
    <TopBar />
    <Header />
    <router-view />
    <Footer />
  </div>
  <MobileView />
  <Login />
  <Register />
  <ResetPassword />
  <ShoppingCart />
  <QuickView />
  <Compare />
  <QuickAdd />
  <SizeGuide />
  <Search />
  <ToolBar />
  <Unavailable />
  <Toast />
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineAsyncComponent } from 'vue';
import { useQuickViewStore } from './stores/quickView';
import { useAppLoadingStore } from './stores/appLoading';
import { useCartStore } from './stores/cart';
import { useAuthStore } from './stores/auth';
import TopBar from './elements/header/topbar.vue';
import Header from './elements/header/header.vue';
import Footer from './elements/footer/footer.vue';

// Lazy load components
const MobileView = defineAsyncComponent(() => import('./elements/MobileView.vue'));
const Login = defineAsyncComponent(() => import('./elements/Login.vue'));
const Register = defineAsyncComponent(() => import('./elements/Register.vue'));
const ResetPassword = defineAsyncComponent(() => import('./elements/ResetPassword.vue'));
const ShoppingCart = defineAsyncComponent(() => import('./elements/ShoppingCart.vue'));
const QuickView = defineAsyncComponent(() => import('./elements/QuickView.vue'));
const Compare = defineAsyncComponent(() => import('./elements/Compare.vue'));
const QuickAdd = defineAsyncComponent(() => import('./elements/QuickAdd.vue'));
const SizeGuide = defineAsyncComponent(() => import('./elements/SizeGuide.vue'));
const Search = defineAsyncComponent(() => import('./elements/Search.vue'));
const ToolBar = defineAsyncComponent(() => import('./elements/ToolBar.vue'));
const Unavailable = defineAsyncComponent(() => import('./elements/unavailable.vue'));
const Toast = defineAsyncComponent(() => import('./components/Toast.vue'));

const quickView = useQuickViewStore();
const appLoading = useAppLoadingStore();
const cart = useCartStore();
const auth = useAuthStore();
let quickViewModal = null;

// Initialize modal and cart on mount
onMounted(async () => {
    const modalElement = document.getElementById('quickView');
    if (modalElement) {
        quickViewModal = new bootstrap.Modal(modalElement, {
            backdrop: 'static',
            keyboard: false
        });

        // Handle modal close event
        modalElement.addEventListener('hidden.bs.modal', () => {
            quickView.closeQuickView();
        });
    }

    // Initialize cart if user is authenticated
    if (auth.token) {
        try {
            await auth.fetchUser();
            if (auth.user?.id) {
                await cart.initialize();
            }
        } catch (error) {
            console.error('Error initializing cart:', error);
        }
    }
});

// Watch for auth changes to initialize cart
watch(() => auth.isAuthenticated, async (newValue) => {
    if (newValue && auth.user?.id) {
        try {
            await cart.initialize();
        } catch (error) {
            console.error('Error initializing cart after auth change:', error);
        }
    }
});

// Watch for user changes to initialize cart
watch(() => auth.user, async (newUser) => {
    if (newUser?.id) {
        try {
            await cart.initialize();
        } catch (error) {
            console.error('Error initializing cart after user change:', error);
        }
    }
}, { immediate: true });

// Watch for global loading state changes to hide the preloader
watch(() => appLoading.isLoading, (isLoading) => {
    if (!isLoading) {
        nextTick(() => {
            const preloadElement = document.getElementById('preload');
            if (preloadElement) {
                // Add a class to trigger fade out animation (assuming theme has one)
                preloadElement.classList.add('loaded');
                // Optionally remove the element after animation
                preloadElement.addEventListener('transitionend', () => {
                     preloadElement.style.display = 'none';
                     // Also add a class to the body to signal the page is loaded
                     document.body.classList.add('page-loaded');
                     // Or removeChild if you want to completely remove it
                });
            }
        });
    }
}, { immediate: true }); // Check immediately on mount

// Watch for modal state changes
watch(() => quickView.isOpen, (isOpen) => {
    if (!quickViewModal) return;

    if (isOpen) {
        quickViewModal.show();
    } else {
        quickViewModal.hide();
    }
});
</script>

<style>
/* Add any global styles here */

/* Basic styles for the preloader transition if theme doesn't provide */
#preload {
  transition: opacity 0.5s ease-out;
}

#preload.loaded {
  opacity: 0;
}
</style>