<template>
    <section class="flat-spacing-3 categories-section">
        <div class="container">
            <div class="sect-top center text-center wow fadeInUp">
                <h2 class="s-title font-2"><span class="fst-italic">Our</span> Categories</h2>
                <p class="s-sub-title">
                    Discover our collection of timeless fashion, crafted for elegance and comfort.
                    <br class="d-none d-xl-block">
                    Let your style speak for you with Modesse.
                </p>
            </div>
            <div dir="ltr" class="swiper tf-swiper max-width_1 wow fadeInUp" data-preview="6" data-tablet="4"
                data-mobile-sm="3" data-mobile="2" data-space-lg="64" data-space-md="30" data-space="15"
                data-pagination="2" data-pagination-sm="3" data-pagination-md="4" data-pagination-lg="6">
                <div :class="loading ? 'swiper-wrapper d-block' : 'swiper-wrapper'">
                    <div v-if="loading">
                        <div class="row">
                            <div class="col-xs-6 col-lg-3 mb-4" v-for="n in 6" :key="n">
                                <div class="category shimmer-loader">
                                    <div class="skeleton-img"></div>
                                    <div class="skeleton-text mt-2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else-if="categories.length > 0" v-for="(category, index) in categories" :key="category.id"
                        class="swiper-slide">
                        <RouterLink :to="`/shop/${category.slug}`" class="wg-cls hover-img wow fadeInUp" :data-wow-delay="`${index * 0.1}s`">
                            <div class="image img-style">
                                <img :src="category.image" :data-src="category.image" :alt="category.name" class="lazyload">
                            </div>
                            <h3 class="name link">{{ category.name }} <span class="count text-caption">{{ category.product_count }}</span></h3>
                        </RouterLink>
                    </div>
                    <div v-else class="text-center py-4">No categories available.</div>
                </div>
                <div class="sw-dot-default tf-sw-pagination"></div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import Swiper from 'swiper';
import { getData } from '@/utils/api';

const loading = ref(true);
const categories = ref([]);

const loadCategories = async () => {
    loading.value = true;
    try {
        const response = await getData('/api/home/categories');

        if (response && response.data && response.data.categories) {
            categories.value = response.data.categories;
            // Wait for DOM to update
            await nextTick();
            // Initialize swiper after data is loaded
            setTimeout(() => {
                initSwiper();
            }, 100);
        } else {
            console.error('Invalid response format:', response);
            categories.value = [];
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        categories.value = [];
    } finally {
        loading.value = false;
    }
};

// Fetch categories data here
onMounted(async () => {
    await loadCategories();
});

const initSwiper = () => {
    const swiper = new Swiper('.categories-section .tf-swiper', {
        slidesPerView: 6,
        spaceBetween: 64,
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 15,
            },
            576: {
                slidesPerView: 3,
                spaceBetween: 15,
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
            1200: {
                slidesPerView: 6,
                spaceBetween: 64,
            }
        },
        pagination: {
            el: '.tf-sw-pagination',
            clickable: true,
        },
    });
};
</script>

<style scoped>
.image img {
    width: 100%;
    height: auto;
    object-fit: cover;
    aspect-ratio: 1;
}

.shimmer-loader {
    background: #f6f7f8;
    background-image: linear-gradient(
        to right,
        #f6f7f8 0%,
        #edeef1 20%,
        #f6f7f8 40%,
        #f6f7f8 100%
    );
    background-repeat: no-repeat;
    background-size: 800px 104px;
    animation: shimmer 1.5s linear infinite;
}

@keyframes shimmer {
    0% {
        background-position: -468px 0;
    }
    100% {
        background-position: 468px 0;
    }
}
</style>