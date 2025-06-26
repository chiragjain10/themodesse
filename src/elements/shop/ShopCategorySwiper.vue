<template>
    <!-- Category -->
    <div class="flat-spacing-5">
        <div class="container-6">
            <div class="swiper tf-swiper" data-preview="5" data-tablet="4" data-mobile-sm="3" data-mobile="2" data-space-lg="30"
            data-space-md="20" data-space="15" data-pagination="2" data-pagination-sm="3" data-pagination-md="4" data-pagination-lg="5">
                <div class="swiper-wrapper">
                     <div v-if="loading" class="text-center py-4">
                        <Loader />
                    </div>
                    <div v-else-if="categories.length > 0" v-for="(category, index) in categories" :key="category.id"
                        class="swiper-slide">
                        <RouterLink :to="`/shop/${category.slug}`" class="box_collection--V01 style_2 hover-img">
                            <div class="image img-style">
                                <img :src="category.image" :data-src="category.image" :alt="category.name"
                                    class=" lazyload">
                            </div>
                            <div class="name-cls link">
                                <span class="h5 fw-normal text-uppercase">
                                    {{ category.name }}
                                </span>
                            </div>
                        </RouterLink>
                    </div>
                     <div v-else class="text-center py-4">No categories available.</div>
                </div>
                <div class="sw-dot-default d-flex d-xl-none tf-sw-pagination"></div>
            </div>
        </div>
    </div>
    <!-- /Category -->
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import { getData } from '@/stores/getApi';
import Swiper from 'swiper';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import Loader from '@/components/Loader.vue';

Swiper.use([Pagination, Navigation, Autoplay]);

const categories = ref([]);
const loading = ref(true);
let categorySwiper = null;

const loadCategories = async () => {
    loading.value = true;
    try {
        const response = await getData('/api/home/categories');
        categories.value = response.categories || [];
        nextTick(() => {
            initSwiper();
        });
    } catch (error) {
        console.error('Error loading categories for swiper:', error);
        categories.value = [];
    } finally {
        loading.value = false;
    }
};

const initSwiper = () => {
    if (categorySwiper) {
        categorySwiper.destroy(true, true);
    }
     if (categories.value.length > 0) {
        categorySwiper = new Swiper('.ShopCategorySwiper .tf-swiper', {
            slidesPerView: 5,
            spaceBetween: 30,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.ShopCategorySwiper .tf-sw-pagination',
                clickable: true,
            },
            breakpoints: {
                320: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                },
                480: {
                    slidesPerView: 3,
                    spaceBetween: 15,
                },
                768: {
                    slidesPerView: 4,
                    spaceBetween: 20,
                },
                1024: {
                    slidesPerView: 5,
                    spaceBetween: 30,
                },
            },
        });
    }
};

onMounted(() => {
    loadCategories();
});
</script>

<style scoped></style> 