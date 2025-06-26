import { defineStore } from 'pinia';
import { wishlistService } from '../services/wishlist';
import { useAppLoadingStore } from './appLoading';

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
      console.log(`[Wishlist Store] Getter isWishlisted accessed for product ${productId}`);
      const cached = state.checkCache.get(productId);
      if (cached && Date.now() - cached.timestamp < state.cacheDuration) {
        console.log(`[Wishlist Store] Cache hit for product ${productId}:`, cached.status);
        return cached.status;
      }

      console.log(`[Wishlist Store] Cache miss or expired for product ${productId}. Checking items array.`);
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
      console.log('[Wishlist Store] Action fetchWishlist triggered');
      this.loading = true;
      this.error = null;

      const sessionId = this.generateSessionId();
      if (!sessionId) {
        console.log('[Wishlist Store] fetchWishlist: No session ID available');
        this.error = 'No session ID available';
        this.items = [];
        this.loading = false;
        return;
      }

      try {
        console.log('[Wishlist Store] fetchWishlist: Calling getWishlist service');
        const response = await wishlistService.getWishlist(sessionId);
        console.log('[Wishlist Store] fetchWishlist: Service responded', response);
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

        console.log('[Wishlist Store] fetchWishlist: Items and cache updated', { items: this.items, checkCache: this.checkCache });

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
      console.log('[Wishlist Store] Action addToWishlist triggered for product', productId);
      this.loading = true;
      this.error = null;
      this.lastAction = 'add';

      try {
        const sessionId = this.generateSessionId();
        console.log('[Wishlist Store] addToWishlist: Calling service');
        const response = await wishlistService.addToWishlist(productId, sessionId);
        console.log('[Wishlist Store] addToWishlist: Service responded', response);
        if (response.status === 'success') {
          this.checkCache.set(productId, { status: true, timestamp: Date.now() });
          console.log('[Wishlist Store] addToWishlist: Cache updated', this.checkCache);
          await this.fetchWishlist();
          console.log('[Wishlist Store] addToWishlist: fetchWishlist completed');
          return response;
        } else {
          this.error = response.message || 'Failed to add item to wishlist';
          this.checkCache.delete(productId);
          console.error('[Wishlist Store] addToWishlist: Service reported not success', response);
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
      console.log('[Wishlist Store] Action removeFromWishlist triggered for product', productId);
      this.loading = true;
      this.error = null;
      this.lastAction = 'remove';

      try {
        const sessionId = this.generateSessionId();
        console.log('[Wishlist Store] removeFromWishlist: Calling service');
        const response = await wishlistService.removeFromWishlist(productId, sessionId);
        console.log('[Wishlist Store] removeFromWishlist: Service responded', response);
        if (response.status === 'success') {
           this.checkCache.set(productId, { status: false, timestamp: Date.now() });
           console.log('[Wishlist Store] removeFromWishlist: Cache updated', this.checkCache);
           await this.fetchWishlist();
           console.log('[Wishlist Store] removeFromWishlist: fetchWishlist completed');
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
        console.log('[Wishlist Store] Action checkWishlisted triggered for product', productId);
        try {
             console.log('[Wishlist Store] checkWishlisted: Calling service');
             const response = await wishlistService.checkWishlisted(productId, sessionId);
             console.log('[Wishlist Store] checkWishlisted: Service responded', response);
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