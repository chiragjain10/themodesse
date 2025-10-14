import { defineStore } from 'pinia';
import { wishlistService } from '../services/wishlist';

export const useWishlistStore = defineStore('wishlist', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    lastAction: null,
    sessionId: localStorage.getItem('wishlistSessionId') || null,
    checkCache: new Map(),
    cacheDuration: 5000
  }),

  getters: {
    isEmpty: (state) => state.items.length === 0,
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    isWishlisted: (state) => (productId) => {
      const cached = state.checkCache.get(productId);
      if (cached && Date.now() - cached.timestamp < state.cacheDuration) {
        return cached.status;
      }
      return state.items.some(item => item.product_id === productId);
    }
  },

  actions: {
    generateSessionId() {
      if (!this.sessionId) {
        this.sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('wishlistSessionId', this.sessionId);
      }
      return this.sessionId;
    },

    async fetchWishlist() {
      this.loading = true;
      this.error = null;

      const sessionId = this.generateSessionId();
      if (!sessionId) {
        this.error = 'No session ID available';
        this.items = [];
        this.loading = false;
        return;
      }

      try {
        const response = await wishlistService.getWishlist(sessionId);
        this.items = Array.isArray(response) ? response : [];
        
        this.items.forEach(item => {
            this.checkCache.set(item.product_id, { status: true, timestamp: Date.now() });
        });

        const currentItemIds = new Set(this.items.map(item => item.product_id));
        for (const productId of this.checkCache.keys()) {
            if (!currentItemIds.has(productId)) {
                 this.checkCache.set(productId, { status: false, timestamp: Date.now() });
            }
        }
        return this.items;
      } catch (error) {
        console.error('[Wishlist Store] fetchWishlist Error:', error);
        this.error = error.response?.data?.message || error.message;
        this.items = [];
         this.checkCache.forEach((value, key) => this.checkCache.set(key, { status: false, timestamp: Date.now() }));
        throw error;
      } finally {
        this.loading = false;
        console.log('[Wishlist Store] fetchWishlist finished');
      }
    },

    async addToWishlist(productId) {
      this.loading = true;
      this.error = null;
      this.lastAction = 'add';
      try {
        const sessionId = this.generateSessionId();
        const response = await wishlistService.addToWishlist(productId, sessionId);
        if (response.status === 'success') {
          this.checkCache.set(productId, { status: true, timestamp: Date.now() });
          await this.fetchWishlist();
          return response;
        } else {
          this.error = response.message || 'Failed to add item to wishlist';
          this.checkCache.delete(productId);
          throw new Error(this.error);
        }
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        console.error('[Wishlist Store] Add to wishlist Error:', this.error);
        this.checkCache.delete(productId);
        throw error;
      } finally {
        this.loading = false;
        console.log('[Wishlist Store] addToWishlist finished');
      }
    },

    async removeFromWishlist(productId) {
      this.loading = true;
      this.error = null;
      this.lastAction = 'remove';

      try {
        const sessionId = this.generateSessionId();
        const response = await wishlistService.removeFromWishlist(productId, sessionId);
        if (response.status === 'success' || response.deleted) {
           // Optimistically update local state
           this.items = this.items.filter(item => item.product_id !== productId);
           this.checkCache.set(productId, { status: false, timestamp: Date.now() });
           await this.fetchWishlist();
        }
        return response;
      } catch (error) {
        console.error('[Wishlist Store] Remove from wishlist Error:', error.response?.data || error);
        this.error = error.response?.data?.message || error.message;
        this.checkCache.delete(productId);
        throw error;
      } finally {
        this.loading = false;
        console.log('[Wishlist Store] removeFromWishlist finished');
      }
    },

    async checkWishlisted(productId, sessionId) {
        try {
             const response = await wishlistService.checkWishlisted(productId, sessionId);
             this.checkCache.set(productId, { status: response.wishlisted, timestamp: Date.now() });
             return response;
        } catch (error) {
             console.error('[Wishlist Store] Direct checkWishlisted API error:', error);
             this.checkCache.delete(productId);
             throw error;
        } finally {
             console.log('[Wishlist Store] checkWishlisted finished');
        }
    }
  }
});