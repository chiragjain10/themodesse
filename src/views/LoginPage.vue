<template>
  <div class="login-page d-flex align-items-center justify-content-center py-5">
    <div class="login-popup bg-white p-4 rounded shadow">
      <!-- Show error message if any -->
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        <i class="fas fa-exclamation-circle me-2"></i>
        {{ errorMessage }}
      </div>

      <!-- Show success message if coming from registration -->
      <div v-if="route.query.registered" class="alert alert-success" role="alert">
        <i class="fas fa-check-circle me-2"></i>
        Registration successful! Please login to continue.
      </div>

      <form @submit.prevent="handleLogin">
        <h2 class="form-title text-center mb-4">Login</h2>
        <div class="form-group mb-3">
          <label for="login-email" class="form-label">Your Email Address *</label>
          <input type="email" class="form-control" id="login-email" placeholder="Your Email Address *"
            v-model="loginForm.email" required :disabled="loading" @input="errorMessage = ''" />
        </div>
        <div class="form-group mb-3">
          <label for="login-password" class="form-label">Password *</label>
          <input type="password" class="form-control" id="login-password" placeholder="Password *"
            v-model="loginForm.password" required :disabled="loading" @input="errorMessage = ''" />
        </div>
        <div class="form-footer d-flex justify-content-between align-items-center mb-3">
          <div class="form-checkbox">
            <input type="checkbox" class="form-check-input" id="remember-me" v-model="loginForm.remember"
              :disabled="loading" />
            <label class="form-check-label" for="remember-me">Remember Me</label>
          </div>
          <RouterLink to="/forgot-password" class="link text-decoration-underline">Forgot Password?</RouterLink>
        </div>
        <button class="btn btn-dark btn-block btn-rounded w-100 mb-3" type="submit" :disabled="loading" @click="handleLogin">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <div class="form-choice text-center mb-3">
        <label class="ls-m">or Login With</label>
        <div class="social-links mt-2">
          <a href="#" class="social-link social-google fab fa-google border-no mx-1"></a>
        </div>
      </div>
      <p class="text-center mt-3">Don't have an account? <RouterLink to="/register">Register</RouterLink></p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const loginForm = reactive({
  email: '',
  password: '',
  remember: false,
});

const loading = ref(false);
const errorMessage = ref('');

const handleLogin = async (event) => {
  // Prevent default form submission
  if (event) {
    event.preventDefault();
  }

  if (!loginForm.email || !loginForm.password) {
    errorMessage.value = 'Please fill in all required fields';
    return;
  }

  loading.value = true;
  errorMessage.value = '';

  try {
    console.log('Making login request...');
    const response = await authStore.login(loginForm);
    console.log('Login response:', response);

    if (authStore.isAuthenticated) {
      console.log('Login successful, user:', authStore.user);

      // Check if there's a pending cart item
      const pendingCartItem = localStorage.getItem('pendingCartItem');
      if (pendingCartItem) {
        console.log('Found pending cart item:', pendingCartItem);
        const { productId, quantity, returnPath } = JSON.parse(pendingCartItem);

        // Clear the pending item
        localStorage.removeItem('pendingCartItem');

        // If we have a return path, use it
        if (returnPath) {
          router.push(returnPath);
        } else {
          // Otherwise redirect to the product page
          router.push({
            path: `/product/${productId}`,
            query: { addToCart: true, qty: quantity }
          });
        }
      } else {
        // Normal redirect
        // const redirectTo = route.query.redirect || '/';
        // router.replace(redirectTo);
        window.location.href = route.query.redirect || '/account';
      }
    } else {
      console.log('Login failed - not authenticated');
      errorMessage.value = 'Login failed. Please check your credentials and try again.';
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = error.message || 'Login failed. Please check your credentials and try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
  padding: 50px 0;
  background-color: #f8f4ec; /* Example background color */
}

.login-popup {
  max-width: 400px; /* Limit the width of the form */
  width: 100%;
}

.alert {
  margin-bottom: 1rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb;
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
  to {
    transform: rotate(360deg);
  }
}

.btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.form-control:disabled {
  background-color: #e9ecef;
  opacity: 1;
}

.btn-product {
  cursor: pointer;
  transition: all 0.3s;
}

.btn-product:hover {
  opacity: 0.8;
}

/* Added basic form control styling for consistency if not using a CSS framework */
.form-control {
    display: block;
    width: 100%;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    color: #212529;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
}

.form-control:focus {
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13,110,253,.25);
}

.form-label {
    margin-bottom: 0.5rem;
}

.form-check-input[type="checkbox"] {
    border-radius: 0.25em;
}

.form-check-input:checked {
    background-color: #0d6efd;
    border-color: #0d6efd;
}

.form-check-input:focus {
    border-color: #86b7fe;
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgba(13,110,253,.25);
}
</style>
