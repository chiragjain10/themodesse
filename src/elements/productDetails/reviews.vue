<template>
    <div class="widget-accordion wd-product-descriptions">
        <div class="accordion-title collapsed" data-bs-target="#reviews" data-bs-toggle="collapse"
            aria-expanded="false" aria-controls="reviews" role="button">
          <span class="icon icon-arrow-right-down"></span>
            <span>Reviews ({{ product?.reviews?.length || 0 }})</span>
        </div>
        <div id="reviews" class="collapse widget-desc">
          <div class="accordion-body">
                <div class="tf-product-reviews">
                    <!-- Review Summary -->
                    <div class="review-summary" v-if="product?.reviews?.length">
                        <div class="average-rating">
                            <div class="rating-number">{{ averageRating }}</div>
                            <div class="rating-stars">
                                <i v-for="n in 5" :key="n" 
                                   class="icon-star" 
                                   :class="{ 'text-warning': n <= averageRating }">
                                </i>
              </div>
                            <div class="rating-count">{{ product.reviews.length }} reviews</div>
            </div>
                    </div>

                    <!-- Review List -->
                    <div class="review-list">
                        <div v-for="review in product?.reviews" :key="review.id" class="review-item">
                            <div class="review-header">
                                <div class="review-author">{{ review.user_name }}</div>
                                <div class="review-date">{{ formatDate(review.created_at) }}</div>
                      </div>
                            <div class="review-rating">
                                <i v-for="n in 5" :key="n" 
                                   class="icon-star" 
                                   :class="{ 'text-warning': n <= review.rating }">
                                </i>
                    </div>
                            <div class="review-content">{{ review.comment }}</div>
                      </div>
                    </div>

                    <!-- No Reviews Message -->
                    <div v-if="!product?.reviews?.length" class="no-reviews">
                        No reviews yet. Be the first to review this product.
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useProductStore } from '@/stores/product'
import { storeToRefs } from 'pinia'

const productStore = useProductStore()
const { product } = storeToRefs(productStore)

const averageRating = computed(() => {
    if (!product.value?.reviews?.length) return 0
    const sum = product.value.reviews.reduce((acc, review) => acc + review.rating, 0)
    return (sum / product.value.reviews.length).toFixed(1)
})

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
</script>