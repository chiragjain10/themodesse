import axios from '../api/axios'

export const wishlistService = {
    async addToWishlist(productId, sessionId) {
        try {
            const response = await axios.post('/wishlist', {
                product_id: productId,
                session_id: sessionId
            })
            return response.data
        } catch (error) {
            console.error('Add to wishlist error:', error.response?.data || error)
            throw error
        }
    },

    async removeFromWishlist(productId, sessionId) {
        try {
            const response = await axios.delete(`/wishlist/${productId}?session_id=${sessionId}`)
            return response.data
        } catch (error) {
            console.error('Remove from wishlist error:', error.response?.data || error)
            throw error
        }
    },

    async getWishlist(sessionId) {
        try {
            const response = await axios.get(`/wishlist/${sessionId}`)
            return response.data
        } catch (error) {
            console.error('Get wishlist error:', error.response?.data || error)
            throw error
        }
    },

    async checkWishlisted(productId, sessionId) {
        try {
            const response = await axios.get(`/wishlist/check/${productId}`, {
                params: { session_id: sessionId }
            })
            return response.data
        } catch (error) {
            console.error('Check wishlist error:', error.response?.data || error)
            throw error
        }
    }
} 