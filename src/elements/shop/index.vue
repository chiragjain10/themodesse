<template>
    <div class="shop-page">
        <ShopPageTitle :categoryName="categoryName" :productCount="productCount"
            :categoryDescription="categoryDescription" />
        <ShopCategorySwiper />
        <!-- Product -->
        <div class="flat-spacing pt-0">
            <span class="br-line cus-width d-block bg-line"></span>
            <ShopControl @toggle-sidebar="$emit('toggle-sidebar')" v-model="filterOptions" />
            <div class="container">
                <div class="row">
                    <ShopSidebarFilter 
                        :categories="categories"
                        v-model="selectedCategories"
                    />
                    <ProductGrid :products="sortedProducts" :loading="loading" :pagination="pagination"
                        @pageChange="handlePageChange" />
                </div>
            </div>
        </div>
        <!-- /Product -->
        <ShopIconBoxSwiper />
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getData } from '@/stores/getApi';

import ShopPageTitle from './ShopPageTitle.vue';
import ShopCategorySwiper from './ShopCategorySwiper.vue';
import ShopControl from './ShopControl.vue';
import ShopSidebarFilter from './ShopSidebarFilter.vue';
import ProductGrid from './ProductGrid.vue';
import ShopIconBoxSwiper from './ShopIconBoxSwiper.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const products = ref([]);
const filterOptions = ref({
    sort: 'default',
    view: 'grid'
});
const pagination = ref({
    current_page: 1,
    total: 0,
    per_page: 12,
    last_page: 1,
    links: [],
    next_page_url: null,
    prev_page_url: null
});

const selectedCategories = computed({
    get: () => {
        const categoryIds = route.query.category_id;
        if (!categoryIds) return [];
        return categoryIds.split(',').map(id => parseInt(id));
    },
    set: (value) => {
        const query = { ...route.query };
        if (value.length > 0) {
            query.category_id = value.join(',');
        } else {
            delete query.category_id;
        }
        // If no filters are selected, redirect to /shop
        if (Object.keys(query).length === 0 && route.params.slug) {
            router.push('/shop');
        } else {
            router.push({ query });
        }
    }
});

const response = ref(null);

const categoryName = computed(() => {
    if (route.params.slug) {
        const category = categories.value.find(cat => cat.slug === route.params.slug);
        return category?.name || 'Category';
    }
    return 'All Products';
});

const productCount = computed(() => products.value.length);
const categoryDescription = computed(() => {
    if (route.params.slug) {
        const category = categories.value.find(cat => cat.slug === route.params.slug);
        return `Browse our collection of ${category?.name || 'products'}`;
    }
    return 'Browse our complete collection of products';
});

const sortedProducts = computed(() => {
    let sorted = [...products.value];

    // Apply sorting
    switch (filterOptions.value.sort) {
        case 'price_asc':
            sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            break;
        case 'price_desc':
            sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            break;
        case 'name_asc':
            sorted.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name_desc':
            sorted.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Keep original order
            break;
    }

    return sorted;
});

const categories = ref([]);

const loadProducts = async () => {
    loading.value = true;
    try {
        let url = '/api/products';
        const params = new URLSearchParams();

        // Add pagination parameters
        params.append('page', pagination.value.current_page);
        params.append('per_page', pagination.value.per_page);

        // If we have a category slug, get products for that category
        if (route.params.slug) {
            url = `/api/categories/${route.params.slug}/products`;
        }
        // If we have category_id in query, filter by those categories
        else if (selectedCategories.value.length > 0) {
            params.append('category_id', selectedCategories.value.join(','));
        }

        // Add sort parameter if selected
        if (filterOptions.value.sort !== 'default') {
            params.append('sort', filterOptions.value.sort);
        }

        const response = await getData(`${url}?${params.toString()}`);
        
        if (response.data) {
            products.value = response.data;
            // Update pagination from response
            pagination.value = {
                current_page: response.current_page,
                total: response.total,
                per_page: response.per_page,
                last_page: response.last_page,
                links: response.links,
                next_page_url: response.next_page_url,
                prev_page_url: response.prev_page_url
            };
        } else {
            products.value = [];
        }
    } catch (error) {
        console.error('Error loading products:', error);
        products.value = [];
    } finally {
        loading.value = false;
    }
};

// Watch for route changes
watch([() => route.params.slug, () => route.query.category_id], async () => {
    pagination.value.current_page = 1; // Reset to first page on filter change
    await loadProducts();
}, { immediate: true });

// Watch for sort changes
watch(() => filterOptions.value.sort, async () => {
    pagination.value.current_page = 1; // Reset to first page on sort change
    await loadProducts();
});

// Watch for selected categories changes
watch(() => selectedCategories.value, async () => {
    pagination.value.current_page = 1; // Reset to first page on category change
    await loadProducts();
}, { deep: true });

const handlePageChange = async (page) => {
    pagination.value.current_page = page;
    await loadProducts();
};

// Load categories on mount
onMounted(async () => {
    try {
        const response = await getData('/api/home/categories');
        categories.value = response.categories || [];
        
        // If we have a category slug in the route, set the selected category
        if (route.params.slug) {
            const category = categories.value.find(cat => cat.slug === route.params.slug);
            if (category) {
                selectedCategories.value = [category.id];
            }
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        categories.value = [];
    }
    await loadProducts();
});
</script>

<style scoped></style>