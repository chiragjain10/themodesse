<template>
  <div class="tf-product-fbt">
    <h4 class="title fw-normal text-uppercase">Frequently Bought together</h4>
    <form class="tf-product-form-bundle">
      <ul class="tf-bundle-products">
        <li class="tf-bundle-product-item" v-for="(product, idx) in products" :key="product.id || idx">
          <div class="bundle-check">
            <input type="checkbox" class="tf-check style-2" v-model="selectedProducts" :value="product"
              :checked="idx === 0" :disabled="idx === 0" />
          </div>
          <a :href="`/product/${product.slug}`" class="bundle-image">
            <img :src="product.image" :alt="product.name" />
          </a>
          <div class="bundle-info">
            <a :href="`/product/${product.slug}`" class="name link h5 fw-normal">
              {{ product.name }}
            </a>
            <div class="bundle-price price-wrap">
              <span class="price-new h5">${{ product.price || product.price }}</span>
              <span v-if="product.price" class="price-old fw-normal">${{ product.price }}</span>
            </div>
          </div>
        </li>
      </ul>
      <a href="#shoppingCart" data-bs-toggle="offcanvas"
        class="tf-btn btn-fill text-uppercase fw-medium w-100 animate-btn" @click.prevent="addSelectedToCart">
        add to bag
        <i class="icon-minus"></i>
        <span class="total-price"></span>
      </a>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  products: {
    type: Array,
    default: () => []
  }
})

const cart = useCartStore()
const selectedProducts = ref(props.products.length ? [props.products[0]] : [])

// Keep selectedProducts in sync if products prop changes
watch(() => props.products, (newVal) => {
  selectedProducts.value = newVal.length ? [newVal[0]] : []
})

const addSelectedToCart = async () => {
  for (const product of selectedProducts.value) {
    await cart.addToCart(product.id, 1)
  }
  // Optionally, show a success message or open the cart offcanvas here
}
</script>