<!-- Loader Shimmer Cards -->
<template>
    <table>
        <template v-if="loading">
            <tbody>
                <tr>
                    <td colspan="6">
                        <div class="category shimmer-loader">
                            <div class="skeleton-img"></div>
                            <div class="skeleton-text mt-2"></div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </template>
        <template v-else>
            <tbody>
                <tr v-for="item in cartItems" :key="item.item_id">
                    <td class="product-thumbnail">
                        <figure>
                            <a :href="'/product/' + item.product?.slug">
                                <img :src="item.product?.image" width="100" height="100" :alt="item.product?.name">
                            </a>
                        </figure>
                    </td>
                    <td class="product-name">
                        <div class="product-name-section">
                            <a :href="'/product/' + item.product?.slug">{{ item.product?.name }}</a>
                        </div>
                    </td>
                    <td class="product-subtotal">
                        <span class="amount">₹{{ Number(item.product?.sale_price || 0).toFixed(2) }}</span>
                    </td>
                    <td class="product-quantity">
                        <div class="input-group">
                            <button class="quantity-minus d-icon-minus" @click="updateQuantity(item.item_id, item.qty - 1)"
                                :disabled="item.qty <= 1"></button>
                            <input class="quantity form-control" type="number" min="1" :value="item.qty" readonly>
                            <button class="quantity-plus d-icon-plus"
                                @click="updateQuantity(item.item_id, item.qty + 1)"></button>
                        </div>
                    </td>
                    <td class="product-price">
                        <span class="amount">₹{{ (Number(item.product?.sale_price || 0) * item.qty).toFixed(2) }}</span>
                    </td>
                    <td class="product-close">
                        <a href="#" class="product-remove" title="Remove this product"
                            @click.prevent="removeFromCart(item.item_id)">
                            <i class="fas fa-times"></i>
                        </a>
                    </td>
                </tr>
                <tr v-if="cartItems.length === 0">
                    <td colspan="6" class="text-center">Your cart is empty.</td>
                </tr>
            </tbody>
        </template>
    </table>
</template>

<script setup>
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';

const cart = useCartStore()
const loading = computed(() => cart.loading)
const cartItems = computed(() => cart.items);

const removeFromCart = async (itemId) => {
    await cart.removeItem(itemId);
};

const updateQuantity = async (itemId, newQty) => {
    const item = cart.items.find(i => i.item_id === itemId);
    if (!item || newQty < 1) return;
    await cart.updateItem(itemId, item.product.id, newQty);
};
</script>

<style scoped></style>
