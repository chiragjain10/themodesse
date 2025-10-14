<template>
    <div class="tf-product-media-wrap sticky-top">
        <div class="thumbs-slider">
            <div class="flat-wrap-media-product">
                <div class="swiper tf-product-media-main" ref="mainGallery">
                    <button class="custom-arrow custom-arrow-left" @click="goToPrevImage" aria-label="Previous image"
                        type="button">
                        &#8592;
                    </button>
                    <button class="custom-arrow custom-arrow-right" @click="goToNextImage" aria-label="Next image"
                        type="button">
                        &#8594;
                    </button>
                    <div class="swiper-wrapper">
                        <div class="swiper-slide">
                            <a href="#" class="item" data-pswp-width="593px" data-pswp-height="744px">
                                <img class="tf-image-zoom lazyload" :data-zoom="props.product?.thumbnail_image"
                                    :data-src="props.product?.thumbnail_image" :src="props.product?.thumbnail_image"
                                    :alt="props.product?.name">
                            </a>
                        </div>
                        <div v-for="(image, index) in filteredGalleryImages" :key="index" class="swiper-slide">
                            <a href="#" class="item" data-pswp-width="593px" data-pswp-height="744px">
                                <img class="tf-image-zoom lazyload" :data-zoom="image" :data-src="image" :src="image"
                                    :alt="`${props.product?.name} - Image ${index + 2}`">
                            </a>
                        </div>
                    </div>
                    <div class="main-swiper-button-next"></div>
                    <div class="main-swiper-button-prev"></div>
                </div>
            </div>
            <div class="swiper tf-product-media-thumbs" ref="thumbsGallery" style="position:relative;">
                <button class="custom-arrow custom-arrow-left thumbs-arrow" @click="goToPrevThumb"
                    aria-label="Previous thumbnail" type="button">
                    &#8592;
                </button>
                <button class="custom-arrow custom-arrow-right thumbs-arrow" @click="goToNextThumb"
                    aria-label="Next thumbnail" type="button">
                    &#8594;
                </button>
                <div class="swiper-wrapper">
                    <div class="swiper-slide">
                        <div class="item">
                            <img :data-src="props.product?.thumbnail_image" :src="props.product?.thumbnail_image"
                                :alt="props.product?.name" class="lazyload">
                        </div>
                    </div>
                    <div v-for="(image, index) in filteredGalleryImages" :key="index" class="swiper-slide">
                        <div class="item">
                            <img :data-src="image" :src="image" :alt="`${props.product?.name} - Thumbnail ${index + 2}`"
                                class="lazyload">
                        </div>
                    </div>
                    <div class="thumbs-swiper-button-next"></div>
                    <div class="thumbs-swiper-button-prev"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import Swiper from 'swiper'
import { Navigation, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
});

const filteredGalleryImages = computed(() => {
    if (!props.product?.gallery_images) return [];
    // Remove only the first occurrence of the main image from gallery_images
    const images = [...props.product.gallery_images];
    const mainIndex = images.indexOf(props.product.thumbnail_image);
    if (mainIndex !== -1) images.splice(mainIndex, 1);
    // If all images are filtered out, fallback to original gallery_images
    return images.length > 0 ? images : props.product.gallery_images;
});

const mainGallery = ref(null)
const thumbsGallery = ref(null)

let thumbsSwiper = null
let mainSwiper = null

const initSwiper = () => {
    // Initialize thumbnail swiper
    thumbsSwiper = new Swiper(thumbsGallery.value, {
        modules: [Navigation, Thumbs],
        spaceBetween: 10,
        navigation: {
            nextEl: '.thumbs-swiper-button-next',
            prevEl: '.thumbs-swiper-button-prev',
        },
        slidesPerView: 4,
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
            320: {
                slidesPerView: 3,
                spaceBetween: 5
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 10
            }
        }
    })

    // Initialize main swiper
    mainSwiper = new Swiper(mainGallery.value, {
        modules: [Navigation, Thumbs],
        spaceBetween: 10,
        navigation: {
            nextEl: '.main-swiper-button-next',
            prevEl: '.main-swiper-button-prev',
        },
        thumbs: {
            swiper: thumbsSwiper
        },
        zoom: {
            maxRatio: 3,
            minRatio: 1
        }
    })
}

const handleImageError = (event) => {
    event.target.src = '/images/placeholder.jpg'
    console.error('Failed to load image:', event.target.src)
}

// Add methods for custom arrows
function goToPrevImage() {
    if (mainSwiper) mainSwiper.slidePrev();
}
function goToNextImage() {
    if (mainSwiper) mainSwiper.slideNext();
}

// Add methods for custom thumbnail arrows
function goToPrevThumb() {
    if (thumbsSwiper) thumbsSwiper.slidePrev();
}
function goToNextThumb() {
    if (thumbsSwiper) thumbsSwiper.slideNext();
}

onMounted(() => {
    initSwiper()
})

onBeforeUnmount(() => {
    if (mainSwiper) {
        mainSwiper.destroy(true, true)
    }
    if (thumbsSwiper) {
        thumbsSwiper.destroy(true, true)
    }
})
</script>

<style scoped>
.tf-product-media-wrap {
    position: relative;
}

.thumbs-slider {
    margin-bottom: 20px;
}

.tf-product-media-main {
    margin-bottom: 20px;
}

.tf-product-media-thumbs .swiper-slide {
    opacity: 0.4;
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.tf-product-media-thumbs .swiper-slide-thumb-active {
    opacity: 1;
}

.swiper-button-next,
.swiper-button-prev {
    color: #333;
    background: rgba(255, 255, 255, 0.8);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    transition: all 0.3s ease;
}

.swiper-button-next:hover,
.swiper-button-prev:hover {
    background: #333;
    color: #fff;
}

.swiper-button-next:after,
.swiper-button-prev:after {
    font-size: 18px;
}

.tf-image-zoom {
    width: 100%;
    height: auto;
    object-fit: cover;
}

.custom-arrow {
    position: absolute;
    top: 50%;
    z-index: 10;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    font-size: 20px;
    color: #333;
    cursor: pointer;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.custom-arrow-left {
    left: 8px;
}

.custom-arrow-right {
    right: 8px;
}

/* Adjust thumbs arrow vertical position if needed */
.thumbs-arrow {
    top: 40%;
}

@media (max-width: 767px) {
    .tf-product-media-wrap {
        margin-bottom: 30px;
    }

    .swiper-button-next,
    .swiper-button-prev {
        width: 30px;
        height: 30px;
    }

    .swiper-button-next:after,
    .swiper-button-prev:after {
        font-size: 14px;
    }
}
</style>