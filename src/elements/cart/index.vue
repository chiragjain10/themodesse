<template>
    <!-- Page Title -->
    <CartHeader />
    <!-- /Page Title -->
    <!-- Shop Cart -->
    <section class="flat-spacing s-shop-cart each-list-prd">
        <div class="container">
            <div class="row">
                <div class="col-xl-8">
                    <div class="left mb-xl-0">
                        <CartTable />

                        <!-- Shipping Calculation Section -->
                        <div class="shipping-calculator style-border">
                            <h5 class="title-total fw-medium">Calculate Shipping</h5>
                            <div class="form-group">
                                <label class="label-text" for="country">Country</label>
                                <select id="country" class="form-select" v-model="shippingAddress.country" @change="fetchStatesByCountry" :disabled="countryLoading">
                                    <option value="">Select Country</option>
                                    <option v-for="country in countries" :key="country.code" :value="country.code">{{ country.name }}</option>
                                </select>
                                <div v-if="countryLoading"><Loader /> Loading countries...</div>
                                <span v-if="countryError" class="text-danger">{{ countryError }}</span>
                                                </div>
                            <div class="form-group">
                                <label class="label-text" for="state">State/Province</label>
                                <select id="state" class="form-select" v-model="shippingAddress.state" :disabled="!shippingAddress.country || stateLoading">
                                    <option value="">Select State/Province</option>
                                    <option v-for="state in states" :key="state.code" :value="state.code">{{ state.name }}</option>
                                </select>
                                <div v-if="stateLoading"><Loader /> Loading states...</div>
                                <span v-if="stateError" class="text-danger">{{ stateError }}</span>
                                            </div>
                            <div class="form-group">
                                <label class="label-text" for="zip">Zip/Postal Code</label>
                                <input id="zip" type="text" class="form-control" v-model="zipCodeInput" @input="handleZipInput">
                                <div v-if="zipLoading"><Loader /> Fetching city suggestions...</div>
                                <span v-if="zipError" class="text-danger">{{ zipError }}</span>
                                 <!-- City suggestions dropdown -->
                                <ul v-if="citySuggestions.length > 0" class="list-group mt-2">
                                    <li v-for="suggestion in citySuggestions" :key="suggestion.zip" class="list-group-item list-group-item-action" @click="selectCitySuggestion(suggestion)">
                                        {{ suggestion.city }} ({{ suggestion.zip }})
                                    </li>
                                </ul>
                                                </div>
                             <div class="form-group">
                                <label class="label-text" for="city">City</label>
                                <input id="city" type="text" class="form-control" v-model="shippingAddress.city" :disabled="true"> <!-- City is populated by suggestion -->
                                            </div>

                            <button type="button" class="tf-btn btn-fill fw-medium mt-3" @click="calculateShipping" :disabled="!shippingAddress.zip || shippingLoading">
                                Calculate Shipping
                            </button>

                            <div v-if="shippingMethods.length > 0" class="mt-4">
                                <h6 class="fw-medium">Available Shipping Methods:</h6>
                                <div v-for="method in shippingMethods" :key="method.id" class="form-check">
                                    <input class="form-check-input" type="radio" :id="`shipping-${method.id}`" :value="method.id" v-model="selectedShippingMethod">
                                    <label class="form-check-label" :for="`shipping-${method.id}`">
                                        {{ method.label }} - ₹{{ Number(method.price || 0).toFixed(2) }}
                                    </label>
                                                </div>
                                            </div>
                            <div v-if="shippingLoading"><Loader /> Calculating shipping...</div>
                            <span v-if="shippingError" class="text-danger">{{ shippingError }}</span>
                        </div>

                        <div class="checkbox-wrap">
                            <input id="add-gift" type="checkbox" class="tf-check style-4">
                            <label for="add-gift">Add gift packaging (₹{{ Number(giftPackagingPrice.value || 0).toFixed(2) }})</label>
                        </div>
                        <form class="style-border">
                            <fieldset>
                                <label class="label-text">Special instructions for seller</label>
                                <textarea style="height: 206px;"></textarea>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div class="col-xl-4">
                    <CartSummary :finalTotal="totalWithShipping" :paymentMethods="paymentMethods" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useCartStore } from '@/stores/cart';
