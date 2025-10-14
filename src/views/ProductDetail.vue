<template>
    <div class="product-detail-page">
        <div v-if="loading" class="text-center py-4">
            <Loader />
        </div>
        <div v-else-if="!product" class="text-center py-4">
            <p>Product not found</p>
        </div>
        <div v-else class="container">
            <div class="row">
                <!-- Product Images -->
                <div class="col-lg-6">
                    <div class="product-gallery">
                        <div class="main-image">
                            <img :src="product.thumbnail_image" :alt="product.name" class="img-fluid">
                        </div>
                        <div class="thumbnail-images" v-if="product.gallery_images && product.gallery_images.length > 0">
                            <div v-for="(image, index) in product.gallery_images" :key="index" 
                                 class="thumbnail" 
                                 @click="currentImage = image">
                                <img :src="image" :alt="product.name" class="img-fluid">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Product Info -->
                <div class="col-lg-6">
                    <div class="product-info">
                        <h1 class="product-name">{{ product.name }}</h1>
                        
                        <div class="price-wrap">
                            <span class="price-new h3">₹{{ product.final_price }}</span>
                            <span v-if="product.discount_percentage > 0" class="price-old">₹{{ product.original_price }}</span>
                            <span v-if="product.discount_percentage > 0" class="discount">-{{ product.discount_percentage }}%</span>
                        </div>

                        <div class="product-description" v-html="product.description"></div>

                        <!-- Add to Cart Section -->
                        <div class="add-to-cart-section">
                            <div class="quantity-selector">
                                <button @click="decreaseQuantity" class="btn-quantity">-</button>
                                <input type="number" v-model="quantity" min="1" :max="product.stock_quantity">
                                <button @click="increaseQuantity" class="btn-quantity">+</button>
                            </div>
                            <button @click="addToCart" class="btn-add-to-cart" :disabled="!product.is_active">
                                {{ product.is_active ? 'Add to Cart' : 'Out of Stock' }}
                            </button>
                        </div>

                        <!-- Product Meta -->
                        <div class="product-meta">
                            <div class="meta-item">
                                <span class="label">SKU:</span>
                                <span class="value">{{ product.sku }}</span>
                            </div>
                            <div class="meta-item">
                                <span class="label">Category:</span>
                                <span class="value">{{ product.category?.name }}</span>
                            </div>
                            <div class="meta-item">
                                <span class="label">Tags:</span>
                                <span class="value">{{ product.tags?.join(', ') }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Tabs -->
            <div class="product-tabs mt-5">
                <ul class="nav nav-tabs" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="tab" href="#description">Description</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#reviews">Reviews</a>
                    </li>
                </ul>

                <div class="tab-content">
                    <div id="description" class="tab-pane active">
                        <div v-html="product.description"></div>
                    </div>
                    <div id="reviews" class="tab-pane">
                        <div class="reviews-section">
                            <Reviews :product="product" />
                        </div>
                    </div>
                </div>
            </div>

            <Attributes
              v-if="product && product.attributes"
              :attributes="product.attributes"
              @update:selected-variants="onSelectedVariantsUpdate"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getData } from '@/stores/getApi';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useProductStore } from '@/stores/product';
import Loader from '@/components/Loader.vue';
import Reviews from '@/elements/productDetails/reviews.vue';
import Attributes from '@/elements/productDetails/attributes.vue';

const route = useRoute();
const cart = useCartStore();
const auth = useAuthStore();
const productStore = useProductStore();

const product = ref(null);
const loading = ref(true);
const quantity = ref(1);
const currentImage = ref('');
const selectedVariants = ref({})

const fetchProduct = async () => {
    loading.value = true;
    try {
        const response = await getData(`/api/products/${route.params.slug}`);
        product.value = response.data;
        productStore.product = product.value;
        if (product.value?.thumbnail_image) {
            currentImage.value = product.value.thumbnail_image;
        }
        if (typeof product.value.gallery_images === 'string') {
            try {
                product.value.gallery_images = JSON.parse(product.value.gallery_images);
            } catch (e) {
                product.value.gallery_images = [];
            }
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        product.value = null;
        productStore.product = null;
    } finally {
        loading.value = false;
    }
};

const calculateOriginalPrice = (salePrice, discount) => {
    return (parseFloat(salePrice) / (1 - discount/100)).toFixed(2);
};

const increaseQuantity = () => {
    if (quantity.value < product.value.stock_quantity) {
        quantity.value++;
    }
};

const decreaseQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

function onSelectedVariantsUpdate(val) {
  selectedVariants.value = val
}

const addToCart = async () => {
    if (!auth.isAuthenticated) {
        // Redirect to login or show login modal
        return;
    }
    try {
        await cart.addToCart({
            product_id: product.value.id,
            quantity: quantity.value,
            variants: selectedVariants.value
        });
        // Show success message
    } catch (error) {
        console.error('Error adding to cart:', error);
        // Show error message
    }
};

onMounted(() => {
    fetchProduct();
});
</script>

<style scoped>
.product-gallery {
    margin-bottom: 2rem;
}

.main-image {
    margin-bottom: 1rem;
    border: 1px solid #eee;
    padding: 1rem;
}

.thumbnail-images {
    display: flex;
    gap: 1rem;
}

.thumbnail {
    width: 80px;
    height: 80px;
    border: 1px solid #eee;
    cursor: pointer;
    padding: 0.5rem;
}

.thumbnail:hover {
    border-color: var(--primary);
}

.product-name {
    margin-bottom: 1rem;
    font-size: 2rem;
}

.price-wrap {
    margin-bottom: 1.5rem;
}

.price-new {
    color: var(--primary);
    margin-right: 1rem;
}

.price-old {
    text-decoration: line-through;
    color: #999;
}

.add-to-cart-section {
    margin: 2rem 0;
    display: flex;
    gap: 1rem;
    align-items: center;
}

.quantity-selector {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.btn-quantity {
    padding: 0.5rem 1rem;
    border: none;
    background: #f5f5f5;
    cursor: pointer;
}

.quantity-selector input {
    width: 60px;
    text-align: center;
    border: none;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    padding: 0.5rem;
}

.btn-add-to-cart {
    padding: 0.75rem 2rem;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.btn-add-to-cart:disabled {
    background: #ccc;
    cursor: not-allowed;
}

.product-meta {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
}

.meta-item {
    margin-bottom: 0.5rem;
}

.meta-item .label {
    font-weight: bold;
    margin-right: 0.5rem;
}

.product-tabs {
    margin-top: 3rem;
}

.tab-content {
    padding: 2rem 0;
}
</style> 