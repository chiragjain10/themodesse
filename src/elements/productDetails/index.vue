<template>
  <ProductTitle />
  <!-- Product Detail -->
  <section class="themesFlat">
    <div class="tf-main-product section-image-zoom">
      <div class="container">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="error" class="alert alert-danger" role="alert">
          {{ error }}
          <button class="btn btn-link" @click="fetchProduct">Try Again</button>
        </div>

        <div v-else-if="product" class="row">
          <div class="col-lg-6">
            <!-- main image -->
            <MainImage />
          </div>
          <div class="col-lg-6">
            <ProductDescribe />
          </div>
        </div>
      </div>
    </div>
    <div class="tf-sticky-btn-atc">
      <div class="container">
        <BottomSticyBar />
      </div>
    </div>
  </section>
  <!-- /Product Detail -->
  <!-- For You -->
  <ForYou />
  <!-- /For You -->
  <IconBox />
  <div class="tf-product-info-price">
    <span class="price">₹{{ selectedProductData.totalPrice || product?.sale_price || product?.price }}</span>
    <span v-if="product?.original_price" class="price-old">₹{{ product.original_price }}</span>
  </div>
  <ProductAttributes 
    :product="product" 
    @update:selectedAttributes="handleAttributesUpdate"
  />
  <ProductButtons 
    :product="product" 
    @update:quantity="handleQuantityUpdate"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import ProductTitle from './productTitle.vue';
import MainImage from './MainImage.vue';
import ProductDescribe from './productDescribe.vue';
import BottomSticyBar from './bottomSticyBar.vue';
import ForYou from './forYou.vue';
import IconBox from '../Home/icon-box.vue';
import ProductAttributes from './attributes.vue'
import ProductButtons from './buttons.vue'

const route = useRoute()
const productStore = useProductStore()
const { product, loading, error } = storeToRefs(productStore)

const selectedProductData = ref({
  attributes: {},
  quantity: 1,
  totalPrice: 0
})

const handleAttributesUpdate = (data) => {
  selectedProductData.value = data
  console.log('Selected Product Data:', selectedProductData.value)
}

const handleQuantityUpdate = (newQuantity) => {
  console.log('Quantity updated:', newQuantity)
}

const addToCart = () => {
  // Here you can use selectedProductData.value to add to cart
  const cartItem = {
    product_id: product.value.id,
    quantity: selectedProductData.value.quantity,
    attributes: selectedProductData.value.attributes,
    price: selectedProductData.value.totalPrice
  }
  console.log('Adding to cart:', cartItem)
  // Add your cart logic here
}

const fetchProduct = async () => {
  await productStore.fetchProduct(route.params.slug)
}

onMounted(() => {
  fetchProduct()
})
</script>

<style scoped>
.tf-product-details {
  padding: 40px 0;
}

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.alert {
  margin: 20px 0;
}

.btn-link {
  text-decoration: none;
  padding: 0;
  margin-left: 10px;
}
</style>