<template>
  <section class="collection-bg">
    <SEOHead 
      title="Shop by Edit | The Modesse"
      description="Browse edits by The Modesse"
    />

    <div class="collection-header">
      <h1 class="collection-title">Shop by Edit</h1>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <div class="tile-grid">
        <RouterLink
          v-for="tile in sortedTiles"
          :key="tile.label"
          :to="{ path: '/product-collection', query: { key: tile.key, label: tile.label } }"
          class="tile-link"
        >
          <div class="tile-card">
            <div class="tile-img-wrap">
              <img :src="tile.image" :alt="tile.label" class="tile-img" />
              <div class="tile-overlay">
                <span class="tile-label">{{ tile.label }}</span>
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

const STATIC_EDITS = [
  { key: 'Bare', label: 'Bare', image: '/images/edits/bare.jpg' },
  { key: 'Brunch', label: 'Brunch', image: '/images/edits/brunch.jpg' },
  { key: 'JetSetter', label: 'JetSetter', image: '/images/edits/jetsetter.jpg' },
  { key: 'Framework', label: 'Framework', image: '/images/edits/framework.jpg' },
  { key: 'Handwrought', label: 'Handwrought', image: '/images/edits/handwrought.jpg' },
  { key: 'vacationCollection', label: 'Vacation', image: '/images/edits/vacation.jpg' },
  { key: 'eveningWearBanner', label: 'Evening', image: '/images/edits/evening.jpg' },
  { key: 'workwearCollection', label: 'Work', image: '/images/edits/work.jpg' },
  { key: 'Outline', label: 'Outline', image: '/images/edits/outline.jpg' },
]

const loading = ref(true)
const tiles = ref([])

onMounted(() => {
  tiles.value = STATIC_EDITS
  loading.value = false
})

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
</style>
