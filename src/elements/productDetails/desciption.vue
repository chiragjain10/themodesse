<template>
    <div class="widget-accordion wd-product-descriptions">
        <div class="accordion-title collapsed" data-bs-target="#description" data-bs-toggle="collapse"
          aria-expanded="false" aria-controls="description" role="button">
          <span class="icon icon-arrow-right-down"></span>
          <span>Description</span>
        </div>
        <div id="description" class="collapse widget-desc">
          <div class="accordion-body">
            <h6 class="text-main-4 fw-normal">
              <span v-html="product?.description"></span>
            </h6>
          </div>
        </div>
    </div>
</template>

<script setup>
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'

const productStore = useProductStore()
const { product } = storeToRefs(productStore)
</script>