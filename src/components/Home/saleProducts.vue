<template>
    <section class="product-widget-wrapper pb-2 pb-md-10 appear-animate">
        <div class="container">
            <div class="row">
                <div class="col-lg-3 col-sm-6 mb-4">
                    <div class="widget widget-products appear-animate" data-animation-options="{
                                    'name': 'fadeInLeftShorter',
                                    'delay': '.5s'
                                }">
                        <h4 class="widget-title border-no lh-1 font-weight-bold">Sale Products</h4>
                        <div class="products-col">
                            <div v-if="!loading" class="product product-list-sm" v-for="product in saleProducts" :key="product.p_id">
                                <figure class="product-media">
                                    <RouterLink :to="`/product/${product.slug}`">
                                        <img :src="product.image" :alt="product.name" width="100"
                                            height="114" style="background-color: #f2f3f5;" />
                                    </RouterLink>
                                </figure>
                                <div class="product-details">
                                    <h3 class="product-name">
                                        <RouterLink :to="`/product/${product.slug}`">{{ product.name }}</RouterLink>
                                    </h3>
                                    <div class="product-price">
                                        <span class="price">₹{{ product.sale_price }}</span>
                                    </div>
                                    <div class="ratings-container">
                                        <div class="ratings-full">
                                            <span class="ratings" :style="{ width: (product.average_rating * 20) + '%' }"></span>
                                            <span class="tooltiptext tooltip-top"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Loading Skeleton -->
                            <div v-else class="product product-list-sm shimmer-loader" v-for="n in 3" :key="n">
                                <div class="skeleton-img" style="width: 100px; height: 114px;"></div>
                                <div class="skeleton-text mt-2"></div>
                                <div class="skeleton-text mt-2" style="width: 70%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6 mb-4">
                    <div class="widget widget-products appear-animate" data-animation-options="{
                                    'name': 'fadeInLeftShorter',
                                    'delay': '.3s'
                                }">
                        <h4 class="widget-title border-no lh-1 font-weight-bold">Latest Products</h4>
                        <div class="products-col">
                            <div v-if="!loading" class="product product-list-sm" v-for="product in latestProducts" :key="product.p_id">
                                <figure class="product-media">
                                    <RouterLink :to="`/product/${product.slug}`">
                                        <img :src="product.image" :alt="product.name" width="100"
                                            height="114" style="background-color: #f2f3f5;" />
                                    </RouterLink>
                                </figure>
                                <div class="product-details">
                                    <h3 class="product-name">
                                        <RouterLink :to="`/product/${product.slug}`">{{ product.name }}</RouterLink>
                                    </h3>
                                    <div class="product-price">
                                        <span class="price">₹{{ product.sale_price }}</span>
                                    </div>
                                    <div class="ratings-container">
                                        <div class="ratings-full">
                                            <span class="ratings" :style="{ width: (product.average_rating * 20) + '%' }"></span>
                                            <span class="tooltiptext tooltip-top"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Loading Skeleton -->
                            <div v-else class="product product-list-sm shimmer-loader" v-for="n in 3" :key="n">
                                <div class="skeleton-img" style="width: 100px; height: 114px;"></div>
                                <div class="skeleton-text mt-2"></div>
                                <div class="skeleton-text mt-2" style="width: 70%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6 mb-4">
                    <div class="widget widget-products appear-animate" data-animation-options="{
                                    'name': 'fadeInRightShorter',
                                    'delay': '.3s'
                                }">
                        <h4 class="widget-title border-no lh-1 font-weight-bold">Best of the Week</h4>
                        <div class="products-col">
                            <div v-if="!loading" class="product product-list-sm" v-for="product in bestOfWeek" :key="product.p_id">
                                <figure class="product-media">
                                    <RouterLink :to="`/product/${product.slug}`">
                                        <img :src="product.image" :alt="product.name" width="100"
                                            height="114" style="background-color: #f2f3f5;" />
                                    </RouterLink>
                                </figure>
                                <div class="product-details">
                                    <h3 class="product-name">
                                        <RouterLink :to="`/product/${product.slug}`">{{ product.name }}</RouterLink>
                                    </h3>
                                    <div class="product-price">
                                        <span class="price">₹{{ product.sale_price }}</span>
                                    </div>
                                    <div class="ratings-container">
                                        <div class="ratings-full">
                                            <span class="ratings" :style="{ width: (product.average_rating * 20) + '%' }"></span>
                                            <span class="tooltiptext tooltip-top"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Loading Skeleton -->
                            <div v-else class="product product-list-sm shimmer-loader" v-for="n in 3" :key="n">
                                <div class="skeleton-img" style="width: 100px; height: 114px;"></div>
                                <div class="skeleton-text mt-2"></div>
                                <div class="skeleton-text mt-2" style="width: 70%"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-sm-6 mb-4">
                    <div class="widget widget-products appear-animate" data-animation-options="{
                                    'name': 'fadeInRightShorter',
                                    'delay': '.5s'
                                }">
                        <h4 class="widget-title border-no lh-1 font-weight-bold">Popular</h4>
                        <div class="products-col">
                            <div v-if="!loading" class="product product-list-sm" v-for="product in popularProducts" :key="product.p_id">
                                <figure class="product-media">
                                    <RouterLink :to="`/product/${product.slug}`">
                                        <img :src="product.image" :alt="product.name" width="100"
                                            height="114" style="background-color: #f2f3f5;" />
                                    </RouterLink>
                                </figure>
                                <div class="product-details">
                                    <h3 class="product-name">
                                        <RouterLink :to="`/product/${product.slug}`">{{ product.name }}</RouterLink>
                                    </h3>
                                    <div class="product-price">
                                        <span class="price">₹{{ product.sale_price }}</span>
                                    </div>
                                    <div class="ratings-container">
                                        <div class="ratings-full">
                                            <span class="ratings" :style="{ width: (product.average_rating * 20) + '%' }"></span>
                                            <span class="tooltiptext tooltip-top"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Loading Skeleton -->
                            <div v-else class="product product-list-sm shimmer-loader" v-for="n in 3" :key="n">
                                <div class="skeleton-img" style="width: 100px; height: 114px;"></div>
                                <div class="skeleton-text mt-2"></div>
                                <div class="skeleton-text mt-2" style="width: 70%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getData } from '@/stores/getApi';

