import { defineStore } from 'pinia';

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        currency: localStorage.getItem('selectedCurrency') || 'USD',
        language: localStorage.getItem('selectedLanguage') || 'en'
    }),
    
    actions: {
        setCurrency(currency) {
            this.currency = currency;
        },
        
        setLanguage(language) {
            this.language = language;
        }
    },
    
    getters: {
        getCurrency: (state) => state.currency,
        getLanguage: (state) => state.language
    }
}); 