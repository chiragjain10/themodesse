import { useCartStore } from '@/stores/cart';
import { ref } from 'vue';
import api from '../api';

export function useQuantityControls() {
    const cart = useCartStore();
    const loading = ref(false);
    const error = ref(null);

    /**
     * Increases the quantity of a cart item.
     * @param {string|number} itemId - The unique ID of the item in the cart (cart_id).
     * @param {number} newQuantity - The new quantity for the item.
     */
    const increaseQuantity = async (itemId, newQuantity) => {
         // Find the item in the cart store
        const item = cart.items.find(i => i.item_id === itemId);
        // Access product ID nested within item.product, with safe navigation
        const productId = item?.product?.id; // Use item.product.id

        // Ensure item and product exist, quantity is valid, and productId is available
        if (!item || !item.product || newQuantity < 1 || productId === undefined) {
             console.error('Increase quantity aborted: Invalid item, product, quantity, or product ID.', { itemId, newQuantity, item, productId });
            return;
        }

        // Call the updateItem action in the cart store with the correct product ID
        await cart.updateItem(itemId, productId, newQuantity);
    };

    /**
     * Decreases the quantity of a cart item.
     * @param {string|number} itemId - The unique ID of the item in the cart (cart_id).
     */
    const decreaseQuantity = async (itemId) => {
         // Find the item in the cart store
        const item = cart.items.find(i => i.item_id === itemId);
        // Access product ID nested within item.product, with safe navigation
         const productId = item?.product?.id; // Use item.product.id

        // Ensure item and product exist, quantity > 1, and productId is available
        if (!item || !item.product || item.qty <= 1 || productId === undefined) {
            console.error('Decrease quantity aborted: Invalid item, product, quantity, or product ID.', { itemId, item, productId });
            return;
        }
        
        // Call the updateItem action in the cart store with the decreased quantity
        await cart.updateItem(itemId, productId, item.qty - 1);
    };

    const updateQuantity = async (itemId, newQuantity) => {
        loading.value = true;
        error.value = null;

        try {
            // Find the item in the cart store
            const item = cart.items.find(i => i.item_id === itemId);
            
            if (!item || !item.product) {
                console.error("Item or product not found:", { itemId, item });
                loading.value = false;
                return;
            }

            const cartId = item.id; // This is the cart item id (cartId)
            const productId = item.product.id;
            
            if (!cartId || !productId) {
                console.error("Cart ID or Product ID not found:", { itemId, item });
                loading.value = false;
                return;
            }

            console.log("Updating quantity for Cart ID:", cartId, "Product ID:", productId, "to", newQuantity);

            // Call the updateItem action in the cart store
            await cart.updateItem(itemId, newQuantity);
        } catch (e) {
            error.value = e.response?.data?.message || e.message;
            console.error('API call failed:', e);
        } finally {
            loading.value = false;
        }
    };

    return {
        increaseQuantity,
        decreaseQuantity,
        updateQuantity,
    };
} 