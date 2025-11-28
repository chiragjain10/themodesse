<template>
    <!-- Preloader -->
    <div v-if="showPreloader" class="preload preload-container" id="preload">
        <div class="preload-bg"></div>
        <div class="preload-logo-anim">
            <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1487 237" width="120" height="19"
                class="modesse-logo">
                <use href="/src/assets/images/Logo.svg#Background" />
            </svg>
        </div>
    </div>

    <!-- Main App -->
    <div id="wrapper">
        <Header />
        <router-view />
        <Footer />
    </div>

    <!-- Lazy Loaded Components -->
    <MobileView />
    <Login />
    <Register />
    <ShoppingCart />
    <QuickView />
    <Search />
    <ToolBar />
    <Toast />

    <!-- WhatsApp Icon -->
    <!-- <a href="https://wa.me/919300125126" target="_blank" rel="noopener" class="whatsapp-sticky"
        aria-label="Chat on WhatsApp">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#fff" class="bi bi-whatsapp"
            viewBox="0 0 16 16">
            <path fill="#fff"
                d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
        </svg>
    </a> -->
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineAsyncComponent } from 'vue';
import { useQuickViewStore } from './stores/quickView';
import { useAppLoadingStore } from './stores/appLoading';
import { useCartStore } from './stores/cart';
import { useAuthStore } from './stores/auth';
import Header from './elements/header/header.vue';
import Footer from './elements/footer/footer.vue';

// Lazy load components for better performance
const MobileView = defineAsyncComponent(() => import('./elements/MobileView.vue'));
const Login = defineAsyncComponent(() => import('./elements/Login.vue'));
const Register = defineAsyncComponent(() => import('./elements/Register.vue'));
const ShoppingCart = defineAsyncComponent(() => import('./elements/ShoppingCart.vue'));
const QuickView = defineAsyncComponent(() => import('./elements/QuickView.vue'));
const Search = defineAsyncComponent(() => import('./elements/Search.vue'));
const ToolBar = defineAsyncComponent(() => import('./elements/ToolBar.vue'));
const Toast = defineAsyncComponent(() => import('./components/Toast.vue'));

const quickView = useQuickViewStore();
const appLoading = useAppLoadingStore();
const cart = useCartStore();
const auth = useAuthStore();
const showPreloader = ref(true);
let quickViewModal = null;

onMounted(async () => {
    try {
        // Initialize quick view modal
        const modalElement = document.getElementById('quickView');
        if (modalElement) {
            quickViewModal = new bootstrap.Modal(modalElement, {
                backdrop: 'static',
                keyboard: false
            });

            modalElement.addEventListener('hidden.bs.modal', () => {
                quickView.closeQuickView();
            });
        }

        // Initialize user and cart if authenticated
        if (auth.token) {
            await auth.fetchUser();
            if (auth.user?.id) {
                await cart.initialize();
            }
        }
    } catch (error) {
        console.error('Initialization error:', error);
    } finally {
        appLoading.stopLoading();
    }
});

// Watch for authentication changes
watch(() => auth.isAuthenticated, async (isAuthenticated) => {
    if (isAuthenticated && auth.user?.id) {
        try {
            await cart.initialize();
        } catch (error) {
            console.error('Cart initialization error:', error);
        }
    }
});

// Handle preloader transition
watch(() => appLoading.isLoading, (isLoading) => {
    if (!isLoading) {
        nextTick(() => {
            const preloadElement = document.getElementById('preload');
            if (preloadElement) {
                preloadElement.classList.add('loaded');
                preloadElement.addEventListener('transitionend', () => {
                    preloadElement.style.display = 'none';
                    document.body.classList.add('page-loaded');
                    showPreloader.value = false;
                }, { once: true });
            }
        });
    }
}, { immediate: true });

// Handle quick view modal
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
/* Preloader Styles */
#preload {
    position: fixed;
    z-index: 9999;
    inset: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: none;
    transition: opacity 0.5s, transform 0.7s cubic-bezier(.77, 0, .18, 1);
}

#preload .preload-bg {
    position: absolute;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background-image: url("https://www.transparenttextures.com/patterns/fabric-of-squares.png"),
        linear-gradient(120deg, #fdf6ee 0%, #f8fafc 100%);
    background-size: auto, cover;
    background-repeat: repeat, no-repeat;
    z-index: 1;
    animation: fabric-move 12s linear infinite;
}

@keyframes fabric-move {
    0% {
        background-position: 0 0, 0 0;
    }

    100% {
        background-position: 200px 100px, 0 0;
    }
}

#preload .preload-logo-anim {
    z-index: 2;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
}

.modesse-logo {
    width: 140px;
    height: auto;
    animation: logo-bounce 1.5s infinite alternate cubic-bezier(.77, 0, .18, 1),
        logo-shimmer 2.5s infinite linear;
    filter: drop-shadow(0 4px 24px rgba(0, 0, 0, 0.08));
}

@keyframes logo-shimmer {

    0%,
    100% {
        filter: drop-shadow(0 4px 24px rgba(0, 0, 0, 0.08)) brightness(1);
    }

    50% {
        filter: drop-shadow(0 4px 24px rgba(0, 0, 0, 0.12)) brightness(1.15);
    }
}

@keyframes logo-bounce {
    0% {
        transform: scale(1) translateY(0);
    }

    60% {
        transform: scale(1.08) translateY(-10px);
    }

    100% {
        transform: scale(1) translateY(0);
    }
}

#preload.loaded {
    opacity: 0;
    pointer-events: none;
    transform: translateY(100%);
}

/* WhatsApp Styles */
.whatsapp-sticky {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 2000;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #25D366;
    border-radius: 50%;
    box-shadow: 0 4px 16px #25d36644;
    transition: box-shadow 0.2s, transform 0.2s;
    animation: whatsapp-bounce 1.2s infinite alternate;
}

.whatsapp-sticky:hover {
    box-shadow: 0 8px 32px #25d36666;
    transform: scale(1.08);
}

@keyframes whatsapp-bounce {
    0% {
        transform: translateY(0);
    }

    60% {
        transform: translateY(-8px) scale(1.08);
    }

    100% {
        transform: translateY(0);
    }
}

.whatsapp-sticky svg {
    width: 38px;
    height: 38px;
    display: block;
}

@media (max-width: 600px) {
    .whatsapp-sticky {
        right: 12px;
        bottom: 12px;
        width: 44px;
        height: 44px;
    }

    .whatsapp-sticky svg {
        width: 28px;
        height: 28px;
    }
}
</style>