const loading = ref(true);
const saleProducts = ref([]);
const latestProducts = ref([]);
const bestOfWeek = ref([]);
const popularProducts = ref([]);

onMounted(async () => {
    try {
        const response = await getData('/api/home');
        saleProducts.value = response.topSales?.data || [];
        latestProducts.value = response.newArrivals?.data || [];
        bestOfWeek.value = response.topRatings?.data || [];
        popularProducts.value = response.topSales?.data || []; // Using top sales as popular products
    } catch (error) {
        console.error('Error loading products:', error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.product-list-sm {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.product-list-sm:hover {
    background-color: #f8f9fa;
}

.product-media {
    margin-right: 1rem;
}

.product-media img {
    border-radius: 4px;
    transition: transform 0.3s ease;
}

.product-list-sm:hover .product-media img {
    transform: scale(1.1);
}

.product-details {
    flex: 1;
}

.product-name {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.product-name a {
    color: #333;
    transition: color 0.3s ease;
}

.product-name a:hover {
    color: #c96;
}

.product-price {
    font-weight: 600;
    color: #c96;
    margin-bottom: 0.5rem;
}

.ratings-container {
    font-size: 0.8rem;
}

/* Loading Skeleton */
.shimmer-loader {
    background: #f6f7f8;
    border-radius: 4px;
    overflow: hidden;
}

.skeleton-img {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

.skeleton-text {
    height: 20px;
    margin: 10px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
</style>