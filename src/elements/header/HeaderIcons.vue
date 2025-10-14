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
            <RouterLink to="/track-order" class="nav-icon-item text-black link" title="Track Order">
                <i class="icon icon-truck"></i>
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
            <a href="#shoppingCart" class="nav-icon-item text-black link" data-bs-toggle="offcanvas"
                data-bs-target="#shoppingCart" aria-controls="shoppingCart">
                <i class="icon icon-cart"></i>
                <span v-if="cartCount > 0" class="count-notice">
                    <template>{{ cartCount }}</template>
                </span>
            </a>
        </li>
    </ul>

    <!-- Wishlist Loading Overlay -->
    <div v-if="wishlistLoading && showInitialLoader" class="wishlist-loading-overlay premium-preload"
        :class="{ 'exiting': loaderExiting }">
        <div class="preload-bg"></div>
        <div class="svgator-preloader">
            <svg :width="svgWidth" :height="svgHeight" :viewBox="`0 0 ${svgWidth} ${svgHeight}`" fill="none"
                xmlns="http://www.w3.org/2000/svg" class="svgator-svg">
                <!-- Animated border -->
                <rect :x="borderX" :y="borderY" :width="borderWidth" :height="borderHeight" rx="48" fill="none"
                    :stroke="'url(#borderGradient)'" stroke-width="8" :stroke-dasharray="borderLength"
                    :stroke-dashoffset="borderAnimDone ? 0 : borderLength"
                    style="transition: stroke-dashoffset 3s cubic-bezier(.77,0,.18,1);" />
                <!-- <defs>
                    <linearGradient id="borderGradient" :x1="borderX" :y1="borderY" :x2="borderX + borderWidth"
                        :y2="borderY + borderHeight" gradientUnits="userSpaceOnUse">
                        <stop stop-color="#e76d30" />
                        <stop offset="1" stop-color="#b8592a" />
                    </linearGradient>
                </defs> -->
                <!-- Logo (centered, sticker reveal, responsive) -->
                <g style="opacity: 1;">
                    <image :xlink:href="logoUrl" :x="(svgWidth - Math.max(logoWidth, minLogoWidth)) / 2"
                        :y="(svgHeight - Math.max(logoHeight, minLogoHeight)) / 2"
                        :width="Math.max(logoWidth, minLogoWidth)" :height="Math.max(logoHeight, minLogoHeight)"
                        class="logo-sticker-reveal" :class="{ 'revealed': logoRevealed }"
                        style="filter: drop-shadow(0 4px 24px rgba(0,0,0,0.08));" preserveAspectRatio="xMidYMid meet" />
                </g>
            </svg>
        </div>
    </div>

    <!-- Wishlist Success Toast -->
    <div v-if="showWishlistSuccess" class="wishlist-success-toast">
        <i class="icon icon-check"></i>
        <span>Added to wishlist successfully!</span>
    </div>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick, watchEffect } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useWishlistStore } from '@/stores/wishlist'
import logoUrl from '@/assets/images/themodesse_logo.png';

const cart = useCartStore()
const auth = useAuthStore()
const wishlist = useWishlistStore()
const router = useRouter()

const wishlistLoading = ref(false)
const showWishlistSuccess = ref(false)
let loaderStartTime = 0;
let loaderMinTimeout = null;
const logoEntered = ref(false);
const loaderExiting = ref(false);
const MIN_LOADER_DURATION = 800

const borderAnimDone = ref(false);
const logoRevealed = ref(false);
const showInitialLoader = ref(false);

const cartCount = computed(() => cart.count)

// Responsive SVG and logo sizes with 50px padding, mobile optimized
const minPaddingDesktop = 50;
const minPaddingMobile = 20;
const isMobile = computed(() => window.innerWidth < 600);
const logoWidth = computed(() => isMobile.value ? window.innerWidth * 0.7 : window.innerWidth * 0.35);
const logoHeight = computed(() => logoWidth.value * 0.38);
const minLogoWidth = 120;
const minLogoHeight = 40;
const svgWidth = computed(() => Math.max(logoWidth.value + (isMobile.value ? minPaddingMobile * 2 : minPaddingDesktop * 2), 220));
const svgHeight = computed(() => Math.max(logoHeight.value + (isMobile.value ? minPaddingMobile * 2 : minPaddingDesktop * 2), 80));
const borderX = computed(() => isMobile.value ? minPaddingMobile / 2 : minPaddingDesktop / 2);
const borderY = computed(() => isMobile.value ? minPaddingMobile / 2 : minPaddingDesktop / 2);
const borderWidth = computed(() => svgWidth.value - (isMobile.value ? minPaddingMobile : minPaddingDesktop));
const borderHeight = computed(() => svgHeight.value - (isMobile.value ? minPaddingMobile : minPaddingDesktop));
const borderLength = computed(() => 2 * (borderWidth.value + borderHeight.value - 2 * 48) + 2 * Math.PI * 48);

onMounted(() => {
    // Only show loader on first load after refresh (global variable)
    if (!window.__modesseLoaderShown) {
        console.log('Initial loader triggered');
        showInitialLoader.value = true;
        window.__modesseLoaderShown = true;
        // Trigger the loader sequence
        wishlistLoading.value = true;
        
        // Fallback: Hide loader after 10 seconds if it gets stuck
        setTimeout(() => {
            if (showInitialLoader.value) {
                console.log('Loader fallback triggered');
                wishlistLoading.value = false;
                showInitialLoader.value = false;
            }
        }, 10000);
    } else {
        console.log('Loader already shown, skipping');
    }
});

