<template>
  <div class="page-wrapper">
    <header class="header">
      <HeaderTop />
      <HeaderMiddle />
      <!-- <HeaderBottom /> -->
    </header>
    <main class="main" style="background-color: #fffaf5;">
      <router-view></router-view>
    </main>
    <footer class="footer">
      <div class="container">
        <FooterTop />
        <FooterMiddle />
        <FooterBottom />
      </div>
    </footer>
  </div>
  <StickyFooter />
  <!-- Scroll Top -->
  <a id="scroll-top" href="#top" title="Top" role="button" class="scroll-top"><i class="d-icon-arrow-up"></i></a>
  <MobileMenu />
  <Newsletter />
  <DiscountPopup v-if="showPopup" @close="handleClose" @submit="handleSubmit" />
  <!-- <SocialIcons /> -->
</template>

<script setup>
import { ref } from 'vue';
import HeaderTop from './components/HeaderTop.vue';
import HeaderMiddle from './components/HeaderMiddle.vue';
import FooterTop from './components/FooterTop.vue';
import FooterMiddle from './components/FooterMiddle.vue';
import FooterBottom from './components/FooterBottom.vue';
import StickyFooter from './components/stickyFooter.vue';
import MobileMenu from './components/mobileMenu.vue';
import Newsletter from './components/newsletter.vue';
import DiscountPopup from '@/components/common/DiscountPopup.vue'

const showPopup = ref(true) // Set to true to show on load

function handleClose() {
  showPopup.value = false
}

function handleSubmit(phone) {
  // You can send the phone to your backend here
  alert('Phone submitted: ' + phone)
  showPopup.value = false
}
</script>

<style>
nav li {
  font-size: 14px;
}
</style>