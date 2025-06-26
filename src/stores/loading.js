import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
  const isLoading = ref(false);
  const loadingCount = ref(0);
  const isAppInitialized = ref(false);

  const startLoading = () => {
    loadingCount.value++;
    isLoading.value = true;
  };

  const stopLoading = () => {
    loadingCount.value--;
    if (loadingCount.value <= 0) {
      loadingCount.value = 0;
      isLoading.value = false;
      // Assuming initial load is done when loadingCount first hits 0
      if (!isAppInitialized.value) {
          isAppInitialized.value = true;
      }
    }
  };

  return { isLoading, loadingCount, isAppInitialized, startLoading, stopLoading };
}); 