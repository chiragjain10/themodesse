<template>
  <section class="collection-bg">
    <SEOHead 
      title="Shop by Category | The Modesse"
      description="Browse categories by The Modesse"
    />
    <div class="collection-header">
      <h1 class="collection-title">Shop by Category</h1>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <div class="tile-grid">
        <RouterLink
          v-for="tile in sortedTiles"
          :key="tile.label"
          :to="tile.to"
          :class="['tile-link', { disabled: tile.upcoming }]"
          @click.prevent="tile.upcoming && $event.preventDefault()"
        >
          <div class="tile-card" :class="{ upcoming: tile.upcoming }">
            <div class="tile-img-wrap">
              <img :src="tile.image" :alt="tile.label" class="tile-img" />
              <div class="tile-overlay">
                <span class="tile-label">{{ tile.label }}</span>
                <span v-if="tile.upcoming" class="up-badge">Upcoming</span>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { RouterLink } from 'vue-router'
import SEOHead from '@/components/SEOHead.vue'

const loading = ref(true)
const tiles = ref([])

const cards = ref([
  { key: 'best', label: 'Best Seller', image: './images/categories/bestseller.jpg', to: { path: '/product-collection', query: { key: 'topSales', label: 'Best Sellers' } } },
  { key: 'dresses', label: 'Dresses', image: './images/categories/dresses.jpg', to: { path: '/shop', query: { category_id: 2 } } },
  { key: 'sets', label: 'Sets', image: './images/categories/sets.jpg', to: { path: '/shop', query: { category_id: 3 } } },
  { key: 'skirts', label: 'Skirts', image: './images/categories/skirts.jpg', to: { path: '/shop', query: { category_id: 1 } } },
  { key: 'shirts', label: 'Shirts', image: './images/categories/shirts.jpg', to: { path: '/shop', query: { category_id: 6 } }, upcoming: true },
  { key: 'jumpsuits', label: 'Jumpsuits', image: './images/categories/jumpsuits.jpg', to: { path: '/shop', query: { category_id: 4 } } },
  { key: 'trousers', label: 'Trousers', image: './images/categories/trousers.jpg', to: { path: '/shop', query: { category_id: 5 } }, upcoming: true },
  { key: 'jackets', label: 'Jackets', image: './images/categories/jackets.jpg', to: { path: '/shop', query: { category_id: 7 } }, upcoming: true },
])

async function load() {
  loading.value = true
  try {
    // Build directly from static cards list so images and targets match design
    // Preserve 'upcoming' flag for UI state
    tiles.value = cards.value.map(c => ({ label: c.label, image: c.image, to: c.to, upcoming: !!c.upcoming }))
  } catch (e) {
    tiles.value = cards.value.map(c => ({ label: c.label, image: c.image, to: c.to, upcoming: !!c.upcoming }))
  } finally {
    loading.value = false
  }
}

onMounted(load)

const sortedTiles = computed(() => {
  const arr = [...tiles.value]
  return arr
})
</script>

<style scoped>
.collection-bg { background: linear-gradient(120deg, #f8fafc 0%, #f3f4f6 100%); min-height: 100vh; padding: 0 0 60px 0; }
.collection-header { max-width: 1100px; margin: 0 auto; padding: 60px 16px 16px 16px; display: flex; align-items: center; justify-content: center; gap: 16px; }
.collection-title {
  font-size: 1.6rem;
  font-weight: 400;
  color: #1a1a1a;
  margin-bottom: .2rem;
  letter-spacing: .5px;
  text-align: center;
}

.tile-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; max-width: 1180px; margin: 0 auto; padding: 0 16px; }
@media (max-width: 1024px) { .tile-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 680px) { .tile-grid { grid-template-columns: repeat(1, 1fr); } }

.tile-link { text-decoration: none; color: inherit; display: block; }
.tile-card { border-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); transition: transform .18s, box-shadow .18s; }
.tile-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.13); }
.tile-img-wrap { position: relative; width: 100%; aspect-ratio: 1/1; background: #f3f4f6; }
.tile-img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
.tile-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.05) 50%, transparent 80%); display: flex; align-items: flex-end; justify-content: center; padding: 18px; }
.tile-label { color: #fff; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; font-size: 0.95rem; }
.loading { text-align: center; font-size: 1.2rem; color: #888; margin: 60px 0; }

/* Upcoming state */
.tile-link.disabled { pointer-events: none; }
.tile-card.upcoming { cursor: not-allowed; }
.up-badge { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #fff; font-weight: 700; font-size: 0.75rem; letter-spacing: 1px; padding: 6px 10px; border-radius: 6px; opacity: 0; transition: opacity .18s; }
.tile-card.upcoming:hover .up-badge { opacity: 1; }
 .tile-card.upcoming .up-badge { opacity: 1; }
</style>
