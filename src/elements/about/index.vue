<template>
    <!-- Page Title -->
    <section class="flat-spacing-2 pb-0">
        <div class="container">
            <div class="page-title">
                <div class="breadcrumbs">
                    <ul class="bread-wrap">
                        <li><RouterLink to="/" class="text-main-4 link-secondary">Home</RouterLink></li>
                        <li class="br-line w-12 bg-main"></li>
                        <li>About Us</li>
                    </ul>
                    <h1 class="heading fw-normal text-uppercase">
                        welcome to the modesse
                    </h1>
                </div>
                <div class="box-text">
                    <p class="text-main-4">
                        We believe in clothes that feel like a second skin.
                        <br class="d-none d-xxl-block">
                        That move when you move. That breathe with you.
                        <br class="d-none d-xxl-block">
                        That don't chase trends, but stay with you—through shifts, seasons, and everything in between.
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Brand Intro -->
    <BrandIntro />

    <!-- Established -->
    <Established />

    <!-- Core Value -->
    <CoreValues />

    <!-- Feature -->
    <FeatureIntro />

    <!-- Testimonial -->
    <Testimonials />

    <!-- Promo -->
    <PromoSection />
</template>

<script setup>
import BrandIntro from './BrandIntro.vue'
import Established from './Established.vue'
import CoreValues from './CoreValues.vue'
import FeatureIntro from './FeatureIntro.vue'
import ShopCollections from './ShopCollections.vue'
import Testimonials from './Testimonials.vue'
import PromoSection from './PromoSection.vue'
</script>