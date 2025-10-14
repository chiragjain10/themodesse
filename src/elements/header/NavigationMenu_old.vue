<template>
    <nav class="box-navigation">
        <ul class="box-nav-menu">
            <li :class="['menu-item', { active: isHomeActive }]">
                <RouterLink to="/" class="item-link">Home</RouterLink>
            </li>
            <li :class="['menu-item', 'dropdown', { active: isCategoryActive }]">
                <a href="javascript:void(0)" class="item-link">Categories<i class="icon icon-arrow-angle-down"></i></a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <ul>
                        <li v-for="category in megamenuCategories">
                            <RouterLink :to="{
                                path: `/shop`,
                                query: {
                                    category_id: category.id,
                                }
                            }" class="menu-link-text link">
                                {{ category.name }}
                            </RouterLink>
                        </li>
                    </ul>
                </div>
                <!-- <div class="sub-menu mega-menu container-layout-right-2 mega-menu-shop mega-menu-style-2">
                    <div class="mega-menu-wrap">
                        <div class="wrapper-sub-menu">
                            <div class="mega-menu-item" v-for="category in megamenuCategories" :key="category.id">
                                <p class="text-caption menu-heading">{{ category.name.toUpperCase() }}</p>
                                <ul class="menu-list">
                                    <li>
                                        <RouterLink :to="{
                                            path: `/shop`,
                                            query: {
                                                category_id: category.id,
                                            }
                                        }" class="menu-link-text link">
                                            <img :src="category.image" :title="category.name" :alt="category.name" />
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div> -->
            </li>
            <li :class="['menu-item', 'dropdown', { active: isJournalsActive }]">
                <a href="#" class="item-link">Journals<i class="icon icon-arrow-angle-down"></i></a>
                <div class="dropdown-menu">
                    <ul>
                        <li>
                            <a href="https://www.instagram.com/" class="menu-link-text link" target="_blank"
                                rel="noopener">Instagram Journal</a>
                        </li>
                        <li>
                            <RouterLink to="/journals" class="menu-link-text link">Our Journal</RouterLink>
                        </li>
                    </ul>
                </div>
            </li>
            <!-- <li class="menu-item">
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
                        </div>
                    </div>
                </div>
            </li> -->
            <li :class="['menu-item', { active: isOurStoryActive }]">
                <RouterLink to="/our-story" class="item-link">Our Story</RouterLink>
            </li>
            <li :class="['menu-item', { active: isContactActive }]">
                <RouterLink to="/contact" class="item-link">Contact Us</RouterLink>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
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

const route = useRoute();
const router = useRouter();

// Handle home click to refresh page
const handleHomeClick = (event) => {
    event.preventDefault()
    
    // If we're already on home page, refresh it
    if (router.currentRoute.value.path === '/') {
        window.location.reload()
    } else {
        // Navigate to home and then refresh
        router.push('/').then(() => {
            window.location.reload()
        })
    }
}

const isHomeActive = computed(() => route.path === '/');
const isCategoryActive = computed(() => route.path === '/shop');
const isJournalsActive = computed(() => route.path === '/journals');
const isOurStoryActive = computed(() => route.path === '/our-story');
const isContactActive = computed(() => route.path === '/contact');
</script>

<style>
.menu-item a {
    padding: 20px 0;
}

.dropdown:hover>.dropdown-menu {
    display: block;
}

.dropdown-menu li {
    padding: 10px 0;
}

.dropdown-menu a {
    padding: 0;
}

.dropdown-menu a:hover {
    text-decoration: underline;
}

.dropdown-menu {
    padding: 20px;
}
</style>