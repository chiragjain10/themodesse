<template>
    <section class="appear-animate banner_home_group" data-animation-options="{ 'delay': '.3s' }" style="margin: 50px 0;">
        <div class="container">
            <h2 class="title title-center mb-5">Our Categories</h2>
            <div class="row">

                <!-- Loader Shimmer Cards -->
                <template v-if="loading">
                    <div class="col-xs-6 col-lg-3 mb-4" v-for="n in 4" :key="n">
                        <div class="category shimmer-loader">
                            <div class="skeleton-img"></div>
                            <div class="skeleton-text mt-2"></div>
                        </div>
                    </div>
                </template>

                <!-- Real Data -->
                <template v-else>
                    <div v-if="!loading" class="owl-carousel owl-theme row owl-nav-full" data-owl-options='
                            {
                                "items": 4,
                                "nav": true,
                                "loop": true,
                                "dots": true,
                                "margin": 20,
                                "responsive": {
                                "0": { "items": 2 },
                                "768": { "items": 3 },
                                "992": { "items": 4, "dots": false, "nav": true 
                            }}'>
                        <div class="col-xs-6 col-lg-3 mb-4" v-for="category in categories" :key="category.slug">
                            <div class="category category-default1 category-absolute banner-radius overlay-zoom">
                                <router-link :to="`/shop/${category.slug}`">
                                    <figure class="category-media">
                                        <img :src="category?.image" :alt="category.name" width="280" height="280"
                                            style="background-color: #f1f1f1;" />
                                    </figure>
                                </router-link>
                                <div class="category-content">
                                    <h4 class="category-name font-weight-bold ls-l">
                                        <router-link :to="`/shop/${category.slug}`">{{ category.name }}</router-link>
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-center py-6">
                        <p>Loading best sellers...</p>
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getData } from '@/stores/getApi';
const categories = ref([]);
const loading = ref(true);

onMounted(async () => {
    try {
        const data = await getData('/api/home/categories');
        categories.value = data.categories;
        loading.value = false;
    } catch (err) {
        console.error(err);
        loading.value = true;
    }
});
</script>

<style scoped></style>