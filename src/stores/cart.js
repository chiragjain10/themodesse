import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { cartService } from '@/services/cart';
import { useAppLoadingStore } from './appLoading';

export const useCartStore = defineStore('cart', () => {
    const items = ref([]);
    const count = ref(0);
    const total = ref(0);
    const loading = ref(false);
    const error = ref(null);
    const openCartAfterAdd = ref(true);
    const couponCode = ref('');
    const couponData = ref(null);
    const couponError = ref(null);

    const generateCartToken = () => {
        return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    };

    const getCartToken = () => {
        return localStorage.getItem('cartToken') || generateCartToken();
    };

    const setCartToken = (token) => {
        localStorage.setItem('cartToken', token);
    };

    async function addToCart(cartData) {
        console.log('[Cart Store] Receiving cartData:', cartData);
        this.loading = true;
        this.error = null;
        const appLoading = useAppLoadingStore();
        appLoading.startLoading();
        try {
            const cartToken = cartData.cart_token || getCartToken();
            console.log('[Cart Store] addToCart: Using cart token', cartToken);
            console.log('[Cart Store] Passing to cartService:', {
                productId: cartData.product_id,
                quantity: cartData.quantity,
                cartToken: cartToken,
                variants: cartData.variants
            });
            const response = await cartService.addToCart(
                cartData.product_id, 
                cartData.quantity, 
                cartToken,
                cartData.variants
            );
            console.log('[Cart Store] Add to cart store response:', response);
            
            if (response.status === 'success') {
                setCartToken(cartToken);
                await this.fetchCart();
                return response;
            } else {
                this.error = response.message || 'Failed to add item to cart';
                console.error('[Cart Store] addToCart: Service reported not success', response);
                throw new Error(this.error);
            }
        } catch (error) {
            this.error = error.response?.data?.message || error.message;
            console.error('[Cart Store] Add to cart error:', error);
            throw error;
        } finally {
            this.loading = false;
            appLoading.stopLoading();
            console.log('[Cart Store] addToCart finished');
        }
    }

    async function fetchCart() {
        console.log('[Cart Store] Action fetchCart triggered');
        this.loading = true;
        this.error = null;
        const appLoading = useAppLoadingStore();
        appLoading.startLoading();

        const cartToken = getCartToken();
        if (!cartToken) {
            console.log('[Cart Store] fetchCart: No cart token available');
            this.error = 'No cart token available';
            this.items = [];
            this.count = 0;
            this.total = 0;
            this.loading = false;
            appLoading.stopLoading();
            return;
        }

        try {
            console.log('[Cart Store] fetchCart: Calling getCart service with token', cartToken);
            const response = await cartService.getCart(cartToken);
            console.log('[Cart Store] fetchCart: Received response from service', response);

            if (response.carts) {
                this.items = response.carts;
                this.count = this.items.reduce((total, item) => total + (parseInt(item.qty) || 0), 0);
                this.total = this.items.reduce((sum, item) => {
                    const price = parseFloat(item.product?.price || 0);
                    const qty = parseInt(item.qty) || 0;
                    return sum + (price * qty);
                }, 0);
            } else {
                this.items = [];
                this.count = 0;
                this.total = 0;
            }

            console.log('[Cart Store] fetchCart: State updated', { items: this.items, count: this.count, total: this.total });
            return response;
        } catch (error) {
            console.error('[Cart Store] fetchCart Error:', error.response?.data || error);
            this.error = error.response?.data?.message || error.message;
            this.items = [];
            this.count = 0;
            this.total = 0;
            throw error;
        } finally {
            this.loading = false;
            appLoading.stopLoading();
            console.log('[Cart Store] fetchCart finished');
        }
    }

    async function updateItem(itemId, quantity) {
        this.loading = true;
        this.error = null;
        const appLoading = useAppLoadingStore();
        appLoading.startLoading();

        try {
            // Find the item in the current cart state
            const itemToUpdate = this.items.find(item => item.item_id === itemId);

            if (!itemToUpdate) {
                throw new Error('Cart item not found in store state');
            }

            const cartId = itemToUpdate.id; // This is the cart_id
            const productId = itemToUpdate.product.id; // This is the product_id
            const cartToken = getCartToken(); // We might still need the token, although the PUT route doesn't use it in the URL or body based on api.php

            // Call the service with the correct parameters
            const response = await cartService.updateItem(cartId, productId, quantity, cartToken);

            if (response.status === 'success') {
                // Fetch the updated cart data after successful update
                await this.fetchCart();
                return response;
            } else {
                this.error = response.message || 'Failed to update item';
                console.error('[Cart Store] updateItem: Service reported not success', response);
                throw new Error(this.error);
            }
        } catch (error) {
            this.error = error.response?.data?.message || error.message;
            console.error('[Cart Store] Update item error:', error);
            throw error;
        } finally {
            this.loading = false;
            appLoading.stopLoading();
        }
    }

    async function removeItem(itemId) {
        console.log('[Cart Store] Action removeItem triggered', { itemId });
        this.loading = true;
        this.error = null;
        const appLoading = useAppLoadingStore();
        appLoading.startLoading();

        try {
            const cartToken = getCartToken();
            console.log('[Cart Store] Removing item with token:', cartToken);
            const response = await cartService.removeItem(itemId, cartToken);
            if (response.status === 'Successfully deleted item') {
                await this.fetchCart();
                return response;
            } else {
                this.error = response.message || 'Failed to remove item';
                throw new Error(this.error);
            }
        } catch (error) {
            this.error = error.response?.data?.message || error.message;
            console.error('[Cart Store] Remove item error:', error);
            throw error;
        } finally {
            this.loading = false;
            appLoading.stopLoading();
        }
    }

    async function getCartCount() {
        console.log('[Cart Store] Action getCartCount triggered');
        try {
            const cartToken = getCartToken();
            const response = await cartService.getCartCount(cartToken);
            if (response.cartItemNumber) {
                this.count = response.cartItemNumber.cart_items_count || 0;
            }
            return response;
        } catch (error) {
            console.error('[Cart Store] Get cart count error:', error);
            this.count = 0;
            throw error;
        }
    }

    function openCart() {
        // Implement cart opening logic here
        console.log('[Cart Store] Opening cart');
    }

    async function clearCart() {
        this.loading = true;
        this.error = null;
        const appLoading = useAppLoadingStore();
        appLoading.startLoading();

        try {
            const cartToken = getCartToken();
            const response = await cartService.clearCart(cartToken);
            if (response.status === 'success') {
                this.items = [];
                this.count = 0;
                this.total = 0;
                localStorage.removeItem('cartToken');
                return response;
            } else {
                this.error = response.message || 'Failed to clear cart';
                throw new Error(this.error);
            }
        } catch (error) {
            this.error = error.response?.data?.message || error.message;
            console.error('[Cart Store] Clear cart error:', error);
            throw error;
        } finally {
            this.loading = false;
            appLoading.stopLoading();
        }
    }

    async function applyCoupon(code) {
        this.couponError = null;
        try {
            const data = await cartService.validateCoupon(code);
            this.couponCode = code;
            this.couponData = data;
            return data;
        } catch (error) {
            this.couponError = error.message || 'Invalid coupon code';
            this.couponCode = '';
            this.couponData = null;
            throw error;
        }
    }

    function removeCoupon() {
        this.couponCode = '';
        this.couponData = null;
        this.couponError = null;
    }

    const totalAfterDiscount = computed(() => {
        if (!couponData.value) return total.value;
        const { discount_type, discount_value, max_discount_amount } = couponData.value;
        let discount = 0;
        if (discount_type === 'percentage') {
            discount = (total.value * discount_value) / 100;
            if (max_discount_amount) discount = Math.min(discount, max_discount_amount);
        } else if (discount_type === 'flat') {
            discount = discount_value;
        }
        return Math.max(total.value - discount, 0);
    });

    return {
        items,
        count,
        total,
        loading,
        error,
        openCartAfterAdd,
        couponCode,
        couponData,
        couponError,
        applyCoupon,
        removeCoupon,
        totalAfterDiscount,
        addToCart,
        fetchCart,
        updateItem,
        removeItem,
        getCartCount,
        openCart,
        clearCart
    };
});