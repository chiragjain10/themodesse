<template>
    <div class="texture_background">
        <Banner />
        <About />
        <NewArrivals />
        <Workware />
        <BestSeller />
        <!-- <Swatches /> -->
        <EveningWearBanner />
        <Vacation />
        <Bottom />
        <!-- <Blogs /> -->
    </div>
</template>

<script setup>
import Banner from './banner.vue';
import About from './about.vue';
import BestSeller from './best-seller.vue';
import NewArrivals from './NewArrivals.vue';
import Workware from './workwear.vue';
import Vacation from './Vacation.vue';
import Bottom from './contentbottom.vue';
import EveningWearBanner from './EveningWearBanner.vue';

</script>

<style scoped>
.texture_background {
    background-image: url("https://www.transparenttextures.com/patterns/fabric-of-squares.png"), linear-gradient(120deg, #fdf6ee 0%, #f8fafc 100%);
}

/* iOS specific fixes */
@supports (-webkit-touch-callout: none) {
    .texture_background {
        background-attachment: scroll;
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
    }
}

/* Prevent iOS Safari from applying blur filters */
@media screen and (-webkit-min-device-pixel-ratio: 0) {
    .texture_background {
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }
}
</style>