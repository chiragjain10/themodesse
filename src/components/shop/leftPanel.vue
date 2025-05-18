<template>
    <aside class="col-lg-3 sidebar sidebar-fixed sidebar-toggle-remain shop-sidebar sticky-sidebar-wrapper">
        <div class="sidebar-overlay"></div>
        <a class="sidebar-close" href="#" @click.prevent="$emit('toggle-sidebar')"><i class="d-icon-times"></i></a>
        <div class="sidebar-content">
            <div class="sticky-sidebar" data-sticky-options="{'top': 10}">
                <div class="filter-actions mb-4">
                    <div class="filter-actions mb-4">
                        <a href="#"
                            class="sidebar-toggle-btn toggle-remain btn btn-outline btn-primary btn-icon-right btn-rounded">Filter<i
                                class="d-icon-arrow-left"></i></a>
                        <a href="#" class="filter-clean">Clean All</a>
                    </div>
                    <button class="filter-clean btn btn-link" @click="clearFilters">Clean All</button>
                </div>

                <!-- Loading State -->
                <div v-if="loading" class="widget widget-collapsible">
                    <div class="skeleton-loader">
                        <div class="skeleton-title"></div>
                        <div class="skeleton-item"></div>
                        <div class="skeleton-item"></div>
                        <div class="skeleton-item"></div>
                    </div>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="widget widget-collapsible">
                    <div class="alert alert-danger">
                        {{ error }}
                        <button @click="fetchCategories" class="btn btn-link">Try Again</button>
                    </div>
                </div>

                <!-- Categories -->
                <template v-else>
                    <!-- Category Filters -->
                    <div class="widget widget-collapsible" v-for="category in categories" :key="category.id">
                        <h3 class="widget-title">{{ category.name }}</h3>
                        <ul class="widget-body filter-items">
                            <li v-if="!category.children || category.children.length === 0">
                                <router-link :to="{ name: 'ShopByCategory', params: { slug: category.slug } }"
                                    :class="{ active: isActiveCategory(category.slug) }">
                                    {{ category.name }}
                                </router-link>
                            </li>
                            <li v-else>
                                <span>{{ category.name }}</span>
                                <ul>
                                    <li v-for="child in category.children" :key="child.id">
                                        <router-link :to="{ name: 'category', params: { slug: child.slug } }"
                                            :class="{ active: isActiveCategory(child.slug) }">
                                            {{ child.name }}
                                        </router-link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    <!-- Price Range Filter -->
                    <div class="widget widget-collapsible">
                        <h3 class="widget-title">Price Range</h3>
                        <div class="widget-body">
                            <div class="price-range">
                                <!-- Min slider -->
                                <input type="range" v-model.number="priceRange.min" :min="rangeLimits.min"
                                    :max="priceRange.max - 1" @change="applyPriceFilter" />

                                <!-- Max slider -->
                                <input type="range" v-model.number="priceRange.max" :min="priceRange.min + 1"
                                    :max="rangeLimits.max" @change="applyPriceFilter" />

                                <div class="price-inputs">
                                    <span>₹{{ priceRange.min }}</span>
                                    <span>₹{{ priceRange.max }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </template>
            </div>
        </div>
    </aside>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getData } from '@/stores/getApi';

// Router and Emits
const route = useRoute();
const emit = defineEmits(['toggle-sidebar', 'update:filters', 'clear-filters']);

// Category Data
const categories = ref([]);
const loading = ref(true);
const error = ref(null);

// Price range config
const rangeLimits = {
    min: 0,
    max: 100000
};

const priceRange = reactive({
    min: 1000,
    max: 50000
});

// Fetch categories from API
const fetchCategories = async () => {
    loading.value = true;
    error.value = null;
    try {
        const response = await getData('/api/home/categories');
        categories.value = response.categories || [];
    } catch (err) {
        error.value = 'Failed to load categories. Please try again.';
        console.error('Error fetching categories:', err);
    } finally {
        loading.value = false;
    }
};

// Check if a category is active
const isActiveCategory = (slug) => route.params.slug === slug;

// Apply price filter
const applyPriceFilter = () => {
    emit('update:filters', {
        priceRange: { ...priceRange } // emit a copy to avoid mutation outside
    });
};

// Clear all filters
const clearFilters = () => {
    priceRange.min = rangeLimits.min;
    priceRange.max = rangeLimits.max;
    emit('clear-filters');
};

// On mount
onMounted(fetchCategories);
</script>


<style scoped>
.sidebar-content {
    flex: 1 1 auto;
    overflow-y: auto;
}

.sticky-sidebar {
    padding-bottom: 20px;
}

.skeleton-loader {
    padding: 15px;
}

.skeleton-title {
    height: 20px;
    background: #eee;
    margin-bottom: 15px;
    border-radius: 4px;
}

.skeleton-item {
    height: 15px;
    background: #eee;
    margin-bottom: 10px;
    border-radius: 4px;
}

.price-range {
    padding: 15px;
}

.price-inputs {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.active {
    color: var(--primary-color);
    font-weight: bold;
}

.alert {
    padding: 15px;
    margin-bottom: 15px;
    border-radius: 4px;
}

.alert-danger {
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
    color: #721c24;
}

.btn-link {
    color: #007bff;
    text-decoration: none;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
}

.btn-link:hover {
    text-decoration: underline;
}
</style>