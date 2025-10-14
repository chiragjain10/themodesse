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

  // Add product state
  const product = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchProduct = async (slug) => {
    loading.value = true
    error.value = null
    try {
      const response = await axios.get(`/api/products/${slug}`)
      product.value = response.data.product
    } catch (err) {
      error.value = err?.response?.data?.message || 'Failed to load product.'
      product.value = null
    } finally {
      loading.value = false
    }
  }

  const addToCart = async (productObj, quantity = 1, selectedAttributes = {}) => {
    console.log('Adding to cart:', { product: productObj, quantity, selectedAttributes })
    try {
      const cartData = {
        productId: productObj.id,
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

  const addToWishlist = async (productObj) => {
    console.log('Adding to wishlist:', productObj)
    try {
      if (wishlist.isWishlisted(productObj.id)) {
        await wishlist.removeFromWishlist(productObj.id)
        toast.success('Product removed from wishlist')
      } else {
        await wishlist.addToWishlist(productObj.id)
        toast.success('Product added to wishlist')
      }
    } catch (error) {
      console.error('Error updating wishlist:', error)
      toast.error('Failed to update wishlist')
    }
  }

  const addToCompare = async (productObj) => {
    console.log('Adding to compare:', productObj)
    try {
      if (compare.isInCompare(productObj.id)) {
        await compare.removeFromCompare(productObj.id)
        toast.success('Product removed from compare')
      } else {
        if (compare.isFull.value) {
          toast.error(`Cannot add more than ${compare.maxItems} items to compare`)
          return
        }
        await compare.addToCompare(productObj)
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
    product,
    loading,
    error,
    fetchProduct,
    addToCart,
    addToWishlist,
    addToCompare
  }
})