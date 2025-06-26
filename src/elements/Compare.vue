<template>
    <!-- Compare -->
    <div class="modal modalCentered fade modal-compare" id="compare">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <span class="icon-close-popup" data-bs-dismiss="modal">
                    <i class="icon-close"></i>
                </span>
                <div class="modal-heading">
                    <h3 class="title fw-normal text-uppercase">compare products</h3>
                </div>
                <div class="modal-body main-list-clear">
                    <div class="tf-compare-inner">
                        <div v-if="items.length === 0" class="tf-compare-list list-empty">
                            <p class="text-empty">Your compare is currently empty</p>
                        </div>
                        <div v-else class="tf-compare-list">
                            <div v-for="item in items" :key="item.id" class="tf-compare-item card_product--V01">
                                <div class="card_product-wrapper aspect-ratio-1">
                                    <span class="remove icon-close" @click="removeFromCompare(item.id)"></span>
                                    <router-link :to="`/product/${item.slug}`" class="product-img">
                                        <img :src="item.thumbnail_image" :alt="item.name" class="img-product">
                                    </router-link>
                                </div>
                                <div class="card_product-info">
                                    <router-link :to="`/product/${item.slug}`" class="name-product h5 fw-normal link text-line-clamp-2">
                                        {{ item.name }}
                                    </router-link>
                                    <div class="price-wrap">
                                        <span class="price-new h5">${{ item.sale_price || item.price }}</span>
                                        <span v-if="item.sale_price" class="price-old fw-normal">${{ item.price }}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Compare -->
</template>

<script setup>
import { useCompareStore } from '@/stores/compare';
import { storeToRefs } from 'pinia';

const compare = useCompareStore();
const { items } = storeToRefs(compare);

const removeFromCompare = async (productId) => {
    try {
        await compare.removeFromCompare(productId);
    } catch (error) {
        console.error('Error removing from compare:', error);
    }
};
</script>

<style scoped>
.tf-compare-list {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.tf-compare-item {
    flex: 0 0 calc(33.333% - 20px);
    max-width: calc(33.333% - 20px);
}

@media (max-width: 768px) {
    .tf-compare-item {
        flex: 0 0 calc(50% - 20px);
        max-width: calc(50% - 20px);
    }
}

@media (max-width: 480px) {
    .tf-compare-item {
        flex: 0 0 100%;
        max-width: 100%;
    }
}
</style>