// Only show loading animation on initial page load, not on navigation
watch(() => wishlist.loading, (newValue) => {
    console.log('Wishlist loading changed:', newValue, 'showInitialLoader:', showInitialLoader.value);
    
    // Skip animation if not initial load
    if (!showInitialLoader.value) return;
    
    // Only run animation on the very first load when wishlist starts loading
    if (newValue && showInitialLoader.value) {
        console.log('Starting loader animation sequence');
        borderAnimDone.value = false;
        loaderExiting.value = false;
        logoRevealed.value = false;
        
        // Start the animation sequence
        setTimeout(() => {
            console.log('Logo reveal triggered');
            logoRevealed.value = true;
            // 2. Border animation (2s)
            setTimeout(() => {
                console.log('Border animation triggered');
                borderAnimDone.value = true;
                // 3. Exit (0.5s)
                setTimeout(() => {
                    console.log('Loader exit triggered');
                    loaderExiting.value = true;
                    setTimeout(() => {
                        console.log('Loader cleanup completed');
                        wishlistLoading.value = false;
                        showInitialLoader.value = false;
                    }, 500);
                }, 2000);
            }, 2500);
        }, 0);
    }
});

// Watch for when wishlist loading completes
watch(() => wishlist.loading, (newValue, oldValue) => {
    console.log('Wishlist loading completion check:', { newValue, oldValue, showInitialLoader: showInitialLoader.value, loaderExiting: loaderExiting.value });
    
    // If loading just finished and we're still showing the initial loader
    if (!newValue && oldValue && showInitialLoader.value) {
        console.log('Wishlist loading completed, ensuring animation cleanup');
        // Ensure we complete the animation sequence
        if (!loaderExiting.value) {
            setTimeout(() => {
                console.log('Forcing loader exit');
                loaderExiting.value = true;
                setTimeout(() => {
                    console.log('Forcing loader cleanup');
                    wishlistLoading.value = false;
                    showInitialLoader.value = false;
                }, 500);
            }, 1000);
        }
    }
});

// Hide footer when preloader is active
watchEffect(() => {
    if (wishlistLoading.value && showInitialLoader.value) {
        document.body.classList.add('preloader-active');
    } else {
        document.body.classList.remove('preloader-active');
    }
});
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

/* Add premium preloader styles and new animation */
.premium-preload {
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
    transition: opacity 0.5s, transform 0.5s cubic-bezier(.77, 0, .18, 1);
}

.premium-preload.exiting {
    opacity: 0;
    pointer-events: none;
    transform: translateY(100%);
    transition: opacity 0.5s, transform 0.5s cubic-bezier(.77, 0, .18, 1);
}

.premium-preload .preload-bg {
    position: absolute;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background-image: url("https://www.transparenttextures.com/patterns/fabric-of-squares.png"), linear-gradient(120deg, #fdf6ee 0%, #f8fafc 100%);
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

/* Responsive loader for mobile */
.svgator-preloader {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    z-index: 2;
    position: relative;
}

.svgator-svg {
    max-width: 98vw;
    max-height: 90vh;
}

@media (max-width: 600px) {
    .svgator-preloader {
        align-items: center;
        padding-top: 0;
    }

    .svgator-svg {
        max-width: 98vw;
        max-height: 60vw;
    }
}

.premium-preload .preload-logo-anim {
    z-index: 2;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
}

.logo-anim-sequence {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.logo-mask-wrap {
    position: relative;
    width: 140px;
    height: 19px;
    overflow: hidden;
    /* Start fully clipped */
    -webkit-clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
    clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
    transition: clip-path 2s cubic-bezier(.77, 0, .18, 1), -webkit-clip-path 2s cubic-bezier(.77, 0, .18, 1);
}

.logo-mask-wrap.revealed {
    -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}

.modesse-logo {
    width: 140px;
    height: 19px;
    filter: drop-shadow(0 4px 24px rgba(0, 0, 0, 0.08));
    position: relative;
    display: block;
}

.logo-border-anim {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    width: 200px;
    height: 50px;
    z-index: 2;
}

.logo-shadow {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%) scale(1);
    width: 140px;
    height: 19px;
    border-radius: 16px;
    background: radial-gradient(ellipse at center, rgba(180, 120, 60, 0.18) 0%, rgba(0, 0, 0, 0.10) 60%, rgba(0, 0, 0, 0.0) 100%);
    filter: blur(8px);
    opacity: 0;
    animation: shadow-pop 0.5s forwards;
    animation-delay: 0s;
}

.logo-mask-wrap.revealed .logo-shadow {
    opacity: 1;
    animation: shadow-pop 0.5s forwards;
}

@keyframes shadow-pop {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.8);
    }

    100% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

.logo-sticker-reveal {
    /* Start with a diagonal clip-path (hidden) */
    clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
    -webkit-clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
    transition: clip-path 3.5s cubic-bezier(.77, 0, .18, 1), -webkit-clip-path 3.5s cubic-bezier(.77, 0, .18, 1);
}

.logo-sticker-reveal.revealed {
    /* Reveal diagonally from left-top to right-bottom */
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    -webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
</style>
<style>
/* Hide sticky footer when preloader is active */
body.preloader-active .footer-sticky,
body.preloader-active .mobile-footer,
body.preloader-active .tf-toolbar-bottom {
    display: none !important;
}
</style>