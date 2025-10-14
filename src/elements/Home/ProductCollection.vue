<template>
  <section class="collection-bg">
    <SEOHead :title="`${pageTitle} | The Modesse`" :description="`Browse ${pageTitle} by The Modesse`" />
    <div class="collection-header">
      <h1 class="collection-title">{{ pageTitle }}</h1>
    </div>

    <div v-if="loading" class="loading">Loading products...</div>
    <div v-else>
      <div v-if="products.length === 0" class="empty">No products found.</div>
      <template v-else>
        <div class="sort-inline">
          <label for="pc-sort" class="sort-label">Sort:</label>
          <select id="pc-sort" class="sort-select" v-model="sortKey" @change="applySort(sortKey)">
            <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>
        <div class="product-grid">
          <RouterLink v-for="product in paginatedProducts" :key="product.id" :to="`/product/${product.slug}`"
            class="product-card-link">
            <div class="product-card">
              <div class="product-img-wrap">
                <img :src="product.image" :alt="product.name" class="product-img" />
              </div>
              <div class="product-info">
                <h2 class="product-name">{{ product.name }}</h2>
                <p class="product-price" v-if="product.price != null">₹{{ Math.round(product.price) }}</p>
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- Pagination -->
        <div v-if="pagination.total > pagination.per_page" class="pagination mt-5">
          <div class="flex justify-center space-x-2">
            <button @click="goToPage(pagination.current_page - 1)" :disabled="pagination.current_page === 1"
              class="px-4 py-2 border rounded"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.current_page === 1 }">
              Previous
            </button>
            <button v-for="n in pagination.total_pages" :key="n" @click="goToPage(n)" class="px-4 py-2 border rounded"
              :class="{ 'main-bg-color text-white': n === pagination.current_page }">
              {{ n }}
            </button>
            <button @click="goToPage(pagination.current_page + 1)"
              :disabled="pagination.current_page === pagination.total_pages" class="px-4 py-2 border rounded"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.current_page === pagination.total_pages }">
              Next
            </button>
          </div>
        </div>
      </template>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { getData } from '@/stores/getApi'
import SEOHead from '@/components/SEOHead.vue'

const route = useRoute()
const router = useRouter()
const products = ref([])
const loading = ref(true)
const pagination = ref({ current_page: 1, per_page: 12, total: 0, total_pages: 1 })

// Sorting state
const sortKey = ref('featured')
const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'best', label: 'Best selling' },
  { value: 'az', label: 'Alphabetically, A–Z' },
  { value: 'za', label: 'Alphabetically, Z–A' },
  { value: 'price_low', label: 'Price, low to high' },
  { value: 'price_high', label: 'Price, high to low' },
  { value: 'date_old', label: 'Date, old to new' },
  { value: 'date_new', label: 'Date, new to old' },
]
function applySort(val) {
  sortKey.value = val
  // write to query
  const q = { ...route.query, sort: val, page: 1 }
  router.push({ path: route.path, query: q })
}

const keyParam = computed(() => route.query.key || route.query.section || '')
const labelParam = computed(() => route.query.label || '')
const pageParam = computed(() => {
  const p = Number(route.query.page)
  return Number.isFinite(p) && p > 0 ? Math.floor(p) : 1
})

const keyToLabel = (key) => {
  const map = {
    Brunch: 'Brunch',
    JetSetter: 'JetSetter',
    Framework: 'Framework',
    Handwrought: 'Handwrought',
    Outline: 'Outline',
    Bare: 'Bare',
    eveningWearBanner: 'Evening',
    workwearCollection: 'Work',
    vacationCollection: 'Vacation',
    collections: 'Collections',
    newArrivals: 'New In',
    topSales: 'Top Sales',
    topRatings: 'Top Ratings',
  }
  return map[key] || key || 'Collection'
}

const pageTitle = computed(() => labelParam.value || keyToLabel(keyParam.value))

