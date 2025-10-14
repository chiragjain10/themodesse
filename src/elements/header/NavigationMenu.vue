<template>
    <nav :class="['box-navigation', { closing: hideMenus }]">
        <ul class="box-nav-menu">
            <li :class="['menu-item', { active: isHomeActive }]">
                <RouterLink to="/" class="item-link" @click="closeAllMenus">Home</RouterLink>
            </li>
            <li :class="['menu-item', 'dropdown', { active: isCategoryActive }]">
                <a href="javascript:void(0)" class="item-link">Shop<i class="icon icon-arrow-angle-down"></i></a>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <ul class="menu-four">
                        <li class="has-sub">
                            <RouterLink :to="{ path: '/shop-by-category' }" class="menu-link-text link" @click="closeAllMenus">
                                Shop by Category
                            </RouterLink>
                            <!-- <i class="icon icon-arrow-angle-down ms-1"></i>
                            <div class="submenu-right">
                                <ul>
                                    <li v-for="category in megamenuCategories" :key="category.id">
                                        <RouterLink :to="{
                                            path: `/shop`,
                                            query: { category_id: category.id }
                                        }" class="menu-link-text link">
                                            {{ category.name }}
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div> -->
                        </li>
                        <li>
                            <RouterLink :to="{ path: '/shop-by-edits' }" class="menu-link-text link" @click="closeAllMenus">
                                Shop by Edits
                            </RouterLink>
                        </li>
                        <li>
                            <RouterLink :to="{ path: '/product-collection', query: { key: 'collections', label: 'Collections' } }" class="menu-link-text link disabled" @click="closeAllMenus">
                                Shop by Collection
                            </RouterLink>
                        </li>
                        <li>
                            <span class="menu-link-text disabled">Best Deals</span>
                        </li>
                    </ul>
                </div>
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
                            <RouterLink to="/journals" class="menu-link-text link" @click="closeAllMenus">Our Journal</RouterLink>
                        </li>
                    </ul>
                </div>
            </li>
            <li :class="['menu-item', { active: isOurStoryActive }]">
                <RouterLink to="/our-story" class="item-link" @click="closeAllMenus">Our Story</RouterLink>
            </li>
            <li :class="['menu-item', { active: isContactActive }]">
                <RouterLink to="/contact" class="item-link" @click="closeAllMenus">Contact Us</RouterLink>
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
const hideMenus = ref(false)

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

// Force-close all dropdowns on any nav click
const closeAllMenus = () => {
    hideMenus.value = true
    setTimeout(() => { hideMenus.value = false }, 300)
}
</script>

<style>
.menu-item a {
    padding: 20px 0;
}

.dropdown:hover>.dropdown-menu {
    display: block;
}

.dropdown-menu li {
    padding: 5px 0;
    width: calc(100% + 20px);
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

/* Force hide when closing */
.box-navigation.closing .dropdown-menu { display: none !important; }

/* Animate arrow on hover of 'Shop by Category' */
.menu-four .has-sub {
    display: flex;
    align-items: center;
}
.menu-four .has-sub > .icon {
    display: inline-block;
    transition: transform 0.2s ease, color 0.2s ease;
    transform-origin: 50% 50%;
}
.menu-four .has-sub:hover > .icon {
    color: var(--primary);
    transform: rotate(180deg);
}

/* New nested submenu styles */
.menu-four {
    position: relative;
    min-width: 188px;
}
.menu-four > li {
    position: relative;
}
.menu-four .has-sub > .submenu-right {
    display: none;
    position: absolute;
    top: 0;
    left: 100%;
    background: #fff;
    border: 1px solid #eee;
    padding: 16px 20px;
    min-width: 240px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.08);
    z-index: 1000;
}
.menu-four .has-sub:hover > .submenu-right {
    display: block;
}
.menu-link-text.disabled {
    color: #999;
    cursor: default;
    pointer-events: none;
}
</style>