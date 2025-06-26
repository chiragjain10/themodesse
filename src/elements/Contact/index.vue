<template>
    <!-- Page Title -->
    <section class="flat-spacing-2 pb-0">
        <div class="container">
            <div class="page-title">
                <div class="breadcrumbs">
                    <ul class="bread-wrap">
                        <li><RouterLink to="/" class="text-main-4 link">Home</RouterLink></li>
                        <li class="br-line w-12 bg-main"></li>
                        <li>Contact Us</li>
                    </ul>
                    <h1 class="heading fw-normal text-uppercase">
                        contact us
                    </h1>
                </div>
                <div class="box-text">
                    <p class="text-main-4">
                        We're here to assist you with any inquiries about themodesse—our products, your orders, or anything else related to your experience. <br class="d-none d-xxl-block">
                        Reach out to us via phone, email, or visit our store—we'd <br class="d-none d-xxl-block">
                        love to hear from you!
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact Us -->
    <section class="s-contact-us flat-spacing-6">
        <!-- Map -->
        <StoreMap />

        <div class="container">
            <div class="row">
                <div class="col-xxl-5 offset-xxl-1 col-lg-6">
                    <StoreInfo />
                </div>
                <div class="col-xl-5 col-lg-6">
                    <ContactForm />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import StoreMap from './StoreMap.vue'
import StoreInfo from './StoreInfo.vue'
import ContactForm from './ContactForm.vue'
</script>