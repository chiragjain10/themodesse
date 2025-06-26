<template>
    <div class="tf-product-media-wrap sticky-top">
        <div class="thumbs-slider">
            <div class="flat-wrap-media-product">
                <!-- Main Gallery -->
                <div class="swiper tf-product-media-main" ref="mainGallery">
                    <div class="swiper-wrapper">
                        <!-- Main Image -->
                        <div class="swiper-slide">
                            <a :href="product?.thumbnail_image" 
                               target="_blank" 
                               class="item" 
                               data-pswp-width="593px" 
                               data-pswp-height="744px">
                                <img class="tf-image-zoom lazyload" 
                                     :data-zoom="product?.thumbnail_image" 
                                     :data-src="product?.thumbnail_image" 
                                     :src="product?.thumbnail_image" 
                                     :alt="product?.name">
                            </a>
                        </div>
                        <!-- Gallery Images -->
                        <div v-for="(image, index) in product?.gallery_images" 
                             :key="index" 
                             class="swiper-slide">
                            <a :href="image" 
                               target="_blank" 
                               class="item" 
                               data-pswp-width="593px" 
                               data-pswp-height="744px">
                                <img class="tf-image-zoom lazyload" 
                                     :data-zoom="image" 
                                     :data-src="image" 
                                     :src="image" 
                                     :alt="`${product?.name} - Image ${index + 2}`">
                            </a>
                        </div>
                    </div>
                    <div class="swiper-button-next"></div>
                    <div class="swiper-button-prev"></div>
                </div>
            </div>
            <!-- Thumbnail Gallery -->
            <div class="swiper tf-product-media-thumbs" ref="thumbsGallery">
                <div class="swiper-wrapper">
                    <!-- Main Image Thumbnail -->
                    <div class="swiper-slide">
                        <div class="item">
                            <img :data-src="product?.thumbnail_image" 
                                 :src="product?.thumbnail_image" 
                                 :alt="product?.name" 
                                 class="lazyload">
                        </div>
                    </div>
                    <!-- Gallery Image Thumbnails -->
                    <div v-for="(image, index) in product?.gallery_images" 
                         :key="index" 
                         class="swiper-slide">
                        <div class="item">
                            <img :data-src="image" 
                                 :src="image" 
                                 :alt="`${product?.name} - Thumbnail ${index + 2}`" 
                                 class="lazyload">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Swiper from 'swiper'
import { Navigation, Thumbs } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'

const productStore = useProductStore()
const { product } = storeToRefs(productStore)

const mainGallery = ref(null)
const thumbsGallery = ref(null)
let mainSwiper = null
let thumbsSwiper = null

const initSwiper = () => {
    // Initialize thumbnail swiper
    thumbsSwiper = new Swiper(thumbsGallery.value, {
        modules: [Navigation, Thumbs],
        spaceBetween: 10,
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
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
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