import { RouterLink, useRouter } from 'vue-router';
import { debounce } from 'lodash';
import { useAuthStore } from '@/stores/auth';

import CartHeader from './CartHeader.vue';
import CartTable from './CartTable.vue';
import CartSummary from './CartSummary.vue';
import RecommendedProducts from './RecommendedProducts.vue';

// Import Loader component
import Loader from '@/components/Loader.vue';

const cart = useCartStore();
const router = useRouter(); // Initialize router
const cartItems = computed(() => cart.items);
const cartTotal = computed(() => cart.total);
const auth = useAuthStore();
const paymentMethods = ref([]);
const shippingMethods = ref([]);

// Add initialization
onMounted(async () => {
    try {
        await cart.fetchCart();
        // Always fetch payment/shipping methods for both guests and logged-in users
        const userId = auth.user?.id || 1; // fallback to 1 for guests
        const { data } = await axios.get(`/api/users/checkout/${userId}`);
        paymentMethods.value = data.paymentMethods || [];
        shippingMethods.value = data.shippingMethods || [];
    } catch (error) {
        console.error('Error initializing cart or fetching methods:', error);
    }
});

// Watch for route changes to reinitialize cart data
watch(() => router.currentRoute.value, async (newRoute) => {
    if (newRoute.name === 'cart') {
        try {
            await cart.fetchCart();
        } catch (error) {
            console.error('Error initializing cart:', error);
        }
    }
}, { immediate: true });

// Calculate shipping progress (e.g., for a free shipping threshold of $200)
const freeShippingThreshold = 200;
const shippingProgress = computed(() => {
    const progress = (cartTotal.value / freeShippingThreshold) * 100;
    return Math.min(progress, 100); // Cap at 100%
});

// --- Shipping Logic from components/cart/index.vue ---
const selectedShippingMethod = ref(null);
const shippingAddress = ref({
    country: '',
    state: '',
    city: '',
    zip: '',
});

const shippingLoading = ref(false);
const shippingError = ref(null);

const countries = ref([]);
const countryLoading = ref(false);
const countryError = ref(null);

const states = ref([]);
const stateLoading = ref(false);
const stateError = ref(null);

const zipCodeInput = ref('');
const citySuggestions = ref([]);
const zipLoading = ref(false);
const zipError = ref(null);

const giftPackagingPrice = ref(0);

// Computed property for total including shipping
const totalWithShipping = computed(() => {
    const shippingCost = selectedShippingMethod.value
        ? shippingMethods.value.find(method => method.id === selectedShippingMethod.value)?.price || 0
        : 0;
    return cartTotal.value + shippingCost;
});

// Placeholder function to fetch countries
const fetchCountries = async () => {
    countryLoading.value = true;
    countryError.value = null;
    try {
        countries.value = [
            { code: 'us', name: 'United States' },
            { code: 'uk', name: 'United Kingdom' },
            { code: 'fr', name: 'France' },
            { code: 'aus', name: 'Australia' },
            { code: 'ind', name: 'India' },
        ];

    } catch (error) {
        countryError.value = 'Failed to load countries.' + (error.message || '');
        console.error('Error fetching countries:', error);
    } finally {
        countryLoading.value = false;
    }
};

