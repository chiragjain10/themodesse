<template>
  <section class="premium-banner">
    <!-- Video element shown for all devices but we handle iOS autoplay failures with tap overlay -->
    <video
      ref="bannerVideoRef"
      class="banner-video"
      :poster="posterImage"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      @loadeddata="handleVideoLoaded"
      @error="handleVideoError"
      @playing="onPlaying"
      @pause="onPause"
    >
      <!-- Use optimized Cloudinary URL parameters (f_auto & q_auto). Replace public IDs with yours -->
      <source
        :src="mp4Url"
        type="video/mp4"
      />
      <source
        :src="webmUrl"
        type="video/webm"
      />
      <!-- Fallback text -->
      Your browser does not support HTML5 video.
    </video>

    <!-- Poster fallback (shown when video couldn't autoplay / on error) -->
    <div v-if="showPoster" class="banner-image" :style="{ backgroundImage: `url(${posterImage})` }"></div>

    <!-- Tap-to-play overlay (visible when autoplay failed or on iOS) -->
    <button
      v-if="showPlayButton"
      @click="userPlay"
      class="play-overlay"
      aria-label="Play banner video"
    >
      ▶
    </button>

    <div class="banner-overlay"></div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const bannerVideoRef = ref(null);
const showPoster = ref(false);      
const showPlayButton = ref(false);  
const isPlaying = ref(false);

const mp4Url = 'https://res.cloudinary.com/dzvwi8fzg/video/upload/f_auto,q_auto/v1764220208/Banner_Video_ols1du.mp4';
const webmUrl = 'https://res.cloudinary.com/dzvwi8fzg/video/upload/f_auto,q_auto/v1764220208/Banner_Video_ols1du.webm';
const posterImage = 'https://res.cloudinary.com/dzvwi8fzg/image/upload/f_auto,q_auto/v1764220208/Banner_Poster_xxxxx.jpg';

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

async function tryAutoPlay() {
  const vid = bannerVideoRef.value;
  if (!vid) return;

  try {
    await vid.play();
    showPoster.value = false;
    showPlayButton.value = false;
    isPlaying.value = true;
  } catch (err) {
    showPoster.value = true;
    showPlayButton.value = true;
    isPlaying.value = false;
  }
}

function handleVideoLoaded() {
  tryAutoPlay();
}

function handleVideoError(e) {
  showPoster.value = true;
  showPlayButton.value = false;
  isPlaying.value = false;
}

function userPlay() {
  const vid = bannerVideoRef.value;
  if (!vid) return;
  vid.play()
    .then(() => {
      showPlayButton.value = false;
      showPoster.value = false;
      isPlaying.value = true;
    })
    .catch((err) => {
      console.error('Play after user gesture failed:', err);
      // still show poster & play button
      showPoster.value = true;
      showPlayButton.value = true;
    });
}

function onPlaying() {
  isPlaying.value = true;
  showPoster.value = false;
  showPlayButton.value = false;
}

function onPause() {
  isPlaying.value = false;
}

function visibilityHandler() {
  const vid = bannerVideoRef.value;
  if (!vid) return;
  if (document.hidden) {
    vid.pause();
  } else if (!isPlaying.value) {
    tryAutoPlay();
  }
}

onMounted(() => {
  const vid = bannerVideoRef.value;

  if (vid) {
    if (vid.readyState >= 3) {
      tryAutoPlay();
    }
  }

  // visibility change listeners to pause/resume
  document.addEventListener('visibilitychange', visibilityHandler);
  window.addEventListener('pagehide', () => {
    if (bannerVideoRef.value) bannerVideoRef.value.pause();
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', visibilityHandler);
});
</script>

<style scoped>
.premium-banner {
  position: relative;
  width: 100vw;
  height: 80vh;
  min-height: 400px;
  overflow: hidden;
  display:flex;
  align-items:center;
  justify-content:center;
  background: black;
}

/* Video */
.banner-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  object-fit: cover;
  z-index: 1;
  filter: brightness(0.7) saturate(1.2);
}

/* Poster fallback (div) */
.banner-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
  filter: brightness(0.7) saturate(1.2);
}

/* play overlay button */
.play-overlay {
  position: absolute;
  z-index: 3;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: none;
  background: rgba(0,0,0,0.5);
  color: #fff;
  font-size: 36px;
  line-height: 1;
  padding: 18px 22px;
  border-radius: 50%;
  cursor: pointer;
  backdrop-filter: blur(2px);
  display: flex;
  align-items:center;
  justify-content:center;
}

/* overlay gradient */
.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100%;
  background: linear-gradient(90deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.1) 50%);
  z-index: 2;
}

@media (max-width: 768px) {
  .premium-banner { height: 45vh; }
  .play-overlay { font-size: 28px; padding: 14px 18px; }
}

/* iOS specific */
@supports (-webkit-touch-callout: none) {
  .premium-banner {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}
</style>
