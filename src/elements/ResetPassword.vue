<template>
  <div class="reset-password-page">
    <div class="reset-password-card">
      <h2 class="reset-title">Reset Password</h2>
      <p class="reset-desc">Please enter your registered email address to receive an email to reset your password.</p>
      <form class="form-reset" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="reset-email">Email *</label>
          <input
            id="reset-email"
            class="form-control"
            type="email"
            v-model="email"
            placeholder="Enter your email"
            required
            :disabled="loading"
          />
        </div>
        <button type="submit" class="tf-btn btn-fill-2 text-uppercase fw-medium animate-btn w-100" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ loading ? 'Sending...' : 'SUBMIT' }}
        </button>
        <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from '@/api/axios';

const email = ref('');
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  successMessage.value = '';
  errorMessage.value = '';
  if (!email.value) {
    errorMessage.value = 'Please enter your email address.';
    return;
  }
  loading.value = true;
  try {
    await axios.post('/api/forgot-password', { email: email.value });
    successMessage.value = 'A password reset link has been sent to your email address.';
    email.value = '';
  } catch (e) {
    errorMessage.value = e.response?.data?.message || 'Failed to send reset email. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.reset-password-page {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f7f7f9 60%, #fffbe6 100%);
}
.reset-password-card {
  background: #fff;
  padding: 32px 24px;
  border-radius: 10px;
  box-shadow: 0 4px 24px #0001;
  max-width: 400px;
  width: 100%;
}
.reset-title {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
}
.reset-desc {
  color: #888;
  font-size: 1rem;
  margin-bottom: 24px;
  text-align: center;
}
.form-group {
  margin-bottom: 18px;
}
.form-control {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  margin-top: 6px;
  margin-bottom: 2px;
  transition: border-color 0.2s;
}
.form-control:focus {
  border-color: #f1c40f;
  outline: none;
}
.spinner-border {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
  border: 0.2em solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spinner-border .75s linear infinite;
}
@keyframes spinner-border {
  to { transform: rotate(360deg); }
}
.alert {
  padding: 0.75rem 1.25rem;
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  text-align: center;
}
.alert-success {
  color: #155724;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
}
.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
}
@media (max-width: 600px) {
  .reset-password-card {
    padding: 16px 6px;
  }
  .reset-title {
    font-size: 1.2rem;
  }
}
</style>