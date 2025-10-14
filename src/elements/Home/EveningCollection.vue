<template>
  <section class="Evening-collection-bg">
    <div class="Evening-collection-header">
      <h1 class="collection-title">Evening Collection</h1>
    </div>
    <div v-if="loading" class="loading">Loading products...</div>
    <div v-else class="product-grid">
      <RouterLink v-for="product in products" :key="product.id" :to="`/product/${product.slug}`"
        class="product-card-link">
        <div class="product-card">
          <div class="product-img-wrap">
            <img :src="product.image" :alt="product.name" class="product-img" />
          </div>
          <div class="product-info">
            <h2 class="product-name">{{ product.name }}</h2>
            <p class="product-price">₹{{ Math.round(product.price) }}</p>
          </div>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { getData } from '@/stores/getApi';

const products = ref([]);
const loading = ref(true);
const route = useRoute();

async function fetchProducts() {
  loading.value = true;
  try {
    const res = await getData('/api/home');
    products.value = (res.eveningWearBanner || []).map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      slug: item.slug,
      image: item.thumbnail_image || '',
    }));
  } catch (e) {
    products.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(fetchProducts);
watch(() => route.fullPath, fetchProducts);
</script>

<style scoped>
.product-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.Evening-collection-bg {
  background: linear-gradient(120deg, #f8fafc 0%, #f3f4f6 100%);
  min-height: 100vh;
  padding: 0 0 60px 0;
}

.Evening-collection-header {
  max-width: 900px;
  margin: 0 auto;
  padding: 60px 16px 32px 16px;
  text-align: center;
}

.collection-title {
  font-size: 2.7rem;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 0.7rem;
  letter-spacing: 0.5px;
}

.collection-desc {
  color: #666;
  font-size: 1.18rem;
  margin-bottom: 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2.2rem;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
}

.product-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.18s, transform 0.18s;
  cursor: pointer;
}

.product-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.13);
  transform: translateY(-4px) scale(1.03);
}

.product-img-wrap {
  width: 100%;
  aspect-ratio: 1/1.2;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.product-info {
  padding: 18px 12px 20px 12px;
  width: 100%;
  text-align: center;
}

.product-name {
  font-size: 1.13rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.4rem;
}

.product-price {
  font-size: 1.08rem;
  color: #444;
  font-weight: 600;
}

.loading {
  text-align: center;
  font-size: 1.2rem;
  color: #888;
  margin: 60px 0;
}

@media (max-width: 507px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .product-name {
    font-size: 1rem;
  }

  .product-price {
    font-size: .9rem;
  }

  .collection-title {
    font-size: 2rem;
  }

  .collection-desc {
    font-size: .9rem;
  }
}
</style>