<template>
    <!-- Page Title -->
    <section class="flat-spacing-2 pb-0">
        <div class="container">
            <div class="page-title type-2">
                <div class="breadcrumbs">
                    <ul class="bread-wrap">
                        <li>
                            <RouterLink to="/" class="text-main-4 link-secondary">Home</RouterLink>
                        </li>
                        <li class="br-line w-12 bg-main"></li>
                        <li>
                            <p>Products</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>
    <!-- /Page Title -->
</template>

<script setup>
import { defineProps } from 'vue';
import { RouterLink } from 'vue-router';

const props = defineProps({
    productCount: {
        type: Number,
        default: 0
    },
});
</script>

<style scoped></style>