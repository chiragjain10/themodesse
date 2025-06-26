import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useQuickViewStore = defineStore('quickView', () => {
    const currentProduct = ref(null);
    const isOpen = ref(false);

    const openQuickView = (product) => {
        currentProduct.value = product;
        isOpen.value = true;
    };

    const closeQuickView = () => {
        currentProduct.value = null;
        isOpen.value = false;
    };

    return {
        currentProduct,
        isOpen,
        openQuickView,
        closeQuickView
    };
}); 