<template>
  <div class="popup-overlay" @click.self="close">
    <div class="popup-content">
      <button class="close-btn" @click="close">&times;</button>
      <div class="logo-row">
        <img src="/src/assets/images/Phalit-logo.png" alt="GemsMantra" class="logo" />
      </div>
      <h3 class="popup-title">Subscribe and Get</h3>
      <h1 class="popup-offer">10% OFF</h1>
      <div class="popup-sub">on Your Next Order</div>

      <form @submit.prevent="submit">
        <div class="row g-1 mb-3">
          <div class="col-3">
            <select v-model="selectedCode" class="form-select form-control">
              <option v-for="code in countryCodes" :key="code.code" :value="code.dial_code">
                {{ code.name }} ({{ code.dial_code }})
              </option>
            </select>
          </div>
          <div class="col-9">
            <input type="tel" v-model="phone" class="form-control" placeholder="Enter phone number" maxlength="15"
              required />
          </div>
        </div>
        <button class="submit-btn" :disabled="!validPhone">Get discount code</button>
      </form>
      <p class="disclaimer">
        I agree to receive automated marketing messages at the phone number provided. Consent is not a condition to
        purchase. Msg & data rates may apply. Msg frequency varies. Reply HELP for help and STOP to cancel. View our
        Terms Of Service and Privacy Policy.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, onMounted } from 'vue';
const emit = defineEmits(['close', 'submit']);
const phone = ref('');
const countryCodes = ref([]);
const selectedCode = ref('+91');

const validPhone = computed(() => phone.value.length >= 6 && phone.value.length <= 15 && /^\d+$/.test(phone.value));

function close() {
  emit('close');
}

function submit() {
  if (validPhone.value) {
    // WhatsApp integration: open WhatsApp with pre-filled message
    const fullNumber = `${selectedCode.value}${phone.value}`;
    const message = encodeURIComponent(`New Discount Form Submission: ${fullNumber}`);
    // Replace YOUR_WHATSAPP_NUMBER with your WhatsApp number in international format, e.g. 919999999999
    window.open(`https://wa.me/YOUR_WHATSAPP_NUMBER?text=${message}`, '_blank');
    emit('submit', { country: selectedCode.value, phone: phone.value });
  }
}

onMounted(async () => {
  // Fetch country codes from a public API
  try {
    const res = await fetch('https://restcountries.com/v2/all?fields=name,callingCodes,alpha2Code');
    const data = await res.json();
    countryCodes.value = data
      .filter(c => c.callingCodes && c.callingCodes.length > 0 && c.callingCodes[0])
      .map(c => ({
        name: c.name,
        code: c.alpha2Code,
        dial_code: `+${c.callingCodes[0]}`
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (e) {
    countryCodes.value = [
      { name: 'India', code: 'IN', dial_code: '+91' },
      { name: 'United States', code: 'US', dial_code: '+1' }
    ];
  }
});
</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup-content {
  background: #fff;
  border-radius: 12px;
  width: 50%;
  padding: 32px 28px 18px 28px;
  position: relative;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 18px;
  right: 18px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.logo-row {
  margin-bottom: 10px;
}

.popup-title {
  font-size: 1.1rem;
  color: #444;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.popup-offer {
  font-size: 2.2rem;
  color: #e14b4b;
  margin: 0 0 0.2rem 0;
  font-weight: 700;
}

.popup-sub {
  color: #222;
  font-size: 1.1rem;
  margin-bottom: 1.2rem;
}

.submit-btn {
  width: 100%;
  background: #e14b4b;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 12px 0;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:disabled {
  background: #f6b1b1;
  cursor: not-allowed;
}

.disclaimer {
  font-size: 0.75rem;
  color: #888;
  margin-top: 1.2rem;
  line-height: 1.5;
}
</style>