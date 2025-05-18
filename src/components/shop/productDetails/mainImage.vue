<template>
    <div class="product-single-carousel owl-carousel owl-theme owl-nav-inner row cols-1 gutter-no">
        <figure class="product-image">
            <img :src="currentImage" 
                :alt="product?.name || 'Product image'"
                width="800" 
                height="900"
                @error="handleImageError"
                :class="{ 'image-error': imageError }"
            >
            <div v-if="imageError" class="image-error-message">
                <i class="d-icon-exclamation-circle"></i>
                <span>Failed to load image</span>
            </div>
        </figure>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    product: {
        required: true
    },
    selectedImageIndex: {
        required: true
    }
});

const imageError = ref(false);

const currentImage = computed(() => {
    console.log('currentImage', props.product?.gallery_images?.length, props.selectedImageIndex)
    if (!props.product?.gallery_images?.length) {
        return props.product?.thumbnail_image || '/src/assets/images/placeholder.jpg';
    }
    return props.product.gallery_images[props.selectedImageIndex];
});

const handleImageError = (event) => {
    imageError.value = true;
    event.target.src = '/src/assets/images/placeholder.jpg';
};
</script>

<style scoped>
.product-image {
    position: relative;
    margin-bottom: 1rem;
}

.product-image img {
    width: 100%;
    height: auto;
    object-fit: cover;
    border-radius: 4px;
}

.image-error {
    opacity: 0.5;
}

.image-error-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #e14b4b;
}

.image-error-message i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
}

.image-error-message span {
    display: block;
    font-size: 0.9rem;
}
</style>