<template>
    <div class="texture_background">
        <Banner />
        <About />
        <NewArrivals />
        <ShopByEditsHome />
        <ShopByCategoriesHome />
        <Bottom />
    </div>
</template>

<script setup>
import Banner from './banner.vue';
import About from './about.vue';
import NewArrivals from './NewArrivals.vue';
import ShopByEditsHome from './ShopByEditsHome.vue';
import ShopByCategoriesHome from './ShopByCategoriesHome.vue';
import Bottom from './contentbottom.vue';
</script>

<style scoped>
.texture_background {
    background-image: url("https://www.transparenttextures.com/patterns/fabric-of-squares.png"),
        linear-gradient(120deg, #fdf6ee 0%, #f8fafc 100%);
    background-attachment: fixed;
    min-height: 100vh;
}

/* iOS specific performance fixes */
@supports (-webkit-touch-callout: none) {
    .texture_background {
        background-attachment: scroll;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
    }
}

/* Prevent rendering issues on iOS */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
    .texture_background {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-perspective: 1000;
        perspective: 1000;
    }
}
</style>