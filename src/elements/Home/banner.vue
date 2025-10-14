<template>
    <section class="premium-banner">
        <video ref="bannerVideoRef" class="banner-video" loop muted playsinline preload="metadata"
            @canplaythrough="handleVideoReady" @loadeddata="handleVideoLoaded" @error="handleVideoError">
            <source :src="BannerVideoMP4" type="video/mp4" />
            <source :src="BannerVideo" type="video/webm" />
            Your browser does not support the video tag.
        </video>
        <div class="banner-overlay"></div>
        <div class="banner-content d-none">
            <h1 class="banner-title">Discover the New Collection</h1>
            <p class="banner-subtitle">Timeless. Elegant. Uniquely You.</p>
            <RouterLink to="/shop" class="banner-btn">Shop Now <span>&rarr;</span></RouterLink>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BannerVideo from '@/assets/Banner Video.webm';
import BannerVideoMP4 from '@/assets/banner_video.mp4';

const bannerVideoRef = ref(null);
const isIOS = ref(false);

// Detect iOS
const detectIOS = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
};

function handleVideoReady() {
    if (bannerVideoRef.value) {
        bannerVideoRef.value.play().catch((error) => {
            console.log('Video play failed:', error);
        });
    }
}

function handleVideoLoaded() {
    console.log('Video loaded successfully');
}

function handleVideoError(error) {
    console.error('Video error:', error);
}

onMounted(() => {
    isIOS.value = detectIOS();
    
    if (bannerVideoRef.value) {
        // For iOS, we need to handle video differently
        if (isIOS.value) {
            bannerVideoRef.value.load();
            bannerVideoRef.value.play().catch((error) => {
                console.log('iOS video play failed:', error);
            });
        } else {
            bannerVideoRef.value.play().catch((error) => {
                console.log('Video play failed:', error);
            });
        }
    }
});
</script>


<style scoped>
.premium-banner {
    position: relative;
    width: 100vw;
    height: 80vh;
    min-height: 400px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.banner-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    object-fit: cover;
    z-index: 1;
    filter: brightness(0.7) saturate(1.2);
}

.banner-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100%;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 50%);
    z-index: 2;
}

.banner-content {
    position: relative;
    z-index: 3;
    color: #fff;
    text-align: center;
    max-width: 700px;
    margin: 0 auto;
    padding: 2rem;
}

.banner-title {
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 1rem;
    text-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

.banner-subtitle {
    font-size: 1.5rem;
    font-weight: 400;
    margin-bottom: 2rem;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
}

.banner-btn {
    display: inline-block;
    padding: 0.9rem 2.2rem;
    background: #fff;
    color: #222;
    font-size: 1.1rem;
    font-weight: 600;
    border-radius: 32px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
    text-decoration: none;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
}

.banner-btn:hover {
    background: #222;
    color: #fff;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.18);
}

@media (max-width: 768px) {
    .premium-banner {
        height: 45vh;
    }
}
</style>