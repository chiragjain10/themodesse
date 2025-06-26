import axios from 'axios';

export const cartService = {
    async addToCart(productId, quantity, cartToken, variants) {
        console.log('[Cart Service] Receiving arguments:', { productId, quantity, cartToken, variants });
        try {
            const requestData = {
                product_id: productId,
                quantity: quantity,
                cart_token: cartToken,
                variants: variants
            };
            console.log('Sending data to backend:', requestData);
            
            const response = await axios.post('/api/cart/items', requestData);
            console.log('Backend response:', response.data);
            return response.data;
        } catch (error) {
            console.error('[Cart Service] Add to cart error:', {
                error: error.response?.data,
                requestData: {
                    product_id: productId,
                    quantity: quantity,
                    cart_token: cartToken,
                    variants: variants
                }
            });
            throw error;
        }
    },

    async getCart(cartToken) {
        try {
            const response = await axios.get('/api/cart/inbox', {
                params: {
                    cart_token: cartToken
                }
            });
            console.log('[Cart Service] Get cart response:', response.data);
            return response.data;
        } catch (error) {
            console.error('[Cart Service] Get cart error:', error.response || error);
            throw error;
        }
    },

    async updateItem(cartId, productId, quantity, cartToken) {
        try {
            const response = await axios.put(`/api/cart/${cartId}/${productId}/${quantity}`);
            return response.data;
        } catch (error) {
            console.error('[Cart Service] Update item error:', error.response || error);
            throw error;
        }
    },

    async removeItem(itemId, cartToken) {
        try {
            console.log('[Cart Service] Removing item:', { itemId, cartToken });
            const response = await axios.delete(`/api/cart/${itemId}`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    cart_token: cartToken
                }
            });
            console.log('[Cart Service] Remove item response:', response.data);
            return response.data;
        } catch (error) {
            console.error('[Cart Service] Remove item error:', error.response || error);
            throw error;
        }
    },

    async getCartCount(cartToken) {
        try {
            const response = await axios.get('/api/cart/count', {
                params: {
                    cart_token: cartToken
                }
            });
            return response.data;
        } catch (error) {
            console.error('[Cart Service] Get cart count error:', error.response || error);
            throw error;
        }
    },

    async clearCart(cartToken) {
        try {
            const response = await axios.delete('/api/cart/clear', {
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    cart_token: cartToken
                }
            });
            return response.data;
        } catch (error) {
            console.error('[Cart Service] Clear cart error:', error.response || error);
            throw error;
        }
    },

    async validateCoupon(code) {
        try {
            const response = await axios.get(`/api/coupon/${code}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Invalid coupon code' };
        }
    }
};