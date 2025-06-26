<template>
    <!-- Page Title -->
    <section class="flat-spacing-2 pb-0">
        <div class="container">
            <div class="page-title type-2">
                <div class="breadcrumbs">
                    <ul class="bread-wrap">
                        <li><RouterLink to="/" class="text-main-4 link-secondary">Home</RouterLink></li>
                        <li class="br-line w-12 bg-main"></li>
                        <li>
                            <p>{{ categoryName }}</p>
                        </li>
                    </ul>
                    <h1 class="heading fw-normal text-uppercase">
                        {{ categoryName }}
                        <span class="number-count">
                            {{ productCount }}
                        </span>
                    </h1>
                </div>
                <div class="box-text">
                    <p class="text-main-4">
                       {{ categoryDescription }}
                    </p>
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
    categoryName: {
        type: String,
        default: 'Category'
    },
    productCount: {
        type: Number,
        default: 0
    },
    categoryDescription: {
        type: String,
        default: 'Discover our collection.'
    }
});
</script>

<style scoped></style> 