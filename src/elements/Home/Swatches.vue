<template>
    <section class="swatches-section container mx-auto">
        <div class="sect-top wow fadeInUp animated" style="visibility: visible; animation-name: fadeInUp;">
            <h3 class="s-title text-capitalize d-md-none ms-md-5 ">Our Swatches</h3>
            <h1 class="s-title text-capitalize d-none d-md-block ms-md-5">Our Swatches</h1>
            <div class="group-btn-slider type-2">
                <div class="nav-prev-swiper tf-sw-nav" :class="{ 'swiper-button-disabled': currentSlide === 0 }"
                    @click="prevSlide">
                    <i class="icon-arrow-left"></i>
                </div>
                <div class="nav-next-swiper tf-sw-nav"
                    :class="{ 'swiper-button-disabled': currentSlide === totalSlides - 1 }" @click="nextSlide">
                    <i class="icon-arrow-right"></i>
                </div>
            </div>
        </div>
        <swiper :slides-per-view="3" :space-between="20" :loop="true"
            :breakpoints="{ 0: { slidesPerView: 2 }, 769: { slidesPerView: 3 } }" class="swatches-swiper"
            @swiper="onSwiper" @slideChange="onSlideChange">
            <swiper-slide v-for="(img, idx) in swatchImages" :key="idx">
                <div class="swatch-slide">
                    <img :src="img" :alt="`Swatch ${idx + 1}`" class="swatch-img" />
                </div>
            </swiper-slide>
        </swiper>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import 'swiper/swiper-bundle.css';

// Reactive variables for navigation
const currentSlide = ref(0);
const totalSlides = ref(35);
const swiperInstance = ref(null);

// Dynamically import all 35 swatch images using Vite's import.meta.glob
const images = import.meta.glob('@/assets/images/swatches/*.jpg', { eager: true, import: 'default' });

// Get the images in order from 1.jpg to 35.jpg
const swatchImages = Array.from({ length: 35 }, (_, i) => {
    const path = `/src/assets/images/swatches/${i + 1}.jpg`;
    return images[path] || images[`/src/assets/images/swatches/${i + 1}.jpg`];
});

// Navigation functions
const prevSlide = () => {
    if (swiperInstance.value) {
        swiperInstance.value.slidePrev();
    }
};

const nextSlide = () => {
    if (swiperInstance.value) {
        swiperInstance.value.slideNext();
    }
};

// Swiper event handlers
const onSwiper = (swiper) => {
    swiperInstance.value = swiper;
    totalSlides.value = swiper.slides.length;
};

const onSlideChange = (swiper) => {
    currentSlide.value = swiper.realIndex;
};
</script>

<style scoped>
.swatches-section {
    padding: 3rem 0;
    border-radius: 2rem;
    margin: 2rem 0;
}

@media (max-width: 768px) {
    .swatches-section {
        padding: 2rem 0;
        margin: 1rem 0;
    }
}

.swatches-swiper {
    width: 90%;
    margin: 0 auto;
}

.swatch-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 250px;
    border-radius: 1rem;
    transition: transform 0.2s;
}

.swatch-slide:hover {
    transform: scale(1.04);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.10);
}

.swatch-img {
    max-width: 100%;
    border-radius: 0.7rem;
    object-fit: cover;
}
</style>