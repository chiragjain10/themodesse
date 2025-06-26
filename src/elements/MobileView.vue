<template>
    <!-- Mobile Menu -->
    <div class="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
        <span class="icon-close-popup" data-bs-dismiss="offcanvas">
            <i class="icon-close"></i>
        </span>
        <div class="mb-canvas-content">
            <div class="mb-body">
                <div class="mb-content-top">
                    <form class="form-search">
                        <fieldset>
                            <input type="text" placeholder="Search for anything..." class="" name="text" tabindex="0"
                                value="" aria-required="true">
                        </fieldset>
                        <button type="submit" class="link"><i class="icon icon-search"></i></button>
                    </form>
                    <ul class="nav-ul-mb" id="wrapper-menu-navigation">
                        <li class="nav-mb-item">
                            <a href="#dropdown-menu-shop" class="collapsed mb-menu-link" data-bs-toggle="collapse"
                                aria-expanded="true" aria-controls="dropdown-menu-shop">
                                <span>Categories</span>
                                <span class="btn-open-sub"></span>
                            </a>
                            <div id="dropdown-menu-shop" class="collapse">
                                <ul class="sub-nav-menu">
                                    <li v-for="category in categories" :key="category.id">
                                        <RouterLink :to="{
                                            path: '/shop',
                                            query: { category_id: category.id }
                                        }" class="sub-nav-link">
                                            <span>{{ category.name }}</span>
                                        </RouterLink>
                                        <div v-if="category.sub_categories && category.sub_categories.length > 0" 
                                            :id="'sub-' + category.slug" class="collapse">
                                            <ul class="sub-nav-menu sub-menu-level-2">
                                                <li v-for="subCategory in category.sub_categories" :key="subCategory.id">
                                                    <RouterLink :to="{
                                                        path: '/shop',
                                                        query: { 
                                                            category_id: category.id,
                                                            sub_category_id: subCategory.id 
                                                        }
                                                    }" class="sub-nav-link">
                                                        {{ subCategory.name }}
                                                    </RouterLink>
                                                </li>
                                            </ul>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li class="nav-mb-item">
                            <RouterLink to="/about" class="mb-menu-link">About Us</RouterLink>
                        </li>
                        <li class="nav-mb-item">
                            <RouterLink to="/contact" class="mb-menu-link">Contact Us</RouterLink>
                        </li>
                    </ul>
                </div>
                <div class="mb-other-content">
                    <div class="group-icon">
                        <RouterLink to="/wishlist" class="site-nav-icon">
                            <i class="icon icon-hearth"></i>
                            Wishlist
                        </RouterLink>
                        <p data-bs-dismiss="offcanvas">
                            <a href="#log" data-bs-toggle="modal" class="site-nav-icon">
                                <i class="icon icon-user"></i>
                                Login
                            </a>
                        </p>
                    </div>
                    <div class="mb-notice">
                        <a href="contact-us.html" class="text-need">Need Help?</a>
                    </div>
                    <ul class="mb-info">
                        <li>
                            <p>Address:
                                <a href="https://www.google.com/maps?q=123+Yarran+St,+Punchbowl,+NSW+2196,+Australia"
                                    class="fw-medium" target="_blank">
                                    123 Yarran st, Punchbowl, NSW 2196, Australia
                                </a>
                            </p>
                        </li>
                        <li>
                            Email:
                            <a href="mailto:hello@vemus.com" class="fw-medium">hello@vemus.com</a>
                        </li>
                        <li>
                            Phone:
                            <a href="tel:6483441233" class="fw-medium">(64) 8344 1233</a>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="mb-bottom">
                <div class="bottom-bar-language">
                    <div class="tf-currencies">
                        <select class="tf-dropdown-select style-default type-currencies">
                            <option selected>USD ($)</option>
                            <option>EUR (€)</option>
                            <option>EUR (€)</option>
                            <option>VND (₫)</option>
                        </select>
                    </div>
                    <div class="tf-languages">
                        <select class="tf-dropdown-select style-default type-languages">
                            <option>English</option>
                            <option>العربية</option>
                            <option>简体中文</option>
                            <option>اردو</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Mobile Menu -->
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getData } from '@/stores/getApi';

const categories = ref([]);

const loadCategories = async () => {
    try {
        const response = await getData('/api/home/categories');
        categories.value = response.categories || [];
    } catch (error) {
        console.error('Error loading categories:', error);
    }
};

onMounted(() => {
    loadCategories();
});
</script>

<style scoped>
.sub-nav-link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 1rem;
    color: inherit;
    text-decoration: none;
}

.sub-nav-link:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.sub-menu-level-2 {
    padding-left: 1rem;
}

.sub-menu-level-2 .sub-nav-link {
    padding: 0.5rem 1rem;
}
</style>