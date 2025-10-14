<template>
  <section class="flat-spacing-9 px-xxl_15 py-5 shop-by-edits">
    <div>
      <div class="sect-top wow fadeInUp animated text-center" style="visibility: visible; animation-name: fadeInUp;">
        <h3 class="s-title text-capitalize d-md-none ms-md-5">Shop by Edit</h3>
        <h1 class="s-title text-capitalize d-none d-md-block ms-md-5">Shop by Edit</h1>
        <div class="group-btn-slider type-2">
          <div class="nav-prev-swiper tf-sw-nav">
            <i class="icon-arrow-left"></i>
          </div>
          <div class="nav-next-swiper tf-sw-nav">
            <i class="icon-arrow-right"></i>
          </div>
        </div>
      </div>

      <div class="swiper tf-swiper wow fadeInUp">
        <div v-if="loading || !swiperReady" class="swiper-loader">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <span class="loader-text">Loading edits...</span>
        </div>

        <div class="swiper-wrapper">
          <template v-if="loading">
            <div class="swiper-slide" v-for="n in 4" :key="'skeleton-' + n">
              <div class="category shimmer-loader">
                <div class="skeleton-img"></div>
                <div class="skeleton-text mt-2"></div>
              </div>
            </div>
          </template>

          <template v-else>
            <div v-for="tile in tiles" :key="tile.key" class="swiper-slide">
              <RouterLink :to="{ path: '/product-collection', query: { key: tile.key, label: tile.label } }" class="edit-card-link">
                <div class="edit-card">
                  <div class="img-wrap">
                    <img :src="tile.image" :alt="tile.label" class="img" />
                    <div class="overlay">
                      <span class="label">{{ tile.label }}</span>
                    </div>
                  </div>
                </div>
              </RouterLink>
            </div>
          </template>
        </div>

        <div class="sw-dot-default tf-sw-pagination type-space-2"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import Swiper from 'swiper'
import { Pagination, Navigation, Autoplay, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

Swiper.use([Pagination, Navigation, Autoplay, Mousewheel])

const loading = ref(true)
const swiperReady = ref(false)
let swiperInstance = null

// Static thumbnails for the 9 edits (update paths if needed)
const CATEGORY_KEYS = [
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

const tiles = ref([])

async function load() {
  loading.value = true
  try {
    tiles.value = CATEGORY_KEYS
  } finally {
    loading.value = false
    nextTick(() => {
      forceShowSlides()
      initSwiper()
    })
  }
}

function forceShowSlides() {
  try {
    const container = document.querySelector('.shop-by-edits')
    if (!container) return
    const targets = [
      container.querySelector('.sect-top'),
      container.querySelector('.tf-swiper'),
      ...container.querySelectorAll('.sect-top *'),
      ...container.querySelectorAll('.swiper-slide')
    ].filter(Boolean)
    targets.forEach(el => {
      el.style.visibility = 'visible'
      el.style.animationName = 'none'
    })
  } catch {}
}

function initSwiper() {
  const swiperEl = document.querySelector('.shop-by-edits .tf-swiper')
  if (!swiperEl) return

  if (swiperInstance) {
    swiperInstance.destroy()
    swiperInstance = null
  }

  swiperInstance = new Swiper(swiperEl, {
    slidesPerView: 4,
    spaceBetween: 15,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
    navigation: {
      nextEl: '.shop-by-edits .nav-next-swiper',
      prevEl: '.shop-by-edits .nav-prev-swiper',
    },
    breakpoints: {
      320: { slidesPerView: 2, spaceBetween: 10 },
      768: { slidesPerView: 3, spaceBetween: 15 },
      1024: { slidesPerView: 4, spaceBetween: 15 },
    },
    on: {
      init: () => {
        forceShowSlides()
        swiperReady.value = true
      },
    },
  })
}

onMounted(load)
</script>

<style scoped>
.collection-header {
    max-width: 1100px;
    margin: 0 auto;
    padding: 60px 16px 16px;
    display: flex
;
    align-items: center;
    justify-content: center;
    gap: 16px;
}
.swiper-loader { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 10px; background: rgba(255,255,255,0.6); z-index: 5; }
.loader-text { font-weight: 600; color: #333; }
.tf-swiper { position: relative; }

/* Card visuals */
.edit-card-link { text-decoration: none; color: inherit; display: block; }
.edit-card { border-radius: 14px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); transition: transform .18s, box-shadow .18s; background:#fff; }
.edit-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.13); }
.img-wrap { position: relative; width: 100%; aspect-ratio: 1/1; background: #f3f4f6; }
.img { width: 100%; height: 100%; object-fit: cover; object-position: top; display: block; }
.overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.05) 50%, transparent 80%); display: flex; align-items: flex-end; justify-content: center; padding: 18px; }
.label { color: #fff; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; font-size: 0.95rem; }
</style>
