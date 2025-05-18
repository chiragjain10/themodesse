<template>
    <section class="product-wrapper appear-animate mt-6 mt-md-10 pt-4 pb-8">
        <div class="container">
            <h2 class="title title-center mb-5">Featured Products</h2>

            <!-- Category Tabs -->
            <ul class="nav nav-tabs nav-fill mb-4" role="tablist">
                <li class="nav-item" v-for="category in categories" :key="category.id">
                    <a class="nav-link" :class="{ active: activeCategory === category.slug }"
                        @click="activeCategory = category.slug" href="#">
                        {{ category.name }}
                    </a>
                </li>
            </ul>

            <!-- Products Grid -->
            <div class="row">
                <div v-if="!loading" class="owl-carousel owl-theme row owl-nav-full cols-2 cols-md-3 cols-lg-4"
                    data-owl-options='{
                        "items": 4,
                        "nav": true,
                        "loop": true,
                        "dots": true,
                        "margin": 20,
                        "responsive": {
                            "0": { "items": 2 },
                            "768": { "items": 3 },
                            "992": { "items": 4, "dots": false, "nav": true }
                        }
                    }'>
                    <div class="product text-center" v-for="product in products" :key="product.p_id">
                        <figure class="product-media">
                            <RouterLink :to="`/product/${product.slug}`">
                                <img :src="product.image" :alt="product.name" width="280" height="315"
                                    style="background-color: #f2f3f5;" />
                            </RouterLink>
                            <div class="product-label-group" v-if="product.discount">
                                <label class="product-label label-sale">-{{ product.discount }}%</label>
                            </div>
                            <div class="product-action-vertical">
                                <button class="btn-product-icon btn-cart add-to-cart-btn" @click="addToCart(product)"
                                    :disabled="loadingProductId === product.p_id" title="Add to cart">
                                    <template v-if="loadingProductId === product.p_id">
                                        <span class="spinner"></span>
                                    </template>
                                    <template v-else-if="successProductId === product.p_id">
                                        <span class="checkmark">&#10003;</span>
                                    </template>
                                    <template v-else>
                                        <i class="d-icon-bag"></i>
                                    </template>
                                </button>
                                <button class="btn-product-icon btn-wishlist"
                                    :class="{ active: wishlist.isWishlisted(product.p_id) }"
                                    @click="handleWishlist(product)" :disabled="loadingWishlistId === product.p_id"
                                    title="Add to wishlist">
                                    <template v-if="loadingWishlistId === product.p_id">
                                        <span class="spinner"></span>
                                    </template>
                                    <template v-else-if="successWishlistId === product.p_id">
                                        <span class="checkmark">&#10003;</span>
                                    </template>
                                    <template v-else>
                                        <i class="d-icon-heart"></i>
                                    </template>
                                </button>
                            </div>
                            <div class="product-action">
                                <RouterLink :to="`/product/${product.slug}`" class="btn-product btn-quickview"
                                    title="Quick View">Quick
                                    View
                                </RouterLink>
                            </div>
                        </figure>
                        <div class="product-details">
                            <h3 class="product-name">
                                <RouterLink :to="`/product/${product.slug}`">{{ product.name }}</RouterLink>
                            </h3>
                            <div class="product-price">
                                <span class="price">₹{{ product.sale_price }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Loading Skeleton -->
                <template v-else>
                    <div class="col-xs-6 col-lg-3 mb-4" v-for="n in 4" :key="n">
                        <div class="category shimmer-loader">
                            <div class="skeleton-img"></div>
                            <div class="skeleton-text mt-2"></div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { getData } from '@/stores/getApi';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useWishlistStore } from '@/stores/wishlist';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const wishlist = useWishlistStore();

const products = ref([]);
const loading = ref(true);
const loadingProductId = ref(null);
const successProductId = ref(null);
const loadingWishlistId = ref(null);
const successWishlistId = ref(null);
const activeCategory = ref(null);
const categories = ref([]);

const filteredProducts = computed(() => {
    if (!activeCategory.value) return products.value;
    console.log(products.value);
    return products.value.filter(product => {
        return product.category?.slug === activeCategory.value;
    });
});

const addToCart = async (product, qty = 1) => {
    if (!auth.user) {
        router.push('/login');
        return;
    }
    loadingProductId.value = product.p_id;
    try {
        await cart.addToCart(product.p_id, qty);
        successProductId.value = product.p_id;
        setTimeout(() => {
            successProductId.value = null;
        }, 1000);
    } catch (err) {
        console.error('Error adding to cart:', err);
    } finally {
        loadingProductId.value = null;
    }
};

const handleWishlist = async (product) => {
    if (!auth.user) {
        router.push('/login');
        return;
    }
    loadingWishlistId.value = product.p_id;
    try {
        if (wishlist.isWishlisted(product.p_id)) {
            await wishlist.removeFromWishlist(product.p_id);
        } else {
            await wishlist.addToWishlist(product.p_id);
            successWishlistId.value = product.p_id;
            setTimeout(() => {
                successWishlistId.value = null;
            }, 1000);
        }
    } catch (err) {
        console.error('Error updating wishlist:', err);
    } finally {
        loadingWishlistId.value = null;
    }
};

onMounted(async () => {
    try {
        // Fetch categories
        const categoryResponse = await getData('/api/home/categories');
        categories.value = categoryResponse.categories;
        if (categories.value.length > 0) {
            activeCategory.value = categories.value[0].slug;
        }

        // Fetch products
        const productResponse = await getData('/api/shop');
        products.value = productResponse.products || [];
        await wishlist.fetchWishlist();
    } catch (error) {
        console.error('Error loading data:', error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.nav-tabs {
    border-bottom: 2px solid #f2f3f5;
}

.nav-tabs .nav-link {
    border: none;
    color: #666;
    font-weight: 600;
    padding: 1rem 1.5rem;
    transition: all 0.3s ease;
}

.nav-tabs .nav-link:hover {
    color: #c96;
}

.nav-tabs .nav-link.active {
    color: #c96;
    border-bottom: 2px solid #c96;
    margin-bottom: -2px;
}

.add-to-cart-btn {
    position: relative;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #fff;
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: inline-block;
}

.checkmark {
    color: #fff;
    font-size: 14px;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.btn-wishlist.active {
    color: #e14b4b;
}

.shimmer-loader {
    background: #f6f7f8;
    border-radius: 4px;
    overflow: hidden;
}

.skeleton-img {
    height: 200px;
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
    0% {
        background-position: -200% 0;
    }

    100% {
        background-position: 200% 0;
    }
}
</style>