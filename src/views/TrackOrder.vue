<template>
  <div class="track-order-container">
    <div class="track-order-card">
      <h2 class="track-order-title">Track Your Order</h2>
      <form class="track-order-form" @submit.prevent="handleTrack">
        <input v-model="orderId" type="text" placeholder="Order ID (e.g. ORD123456)" required />
        <input v-model="email" type="email" placeholder="Email Address" required />
        <button type="submit">Track Order</button>
      </form>
      <div v-if="showError" class="order-error">
        <p>{{ errorMessage }}</p>
      </div>
      <div v-if="showStatus && foundOrder" class="order-status-section">
        <h3>Order Status</h3>
        <div class="order-status-tracker">
          <div v-for="(step, idx) in steps" :key="step.label" class="status-step">
            <div :class="['status-circle', { active: idx <= currentStep }]">
              <span v-if="idx < currentStep" class="checkmark">✔</span>
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <div class="status-label">
              {{ step.label }}
              <span v-if="step.date" class="status-date">({{ step.date }})</span>
            </div>
            <div v-if="idx < steps.length - 1" class="status-line"></div>
          </div>
        </div>
        <div class="order-status-detail">
          <p><strong>Current Status:</strong> {{ steps[currentStep].label }}</p>
          <p><strong>Estimated Delivery:</strong> {{ foundOrder.estimatedDelivery }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const orderId = ref('');
const email = ref('');
const showStatus = ref(false);
const showError = ref(false);
const errorMessage = ref('');
const currentStep = ref(0);
const foundOrder = ref(null);

// Mock order database
const mockOrders = [
  {
    orderId: 'ORD123456',
    email: 'user1@example.com',
    steps: [
      { label: 'Order Placed', date: '2025-06-10' },
      { label: 'Order Processed', date: '2025-06-11' },
      { label: 'Shipped', date: '2025-06-12' },
      { label: 'Delivered', date: '2025-06-15' }
    ],
    currentStep: 2,
    estimatedDelivery: '2025-06-15'
  },
  {
    orderId: 'ORD654321',
    email: 'user2@example.com',
    steps: [
      { label: 'Order Placed', date: '2025-06-09' },
      { label: 'Order Processed', date: '2025-06-10' },
      { label: 'Shipped', date: '2025-06-11' },
      { label: 'Delivered', date: '2025-06-13' }
    ],
    currentStep: 3,
    estimatedDelivery: '2025-06-13'
  },
  {
    orderId: 'ORD111222',
    email: 'demo@themodesse.com',
    steps: [
      { label: 'Order Placed', date: '2025-06-14' },
      { label: 'Order Processed', date: '2025-06-15' },
      { label: 'Shipped', date: '2025-06-16' },
      { label: 'Delivered', date: '2025-06-18' }
    ],
    currentStep: 1,
    estimatedDelivery: '2025-06-18'
  }
];

const steps = ref([
  { label: 'Order Placed' },
  { label: 'Order Processed' },
  { label: 'Shipped' },
  { label: 'Delivered' }
]);

function handleTrack() {
  showStatus.value = false;
  showError.value = false;
  errorMessage.value = '';
  foundOrder.value = null;
  // Simulate API search
  const found = mockOrders.find(
    o => o.orderId === orderId.value.trim() && o.email.toLowerCase() === email.value.trim().toLowerCase()
  );
  if (found) {
    foundOrder.value = found;
    steps.value = found.steps;
    currentStep.value = found.currentStep;
    showStatus.value = true;
  } else {
    errorMessage.value = 'Order not found. Please check your Order ID and Email.';
    showError.value = true;
  }
}
</script>

<style scoped>
.track-order-container {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.track-order-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 32px rgba(0,0,0,0.08);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 420px;
  width: 100%;
}
.track-order-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #72381C;
}
.track-order-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}
.track-order-form input {
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}
.track-order-form button {
  background: #72381C;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.track-order-form button:hover {
  background: #a05a2c;
}
.order-status-section {
  margin-top: 1.5rem;
}
.order-status-tracker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}
.status-step {
  display: flex;
  align-items: center;
  flex-direction: column;
  flex: 1;
  position: relative;
}
.status-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  color: #bbb;
  margin-bottom: 0.5rem;
  border: 2px solid #eee;
  transition: background 0.2s, border 0.2s, color 0.2s;
}
.status-circle.active {
  background: #72381C;
  color: #fff;
  border: 2px solid #72381C;
}
.status-label {
  font-size: 0.95rem;
  color: #72381C;
  text-align: center;
  min-width: 80px;
  height: 60px;
}
.status-line {
  position: absolute;
  top: 18px;
  left: 100%;
  width: 100%;
  height: 4px;
  background: #eee;
  z-index: 0;
}
.status-step:not(:last-child) .status-line {
  background: #72381C;
  left: 50%;
  width: 100%;
  height: 4px;
  z-index: 0;
}
.status-step:last-child .status-line {
  display: none;
}
.checkmark {
  font-size: 1.1rem;
}
.order-status-detail {
  background: #f3edea;
  border-radius: 8px;
  padding: 1rem;
  color: #72381C;
  font-size: 1rem;
  text-align: center;
}
.order-error {
  color: #fff;
  background: #d9534f;
  border-radius: 6px;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 600;
}
.status-date {
  display: block;
  font-size: 0.8em;
  color: #888;
  margin-top: 2px;
}
@media (max-width: 600px) {
  .track-order-card {
    padding: 1.2rem 0.5rem;
  }
  .status-label {
    min-width: 60px;
    font-size: 0.85rem;
  }
}
</style> 