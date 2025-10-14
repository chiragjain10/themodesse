<template>
    <div class="shop-page">
        <SEOHead 
            :title="seoTitle"
            :description="seoDescription"
            :keywords="seoKeywords"
            :schema="shopSchema"
        />
        
        <ShopPageTitle :productCount="productCount"/>
        <div class="flat-spacing pt-0">
            <span class="br-line cus-width d-block bg-line"></span>
            <ShopControl @toggle-sidebar="$emit('toggle-sidebar')" v-model="filterOptions" />
            <div class="container">
                <div class="row">
                    <ProductGrid :products="sortedProducts" :loading="loading" :pagination="pagination"
                        @page-changed="handlePageChange" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getData } from '@/stores/getApi';

import SEOHead from '@/components/SEOHead.vue';
import ShopPageTitle from './ShopPageTitle.vue';
import ShopControl from './ShopControl.vue';
import ProductGrid from './ProductGrid.vue';

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const products = ref([]);
const filterOptions = ref({
    sort: 'default',
    view: 'grid-3'
});
const pagination = ref({
    current_page: Number(route.query.page) || 1,
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
        if (Object.keys(query).length === 0 && route.params.slug) {
            router.push('/shop');
        } else {
            router.push({ query });
        }
    }
});

const response = ref(null);

const seoTitle = computed(() => {
    const category = route.params.slug;
    if (category) {
        return `${category.charAt(0).toUpperCase() + category.slice(1)} Collection | Premium Contemporary Womenswear - The Modesse`;
    }
    return 'Shop Premium Contemporary Womenswear | Designer Clothing Collection - The Modesse';
});

const seoDescription = computed(() => {
    const category = route.params.slug;
    if (category) {
        return `Explore our exclusive ${category} collection featuring premium contemporary womenswear. Handcrafted designer clothing made from finest Indian fabrics - khadi, handloom, and pure cotton. Discover elegant dresses and modern ethnic wear.`;
    }
    return 'Discover premium contemporary womenswear at The Modesse. Browse our exclusive collection of handcrafted designer clothing made from finest Indian fabrics - khadi, handloom, and pure cotton. Elegant dresses, modern ethnic wear, and sustainable fashion for the sophisticated woman.';
});

const seoKeywords = computed(() => {
    const category = route.params.slug;
    const baseKeywords = 'premium contemporary clothing, designer womenswear, luxury fashion, modern ethnic wear, handcrafted garments, sustainable fashion, Indian designer clothes, boutique clothing, elegant dresses, contemporary fashion';
    
    if (category) {
        return `${category} collection, ${category} dresses, ${category} clothing, ${baseKeywords}`;
    }
    return baseKeywords;
});

const shopSchema = computed(() => {
    const category = route.params.slug;
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": seoTitle.value,
        "description": seoDescription.value,
        "url": `https://themodesse.com/shop${category ? '/' + category : ''}`,
        "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": productCount.value,
            "itemListElement": sortedProducts.value.slice(0, 10).map((product, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                    "@type": "Product",
                    "name": product.name,
                    "description": product.description,
                    "url": `https://themodesse.com/product/${product.slug}`,
                    "image": product.images?.[0] || '/src/assets/images/themodesse.jpg',
                    "brand": {
                        "@type": "Brand",
                        "name": "The Modesse"
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": product.price,
                        "priceCurrency": "INR",
                        "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                        "url": `https://themodesse.com/product/${product.slug}`
                    }
                }
            }))
        }
    };
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

const productCount = computed(() => {
    return pagination.value.total || products.value.length;
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

// Watch for route changes (category or slug)
watch([() => route.params.slug, () => route.query.category_id], async ([newSlug, newCat], [oldSlug, oldCat]) => {
    if (newSlug !== oldSlug || newCat !== oldCat) {
        router.replace({ query: { ...route.query, page: 1 } });
    }
    // Do not call loadProducts here!
});

// Watch for sort changes
watch(() => filterOptions.value.sort, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
        router.replace({ query: { ...route.query, page: 1 } });
    }
});

// Watch for selected categories changes
watch(() => selectedCategories.value, async (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        router.replace({ query: { ...route.query, page: 1 } });
    }
}, { deep: true });

// Watch for route query page changes
watch(() => route.query.page, async (newPage) => {
    pagination.value.current_page = Number(newPage) || 1;
    await loadProducts();
});

const handlePageChange = async (page) => {
    if (page === pagination.value.current_page) return;
    router.replace({ query: { ...route.query, page } });
    // loadProducts will be triggered by watcher
};

const handleClearAllFilters = () => {
    // Remove all filter params from the query and reset to /shop
    router.push({ path: '/shop' });
    // Reset sort, view, and pagination
    filterOptions.value.sort = 'default';
    filterOptions.value.view = 'grid-3';
    pagination.value.current_page = 1;
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