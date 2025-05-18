<template>
  <TopPanel v-model="filterOptions" @toggle-sidebar="$emit('toggle-sidebar')" />
  <!-- Loader Shimmer Cards -->
  <div class="row">
    <template v-if="loading">
      <div class="col-xs-6 col-lg-4 mb-4" v-for="n in 3" :key="n">
        <div class="category shimmer-loader">
          <div class="skeleton-img"></div>
          <div class="skeleton-text mt-2"></div>
        </div>
      </div>
    </template>
    <template v-else-if="error">
      <div class="col-12 text-center py-5">
        <div class="error-state">
          <i class="d-icon-times-circle mb-4" style="font-size: 48px; color: #dc3545;"></i>
          <h3 class="mb-3">Something went wrong!</h3>
          <p class="mb-4">{{ error }}</p>
          <button @click="fetchProducts" class="btn btn-primary btn-rounded">
            <i class="d-icon-refresh"></i> Try Again
          </button>
        </div>
      </div>
    </template>
    <template v-else-if="products.length === 0">
      <div class="col-12 text-center py-5">
        <div class="no-products-state">
          <i class="d-icon-box mb-4" style="font-size: 48px; color: #6c757d;"></i>
          <h3 class="mb-3">No Products Found</h3>
          <p class="mb-4">We couldn't find any products matching your criteria.</p>
          <button @click="fetchProducts" class="btn btn-primary btn-rounded">
            <i class="d-icon-refresh"></i> Try Again
          </button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="main-content right-panel">
        <div class="products-wrapper " :class="{ 'list-layout': filterOptions.layout === 'list' }">
          <div class="product-wrap" v-for="product in paginatedProducts" :key="product.p_id">
            <div class="product mb-4">
              <figure class="product-media">
                <RouterLink :to="`/product/${product.slug}`">
                  <figure class="category-media">
                    <img :src="product?.image" :alt="product.name" width="280" height="280"
                      style="background-color: #f1f1f1;" />
                  </figure>
                </RouterLink>
                <div class="product-label-group">
                  <label v-if="product?.is_new" class="product-label label-new">new</label>
                  <label v-if="product?.discount_percentage > 0" class="product-label label-sale">{{
                    product?.discount_percentage }}% OFF</label>
                </div>
                <div class="product-action-vertical">
                  <button
                    class="btn-product-icon btn-cart add-to-cart-btn"
                    @click="addToCart(product)"
                    :disabled="loadingProductId === product.p_id"
                    title="Add to cart"
                  >
                    <template v-if="loadingProductId === product.p_id">
                      <span class="spinner"></span>
                    </template>
                    <template v-else-if="successProductId === product.p_id">
                      <span class="checkmark">&#10003;</span>
                    </template>
                    <template v-else>
                      <i class="d-icon-bag"></i>
                    </template>
                  </button>
                  <button class="btn-product-icon btn-wishlist" @click="addToWishlist(product)"
                    title="Add to wishlist"><i class="d-icon-heart"></i></button>
                </div>
                <div class="product-action">
                  <RouterLink :to="`/product/${product.slug}`" class="btn-product btn-quickview" title="Quick View">
                    Quick
                    View</RouterLink>
                </div>
              </figure>
              <div class="product-details">
                <div class="product-cat">
                  <RouterLink :to="`/shop?category=${product?.category?.slug}`">{{ product?.category?.name }}
                  </RouterLink>
                </div>
                <h3 class="product-name">
                  <RouterLink :to="`/product/${product.slug}`">{{ product.name }}</RouterLink>
                </h3>
                <div class="product-price">
                  <!-- <ins class="new-price">${{ (product.sale_price * (1 - product?.discount_percentage / 100)).toFixed(2) }}</ins> -->
                  <ins class="new-price">${{ (product.sale_price) }}</ins>
                  <del v-if="product?.discount_percentage > 0" class="old-price">${{ product.sale_price }}</del>
                </div>
                <div class="ratings-container">
                  <div class="ratings-full" :style="{ width: (product?.average_rating * 20) + '%' }">
                    <span class="ratings" :style="{ width: (product?.average_rating * 20) + '%' }"></span>
                    <span class="tooltiptext tooltip-top"></span>
                  </div>
                  <RouterLink :to="`/product/${product.slug}#reviews`" class="rating-reviews">({{ product?.review_count
                  }}
                    reviews)</RouterLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getData } from '@/stores/getApi';
import TopPanel from './topPanel.vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();

const route = useRoute();
const products = ref([]);
const loading = ref(true);
const error = ref(null);
const filterOptions = ref({
  sort: 'default',
  itemsPerPage: 12,
  layout: 'grid'
});

// Local loading state for add to cart
const loadingProductId = ref(null);
const successProductId = ref(null);

const addToCart = async (product, qty = 1) => {
  if (!auth.user) {
    router.push('/login');
    return;
  }

  loadingProductId.value = product.p_id;
  error.value = null;

  try {
    await cart.addToCart(product.p_id, qty);
    successProductId.value = product.p_id;
    setTimeout(() => {
      successProductId.value = null;
    }, 1000); // Show checkmark for 1 second
  } catch (err) {
    error.value = err.message;
  } finally {
    loadingProductId.value = null;
  }
};

const sortedProducts = computed(() => {
  let sorted = [...products.value];

  switch (filterOptions.value.sort) {
    case 'popularity':
      sorted.sort((a, b) => b.view_count - a.view_count);
      break;
    case 'rating':
      sorted.sort((a, b) => b.average_rating - a.average_rating);
      break;
    case 'date':
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;
    case 'price-low':
      sorted.sort((a, b) => a.sale_price - b.sale_price);
      break;
    case 'price-high':
      sorted.sort((a, b) => b.sale_price - a.sale_price);
      break;
    default:
      // Default sorting (no change)
      break;
  }
  return sorted;
});

const paginatedProducts = computed(() => {
  return sortedProducts.value.slice(0, filterOptions.value.itemsPerPage);
});

const fetchProducts = async () => {
  loading.value = true;
  error.value = null;
  try {
    const slug = route.params.slug;
    let data;
    if (slug) {
      data = await getData(`/api/categories/${slug}`);
    } else {
      data = await getData(`/api/shop`);
    }
    products.value = data.products ?? data.data ?? [];
  } catch (err) {
    console.error(err);
    error.value = 'Failed to load products. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Fetch products on first mount
onMounted(fetchProducts);
// Fetch products when the route changes
watch(() => route.params.slug, fetchProducts);
</script>

<style scoped>
/* Aapki theme ke specific styles yahan */
.products-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.products-wrapper.list-layout {
  grid-template-columns: 1fr;
}

.products-wrapper.list-layout .product {
  display: flex;
  gap: 20px;
}

.products-wrapper.list-layout .product-media {
  flex: 0 0 280px;
}

.products-wrapper.list-layout .product-details {
  flex: 1;
}

.error-state,
.no-products-state {
  padding: 40px 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.error-state i,
.no-products-state i {
  display: block;
  margin: 0 auto;
}

.error-state h3,
.no-products-state h3 {
  color: #333;
  font-size: 24px;
}

.error-state p,
.no-products-state p {
  color: #6c757d;
  font-size: 16px;
}

.btn-rounded {
  padding: 10px 25px;
  border-radius: 30px;
}

.btn-rounded i {
  margin-right: 5px;
}

.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #ccc;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  vertical-align: middle;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.checkmark {
  color: #28a745;
  font-size: 20px;
  font-weight: bold;
  vertical-align: middle;
}
</style>