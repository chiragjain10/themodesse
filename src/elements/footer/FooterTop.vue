<template>
    <div class="footer-top">
        <div class="container">
            <ul class="category-list justify-content-xl-center">
                <li v-for="category in categories" :key="category.id">
                    <RouterLink :to="`/category/`" class="tf-btn btn-line has-icon link">
                        <span class="text h6 text-uppercase fw-normal">{{ category.name }}</span>
                        <i class="icon icon-arrow-top-right"></i>
                    </RouterLink>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const categories = ref([
    { id: 1, name: 'New Arrivals', slug: 'new-arrivals' },
    { id: 2, name: 'Bestsellers', slug: 'bestsellers' },
    { id: 3, name: 'Silk Collection', slug: 'silk-collection' },
    { id: 4, name: 'Handwoven', slug: 'handwoven' },
    { id: 5, name: 'Limited Edition', slug: 'limited-edition' }
])
</script> 