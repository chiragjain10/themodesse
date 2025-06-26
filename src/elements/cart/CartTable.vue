<template>
    <div class="table-shop-cart table-order-detail">
        <table>
            <thead>
                <tr>
                    <th class="order_product h6 fw-normal">Product</th>
                    <th class="order_price h6 fw-normal">price</th>
                    <th class="order_quantity h6 fw-normal">quantity</th>
                    <th class="order_subtotal h6 fw-normal">subtotal</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="loading">
                    <td colspan="4">
                        <div class="col-xs-6 col-lg-3 mb-4" v-for="n in 4" :key="n">
                            <div class="category shimmer-loader">
                                <div class="skeleton-img"></div>
                                <div class="skeleton-text mt-2"></div>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr v-else-if="error">
                    <td colspan="4" class="text-center py-4 text-danger">
                        {{ error }}
                        <button class="btn btn-link" @click="retryLoading">Retry</button>
                    </td>
                </tr>
                <tr v-else-if="cartItems.length === 0">
                    <td colspan="4" class="text-center py-4">
                        <div class="d-flex flex-column align-items-center">
                            <i class="icon icon-cart mb-2" style="font-size: 2rem;"></i>
                            <span>Your cart is empty.</span>
                            <RouterLink to="/" class="btn btn-link mt-2">Continue Shopping</RouterLink>
                        </div>
                    </td>
                </tr>
                <tr v-else v-for="item in cartItems" :key="item.item_id" class="file-delete order_item each-prd">
                    <td>
                        <div class="order_product">
                            <RouterLink :to="`/product/${item.product.slug}`" class="image">
                                 <!-- Assuming item.product.image exists -->
                                <img :src="item.product.image" :alt="item.product.name">
                            </RouterLink>
                            <div class="infor">
                                <RouterLink :to="`/product/${item.product.slug}`" class="prd-name h6 fw-normal link">
                                    {{ item.product.name }}
                                </RouterLink>
                                 <!-- Display variants if available -->
                                <p v-if="item.variants" class="prd-type">
                                    <span v-if="item.variants.material">{{ item.variants.material }}</span>
                                    <span v-if="item.variants.size"> / {{ item.variants.size }}</span>
                                </p>
                            </div>
                        </div>
                    </td>
                    <td class="order_price each-price">₹{{ parseFloat(item.product?.sale_price || 0).toFixed(2) }}</td>
                    <td>
                        <div class="order_quantity">
                            <div class="wg-quantity style-2">
                                <button class="btn-quantity minus-quantity" 
                                    @click="updateQuantity(item.item_id, item.qty - 1)"
                                    :disabled="item.qty <= 1">
                                    <i class="icon-minus"></i>
                                </button>
                                <input class="quantity-product" 
                                    type="number" 
                                    name="number" 
                                    :value="item.qty" 
                                    readonly>
                                <button class="btn-quantity plus-quantity" 
                                    @click="updateQuantity(item.item_id, item.qty + 1)">
                                    <i class="icon-plus"></i>
                                </button>
                            </div>
                            <span class="remove tf-btn-line style-line-2 fw-normal" @click="removeFromCart(item.item_id)">Remove</span>
                        </div>
                    </td>
                    <td class="order_subtotal each-subtotal-price">₹{{ itemSubtotal(item).toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { RouterLink } from 'vue-router';
import { useQuantityControls } from '@/composables/useQuantityControls';

const cart = useCartStore();
const loading = computed(() => cart.loading);
const error = computed(() => cart.error);
const cartItems = computed(() => cart.items);

const { updateQuantity } = useQuantityControls();

// Computed property to calculate item subtotal
const itemSubtotal = (item) => {
    const price = parseFloat(item.product?.sale_price || 0);
    const quantity = item.qty || 0;
    return price * quantity;
};

const retryLoading = async () => {
    try {
        await cart.fetchCart();
    } catch (error) {
        console.error('Error retrying cart fetch:', error);
    }
};

const removeFromCart = async (itemId) => {
    try {
        await cart.removeItem(itemId);
    } catch (error) {
        console.error('Error removing item:', error);
    }
};
</script>

<style scoped>
.table-shop-cart {
    min-height: 200px;
}
</style> 