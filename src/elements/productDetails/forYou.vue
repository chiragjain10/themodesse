<template>
  <section class="flat-spacing-3 forYou pt-0">
    <div class="container">
      <div class="sect-top wow fadeInUp">
        <h3 class="s-title">YOU MAY ALSO LIKE</h3>
        <div class="group-btn-slider">
          <div class="nav-prev-swiper tf-sw-nav">
            <i class="icon-arrow-left"></i>
          </div>
          <div class="nav-next-swiper tf-sw-nav">
            <i class="icon-arrow-right"></i>
          </div>
        </div>
      </div>
      <div dir="ltr" class="swiper tf-swiper wow fadeInUp" data-preview="4" data-tablet="3" data-mobile-sm="2"
        data-mobile="2" data-space-lg="30" data-space-md="20" data-space="15" data-pagination="2" data-pagination-sm="2"
        data-pagination-md="3" data-pagination-lg="4">
        <div class="swiper-wrapper">
          <div v-for="product in relatedProducts" :key="product.id" class="swiper-slide">
            <div class="card_product--V01">
              <div class="card_product-wrapper">
                <router-link :to="`/product/${product.slug}`" class="product-img">
                  <img :src="product.thumbnail_image" :data-src="product.thumbnail_image" :alt="product.name"
                    class="lazyload img-product">
                  <img v-if="product.hover_image" :src="product.hover_image" :data-src="product.hover_image"
                    :alt="product.name" class="lazyload img-hover">
                </router-link>
                <ul class="list-product-btn">
                  <li class="wishlist">
                    <a href="javascript:void(0);" class="hover-tooltip tooltip-left box-icon"
                      @click="addToWishlist(product)">
                      <span class="icon icon-heart-2"></span>
                      <span class="tooltip">Add to Wishlist</span>
                    </a>
                  </li>
                  <li class="shop-cart">
                    <a href="javascript:void(0);" class="hover-tooltip tooltip-left box-icon"
                      @click="addToCart(product)"
                      :disabled="loadingProductId === product.id">
                      <span class="icon">
                        <i v-if="loadingProductId === product.id" class="fas fa-spinner fa-spin"></i>
                        <i v-else-if="successProductId === product.id" class="icon icon-check"></i>
                        <i v-else class="icon icon-shop-cart"></i>
                      </span>
                      <span class="tooltip">Add to Cart</span>
                    </a>
                  </li>
                  <li>
                    <a href="#quickView" data-bs-toggle="modal" class="hover-tooltip tooltip-left box-icon quickview"
                      @click="quickView(product)">
                      <span class="icon icon-view"></span>
                      <span class="tooltip">Quick View</span>
                    </a>
                  </li>
                  <li class="compare">
                    <a href="#compare" data-bs-toggle="modal" aria-controls="compare"
                      class="hover-tooltip tooltip-left box-icon" @click="addToCompare(product)">
                      <span class="icon icon-compare"></span>
                      <span class="tooltip">Add to Compare</span>
                    </a>
                  </li>
                </ul>
              </div>
              <div class="card_product-info">
                <router-link :to="`/product/${product.slug}`" class="name-product h5 fw-normal link text-line-clamp-2">
                  {{ product.name }}
                </router-link>
                <div class="price-wrap">
                  <span class="price-new h5">${{ product.price }}</span>
                  <span v-if="product.discount_price" class="price-old fw-normal">${{ product.price }}</span>
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
import { onMounted, onBeforeUnmount, ref, nextTick } from 'vue'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import Swiper from 'swiper'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { useCartStore } from '@/stores/cart'
import { useToast } from 'vue-toast-notification'

const productStore = useProductStore()
const cart = useCartStore()
const toast = useToast()
const { relatedProducts } = storeToRefs(productStore)

const swiperRef = ref(null)
let swiper = null

// Add states for add to cart loading and success for individual products
const loadingProductId = ref(null)
const successProductId = ref(null)

const initSwiper = () => {
  swiper = new Swiper('.forYou .tf-swiper', {
    modules: [Navigation, Pagination],
    slidesPerView: 4,
    spaceBetween: 30,
    navigation: {
      nextEl: '.nav-next-swiper',
      prevEl: '.nav-prev-swiper',
    },
    pagination: {
      el: '.sw-dot-default',
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 15,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 30,
      }
    }
  })
  swiperRef.value = swiper
}

const addToWishlist = (product) => {
  productStore.addToWishlist(product)
}

const addToCart = async (product) => {
  if (!product) return

  loadingProductId.value = product.id
  successProductId.value = null

  try {
    const cartData = {
      productId: product.id,
      quantity: 1,
      cartToken: localStorage.getItem('cartToken') || generateCartToken()
    }

    const response = await cart.addToCart(cartData)

    if (response.status === 'success') {
      if (response.cartToken) {
        localStorage.setItem('cartToken', response.cartToken)
      }

      await cart.getCartCount()

      toast.success('Product added to cart successfully')

      successProductId.value = product.id
      setTimeout(() => {
        successProductId.value = null
      }, 2000)

    } else {
      toast.error(response.message || 'Failed to add product to cart')
    }
  } catch (error) {
    console.error('Error adding to cart:', error)
    toast.error('Failed to add product to cart')
  } finally {
    loadingProductId.value = null
  }
}

const generateCartToken = () => {
  return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

const quickView = (product) => {
  // Implement quick view functionality
  console.log('Quick view:', product)
}

const addToCompare = (product) => {
  productStore.addToCompare(product)
}

onMounted(() => {
  // Initialize Swiper after component is mounted
  nextTick(() => {
    initSwiper()
  })
})

onBeforeUnmount(() => {
  // Properly destroy Swiper instance
  if (swiperRef.value) {
    swiperRef.value.destroy(true, true)
    swiperRef.value = null
  }
})
</script>