<template>
  <!-- SEO Component -->
  <SEOHead 
    v-if="product"
    :title="seoTitle"
    :description="seoDescription"
    :keywords="seoKeywords"
    :image="product.images?.[0] || '/src/assets/images/themodesse.jpg'"
    :schema="productSchema"
  />
  
  <ProductTitle />
  <!-- Product Detail -->
  <section class="themesFlat">
    <div class="tf-main-product section-image-zoom pb-5">
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
            <MainImage :product="product" />
          </div>
          <div class="col-lg-6">
            <ProductDescribe 
              :product="product"
              :handle-attributes-update="handleAttributesUpdate"
              :handle-quantity-update="handleQuantityUpdate"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="tf-sticky-btn-atc">
      <div class="container">
        <!-- <BottomSticyBar /> -->
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'
import SEOHead from '@/components/SEOHead.vue';
import ProductTitle from './productTitle.vue';
import MainImage from './MainImage.vue';
import ProductDescribe from './productDescribe.vue';

const route = useRoute()
const productStore = useProductStore()
const { product, loading, error } = storeToRefs(productStore)

// SEO Computed Properties
const seoTitle = computed(() => {
  if (!product.value) return 'Product Details - The Modesse';
  return `${product.value.name} | Premium Contemporary Womenswear - The Modesse`;
});

const seoDescription = computed(() => {
  if (!product.value) return 'Discover premium contemporary womenswear at The Modesse.';
  return `${product.value.name} - Premium contemporary womenswear from The Modesse. Handcrafted designer clothing made from finest Indian fabrics. ${product.value.description || 'Elegant design with modern sensibilities.'}`;
});

const seoKeywords = computed(() => {
  if (!product.value) return 'premium contemporary clothing, designer womenswear, luxury fashion';
  const productName = product.value.name.toLowerCase();
  const category = product.value.category?.name || '';
  return `${productName}, ${category}, premium contemporary clothing, designer womenswear, luxury fashion, modern ethnic wear, handcrafted garments, sustainable fashion, Indian designer clothes, boutique clothing, elegant dresses, contemporary fashion`;
});

const productSchema = computed(() => {
  if (!product.value) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.value.name,
    "description": product.value.description || `${product.value.name} - Premium contemporary womenswear from The Modesse`,
    "url": `https://themodesse.com/product/${product.value.slug}`,
    "image": product.value.images || [],
    "brand": {
      "@type": "Brand",
      "name": "The Modesse"
    },
    "category": product.value.category?.name || "Contemporary Womenswear",
    "offers": {
      "@type": "Offer",
      "price": product.value.price,
      "priceCurrency": "INR",
      "availability": product.value.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "url": `https://themodesse.com/product/${product.value.slug}`,
      "seller": {
        "@type": "Organization",
        "name": "The Modesse"
      }
    },
    "aggregateRating": product.value.rating ? {
      "@type": "AggregateRating",
      "ratingValue": product.value.rating,
      "reviewCount": product.value.review_count || 0
    } : undefined,
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Material",
        "value": "Khadi, Handloom, Pure Cotton"
      },
      {
        "@type": "PropertyValue",
        "name": "Made In",
        "value": "India"
      },
      {
        "@type": "PropertyValue",
        "name": "Style",
        "value": "Contemporary"
      }
    ]
  };
});

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
}

const fetchProduct = async () => {
  await productStore.fetchProduct(route.params.slug)
}

onMounted(() => {
  fetchProduct();
});

watch(() => route.params.slug, () => {
  fetchProduct();
});
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