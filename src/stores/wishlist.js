import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from './auth';

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchWishlist() {
      this.loading = true;
      this.error = null;
      try {
        const { token } = useAuthStore();
        const res = await axios.get('/api/users/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.items = res.data;
      } catch (err) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async addToWishlist(productId) {
      this.error = null;
      try {
        const { token } = useAuthStore();
        await axios.post('/api/users/wishlist', { product_id: productId }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await this.fetchWishlist();
      } catch (err) {
        this.error = err.message;
      }
    },
    async removeFromWishlist(productId) {
      this.error = null;
      try {
        const { token } = useAuthStore();
        await axios.delete(`/api/users/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        await this.fetchWishlist();
      } catch (err) {
        this.error = err.message;
      }
    },
    isWishlisted(productId) {
      return this.items.some(item => item.product_id === productId);
    },
  },
}); 