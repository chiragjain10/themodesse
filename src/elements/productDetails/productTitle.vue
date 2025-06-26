<template>
    <!-- Page Title -->
    <div class="flat-spacing-16 pb-0">
        <div class="container">
            <div class="page-title border-0">
                <div class="breadcrumbs">
                    <ul class="bread-wrap mb-0">
                        <li><router-link to="/" class="text-main-4 link">Home</router-link></li>
                        <li class="br-line w-12 bg-main"></li>
                        <li v-if="product?.category">
                            <router-link :to="`/category/${product.category.slug}`" class="text-main-4 link">
                                {{ product.category.name }}
                            </router-link>
                        </li>
                        <li v-if="product?.sub_category" class="br-line w-12 bg-main"></li>
                        <li v-if="product?.sub_category">
                            <router-link :to="`/category/${product.sub_category.slug}`" class="text-main-4 link">
                                {{ product.sub_category.name }}
                            </router-link>
                        </li>
                        <li class="br-line w-12 bg-main"></li>
                        <li>
                            <p>{{ product?.name }}</p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <!-- /Page Title -->
</template>

<script setup>
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'

const productStore = useProductStore()
const { product } = storeToRefs(productStore)
</script>

<style scoped>

</style>