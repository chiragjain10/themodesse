<template>
    <div class="banner-section">
        <div class="swiper tf-swiper BannerTop-swiper" data-preview="1" data-tablet="1" data-mobile="1" data-space="0"
            data-pagination="1">
            <div class="swiper-wrapper">
                <div v-for="(slide, index) in slides" :key="index" class="swiper-slide">
                    <div class="slider_wrap">
                        <div class="sld-image">
                            <img :src="slide.image" :alt="slide.title" :width="slide.width || 1920"
                                :height="slide.height || 800" loading="eager" fetchpriority="high" class="lazyload"
                                @error="handleImageError">
                        </div>
                        <div class="sld-content">
                            <h2 class="title">{{ slide.title }}</h2>
                            <p class="text">{{ slide.text }}</p>
                            <RouterLink :to="slide.link" class="btn">{{ slide.buttonText }}</RouterLink>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sw-dot-default tf-sw-pagination"></div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import Swiper from 'swiper'
import { Autoplay, Pagination, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

import slider1 from "@/assets/images/banner1.jpg"
import slider2 from "@/assets/images/banner2.jpg"
import slider3 from "@/assets/images/banner3.jpg"

// Register Swiper modules
Swiper.use([Autoplay, Pagination, EffectFade])

const slides = ref([
    {
        image: slider1,
        alt: 'Clothes that feel like home',
        text: `<span class="fst-italic">Clothes</span> That <br> Feel Like Home`,
        link: '/shop',
        buttonText: 'explore collection',
        btnClass: 'style-white-2',
        textClass: ''
    },
    {
        image: slider2,
        alt: 'Move with grace',
        text: `<span class="fst-italic">Move</span> With <br> Grace`,
        link: '/shop',
        buttonText: 'discover more',
        btnClass: '',
        textClass: 'text-main'
    },
    {
        image: slider3,
        alt: 'Timeless simplicity',
        text: `<span class="fst-italic">Timeless</span><br> Simplicity`,
        link: '/shop',
        buttonText: 'shop now',
        btnClass: 'style-white-2',
        textClass: ''
    }
])

onMounted(async () => {
    await nextTick() // Wait till DOM is fully rendered
    new Swiper('.BannerTop-swiper', {
        modules: [Autoplay, Pagination, EffectFade],
        slidesPerView: 1,
        effect: 'fade',
        loop: true,
        speed: 1000,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.tf-sw-pagination',
            clickable: true
        }
    })
})
</script>

<style scoped>
.banner-section {
    position: relative;
    width: 100%;
    overflow: hidden;
}

.slider_wrap {
    position: relative;
    width: 100%;
}

.sld-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 41.67%;
    /* 800/1920 = 0.4167 */
    overflow: hidden;
}

.sld-image img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    will-change: transform;
}

.sld-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    z-index: 2;
    width: 100%;
    max-width: 800px;
    padding: 0 20px;
}

/* Optimize animations */
.title,
.text,
.btn {
    opacity: 0;
    transform: translateY(20px);
    animation: fadeInUp 0.6s ease forwards;
}

.title {
    animation-delay: 0.2s;
}

.text {
    animation-delay: 0.4s;
}

.btn {
    animation-delay: 0.6s;
}

@keyframes fadeInUp {
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Optimize swiper pagination */
:deep(.swiper-pagination-bullet) {
    width: 10px;
    height: 10px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 1;
}

:deep(.swiper-pagination-bullet-active) {
    background: #fff;
}
</style>