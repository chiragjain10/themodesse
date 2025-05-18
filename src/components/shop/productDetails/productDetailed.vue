<template>
    <div class="row mx-0">
        <div class="container" style="padding: 50px 10px;">
            <!-- Loading State -->
            <div v-if="loading" class="product-skeleton">
                <div class="row">
                    <div class="col-md-6">
                        <div class="skeleton-image"></div>
                    </div>
                    <div class="col-md-6">
                        <div class="skeleton-content">
                            <div class="skeleton-title"></div>
                            <div class="skeleton-text"></div>
                            <div class="skeleton-text"></div>
                            <div class="skeleton-price"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="error-container">
                <div class="error-message">
                    <i class="d-icon-exclamation-circle"></i>
                    <h3>Oops! Something went wrong</h3>
                    <p>{{ error }}</p>
                    <button @click="retryLoading" class="btn btn-primary">Try Again</button>
                </div>
            </div>

            <!-- Content State -->
            <template v-else>
                <div class="product product-single row mb-7">
                    <div class="col-md-6 sticky-sidebar-wrapper">
                        <div class="product-gallery pg-vertical sticky-sidebar" data-sticky-options="{'minWidth': 767}">
                            <MainImage :product="product" v-model:selectedImageIndex="selectedImageIndex" />
                            <SideImages :product="product" v-model:selectedImageIndex="selectedImageIndex" />
                        </div>
                    </div>
                    <div class="col-md-6">
                        <Detailed :product="product" />
                    </div>
                </div>

                <div class="tab tab-nav-simple product-tabs">
                    <TabNav :product="product" />
                    <TanContent :product="product" />
                </div>

                <Reviews :product="product" />
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getData } from '@/stores/getApi';
import MainImage from './mainImage.vue';
import SideImages from './sideImages.vue';
import Detailed from './details.vue';
import TabNav from './details/tabNav.vue';
import TanContent from './details/tabContent.vue';
import Reviews from './reviews/index.vue';

const selectedImageIndex = ref(0);
const route = useRoute();
const product = ref(null);
const loading = ref(true);
const error = ref(null);

const loadProduct = async () => {
    loading.value = true;
    error.value = null;
    const slug = route.params.slug;
    
    try {
        const data = await getData(`/api/products/${slug}`);
        if (!data.product) {
            throw new Error('Product not found');
        }
        product.value = data.product;
    } catch (err) {
        error.value = err.message || 'Failed to load product details. Please try again later.';
        console.error('Failed to load product details:', err);
    } finally {
        loading.value = false;
    }
};

const retryLoading = () => {
    loadProduct();
};

onMounted(() => {
    loadProduct();
});
</script>

<style scoped>
.product img {
    display: block;
    width: 100%;
    height: auto;
    margin-left: auto;
    margin-right: auto;
    background-color: #f1f1f1;
}

/* Loading Skeleton Styles */
.product-skeleton {
    padding: 2rem 0;
}

.skeleton-image {
    width: 100%;
    height: 400px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 4px;
}

.skeleton-content {
    padding: 1rem;
}

.skeleton-title {
    height: 32px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    margin-bottom: 1rem;
    border-radius: 4px;
}

.skeleton-text {
    height: 20px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    margin-bottom: 0.5rem;
    border-radius: 4px;
}

.skeleton-price {
    height: 24px;
    width: 120px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    margin-top: 1rem;
    border-radius: 4px;
}

/* Error State Styles */
.error-container {
    text-align: center;
    padding: 3rem 0;
}

.error-message {
    max-width: 400px;
    margin: 0 auto;
}

.error-message i {
    font-size: 3rem;
    color: #e14b4b;
    margin-bottom: 1rem;
}

.error-message h3 {
    margin-bottom: 1rem;
    color: #333;
}

.error-message p {
    color: #666;
    margin-bottom: 1.5rem;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
</style>