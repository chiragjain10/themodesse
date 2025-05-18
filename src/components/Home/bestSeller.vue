<template>
  <section class="product-wrapper appear-animate mt-6 mt-md-10 pt-4 pb-8">
    <div class="">
      <h2 class="title title-center mb-5">Best Sellers</h2>

      <div class="row">
        <div v-if="!loading" class="owl-carousel owl-theme row owl-nav-full cols-2 cols-md-3 cols-lg-5"
          data-owl-options='{
            "items": 5,
            "nav": true,
            "loop": true,
            "dots": true,
            "margin": 0,
            "responsive": {
              "0": { "items": 2 },
              "768": { "items": 3 },
              "992": { "items": 4, "dots": false, "nav": true }
            }
          }'>
          <div class="product text-center" v-for="product in bestSellers" :key="product.id">
            <figure class="product-media">
              <RouterLink :to="`/product/${product.slug}`">
                <img :src="product.image" :alt="product.name" width="280" height="315"
                  style="background-color: #f2f3f5;" />
              </RouterLink>
              <div class="product-label-group" v-if="product.is_new">
                <label class="product-label label-new">New</label>
              </div>
              <div class="product-action-vertical">
                <button class="btn-product-icon btn-cart add-to-cart-btn" @click="addToCart(product)"
                  :disabled="loadingProductId === product.p_id" title="Add to cart">
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
                <button class="btn-product-icon btn-wishlist" :class="{ active: wishlist.isWishlisted(product.p_id) }"
                  @click="handleWishlist(product)" :disabled="loadingWishlistId === product.p_id"
                  title="Add to wishlist">
                  <template v-if="loadingWishlistId === product.p_id">
                    <span class="spinner"></span>
                  </template>
                  <template v-else-if="successWishlistId === product.p_id">
                    <span class="checkmark">&#10003;</span>
                  </template>
                  <template v-else>
                    <i class="d-icon-heart"></i>
                  </template>
                </button>
              </div>
              <div class="product-action">
                <RouterLink :to="`/product/${product.slug}`" class="btn-product btn-quickview" title="Quick View">Quick
                  View
                </RouterLink>
              </div>
            </figure>
            <div class="product-details">
              <div class="product-cat">
                <RouterLink :to="`/category/${product.category?.slug}`">{{ product.category?.name }}</RouterLink>
              </div>
              <h3 class="product-name">
                <RouterLink :to="`/product/${product.slug}`">{{ product.name }}</RouterLink>
              </h3>
              <div class="product-price">
                <span class="price">₹{{ product.sale_price }}</span>
              </div>
              <div class="ratings-container">
                <div class="ratings-full">
                  <span class="ratings" :style="{ width: product.rating * 20 + '%' }"></span>
                </div>
                <RouterLink :to="`/product/${product.slug}`" class="rating-reviews">
                  ({{ product.reviews_count }} reviews)
                </RouterLink>
              </div>
            </div>
          </div>
        </div>

        <template v-else>
          <div class="col-xs-6 col-lg-3 mb-4" v-for="n in 4" :key="n">
            <div class="category shimmer-loader">
              <div class="skeleton-img"></div>
              <div class="skeleton-text mt-2"></div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getData } from '@/stores/getApi';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
import { useWishlistStore } from '@/stores/wishlist';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const wishlist = useWishlistStore();

const bestSellers = ref([]);
const loading = ref(true);
const loadingProductId = ref(null);
const successProductId = ref(null);
const loadingWishlistId = ref(null);
const successWishlistId = ref(null);

const addToCart = async (product, qty = 1) => {
  if (!auth.user) {
    router.push('/login');
    return;
  }
  loadingProductId.value = product.p_id;
  try {
    await cart.addToCart(product.p_id, qty);
    successProductId.value = product.p_id;
    setTimeout(() => {
      successProductId.value = null;
    }, 1000);
  } catch (err) {
    console.error('Error adding to cart:', err);
  } finally {
    loadingProductId.value = null;
  }
};

const handleWishlist = async (product) => {
  if (!auth.user) {
    router.push('/login');
    return;
  }
  loadingWishlistId.value = product.p_id;
  try {
    if (wishlist.isWishlisted(product.p_id)) {
      await wishlist.removeFromWishlist(product.p_id);
    } else {
      await wishlist.addToWishlist(product.p_id);
      successWishlistId.value = product.p_id;
      setTimeout(() => {
        successWishlistId.value = null;
      }, 1000);
    }
  } catch (err) {
    console.error('Error updating wishlist:', err);
  } finally {
    loadingWishlistId.value = null;
  }
};

onMounted(async () => {
  try {
    const response = await getData('/api/shop');
    bestSellers.value = response.products || [];
    await wishlist.fetchWishlist();
  } catch (error) {
    console.error('Error loading best sellers:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.add-to-cart-btn {
  position: relative;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #fff;
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

.checkmark {
  color: #fff;
  font-size: 14px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.btn-wishlist.active {
  color: #e14b4b;
}

section::before{
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: #e2d392;
}
</style>