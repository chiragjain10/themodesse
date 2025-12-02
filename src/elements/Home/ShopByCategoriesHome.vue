<template>
  <section class="flat-spacing-9 px-xxl_15 py-5 shop-edit-home">
    <div>
      <div class="edit-grid wow fadeInUp">
        <RouterLink v-for="card in cards" :key="card.label" :to="card.to" :class="['edit-card-link', { disabled: card.upcoming }]" @click.prevent="card.upcoming && $event.preventDefault()">
          <div class="edit-card" :class="{ upcoming: card.upcoming }">
            <div class="img-wrap">
              <img :src="card.image" :alt="card.label" class="img" />
              <div class="overlay">
                <span class="label">{{ card.label }}</span>
                <span v-if="card.upcoming" class="up-badge">Upcoming</span>
              </div>
            </div>
          </div>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onActivated, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { getData } from '@/stores/getApi'

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

onMounted(async () => {
  try {
    const res = await getData('/api/home/categories')
    cards.value = cards.value.map(c => {
      return { ...c, image: c.image }
    })
  } catch (e) {
    console.error(e)
  }
  // Ensure WOW/animation hidden styles don't persist after navigation
  nextTick(() => forceShowGrid())
})

onActivated(() => {
  nextTick(() => forceShowGrid())
})

function forceShowGrid() {
  const grid = document.querySelector('.shop-edit-home .edit-grid')
  if (grid) {
    grid.style.visibility = 'visible'
    grid.style.animationName = 'none'
  }
  document.querySelectorAll('.shop-edit-home .edit-card').forEach(el => {
    el.style.visibility = 'visible'
    el.style.animationName = 'none'
  })
}
</script>

<style scoped>
/* Grid */
.edit-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 28px; max-width: 1180px; margin: 0 auto; padding: 0 16px; }
@media (max-width: 1024px) { .edit-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 680px) { .edit-grid { grid-template-columns: repeat(1, 1fr); } }

/* Card */
.edit-card-link { text-decoration: none; color: inherit; display: block; }
.edit-card { border-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); transition: transform .18s, box-shadow .18s; }
.edit-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.13); }
.img-wrap { position: relative; width: 100%; aspect-ratio: 1/1; background: #f3f4f6; }
.img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
.overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.05) 50%, transparent 80%); display: flex; align-items: flex-end; justify-content: center; padding: 18px; }
.label { color: #fff; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; font-size: 0.95rem; }

/* Upcoming state */
.edit-card-link.disabled { pointer-events: none; }
.edit-card.upcoming { cursor: not-allowed; }
.up-badge { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: #fff; font-weight: 700; font-size: 0.75rem; letter-spacing: 1px; padding: 6px 10px; border-radius: 6px; opacity: 0; transition: opacity .18s; }
.edit-card.upcoming:hover .up-badge { opacity: 1; }
@media (max-width: 680px) { .edit-card.upcoming .up-badge { opacity: 1; } }

/* Section wrapper (match New Arrivals spacing) */
.shop-edit-home .sect-top { display: flex; align-items: center; justify-content: space-between; }
</style>
