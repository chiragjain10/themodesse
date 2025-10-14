<template>
    <!-- Sidebar Filter -->
    <div class="col-xl-3">
        <div class="canvas-sidebar sidebar-filter canvas-filter left p-3 border" :class="{ 'sticky-filter': isSticky, 'show': isMobileFilterOpen }">
            <div class="canvas-wrapper">
                <div class="canvas-header d-flex d-xl-none">
                    <h5 class="canvas-title">Filter</h5>
                    <button type="button" class="btn-close" @click="closeMobileFilter"></button>
                </div>
                <div class="canvas-body">
                    <div class="apply-filter-wrap">
                        <p class="title h6 fw-normal text-uppercase d-xl-none">Applied Filters</p>
                        <div id="product-count-grid" class="count-text text-main-4 d-xl-none">
                            {{ selectedFiltersCount }} Filters Selected
                        </div>
                        <div class="meta-filter-shop">
                            <div id="applied-filters" class="check-yes">
                                <template v-for="(filter, key) in appliedFilters" :key="key">
                                    <div v-if="filter && filter.name && filter.value" class="filter-tag">
                                        {{ filter.name }}: {{ filter.value }}
                                        <span class="remove-filter" @click="removeFilter(key)">×</span>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- Categories Filter -->
                    <div class="widget-facet" v-if="categories && categories.length > 0">
                        <div class="facet-title h6 fw-normal" data-bs-target="#categories" role="button"
                            data-bs-toggle="collapse" aria-expanded="true" aria-controls="categories">
                            <span class="h6 fw-normal text-uppercase">Categories</span>
                            <span class="icon ic-accordion-custom"></span>
                        </div>
                        <div id="categories" class="collapse show">
                            <ul class="collapse-body filter-group-check current-scrollbar">
                                <li v-for="category in categories" :key="category.id" class="list-item">
                                    <input type="checkbox" :id="'cat-' + category.id" :value="category.id"
                                        v-model="selectedCategories" class="tf-check style-2" @change="handleFilterChange">
                                    <label :for="'cat-' + category.id" class="label">
                                        <span>{{ category.name }}</span>
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Price Range Filter -->
                    <div class="widget-facet">
                        <div class="facet-title h6 fw-normal" data-bs-target="#price-range" role="button"
                            data-bs-toggle="collapse" aria-expanded="true" aria-controls="price-range">
                            <span class="h6 fw-normal text-uppercase">Price Range</span>
                            <span class="icon ic-accordion-custom"></span>
                        </div>
                        <div id="price-range" class="collapse show">
                            <div class="collapse-body">
                                <div class="price-range-slider">
                                    <div class="price-range-values mb-3">
                                        <span>₹{{ priceRange.min }}</span>
                                        <span>₹{{ priceRange.max }}</span>
                                    </div>
                                    <input type="range" v-model.number="priceRange.min" :min="priceLimits.min"
                                        :max="priceLimits.max" @input="handleFilterChange" class="form-range">
                                    <input type="range" v-model.number="priceRange.max" :min="priceLimits.min"
                                        :max="priceLimits.max" @input="handleFilterChange" class="form-range">
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Filter Actions -->
                    <div class="filter-actions mt-4 d-flex gap-2">
                        <button @click="handleClearAll" class="btn btn-outline-secondary flex-grow-1">
                            Clear All
                        </button>
                        <button @click="handleApplyFilters" class="btn btn-primary flex-grow-1">
                            Apply
                        </button>
                    </div>
                </div>

                <div class="canvas-bottom d-xl-none">
                    <button @click="clearAllFilters" class="tf-btn btn-reset">
                        <span class="fw-medium">CLEAR ALL</span>
                    </button>
                    <button type="button" class="tf-btn btn-fill animate-btn" @click="handleApplyFilters">
                        <span class="fw-medium">APPLY [{{ selectedFiltersCount }}]</span>
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile Filter Button -->
    <div class="mobile-filter-button d-xl-none fixed-bottom bg-white p-3 border-top">
        <button class="btn btn-primary w-100" @click="openMobileFilter">
            <i class="fas fa-filter me-2"></i> Filter
        </button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getData } from '@/stores/getApi';

const router = useRouter();
const route = useRoute();

