<template>
    <div class="footer-bottom">
        <div class="container">
            <div class="footer-bottom-wrap">
                <div class="footer-bar-language">
                    <div class="tf-currencies">
                        <select v-model="selectedCurrency" class="tf-dropdown-select style-default type-currencies" @change="handleCurrencyChange">
                            <option v-for="currency in currencies" :key="currency.code" :value="currency.code">
                                {{ currency.name }} ({{ currency.code }} {{ currency.symbol }})
                            </option>
                        </select>
                    </div>
                    <div class="tf-languages">
                        <select v-model="selectedLanguage" class="tf-dropdown-select style-default type-languages" @change="handleLanguageChange">
                            <option v-for="language in languages" :key="language.code" :value="language.code">
                                {{ language.name }}
                            </option>
                        </select>
                    </div>
                </div>
                <p class="text-nocopy">
                    All Rights Reserved {{ new Date().getFullYear() }} The Modesse.
                </p>
                <ul class="paymend-method-list">
                    <li v-for="payment in paymentMethods" :key="payment.id">
                        <a href="#" @click.prevent="handlePaymentClick(payment)">
                            <img :src="payment.icon" :alt="payment.name">
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useSettingsStore } from '@/stores/settings';

import visa from '@/assets/images/visa.png';
import amex from '@/assets/images/amex.jpg';
import mastercared from '@/assets/images/mastercard.png';
import paypal from '@/assets/images/paypal.png';
import upi from '@/assets/images/upi.png';

const settingsStore = useSettingsStore();

// Currency data
const currencies = ref([
    { code: 'INR', name: 'India', symbol: '₹' },
    { code: 'USD', name: 'United States', symbol: '$' },
    { code: 'GBP', name: 'United Kingdom', symbol: '£' },
    { code: 'EUR', name: 'European Union', symbol: '€' }
]);

// Language data
const languages = ref([
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' }
]);

// Payment methods data
const paymentMethods = ref([
    { id: 1, name: 'Visa', icon: visa },
    { id: 2, name: 'Mastercard', icon: mastercared },
    { id: 3, name: 'American Express', icon: amex },
    { id: 4, name: 'PayPal', icon: paypal },
    { id: 5, name: 'UPI', icon: upi }
]);

// Selected values
const selectedCurrency = ref('INR');
const selectedLanguage = ref('en');

// Load saved preferences
onMounted(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    const savedLanguage = localStorage.getItem('selectedLanguage');
    
    if (savedCurrency) selectedCurrency.value = savedCurrency;
    if (savedLanguage) selectedLanguage.value = savedLanguage;
});

// Handle currency change
const handleCurrencyChange = () => {
    localStorage.setItem('selectedCurrency', selectedCurrency.value);
    settingsStore.setCurrency(selectedCurrency.value);
    // You can add additional logic here, like updating prices
};

// Handle language change
const handleLanguageChange = () => {
    localStorage.setItem('selectedLanguage', selectedLanguage.value);
    settingsStore.setLanguage(selectedLanguage.value);
    // You can add additional logic here, like updating the UI language
};

// Handle payment method click
const handlePaymentClick = (payment) => {
    // You can add logic here to handle payment method selection
    console.log('Selected payment method:', payment.name);
};
</script>

<style scoped>
.footer-bottom {
    padding: 20px 0;
    border-top: 1px solid #eee;
}

.footer-bottom-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

.footer-bar-language {
    display: flex;
    gap: 15px;
}

.tf-dropdown-select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
}

.paymend-method-list {
    display: flex;
    gap: 10px;
    list-style: none;
    padding: 0;
    margin: 0;
}

.paymend-method-list img {
    height: 24px;
    width: auto;
}

@media (max-width: 768px) {
    .footer-bottom-wrap {
        flex-direction: column;
        text-align: center;
    }
    
    .footer-bar-language {
        justify-content: center;
    }
    
    .paymend-method-list {
        justify-content: center;
        flex-wrap: wrap;
    }
}
</style>