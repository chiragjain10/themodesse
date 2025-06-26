<template>
    <!-- Search -->
    <div class="offcanvas offcanvas-top offcanvas-search" id="search">
        <div class="offcanvas-content">
            <div class="container">
                <div class="popup-content">
                    <form class="form-search" @submit.prevent="performSearch">
                        <fieldset>
                            <input type="text" placeholder="ENTER YOUR SEARCH" class="" name="text" tabindex="0"
                                v-model="searchKeyword" aria-required="true">
                        </fieldset>
                        <button type="submit" class="link"><i class="icon icon-search"></i></button>
                        <span class="icon-close-popup" data-bs-dismiss="offcanvas">
                            <i class="icon-close"></i>
                        </span>
                    </form>
                    <div class="search-results mt-4">
                        <div v-if="loading">
                            <div class="col-xs-6 col-lg-3 mb-4" v-for="n in 4" :key="n">
                                <div class="category shimmer-loader">
                                    <div class="skeleton-img"></div>
                                    <div class="skeleton-text mt-2"></div>
                                </div>
                            </div>
                        </div>
                        <div v-else-if="searchResults.length > 0">
                            <p class="title">SEARCH RESULTS</p>
                            <ul class="product-list">
                                <li v-for="product in searchResults" :key="product.p_id">
                                    <div class="tf-product-mini-view">
                                        <RouterLink :to="`/product/${product.slug}`" class="prd-image">
                                            <img :src="product.image" :alt="product.name">
                                        </RouterLink>
                                        <div class="prd-content">
                                            <RouterLink :to="`/product/${product.slug}`"
                                                class="prd-name link text-uppercase">
                                                {{ product.name }}
                                            </RouterLink>
                                            <div class="price-wrap">
                                                <span class="price-new price-on-sale">${{ product.sale_price }}</span>
                                                <span v-if="product.discount > 0"
                                                    class="price-old compare-at-price text-caption">${{
                                                        calculateOriginalPrice(product.sale_price, product.discount,
                                                    product.type) }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div v-else-if="searchKeyword.length > 2 && !loading" class="text-center">
                            No products found for "{{ searchKeyword }}".
                        </div>
                        <div v-else class="tf-grid-layout sm-col-2">
                            <div class="feature-wrap">
                                <p class="title">QUICK LINK</p>
                                <ul class="quick-link-list">
                                    <li>
                                        <RouterLink to="/shop" class="link-item text-main-4 link">Best Sellers
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/shop" class="link-item text-main-4 link">Bracelets</RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/shop" class="link-item text-main-4 link">Earrings</RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink to="/shop" class="link-item text-main-4 link">Rings</RouterLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <span class="close" data-bs-dismiss="offcanvas"></span>
    </div>
    <!-- /Search -->
</template>

<script setup>
import { ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { getData } from '@/stores/getApi';

// Reactive state
const searchKeyword = ref('');
const searchResults = ref([]);
const loading = ref(false);

// Simple debounce function
const debounce = (func, delay) => {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), delay);
    };
};

// Function to perform the search
const performSearch = async () => {
    if (searchKeyword.value.length < 3) {
        searchResults.value = [];
        return;
    }

    loading.value = true;
    try {
        const response = await getData(`/api/search?keyword=${searchKeyword.value}`);
        // Assuming the API response structure is { products: [...] }
        searchResults.value = response.products.data || []; // Accessing the data array from paginated results
    } catch (error) {
        console.error('Error fetching search results:', error);
        searchResults.value = [];
    } finally {
        loading.value = false;
    }
};

// Debounced search function
const debouncedSearch = debounce(performSearch, 300); // Adjust delay as needed

// Watch for changes in searchKeyword and perform debounced search
watch(searchKeyword, (newKeyword) => {
    if (newKeyword.length >= 3 || newKeyword.length === 0) {
        debouncedSearch();
    } else {
        searchResults.value = []; // Clear results if keyword is less than 3 characters
    }
});

// Helper function to calculate original price (assuming discount is a percentage or fixed amount)
const calculateOriginalPrice = (salePrice, discount, type) => {
    if (!discount || !salePrice) return salePrice;
    let originalPrice = parseFloat(salePrice);
    if (type === 'percentage') {
        originalPrice = originalPrice / (1 - discount / 100);
    } else if (type === 'fixed') {
        originalPrice = originalPrice + discount;
    }
    return originalPrice.toFixed(2);
};
</script>

<style scoped>
/* Add any specific styles for the search results display here */
.search-results .product-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.search-results .product-list li {
    margin-bottom: 15px;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
}

.search-results .product-list li:last-child {
    margin-bottom: 0;
    border-bottom: none;
    padding-bottom: 0;
}

.tf-product-mini-view {
    display: flex;
    align-items: center;
}

.tf-product-mini-view .prd-image {
    width: 60px;
    /* Adjust size as needed */
    height: 60px;
    /* Adjust size as needed */
    margin-right: 15px;
    flex-shrink: 0;
}

.tf-product-mini-view .prd-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
}

.tf-product-mini-view .prd-content {
    flex-grow: 1;
}

.tf-product-mini-view .prd-name {
    font-size: 0.9rem;
    margin-bottom: 5px;
    display: block;
}

.tf-product-mini-view .price-wrap {
    font-size: 0.8rem;
}

.tf-product-mini-view .price-new {
    color: #e76458;
    /* Example sale price color */
    font-weight: bold;
    margin-right: 5px;
}

.tf-product-mini-view .price-old {
    text-decoration: line-through;
    color: #777;
    /* Example old price color */
}

.tf-grid-layout.sm-col-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
}

.quick-link-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.quick-link-list li {
    margin-bottom: 8px;
}

.quick-link-list .link-item {
    text-decoration: none;
    color: inherit;
}

.quick-link-list .link-item:hover {
    text-decoration: underline;
}
</style>