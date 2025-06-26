<template>
    <!-- Collection -->
    <section class="flat-spacing pt-0">
        <div class="container">
            <div class="sect-top center text-center wow fadeInUp">
                <h2 class="s-title font-2 text-capitalize"><span class="fst-italic">Featured</span> Categories</h2>
                <p class="s-sub-title">
                    Explore our range of clinically crafted skincare that speaks through results, not words.
                    <br class="d-none d-xl-block">
                    Let your skin do the talking.
                </p>
            </div>
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div v-else-if="error" class="text-center py-5 text-danger">
                {{ error }}
            </div>
            <div v-else class="flat-animate-tab cls-tablist">
                <ul class="tab-cls" role="tablist">
                    <li v-for="(category, index) in categories" :key="category.id" class="nav-tab-item"
                        role="presentation">
                        <div data-bs-toggle="tab" :class="['tf-btn-tab', 'hover-cursor-img', { active: index === 0 }]"
                            :data-bs-target="'#' + category.slug">
                            <span class="text h3">
                                {{ category.name.toUpperCase() }} <span class="count">{{ category.products_count
                                    }}</span>
                            </span>
                            <a :href="'/shop-collection-list.html?category=' + category.slug"
                                class="icon icon-arrow-top-right"></a>
                            <div class="hover-image">
                                <img :src="category.image" :alt="category.name + ' Hover Image'">
                            </div>
                        </div>
                    </li>
                </ul>
                <div class="tab-content wow fadeInUp">
                    <div v-for="(category, index) in categories" :key="category.id"
                        :class="['tab-pane', { active: index === 0, show: index === 0 }]" :id="category.slug"
                        role="tabpanel">
                        <div class="row">
                            <div class="col-md-8">
                                <a :href="'/shop-collection-list.html?category=' + category.slug"
                                    class="shape-image hover-img">
                                    <div class="image img-style z-5 position-relative">
                                        <img :src="category.image" :data-src="category.image" :alt="category.name"
                                            class="lazyload">
                                    </div>
                                    <span class="line-circle"></span>
                                </a>
                            </div>
                            <div class="col-md-4">
                                <div class="sub-categories-list">
                                    <h4 class="mb-3">Sub Categories</h4>
                                    <ul class="list-unstyled">
                                        <li v-for="subCategory in category.sub_categories" :key="subCategory.id"
                                            class="mb-2">
                                            <RouterLink :to="{
                                                path: `/shop/${category.slug}`,
                                                query: { 
                                                    category_id: category.id,
                                                    sub_category_id: subCategory.id 
                                                }
                                            }" class="d-flex justify-content-between align-items-center">
                                                <span>{{ subCategory.name }}</span>
                                                <span class="badge bg-primary">{{ subCategory.products_count }}</span>
                                            </RouterLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- /Collection -->
</template>

<script>
import axios from 'axios';

export default {
    name: 'Categories',
    data() {
        return {
            categories: [],
            loading: true,
            error: null
        }
    },
    async created() {
        try {
            const response = await axios.get('/api/home/categories');
            this.categories = response.data.categories;
        } catch (err) {
            this.error = 'Failed to load categories. Please try again later.';
            console.error('Error fetching categories:', err);
        } finally {
            this.loading = false;
        }
    }
}
</script>

<style scoped>
.sub-categories-list {
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    height: 100%;
}

.sub-categories-list h4 {
    color: #333;
    font-weight: 600;
}

.sub-categories-list ul li a {
    color: #666;
    text-decoration: none;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.sub-categories-list ul li a:hover {
    color: #AE873E;
}

.sub-categories-list .badge {
    background-color: #AE873E;
}
</style>