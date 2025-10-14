<template>
    <!-- Mobile Menu -->
    <div class="offcanvas offcanvas-start canvas-mb" id="mobileMenu">
        <span id="mobileMenuCloseBtn" class="icon-close-popup" data-bs-dismiss="offcanvas">
            <i class="icon-close"></i>
        </span>
        <div class="mb-canvas-content">
            <div class="mb-body">
                <div class="mb-content-top">
                    <form class="form-search">
                        <fieldset style="position:relative;">
                            <input type="text" placeholder="Search for anything..." class="" name="text" tabindex="0"
                                v-model="searchText" aria-required="true" autocomplete="off" @focus="filterProducts" />
                            <ul v-if="showDropdown || searchLoading" class="search-dropdown">
                                <li v-if="searchLoading">Loading...</li>
                                <li v-else v-for="product in filteredProducts" :key="product.id" @click="goToProduct(product.slug)">
                                    <span>{{ product.name }}</span>
                                </li>
                            </ul>
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
                    <div class="mb-help-heading">Need Help?</div>
                    <ul class="store-info-list">
                        <li>
                            <span class="caption">Email:</span>
                            <a href="mailto:hello@themodesse.com" class="link text-main-4">
                                hello@themodesse.com
                            </a>
                        </li>
                        <li>
                            <span class="caption">Phone:</span>
                            <a href="tel:+919300125126" class="link text-main-4">
                                +91 93001 25126
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <!-- /Mobile Menu -->
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { getData } from '@/stores/getApi';

const searchText = ref('');
const allProducts = ref([]);
const filteredProducts = ref([]);
const showDropdown = ref(false);
const searchLoading = ref(false);
const router = useRouter();
let fetchTimeout = null;
const categories = ref([]);

const fetchProducts = async () => {
    searchLoading.value = true;
    try {
        const response = await getData('/api/products');
        allProducts.value = response.data || [];
        filterProducts();
    } catch (error) {
        allProducts.value = [];
        filteredProducts.value = [];
    } finally {
        searchLoading.value = false;
    }
};

const filterProducts = () => {
    if (!searchText.value.trim()) {
        filteredProducts.value = [];
        showDropdown.value = false;
        return;
    }
    const search = searchText.value.trim().toLowerCase();
    filteredProducts.value = allProducts.value.filter(p => p.name.toLowerCase().includes(search));
    showDropdown.value = filteredProducts.value.length > 0;
};

watch(searchText, (val) => {
    clearTimeout(fetchTimeout);
    if (!val.trim()) {
        filteredProducts.value = [];
        showDropdown.value = false;
        return;
    }
    fetchTimeout = setTimeout(() => {
        if (allProducts.value.length === 0) {
            fetchProducts();
        } else {
            filterProducts();
        }
    }, 300);
});

const goToProduct = (slug) => {
    showDropdown.value = false;
    searchText.value = '';
    router.push(`/product/${slug}`);
};

const fetchCategories = async () => {
  try {
    const response = await getData('/api/home/categories');
    categories.value = response.categories || [];
  } catch (error) {
    categories.value = [];
  }
};

let offcanvasCloseHook = null;

onMounted(() => {
    fetchCategories();
    // Auto-close mobile menu on route change
    offcanvasCloseHook = router.afterEach(() => {
        // Simulate click on the close button with data-bs-dismiss="offcanvas"
        document.getElementById('mobileMenuCloseBtn')?.click();
        // Remove all lingering backdrops and restore body
        removeAllBackdrops();
    });
});

function removeAllBackdrops() {
    document.querySelectorAll('.offcanvas-backdrop, .modal-backdrop').forEach(el => el.remove());
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

onUnmounted(() => {
    if (offcanvasCloseHook) offcanvasCloseHook();
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
.mb-other-content {
  padding: 24px 0 0 0;
  border-top: 1px solid #eee;
  margin-top: 24px;
}
.mb-help-heading {
  font-weight: 700;
  color: #222;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  margin-top: 0;
  border-left: 3px solid #deb973;
  padding-left: 12px;
  font-size: inherit;
}
.store-info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.store-info-list li {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
}
.store-info-list .caption {
  font-weight: 600;
  color: #555;
  margin-bottom: 2px;
}
.store-info-list .link {
  color: #1a73e8;
  text-decoration: underline;
  word-break: break-word;
}
.store-info-list .link:hover {
  color: #deb973;
  text-decoration: underline;
}
.search-dropdown {
    position: absolute;
    left: 0;
    right: 0;
    top: 100%;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    z-index: 100;
    max-height: 220px;
    overflow-y: auto;
    margin: 0;
    padding: 0;
    list-style: none;
}
.search-dropdown li {
    padding: 12px 18px;
    cursor: pointer;
    transition: background 0.2s;
    font-size: 16px;
}
.search-dropdown li:hover {
    background: #f8f8f8;
}
</style>