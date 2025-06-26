<template>
    <div class="product-grid">
        <div v-if="loading" class="loading-spinner">
            <div class="spinner"></div>
        </div>
        <div v-else-if="products.length === 0" class="no-products">
            <p>No products found</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="product in products" :key="product.id" class="product-card">
                <router-link :to="`/product/${product.slug}`" class="block">
                    <div class="card_product-wrapper">
                        <RouterLink :to="`/product/${product.slug}`" class="product-img">
                            <img :src="product.thumbnail_image" :data-src="product.thumbnail_image" :alt="product.name"
                                class="lazyload img-product">
                            <img v-if="product.thumbnail_image" :src="product.thumbnail_image" :data-src="product.thumbnail_image"
                                :alt="product.name" class="lazyload img-hover">
                        </RouterLink>
                        <ul class="list-product-btn">
                            <li class="wishlist">
                                <a href="javascript:void(0);" class="hover-tooltip tooltip-left box-icon"
                                    @click="addToWishlist(product)">
                                    <span class="icon icon-heart-2"></span>
                                    <span class="tooltip">Add to Wishlist</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="product-details">
                        <div class="product-cat">
                            <RouterLink :to="`/shop?category=${product?.category?.slug}`">{{ product?.category?.name }}
                            </RouterLink>
                        </div>
                        <h3 class="product-name">
                            <RouterLink :to="`/product/${product.slug}`">{{ product.name }}</RouterLink>
                        </h3>
                        <div class="product-price d-flex align-items-center gap-2">
                            <ins class="new-price text-primary fw-bold fs-5 me-2">₹{{ product.sale_price }}</ins>
                            <del v-if="product.discount_perc > 0" class="old-price text-muted fs-6 me-2">₹{{ product.price }}</del>
                            <span v-if="product.discount_perc > 0" class="badge bg-danger ms-1">-{{ product.discount_perc }}%</span>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>

        <!-- Pagination -->
        <div v-if="pagination && pagination.total > pagination.per_page" class="pagination mt-8">
            <div class="flex justify-center space-x-2">
                <button 
                    @click="$emit('page-change', pagination.current_page - 1)"
                    :disabled="!pagination.prev_page_url"
                    class="px-4 py-2 border rounded"
                    :class="{'opacity-50 cursor-not-allowed': !pagination.prev_page_url}"
                >
                    Previous
                </button>
                
                <template v-for="link in pagination.links" :key="link.label">
                    <button 
                        v-if="link.url"
                        @click="$emit('page-change', getPageNumber(link.url))"
                        class="px-4 py-2 border rounded"
                        :class="{'bg-blue-500 text-white': link.active}"
                    >
                        <span v-html="link.label"></span>
                    </button>
                    <span v-else class="px-4 py-2" v-html="link.label"></span>
                </template>

                <button 
                    @click="$emit('page-change', pagination.current_page + 1)"
                    :disabled="!pagination.next_page_url"
                    class="px-4 py-2 border rounded"
                    :class="{'opacity-50 cursor-not-allowed': !pagination.next_page_url}"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
    products: {
        type: Array,
        required: true
    },
    loading: {
        type: Boolean,
        default: false
    },
    pagination: {
        type: Object,
        required: true
    }
});

defineEmits(['page-change']);

// Watch for products changes
watch(() => props.products, (newProducts) => {
    console.log('Products updated:', newProducts.length);
}, { immediate: true });

const getPageNumber = (url) => {
    if (!url) return null;
    const params = new URLSearchParams(url.split('?')[1]);
    return parseInt(params.get('page')) || 1;
};
</script>

<style scoped>
.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
}

.spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.no-products {
    text-align: center;
    padding: 2rem;
    color: #666;
}

.product-card {
    border: 1px solid #eee;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s;
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.pagination button {
    transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
    background-color: #f3f4f6;
}

.product-price {
    margin-top: 8px;
    margin-bottom: 8px;
}
.new-price {
    font-size: 1.2rem;
    font-weight: bold;
    color: #007bff;
}
.old-price {
    color: #888;
    text-decoration: line-through;
    font-size: 1rem;
}
.badge.bg-danger {
    background: #dc3545;
    color: #fff;
    font-size: 0.9rem;
    padding: 0.3em 0.7em;
    border-radius: 0.5em;
    font-weight: 500;
}
</style>