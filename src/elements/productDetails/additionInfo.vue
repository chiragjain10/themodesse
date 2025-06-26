<template>
    <div class="widget-accordion wd-product-descriptions">
        <div class="accordion-title collapsed" data-bs-target="#additionalInfo" data-bs-toggle="collapse"
            aria-expanded="false" aria-controls="additionalInfo" role="button">
          <span class="icon icon-arrow-right-down"></span>
            <span>Additional Information</span>
        </div>
        <div id="additionalInfo" class="collapse widget-desc">
          <div class="accordion-body">
                <div class="tf-product-info-table">
                    <table class="table">
              <tbody>
                            <tr v-if="product?.sku">
                                <th>SKU</th>
                                <td>{{ product.sku }}</td>
                            </tr>
                            <tr v-if="product?.category">
                                <th>Category</th>
                                <td>{{ product.category.name }}</td>
                </tr>
                            <tr v-if="product?.sub_category">
                                <th>Sub Category</th>
                                <td>{{ product.sub_category.name }}</td>
                </tr>
                            <tr v-if="product?.brand">
                                <th>Brand</th>
                                <td>{{ product.brand }}</td>
                </tr>
                            <tr v-if="product?.weight">
                                <th>Weight</th>
                                <td>{{ product.weight }}</td>
                </tr>
                            <tr v-if="product?.dimensions">
                                <th>Dimensions</th>
                                <td>{{ product.dimensions }}</td>
                </tr>
              </tbody>
            </table>
                </div>
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