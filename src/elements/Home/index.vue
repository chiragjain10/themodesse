<template>
    <Banner />
    <Collection />
    <BestSeller />
    <BannerImageText />
    <BannerFresh :newArrivals="newArrivals" />
    <Collection2 :collections="collections" />
    <Lookbook :lookbookProducts="topSales" />
    <Testimonial :reviews="reviews" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Banner from './banner.vue';
import BestSeller from './best-seller.vue';
import Collection from './collection.vue';
import BannerImageText from './banner-image-text.vue';
import BannerFresh from './banner-fresh.vue';
import Collection2 from './collection2.vue';
import Lookbook from './lookbook.vue';
import Testimonial from './testimonial.vue';

const newArrivals = ref([]);
const collections = ref([]);
const topSales = ref([]);
const reviews = ref([]);
const offers = ref([]);

const fetchHomeData = async () => {
    try {
        const response = await axios.get('/api/home');
        newArrivals.value = response.data.newArrivals;
        collections.value = response.data.collections;
        topSales.value = response.data.topSales;
        reviews.value = response.data.topRatings
            .flatMap(product =>
                (product.reviews || [])
                    .filter(review => review.user && review.user.name)
                    .map(review => ({
                        ...review,
                        product: {
                            id: product.id,
                            name: product.name,
                            slug: product.slug,
                            image: product.image,
                            sale_price: product.sale_price
                        }
                    }))
            );
    } catch (error) {
        console.error('Error fetching home data:', error);
    }
};

const fetchOffers = async () => {
    try {
        const response = await axios.get('/api/offers');
        offers.value = response.data;
    } catch (error) {
        offers.value = [];
    }
};

const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

onMounted(() => {
    fetchHomeData();
    fetchOffers();
});
</script>