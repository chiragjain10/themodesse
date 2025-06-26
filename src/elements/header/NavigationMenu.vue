<template>
    <nav class="box-navigation">
        <ul class="box-nav-menu">
            <li class="menu-item active">
                <RouterLink to="/" class="item-link">Home</RouterLink>
            </li>
            <li class="menu-item">
                <RouterLink to="/categories" class="item-link">Categories<i class="icon icon-arrow-angle-down"></i>
                </RouterLink>
                <div class="sub-menu mega-menu container-layout-right-2 mega-menu-shop mega-menu-style-2">
                    <div class="mega-menu-wrap">
                        <div class="wrapper-sub-menu">
                            <div class="mega-menu-item" v-for="category in megamenuCategories" :key="category.id">
                                <p class="text-caption menu-heading">{{ category.name.toUpperCase() }}</p>
                                <ul class="menu-list">
                                    <li>
                                        <RouterLink :to="{
                                            path: `/shop/${category.slug}`,
                                            query: {
                                                category_id: category.id,
                                            }
                                        }" class="menu-link-text link">
                                            <img :src="category.image" :title="category.name" :alt="category.name"/>
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- <div class="wrapper-sub-collection">
                            <div class="box_image--V01 h-100 hover-img">
                                <div class="image h-100 img-style">
                                    <img src="/src/assets/images/collections/cls-header.jpg"
                                        data-src="/src/assets/images/collections/cls-header.jpg" alt=""
                                        class="lazyload">
                                </div>
                                <div class="content">
                                    <h5 class="box-text fw-medium text-white">
                                        <span>Flash Sale</span>
                                        <span class="br-line w-22 bg-white d-block"></span>
                                        <span>30% OFF</span>
                                    </h5>
                                    <div class="box-btn">
                                        <RouterLink to="/shop" class="tf-btn-line style-white text-uppercase">
                                            <span class="text-caption lh-28">Shop Now</span>
                                            <i class="icon-arrow-top-right-2 fs-10"></i>
                                        </RouterLink>
                                    </div>
                                </div>
                            </div>
                        </div> -->
                    </div>
                </div>
            </li>
            <li class="menu-item">
                <RouterLink to="/products" class="item-link">
                    Products
                    <i class="icon icon-arrow-angle-down"></i>
                </RouterLink>
                <div class="sub-menu mega-menu mega-menu-product">
                    <div class="container-layout-right">
                        <div class="mega-menu-wrap">
                            <div class="wrapper-sub-menu">
                                <div class="mega-menu-content" v-for="category in megamenuCategories"
                                    :key="category.id">
                                    <div class="mega-menu-item">
                                        <p class="text-caption menu-heading">{{ category.name.toUpperCase() }}</p>
                                        <ul class="menu-list">
                                            <li v-for="product in megamenuCategories[category]" :key="product.id">
                                                <RouterLink :to="`/product/${product.slug}`"
                                                    class="menu-link-text link">
                                                    {{ product.name }}
                                                </RouterLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="wrapper-sub-collection">
                                <div class="card_product--V01">
                                    <div class="card_product-wrapper aspect-ratio-1">
                                        <RouterLink to="/product/default" class="product-img">
                                            <img src="/src/assets/images/products/product-28.jpg"
                                                data-src="/src/assets/images/products/product-28.jpg"
                                                alt="Image Product" class="lazyload img-product">
                                            <img src="/src/assets/images/products/product-29.jpg"
                                                data-src="/src/assets/images/products/product-29.jpg"
                                                alt="Image Product" class="lazyload img-hover">
                                        </RouterLink>
                                        <ul class="list-product-btn center">
                                            <li>
                                                <RouterLink to="/quick-view" class="hover-tooltip box-icon quickview">
                                                    <span class="icon icon-view"></span>
                                                    <span class="tooltip">Quick View</span>
                                                </RouterLink>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div> -->
                        </div>
                    </div>
                </div>
            </li>
            <li class="menu-item">
                <RouterLink to="/our-story" class="item-link">Our Story</RouterLink>
            </li>
            <li class="menu-item">
                <RouterLink to="/contact" class="item-link">Contact</RouterLink>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { getData } from '@/stores/getApi'

// State for dynamic megamenu
const megamenuCategories = ref([])
const megamenuLoading = ref(true)

// Flatten sub-categories from all categories
const subCategories = computed(() => {
    const allSubCategories = []
    megamenuCategories.value.forEach(category => {
        if (category.sub_categories) {
            allSubCategories.push(...category.sub_categories)
        }
    })
    return allSubCategories
})

// Function to fetch megamenu data
const loadMegamenuData = async () => {
    try {
        // First get categories with sub-categories
        const categoryResponse = await getData('/api/home/categories')
        const categories = categoryResponse.categories || []

        // Then get products for each sub-category
        for (const category of categories) {
            if (category.sub_categories) {
                for (const subCategory of category.sub_categories) {
                    const productResponse = await getData(`/api/products?sub_category_id=${subCategory.id}`)
                    subCategory.products = productResponse.data || []
                }
            }
        }

        megamenuCategories.value = categories
    } catch (error) {
        console.error('Error loading megamenu data:', error)
    } finally {
        megamenuLoading.value = false
    }
}

// Fetch megamenu data on mounted
onMounted(() => {
    loadMegamenuData()
})
</script>