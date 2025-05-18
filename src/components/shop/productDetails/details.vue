<template>
    <div class="product-details">
        <ProductNav />

        <h1 class="product-name">{{ product.name }}</h1>
        <div class="product-meta">
            SKU: <span class="product-sku">{{ product.sku }}</span>
            BRAND: <span class="product-brand">{{ product.brand }}</span>
        </div>
        <div class="product-price">₹{{ product.price }}</div>
        <div class="ratings-container">
            <div class="ratings-full">
                <span class="ratings" style="width:80%"></span>
                <span class="tooltiptext tooltip-top"></span>
            </div>
            <a href="#product-tab-reviews" class="link-to-tab rating-reviews">( 11 reviews )</a>
        </div>
        <p class="product-short-desc">{{ product.description }}</p>
        <ProductColor :product="product" />
        <ProductSize :product="product" />
        <div class="product-variation-price">
            <span>₹{{ product.price }}</span>
        </div>

        <hr class="product-divider">

        <ReadyToBuy :product="product" />

        <hr class="product-divider mb-3">

        <Wishlist />
    </div>
</template>
<script setup>
import ProductColor from './productColor.vue';
import ProductSize from './productSize.vue';
import ProductNav from './productNav.vue';
import ReadyToBuy from './readyToBuy.vue';
import Wishlist from './wishList.vue';

defineProps({
    product: {
        type: Object,
        required: true
    }
});
</script>
<style scoped></style>