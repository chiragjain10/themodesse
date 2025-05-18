import axios from '../api/axios'; // Ensure the path to your axios config is correct

/**
 * To get all products from the backend
 * @returns {Promise<AxiosResponse>}
 */
export async function getProducts() {
  try {
    const response = await axios.get('http://localhost:8000/api/shop');
    return response; // Response object will have a data property (products array)
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw the error to be handled by the component
  }
}

/**
 * To get products by category from the backend
 * @param {string} categorySlug - Category slug
 * @returns {Promise<AxiosResponse>}
 */
export async function getProductsByCategory(categorySlug) {
  try {
    const response = await axios.get(`/api/shop?category=${categorySlug}`);
    return response;
  } catch (error) {
    console.error(`Error fetching products for category ${categorySlug}:`, error);
    throw error;
  }
}

/**
 * To get details of a specific product from the backend
 * @param {string} productSlug - Product slug
 * @returns {Promise<AxiosResponse>}
 */
export async function getProductDetails(productSlug) {
  try {
    const response = await axios.get(`/api/products/${productSlug}`); // Assuming a different endpoint for details
    return response;
  } catch (error) {
    console.error(`Error fetching details for product ${productSlug}:`, error);
    throw error;
  }
}

// You can define other product-related API calls here,
// such as add to cart, wishlist, reviews, etc.