const props = defineProps({
    categories: {
        type: Array,
        default: () => []
    },
    modelValue: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['update:modelValue', 'clear-all']);

const selectedCategories = computed({
    get: () => props.modelValue || [],
    set: (value) => emit('update:modelValue', value)
});

// Data refs
const priceRange = ref({
    min: 0,
    max: 100000
});
const priceLimits = ref({
    min: 0,
    max: 100000
});
const appliedFilters = ref({});

// Computed
const selectedFiltersCount = computed(() => {
    let count = selectedCategories.value.length;
    if (priceRange.value.min > priceLimits.value.min || priceRange.value.max < priceLimits.value.max) {
        count++;
    }
    return count;
});

// Methods
const fetchProductsAndExtractAttributes = async () => {
    try {
        const response = await getData('/api/products');
        if (response && response.data) {
            // Set price limits based on product prices
            const prices = response.data.map(p => parseFloat(p.price)).filter(price => !isNaN(price));
            if (prices.length > 0) {
                priceLimits.value = {
                    min: Math.min(...prices),
                    max: Math.max(...prices)
                };
                priceRange.value = { ...priceLimits.value };
            }
        }
    } catch (error) {
        console.error('Error fetching products:', error);
    }
};

const handleFilterChange = () => {
    // Update applied filters
    const newAppliedFilters = {};

    if (selectedCategories.value.length > 0) {
        const categoryNames = selectedCategories.value.map(id => {
            const category = props.categories.find(c => c.id === id);
            return category ? category.name : '';
        }).filter(Boolean);

        if (categoryNames.length > 0) {
            newAppliedFilters.categories = {
                name: 'Categories',
                value: categoryNames.join(', ')
            };
        }
    }

    if (priceRange.value.min > priceLimits.value.min || priceRange.value.max < priceLimits.value.max) {
        newAppliedFilters.price = {
            name: 'Price Range',
            value: `₹${priceRange.value.min} - ₹${priceRange.value.max}`
        };
    }

    appliedFilters.value = newAppliedFilters;

    // Update URL with filters
    const query = {
        ...route.query,
        category_id: selectedCategories.value.length > 0 ? selectedCategories.value.join(',') : undefined,
        min_price: priceRange.value.min > priceLimits.value.min ? priceRange.value.min : undefined,
        max_price: priceRange.value.max < priceLimits.value.max ? priceRange.value.max : undefined
    };

    // Remove undefined values
    Object.keys(query).forEach(key => {
        if (query[key] === undefined) {
            delete query[key];
        }
    });

    router.push({
        path: route.path,
        query
    });
};

const removeFilter = (filterKey) => {
    if (filterKey === 'categories') {
        selectedCategories.value = [];
    } else if (filterKey === 'price') {
        priceRange.value = { ...priceLimits.value };
    }
    handleFilterChange();
};

const clearAllFilters = () => {
    selectedCategories.value = [];
    priceRange.value = { ...priceLimits.value };
    emit('clear-all');
    handleFilterChange();
};

// Watch for route changes
watch(() => route.query, (newQuery) => {
    if (newQuery.category_id) {
        selectedCategories.value = newQuery.category_id.split(',').map(id => parseInt(id));
    } else {
        selectedCategories.value = [];
    }

    if (newQuery.min_price) {
        priceRange.value.min = parseInt(newQuery.min_price);
    }
    if (newQuery.max_price) {
        priceRange.value.max = parseInt(newQuery.max_price);
    }
}, { immediate: true });

// Sticky behavior
const isSticky = ref(false);
const handleScroll = () => {
    isSticky.value = window.scrollY > 300;
};

// Mobile filter
const isMobileFilterOpen = ref(false);

const openMobileFilter = () => {
    isMobileFilterOpen.value = true;
    document.body.style.overflow = 'hidden';
};

const closeMobileFilter = () => {
    isMobileFilterOpen.value = false;
    document.body.style.overflow = '';
};

const handleClearAll = () => {
    selectedCategories.value = [];
    priceRange.value = { ...priceLimits.value };
    handleFilterChange();
};

const handleApplyFilters = () => {
    handleFilterChange();
    isMobileFilterOpen.value = false;
    document.body.style.overflow = 'visible';
};

// Lifecycle hooks
onMounted(() => {
    fetchProductsAndExtractAttributes();
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.price-range {
    padding: 15px;
}

.price-inputs {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.filter-tag {
    display: inline-flex;
    align-items: center;
    background: #f5f5f5;
    padding: 4px 8px;
    border-radius: 4px;
    margin: 4px;
    font-size: 0.9em;
}

.remove-filter {
    margin-left: 8px;
    cursor: pointer;
    color: #666;
}

.remove-filter:hover {
    color: #ff0000;
}

.category-name {
    font-weight: 600;
    color: #333;
}

.sub-categories {
    list-style: none;
    padding-left: 0;
}

.sub-categories .list-item {
    margin-bottom: 8px;
}

.sub-categories .label {
    font-size: 0.9rem;
    color: #666;
}

.sub-categories .count-wrap {
    font-size: 0.8rem;
    color: #999;
}

.sticky-filter {
    position: sticky;
    top: 20px;
    transition: all 0.3s ease;
}

@media (max-width: 1199px) {
    .canvas-sidebar {
        position: fixed;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100vh;
        background: white;
        z-index: 1000;
        transition: left 0.3s ease;
        overflow-y: auto;
    }

    .canvas-sidebar.show {
        left: 0;
    }

    .canvas-header {
        padding: 1rem;
        border-bottom: 1px solid #eee;
        position: sticky;
        top: 0;
        background: white;
        z-index: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .canvas-body {
        padding: 1rem;
    }

    .btn-close {
        padding: 0.5rem;
        margin: -0.5rem;
        cursor: pointer;
    }
}

.mobile-filter-button {
    z-index: 999;
}

.price-range-values {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #666;
}

.form-range {
    width: 100%;
    margin: 0.5rem 0;
}

.filter-actions {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 1rem 0;
    border-top: 1px solid #eee;
}

.btn {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.btn-outline-secondary {
    border: 1px solid #ddd;
    color: #666;
}

.btn-outline-secondary:hover {
    background: #f5f5f5;
    border-color: #ccc;
}

.btn-primary {
    background: #72381C;
    border: 1px solid #72381C;
    color: white;
}

.btn-primary:hover {
    background: #72381C;
    border-color: #72381C;
}

@media (max-width: 1199px) {
    .filter-actions {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        background: white;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        z-index: 1001;
    }
}
</style>