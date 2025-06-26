<template>
    <section class="flat-spacing pt-0">
    <div class="container">
      <div class="sect-top wow fadeInUp">
        <h3 class="s-title">recently viewed products</h3>
        <div class="group-btn-slider">
          <div class="nav-prev-swiper tf-sw-nav">
            <i class="icon-arrow-left"></i>
          </div>
          <div class="nav-next-swiper tf-sw-nav">
            <i class="icon-arrow-right"></i>
          </div>
        </div>
      </div>
      <div dir="ltr" class="swiper tf-swiper wow fadeInUp" data-preview="4" data-tablet="3" data-mobile-sm="2" data-mobile="2" data-space-lg="30" data-space-md="20" data-space="15" data-pagination="2" data-pagination-sm="2" data-pagination-md="3" data-pagination-lg="4">
        <div class="swiper-wrapper">
          <div class="swiper-slide" v-for="product in products" :key="product.id">
            <div class="card_product--V01">
              <div class="card_product-wrapper">
                <a :href="`/product/${product.slug}`" class="product-img">
                  <img :src="product.image" :alt="product.name" class="lazyload img-product">
                  <img v-if="product.hover_image" :src="product.hover_image" :alt="product.name" class="lazyload img-hover">
                </a>
                <ul class="list-product-btn">
                  <li class="wishlist">
                    <a href="javascript:void(0);" class="hover-tooltip tooltip-left box-icon" @click.prevent="addToWishlist(product)">
                      <span class="icon icon-heart-2"></span>
                      <span class="tooltip">Add to Wishlist</span>
                    </a>
                  </li>
                  <li>
                    <a href="#shoppingCart" data-bs-toggle="offcanvas" class="hover-tooltip tooltip-left box-icon" @click.prevent="addToCart(product)"
                        :disabled="loadingProductId === product.id"
                    >
                      <span class="icon">
                          <i v-if="loadingProductId === product.id" class="fas fa-spinner fa-spin"></i>
                          <i v-else-if="successProductId === product.id" class="icon icon-check"></i>
                          <i v-else class="icon icon-shop-cart"></i>
                      </span>
                      <span class="tooltip">Add to Cart</span>
                    </a>
                  </li>
                  <li>
                    <a href="#quickView" data-bs-toggle="modal" class="hover-tooltip tooltip-left box-icon quickview" @click.prevent="quickView(product)">
                      <span class="icon icon-view"></span>
                      <span class="tooltip">Quick View</span>
                    </a>
                  </li>
                  <li class="compare">
                    <a href="#compare" data-bs-toggle="modal" aria-controls="compare" class="hover-tooltip tooltip-left box-icon" @click.prevent="addToCompare(product)">
                      <span class="icon icon-compare"></span>
                      <span class="tooltip">Add to Compare</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="card_product-info">
                <a :href="`/product/${product.slug}`" class="name-product h5 fw-normal link text-line-clamp-2">
                  {{ product.name }}
                </a>
                <div class="price-wrap">
                  <span class="price-new h5">${{ product.sale_price || product.price }}</span>
                  <span v-if="product.sale_price" class="price-old fw-normal">${{ product.price }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sw-dot-default tf-sw-pagination d-xl-none"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toast-notification';

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  }
})

const cart = useCartStore()
const toast = useToast()

const loadingProductId = ref(null)
const successProductId = ref(null)

const addToCart = async (product) => {
  if (!product) return;

  loadingProductId.value = product.id;
  successProductId.value = null;

  try {
    const cartData = {
        productId: product.id,
        quantity: 1,
        cartToken: localStorage.getItem('cartToken') || generateCartToken()
    };

    const response = await cart.addToCart(cartData);

    if (response.status === 'success') {
        if (response.cartToken) {
            localStorage.setItem('cartToken', response.cartToken);
        }

        await cart.getCartCount();

        toast.success('Product added to cart successfully');

        successProductId.value = product.id;
        setTimeout(() => {
            successProductId.value = null;
        }, 2000);

    } else {
        toast.error(response.message || 'Failed to add product to cart');
    }
  } catch (error) {
    console.error('Error adding to cart from RecentlyViewed:', error);
    toast.error('Failed to add product to cart');
  } finally {
    loadingProductId.value = null;
  }
};

const generateCartToken = () => {
    return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

const addToWishlist = (product) => {
  // Implement your wishlist logic here
}

const quickView = (product) => {
  // Implement your quick view logic here
}

const addToCompare = (product) => {
  // Implement your compare logic here
}
</script>

<style scoped>
.hover-tooltip .icon-check {
  font-size: 16px;
  vertical-align: middle;
}
</style>