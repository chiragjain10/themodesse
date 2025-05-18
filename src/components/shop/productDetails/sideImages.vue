<template>
    <div class="product-thumbs-wrap">
        <div class="product-thumbs">
            <!-- Thumbnail Image -->
            <div class="product-thumb"
                :class="{ active: selectedImageIndex === -1 }"
                @click="updateSelectedImage(-1)">
                <img :src="product?.thumbnail_image" 
                    :alt="`${product?.name || 'Product'} thumbnail`"
                    width="109" 
                    height="122"
                    @error="handleImageError"
                    :class="{ 'image-error': imageErrors.thumbnail }"
                >
                <div v-if="imageErrors.thumbnail" class="image-error-message">
                    <i class="d-icon-exclamation-circle"></i>
                </div>
            </div>
            <!-- Gallery Images -->
            <div v-for="(image, index) in product?.gallery_images || []" 
                :key="index"
                class="product-thumb"
                :class="{ active: selectedImageIndex === index }"
                @click="updateSelectedImage(index)">
                <img :src="image" 
                    :alt="`${product?.name || 'Product'} thumbnail ${index + 1}`"
                    width="109" 
                    height="122"
                    @error="handleImageError"
                    :class="{ 'image-error': imageErrors[index] }"
                >
                <div v-if="imageErrors[index]" class="image-error-message">
                    <i class="d-icon-exclamation-circle"></i>
                </div>
            </div>
        </div>
        <button class="thumb-up" 
            :class="{ disabled: selectedImageIndex <= -1 }"
            @click="navigateImages('up')">
            <i class="fas fa-chevron-left"></i>
        </button>
        <button class="thumb-down" 
            :class="{ disabled: selectedImageIndex >= (product?.gallery_images?.length - 1) }"
            @click="navigateImages('down')">
            <i class="fas fa-chevron-right"></i>
        </button>
    </div>
    <div class="product-label-group" v-if="product?.is_featured">
        <label class="product-label label-new">Featured</label>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    product: {
        required: true
    },
    selectedImageIndex: {
        default: -1
    }
});

const emit = defineEmits(['update:selectedImageIndex']);
const imageErrors = ref({});

const handleImageError = (event, index) => {
    imageErrors.value[index] = true;
    event.target.src = '/src/assets/images/placeholder.jpg';
};

const updateSelectedImage = (index) => {
    emit('update:selectedImageIndex', index);
};

const navigateImages = (direction) => {
    const maxIndex = (props.product?.gallery_images?.length || 0) - 1;
    const newIndex = direction === 'up' 
        ? props.selectedImageIndex - 1 
        : props.selectedImageIndex + 1;
    
    if (newIndex >= -1 && newIndex <= maxIndex) {
        emit('update:selectedImageIndex', newIndex);
    }
};
</script>

<style scoped>
.product-thumbs-wrap {
    width: 100px;
    position: relative;
}

.product-thumbs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.product-thumb {
    cursor: pointer;
    position: relative;
    border: 2px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.product-thumb.active {
    border-color: #c96;
}

.product-thumb img {
    display: block;
    width: 100%;
    height: auto;
    transition: transform 0.3s ease;
}

.product-thumb:hover img {
    transform: scale(1.05);
}

.image-error {
    opacity: 0.5;
}

.image-error-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #e14b4b;
}

.thumb-up,
.thumb-down {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.thumb-up {
    top: -12px;
}

.thumb-down {
    bottom: -12px;
}

.thumb-up:hover:not(.disabled),
.thumb-down:hover:not(.disabled) {
    background: #f8fafc;
    border-color: #c96;
}

.thumb-up.disabled,
.thumb-down.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>