// Placeholder function to fetch states by country
const fetchStatesByCountry = async () => {
    const countryCode = shippingAddress.value.country;
    if (!countryCode) {
        states.value = [];
        return;
    }
    stateLoading.value = true;
    stateError.value = null;
    try {
        const dummyStates = {
            us: [ { code: 'CA', name: 'California' }, { code: 'TX', name: 'Texas' } ],
            uk: [ { code: 'ENG', name: 'England' }, { code: 'SCT', name: 'Scotland' } ],
            fr: [ { code: 'IDF', name: 'Île-de-France' } ],
            aus: [ { code: 'NSW', name: 'New South Wales' } ],
             ind: [ { code: 'MH', name: 'Maharashtra' }, { code: 'DL', name: 'Delhi' }, { code: 'KA', name: 'Karnataka' } ],
        };
        states.value = dummyStates[countryCode] || [];
        shippingAddress.value.state = ''; // Reset state when country changes

    } catch (error) {
        stateError.value = 'Failed to load states.' + (error.message || '');
        console.error('Error fetching states:', error);
    } finally {
        stateLoading.value = false;
    }
};

const fetchCitySuggestionsByZip = debounce(async () => {
    const zip = zipCodeInput.value;
    if (zip.length < 3) { // Minimum characters to trigger suggestion
        citySuggestions.value = [];
        return;
    }
    zipLoading.value = true;
    zipError.value = null;
    try {
         const dummySuggestions = [
            { zip: '90210', city: 'Beverly Hills', state: 'CA', country: 'us' },
            { zip: '10001', city: 'New York', state: 'NY', country: 'us' },
             { zip: '400001', city: 'Mumbai', state: 'MH', country: 'ind' },
             { zip: '110001', city: 'Delhi', state: 'DL', country: 'ind' },
        ];

        citySuggestions.value = dummySuggestions.filter(s =>
             s.zip.startsWith(zip)
        );

    } catch (error) {
        zipError.value = 'Failed to fetch suggestions.' + (error.message || '');
        console.error('Error fetching suggestions:', error);
    } finally {
        zipLoading.value = false;
    }
}, 300);

// Handle zip code input
const handleZipInput = () => {
    // Clear selected address fields when zip changes
    shippingAddress.value.city = '';
    shippingAddress.value.state = '';
    shippingAddress.value.country = '';
    fetchCitySuggestionsByZip();
};

// Select a city suggestion and populate fields
const selectCitySuggestion = (suggestion) => {
    zipCodeInput.value = suggestion.zip;
    shippingAddress.value.zip = suggestion.zip;
    shippingAddress.value.city = suggestion.city;
    shippingAddress.value.state = suggestion.state;
    shippingAddress.value.country = suggestion.country;
    citySuggestions.value = [];
     calculateShipping();
};

// Placeholder function to fetch shipping methods
const fetchShippingMethods = async () => {
    shippingLoading.value = true;
    shippingError.value = null;
     // In a real application, this would likely take the shippingAddress as a parameter
    try {
        shippingMethods.value = [
            { id: 'flat_rate', label: 'Flat Rate', price: 10.00 },
            { id: 'free-shipping', label: 'Free Shipping', price: 0.00 },
            { id: 'local_pickup', label: 'Local Pickup', price: 0.00 },
        ];

        // Select the first method by default if available and not already selected
         if (shippingMethods.value.length > 0 && selectedShippingMethod.value === null) {
            selectedShippingMethod.value = shippingMethods.value[0].id;
        }

    } catch (error) {
        shippingError.value = 'Failed to load shipping methods.' + (error.message || '');
        console.error('Error fetching shipping methods:', error);
    } finally {
        shippingLoading.value = false;
    }
};

const calculateShipping = async () => {
    console.log('Calculating shipping for address:', shippingAddress.value);
    await fetchShippingMethods();
};

onMounted(() => {
    fetchCountries();
});

watch(() => shippingAddress.value.country, () => {
    fetchStatesByCountry();
    // Also clear shipping methods and selection when country changes
    shippingMethods.value = [];
    selectedShippingMethod.value = null;
});

watch(zipCodeInput, () => {
    handleZipInput();
});
</script>

<style scoped>
.shipping-calculator .form-group {
    margin-bottom: 15px;
}

.shipping-calculator .list-group-item {
    cursor: pointer;
}
</style>