<template>
    <div class="tf-product-info-heading">
        <h3 class="product-info-name" style="font-size: 30px;">
            {{ product?.name }}
        </h3>
        <div class="product-info-price" style="">
            <div class="price-wrap">
                <!-- Original Price with strikethrough -->
                <!-- <span class="price-old compare-at-price fw-normal" style="text-decoration: line-through; color: #999; font-size: 16px;">
                    ₹{{ product?.price }} INR
                </span> -->
                
                <!-- Discount Badge -->
                <!-- <span v-if="product?.discount_perc" class="discount-badge" style="background: #ff4444; color: white; padding: 2px 8px; border-radius: 4px; margin: 0 8px; font-size: 14px;">
                    {{ Math.round(product?.discount_perc) }}% OFF
                </span> -->
                
                <!-- Final Sale Price -->
                <span class="price-new price-on-sale" style="font-size: 18px; color: #333;">
                    ₹{{ product?.price }} INR
                </span>

                <!-- Discount Amount -->
                <!-- <span v-if="product?.discount_amt" class="discount-amount" style="color: #ff4444; font-size: 14px; margin-left: 8px;">
                    (Save ₹{{ product?.discount_amt }})
                </span> -->
            </div>
        </div>
        <p class="product-infor-sub text-muted">
            Free Shipping
        </p>
    </div>
</template>

<script setup>
defineProps({
    product: {
        type: Object,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    }
});
</script>

<style scoped>
.price-wrap {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
}

.discount-badge {
    display: inline-block;
    font-weight: 500;
}

.price-new {
    color: #333;
    font-weight: 600;
}

.price-old {
    color: #999;
    text-decoration: line-through;
}

.discount-amount {
    color: #ff4444;
    font-weight: 500;
}
</style>