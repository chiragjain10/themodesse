import { defineStore } from 'pinia'
import axios from 'axios'
import { ref } from 'vue'
import { useCartStore } from './cart'
import { useWishlistStore } from './wishlist'
import { useCompareStore } from './compare'
import { useToast } from '@/composables/useToast'

export const useProductStore = defineStore('product', () => {
  const cart = useCartStore()
  const wishlist = useWishlistStore()
  const compare = useCompareStore()
  const toast = useToast()

  const addToCart = async (product, quantity = 1, selectedAttributes = {}) => {
    console.log('Adding to cart:', { product, quantity, selectedAttributes })
    try {
      const cartData = {
        productId: product.id,
        quantity: quantity,
        selectedVariant: selectedAttributes,
        cartToken: localStorage.getItem('cartToken') || generateCartToken()
      }

      const response = await cart.addToCart(cartData)
      
      if (response.status === 'success') {
        toast.success('Product added to cart successfully')
        if (cart.openCartAfterAdd) {
          cart.openCart()
        }
      } else {
        toast.error(response.message || 'Failed to add product to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add product to cart')
    }
  }

  const addToWishlist = async (product) => {
    console.log('Adding to wishlist:', product)
    try {
      if (wishlist.isWishlisted(product.id)) {
        await wishlist.removeFromWishlist(product.id)
        toast.success('Product removed from wishlist')
      } else {
        await wishlist.addToWishlist(product.id)
        toast.success('Product added to wishlist')
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
      toast.error('Failed to update wishlist')
    }
  }

  const addToCompare = async (product) => {
    console.log('Adding to compare:', product)
    try {
      if (compare.isInCompare(product.id)) {
        await compare.removeFromCompare(product.id)
        toast.success('Product removed from compare')
      } else {
        if (compare.isFull.value) {
          toast.error(`Cannot add more than ${compare.maxItems} items to compare`)
          return
        }
        await compare.addToCompare(product)
        toast.success('Product added to compare')
      }
    } catch (error) {
      console.error('Error updating compare list:', error)
      toast.error(error.message || 'Failed to update compare list')
    }
  }

  // Helper function to generate cart token
  const generateCartToken = () => {
    return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  return {
    addToCart,
    addToWishlist,
    addToCompare
  }
})