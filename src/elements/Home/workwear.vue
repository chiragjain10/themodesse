<template>
  <section class="workwear-banner-section">
    <RouterLink class="workwear-banner" :to="shopworkwearLink" :style="bannerStyle">
      <div class="banner-overlay">
        <span class="banner-title">Shop Workwear</span>
        <span class="banner-arrow">
          <svg data-v-27c6996c="" width="38" height="38" viewBox="0 0 38 38" fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle data-v-27c6996c="" cx="19" cy="19" r="18" stroke="#352e2e" stroke-opacity="0.18" stroke-width="2">
            </circle>
            <path data-v-27c6996c="" d="M13 19H25M25 19L21 15M25 19L21 23" stroke="#352e2e" stroke-width="2.5"
              stroke-linecap="round" stroke-linejoin="round"></path>
            <defs data-v-27c6996c="">
              <linearGradient data-v-27c6996c="" id="arrowGradient" x1="13" y1="19" x2="25" y2="19"
                gradientUnits="userSpaceOnUse">
                <stop data-v-27c6996c="" stop-color="#352e2e"></stop>
                <stop data-v-27c6996c="" offset="1" stop-color="#352e2e"></stop>
              </linearGradient>
            </defs>
          </svg>
        </span>
      </div>
    </RouterLink>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { RouterLink } from 'vue-router';
import workwearImg from '@/assets/images/workwear.svg';
// import workwearImgMobile from '@/assets/images/workwarMobile.jpg';
const shopworkwearLink = '/workwear-collection';

const isMobile = ref(window.innerWidth <= 768);
function handleResize() {
  isMobile.value = window.innerWidth <= 768;
}
onMounted(() => window.addEventListener('resize', handleResize));
onBeforeUnmount(() => window.removeEventListener('resize', handleResize));

const bannerStyle = computed(() => ({
  backgroundImage: `url(${isMobile.value ? workwearImg : workwearImg})`,
  borderRadius: '16px',
  minHeight: '80vh',
  width: '100%',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
  textDecoration: 'none',
  overflow: 'hidden',
  transition: 'box-shadow 0.2s',
  display: 'block',
  position: 'relative',
}));
</script>

<style scoped>
.workwear-banner-section {
  width: 100%;
  min-height: 80vh;
  position: relative;
}

.workwear-banner {
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #d6d6d6;
  background-position: center;
}

@media (max-width: 768px) {

  .workwear-banner-section,
  .workwear-banner {
    min-height: 70vh !important;
  }
}

.workwear-banner:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  backdrop-filter: blur(0px) saturate(1.2);
  -webkit-backdrop-filter: blur(6px) saturate(1.2);
  background-color: rgba(0, 0, 0, 0.1);
}

.banner-title {
  font-family: 'KenokyLight3zezL';
  color: #000;
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background: #352e2e;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-right: 12px;
  transition: transform 0.18s cubic-bezier(.4, 1.4, .6, 1), text-shadow 0.18s;
}

.banner-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.22s cubic-bezier(.4, 1.4, .6, 1);
}

@media (max-width: 700px) {
  .banner-title {
    font-size: 2rem;
    margin-right: 12px;
  }

  .banner-arrow svg {
    width: 26px;
    height: 26px;
  }
}
</style>