<template>
    <div class="col-12">
        <div v-if="loading" class="product-grid">
            <div v-for="n in 6" :key="n" class="product-card shimmer-loader">
                <div class="product-img-wrap skeleton-img"></div>
                <div class="product-info">
                    <div class="skeleton-text" style="width: 60%; height: 18px; margin-bottom: 8px;"></div>
                    <div class="skeleton-text" style="width: 40%; height: 14px;"></div>
                </div>
            </div>
        </div>
        <div v-else-if="products.length === 0" class="no-products">
            <p>No products found</p>
        </div>
        <div v-else class="product-grid">
            <div v-for="product in products" :key="product.id" class="product-card">
                <router-link :to="`/product/${product.slug}`" class="product-img-wrap">
                    <img v-lazy="product.thumbnail_image" :alt="product.name" class="product-img" />
                </router-link>
                <div class="product-info">
                    <div class="product-name">
                        <router-link :to="`/product/${product.slug}`">{{ product.name }}</router-link>
                    </div>
                    <div class="product-price">
                        ₹{{ product.price }}
                    </div>
                </div>
            </div>
        </div>
        <div v-if="pagination && pagination.total > pagination.per_page" class="pagination mt-5">
            <div class="flex justify-center space-x-2">
                <button @click="goToPage(props.pagination.current_page - 1)" :disabled="!pagination.prev_page_url"
                    class="px-4 py-2 border rounded"
                    :class="{ 'opacity-50 cursor-not-allowed': !pagination.prev_page_url }">
                    Previous
                </button>
                <template v-for="link in pagination.links" :key="link.label">
                    <button v-if="link.url" @click="goToPageByUrl(link.url)" class="px-4 py-2 border rounded"
                        :class="{ 'bg-blue-500 text-white': link.active }">
                        <span v-html="link.label"></span>
                    </button>
                    <span v-else class="px-4 py-2" v-html="link.label"></span>
                </template>
                <button @click="goToPage(props.pagination.current_page + 1)" :disabled="!pagination.next_page_url"
                    class="px-4 py-2 border rounded"
                    :class="{ 'opacity-50 cursor-not-allowed': !pagination.next_page_url }">
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
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
    },
    currentPage: {
        type: Number,
        default: 1
    }
});
const emit = defineEmits(['page-changed']);


watch(() => props.products, (newProducts) => {
    console.log('Products updated:', newProducts.length);
}, { immediate: true });

function goToPage(page) {
    if (page < 1 || page > (props.pagination.last_page || 1) || page === props.pagination.current_page) return;
    emit('page-changed', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
function goToPageByUrl(url) {
    const match = url.match(/[?&]page=(\d+)/);
    if (match) {
        goToPage(Number(match[1]));
    }
}
</script>

<style scoped>
.bg-blue-500 {
    background-color: #72381c;
}

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
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.no-products {
    text-align: center;
    padding: 2rem;
    color: #666;
}

.product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 2.2rem;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 16px;
}

.product-card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: box-shadow 0.18s, transform 0.18s;
    cursor: pointer;
}

.product-card:hover {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.13);
    transform: translateY(-4px) scale(1.03);
}

.product-img-wrap {
    width: 100%;
    aspect-ratio: 1/1.2;
    background: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
}

.product-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.product-info {
    padding: 18px 12px 20px 12px;
    width: 100%;
    text-align: center;
}

.product-name {
    font-size: 1.15rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 0.4rem;
}

.product-price {
    font-size: .98rem;
    color: #444;
    font-weight: 600;
}

.pagination button {
    transition: all 0.2s;
}

.pagination button:hover:not(:disabled) {
    background-color: #fff;
}

.product-price {
    margin-bottom: 8px;
}

.new-price {
    font-size: .98rem;
    font-weight: bold;
    color: #007bff;
}

.old-price {
    color: #888;
    text-decoration: line-through;
    font-size: .97rem;
}

.badge {
    background: #72381c;
    color: #fff;
    font-size: 0.9rem;
    padding: 0.3em 0.7em;
    border-radius: 0.5em;
    font-weight: 500;
}

/* Shimmer loader styles */
.shimmer-loader {
    background: #f6f7f8;
    position: relative;
    overflow: hidden;
}

.skeleton-img {
    width: 100%;
    height: 180px;
    background: linear-gradient(90deg, #f6f7f8 25%, #edeef1 50%, #f6f7f8 75%);
    border-radius: 8px;
    margin-bottom: 12px;
    animation: shimmer 1.2s infinite linear;
}

.skeleton-text {
    height: 16px;
    background: linear-gradient(90deg, #f6f7f8 25%, #edeef1 50%, #f6f7f8 75%);
    border-radius: 4px;
    margin-bottom: 8px;
    animation: shimmer 1.2s infinite linear;
}

@keyframes shimmer {
    0% {
        background-position: -400px 0;
    }

    100% {
        background-position: 400px 0;
    }
}

@media (max-width: 992px) {
    .tf-grid-layout.tf-col-3 {
        overflow: auto;
    }
}

@media (max-width: 537px) {
    .product-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }

    .product-img-wrap {
        aspect-ratio: 1/1.1;
        max-height: 200px;
    }

    .product-card {
        padding-bottom: 0;
    }

    .product-info {
        padding: 10px 6px 12px 6px;
    }

    .product-name {
        font-size: 1rem;
    }

    .product-price,
    .old-price {
        font-size: .7rem;
    }

    .product-img {
        object-position: top;
    }

    .badge {
        font-size: .7rem;
    }
}
</style>