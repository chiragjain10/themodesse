import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCompareStore = defineStore('compare', () => {
    const items = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const maxItems = 4; // Maximum number of items that can be compared

    // Load items from localStorage on store initialization
    const loadFromStorage = () => {
        const storedItems = localStorage.getItem('compareItems');
        if (storedItems) {
            items.value = JSON.parse(storedItems);
        }
    };

    // Save items to localStorage whenever they change
    const saveToStorage = () => {
        localStorage.setItem('compareItems', JSON.stringify(items.value));
    };

    // Computed properties
    const isInCompare = (productId) => {
        return items.value.some(item => item.id === productId);
    };

    const itemCount = computed(() => items.value.length);

    const isFull = computed(() => items.value.length >= maxItems);

    // Actions
    const addToCompare = async (product) => {
        try {
            if (!isInCompare(product.id)) {
                if (isFull.value) {
                    throw new Error(`Cannot add more than ${maxItems} items to compare`);
                }
                items.value.push(product);
                saveToStorage();
            }
        } catch (error) {
            console.error('Error adding to compare:', error);
            throw error;
        }
    };

    const removeFromCompare = async (productId) => {
        try {
            items.value = items.value.filter(item => item.id !== productId);
            saveToStorage();
        } catch (error) {
            console.error('Error removing from compare:', error);
            throw error;
        }
    };

    const clearCompare = () => {
        items.value = [];
        saveToStorage();
    };

    // Initialize store
    loadFromStorage();

    return {
        items,
        loading,
        error,
        maxItems,
        isInCompare,
        itemCount,
        isFull,
        addToCompare,
        removeFromCompare,
        clearCompare
    };
});