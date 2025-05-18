import { defineStore } from 'pinia';
import { cartService } from '../services/cart';
import { useAuthStore } from './auth';

export const useCartStore = defineStore('cart', {
    state: () => ({
        items: [],
        total: 0,
        count: 0,
        loading: false,
        error: null
    }),

    actions: {
        async addToCart(productId, quantity) {
            this.loading = true;
            this.error = null;
            const auth = useAuthStore();
            try {
                const response = await cartService.addToCart(productId, quantity, auth.user.id);
                if (response.status === 'success') {
                    await this.fetchCart();
                    return response;
                } else {
                    this.error = response.message || 'Failed to add item to cart';
                    throw new Error(this.error);
                }
            } catch (error) {
                this.error = error.response?.data?.message || error.message;
                console.error('Add to cart error:', this.error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchCart() {
            this.loading = true;
            this.error = null;
            const auth = useAuthStore();

            if (!auth.user?.id) {
                console.error('No user ID available');
                this.error = 'User not authenticated';
                return;
            }

            try {
                const response = await cartService.getCart(auth.user.id);
                console.log('Response from cartService.getCart:', response);

                const cartItems = response.carts || [];
                this.items = cartItems;
                this.count = cartItems.length;
                this.total = cartItems.reduce((sum, item) => {
                    return sum + (item.product?.sale_price || 0) * (item.qty || 1);
                }, 0);

                return response;
            } catch (error) {
                this.error = error.response?.data?.message || error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateItem(cartId, productId, quantity) {
            this.loading = true;
            this.error = null;
            try {
                const response = await cartService.updateCartItem(cartId, productId, quantity);
                if (response.status === 'success') {
                    // Refresh cart data after successful update
                    await this.fetchCart();
                }
                return response;
            } catch (error) {
                console.error('Update cart error:', error.response || error);
                this.error = error.response?.data?.message || error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async removeItem(id) {
            this.loading = true;
            this.error = null;
            try {
                const response = await cartService.removeCartItem(id);
                await this.fetchCart();
                return response;
            } catch (error) {
                console.error('Remove cart error:', error.response || error);
                this.error = error.response?.data?.message || error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async getCartCount(userId) {
            this.loading = true;
            this.error = null;
            try {
                const response = await cartService.getCartCount(userId);
                this.count = response.count;
                return response;
            } catch (error) {
                console.error('Get cart count error:', error.response || error);
                this.error = error.response?.data?.message || error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
}); 