async function fetchProducts() {
  loading.value = true
  try {
    const res = await getData('/api/home')
    const source = res?.data || res || {}
    const key = keyParam.value
    const list = Array.isArray(source[key]) ? source[key] : []
    products.value = list.map(item => ({
      id: item.id,
      name: item.name || item.title || 'Product',
      price: item.price,
      slug: item.slug,
      image: item.thumbnail_image || item.image || '',
      created_at: item.created_at || item.date || null,
      sold: item.total_sales || item.sold || item.orders || 0,
    }))
    // init pagination
    pagination.value.total = products.value.length
    pagination.value.total_pages = Math.max(1, Math.ceil(pagination.value.total / pagination.value.per_page))
    // set current page from query (clamped)
    const desired = pageParam.value
    pagination.value.current_page = Math.min(Math.max(1, desired), pagination.value.total_pages)

    // Default sort depending on collection key when no explicit sort in query
    if (!route.query.sort) {
      if (key === 'newArrivals') {
        sortKey.value = 'date_new'
      } else if (key === 'topSales') {
        sortKey.value = 'best'
      }
    }
  } catch (e) {
    products.value = []
    pagination.value = { current_page: 1, per_page: 12, total: 0, total_pages: 1 }
  } finally {
    loading.value = false
  }
}

onMounted(fetchProducts)
// Refetch when collection key changes
watch(() => keyParam.value, fetchProducts)
// Update current page when only page query changes
watch(() => pageParam.value, (p) => {
  pagination.value.current_page = Math.min(Math.max(1, p), pagination.value.total_pages)
})
// Initialize sort from query and react when query changes
onMounted(() => {
  const s = route.query.sort
  if (typeof s === 'string' && s) sortKey.value = s
})
watch(() => route.query.sort, (s) => {
  if (typeof s === 'string' && s) sortKey.value = s
})

// Computed: current page slice
const sortedProducts = computed(() => {
  const arr = [...products.value]
  switch (sortKey.value) {
    case 'az':
      return arr.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    case 'za':
      return arr.sort((a, b) => (b.name || '').localeCompare(a.name || ''))
    case 'price_low':
      return arr.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity))
    case 'price_high':
      return arr.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity))
    case 'date_old':
      return arr.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0))
    case 'date_new':
      return arr.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
    case 'best':
      return arr.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0))
    case 'featured':
    default:
      return arr // keep API order
  }
})
const paginatedProducts = computed(() => {
  const start = (pagination.value.current_page - 1) * pagination.value.per_page
  const end = start + pagination.value.per_page
  return sortedProducts.value.slice(start, end)
})

// Methods: change page
function goToPage(n) {
  const total = pagination.value.total_pages
  if (n < 1 || n > total) return
  const query = { ...route.query, page: n }
  router.push({ path: route.path, query })
}
</script>

<style scoped>
.product-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.collection-bg {
  background: linear-gradient(120deg, #f8fafc 0%, #f3f4f6 100%);
  min-height: 100vh;
  padding: 0 0 60px 0;
}

.collection-header {
  max-width: 1100px;
  margin: 0 auto;
  padding: 30px 16px 16px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.collection-title {
  font-size: 1.6rem;
  font-weight: 400;
  color: #1a1a1a;
  margin-bottom: .2rem;
  letter-spacing: .5px;
  text-align: center;
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
  transition: box-shadow .18s, transform .18s;
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
  margin-bottom: .4rem;
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

.empty {
  text-align: center;
  color: #666;
  padding: 40px 0;
}

@media (max-width: 507px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .collection-title {
    font-size: 2rem;
  }
}

.main-bg-color {
  background-color: #72381C;
}

/* Sort UI */
.sort-inline {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  /* gap: 8px; */
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
  margin-bottom: 7px;
}

.sort-label {
  font-weight: 400;
  color: #333;
}

.sort-select {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 10px;
  background: #fff;
}
</style>
