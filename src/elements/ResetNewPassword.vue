<template>
  <div class="reset-password-page">
    <div class="reset-password-card">
      <h2>Set New Password</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" required class="form-control" placeholder="Your email" />
        </div>
        <div class="form-group">
          <label>New Password</label>
          <input v-model="password" type="password" required class="form-control" placeholder="New password" />
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input v-model="password_confirmation" type="password" required class="form-control" placeholder="Confirm password" />
        </div>
        <button class="btn btn-dark w-100" type="submit" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
        <div v-if="successMessage" class="alert alert-success mt-3">{{ successMessage }}</div>
        <div v-if="errorMessage" class="alert alert-danger mt-3">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '@/api/axios';

const route = useRoute();
const router = useRouter();

const token = ref(route.params.token || '');
const email = ref(route.query.email || '');
const password = ref('');
const password_confirmation = ref('');
const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const handleSubmit = async () => {
  successMessage.value = '';
  errorMessage.value = '';
  if (!email.value || !password.value || !password_confirmation.value) {
    errorMessage.value = 'Please fill all fields.';
    return;
  }
  if (password.value !== password_confirmation.value) {
    errorMessage.value = 'Passwords do not match.';
    return;
  }
  loading.value = true;
  try {
    await axios.post('/api/reset-password', {
      email: email.value,
      token: token.value,
      password: password.value,
      password_confirmation: password_confirmation.value
    });
    successMessage.value = 'Your password has been reset. You can now log in.';
    setTimeout(() => router.push('/login'), 2000);
  } catch (e) {
    errorMessage.value = e.response?.data?.message || 'Failed to reset password. Please try again.';
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
  background: #f8f4ec;
}
.reset-password-card {
  background: #fff;
  padding: 32px 24px;
  border-radius: 8px;
  box-shadow: 0 2px 16px #0001;
  max-width: 400px;
  width: 100%;
}
.form-group {
  margin-bottom: 18px;
}
</style> 