import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useWishlistStore } from '@/stores/wishlist';
import { useQuickViewStore } from '@/stores/quickView';
import { until } from '@vueuse/core';

export function useProductActions() {
    const router = useRouter();
    const cart = useCartStore();
    const auth = useAuthStore();
    const wishlist = useWishlistStore();
    const quickView = useQuickViewStore();

    // Handle Add to Cart
    const addToCart = async (cartData) => {
        try {
            console.log('Received cart data:', cartData);
            
            // Validate cart data
            if (!cartData.productId || !cartData.quantity || !cartData.selectedVariant) {
                console.error('Missing required data:', {
                    productId: cartData.productId,
                    quantity: cartData.quantity,
                    selectedVariant: cartData.selectedVariant
                });
                throw new Error('Missing required cart data');
            }

            // Format the data for the API
            const formattedVariants = Object.keys(cartData.selectedVariant).map(key => ({
                type: key,
                value: cartData.selectedVariant[key]
            }));

            const formattedData = {
                product_id: cartData.productId,
                quantity: cartData.quantity,
                variants: formattedVariants,
                cart_token: cartData.cartToken
            };

            console.log('Sending cart data to backend:', formattedData);
            const response = await cart.addToCart(formattedData);
            
            if (response.status === 'error') {
                console.error('Backend error response:', response);
                throw new Error(response.message);
            }
            
            return response;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    // Handle Wishlist Add/Remove
    const handleWishlist = async (product) => {
        // Wait until auth state is fully loaded
        await until(() => auth.userLoaded);

        if (!auth.isAuthenticated) { // Check isAuthenticated after user data is loaded
            router.push('/login');
            return;
        }
        try {
            // Assuming product object has an 'id' or 'p_id' field and wishlist store has isWishlisted, addToWishlist, removeFromWishlist
            if (wishlist.isWishlisted(product.p_id)) { // Use p_id or equivalent
                await wishlist.removeFromWishlist(product.p_id); // Use p_id or equivalent
                console.log('Removed from wishlist:', product.name);
            } else {
                await wishlist.addToWishlist(product.p_id); // Use p_id or equivalent
                console.log('Added to wishlist:', product.name);
            }
        } catch (err) {
            console.error('Error updating wishlist:', err);
            // Optional: Show an error notification
        }
    };

    // Handle Quick View
    const openQuickView = (product) => {
        // Initialize product images array (similar to best-seller logic)
        const images = [{
            url: product.image,
            color: 'default'
        }];
        if (product.image_hover) {
            images.push({
                url: product.image_hover,
                color: 'hover'
            });
        }
        if (product.variants?.materials) {
            product.variants.materials.forEach(material => {
                if (material.image) {
                    images.push({ url: material.image, color: material.name });
                } else if (material.color_code) {
                    // Handle cases where there's a color code but no image for the material
                    // You might want to add a placeholder image or handle this differently in your UI
                }
            });
        }

        // Set the product data with images in the quickView store
        const productWithImages = {
            ...product,
            images: images
        };

        quickView.openQuickView(productWithImages);

        // The QuickView component is expected to handle showing the modal
    };

    // Helper function to calculate original price
    const calculateOriginalPrice = (salePrice, discount, type) => {
        if (!discount || !salePrice) return salePrice; // Return original value if no discount or sale price
        let originalPrice = parseFloat(salePrice || 0);
        let disc = parseFloat(discount || 0);

        if (type === 'percentage') {
            // Ensure percentage discount is not 100 or more to avoid division by zero or negative results
             if (disc >= 100) return 0; // Or handle as an error/special case
            originalPrice = originalPrice / (1 - disc / 100);
        } else if (type === 'fixed') {
            originalPrice = originalPrice + disc;
        }
        return originalPrice.toFixed(2);
    };

    return {
        addToCart,
        handleWishlist,
        openQuickView,
        calculateOriginalPrice,
        // You might return other state or computed properties if needed
        // e.g., loading state for add to cart specific to this composable
    };
} 