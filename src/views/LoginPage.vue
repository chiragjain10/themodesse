<template>
  <div class="container py-5">
    <div class="login-popup bg-white">
      <div class="form-box">
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
          <h2 class="form-title text-center">Login</h2>
          <div class="form-group">
            <input type="email" class="form-control" placeholder="Your Email Address *" v-model="loginForm.email"
              required :disabled="loading" @input="errorMessage = ''" />
          </div>
          <div class="form-group">
            <input type="password" class="form-control" placeholder="Password *" v-model="loginForm.password" required
              :disabled="loading" @input="errorMessage = ''" />
          </div>
          <div class="form-footer">
            <div class="form-checkbox">
              <input type="checkbox" class="custom-checkbox" v-model="loginForm.remember" :disabled="loading" />
              <label class="form-control-label">Remember Me</label>
            </div>
          </div>
          <button class="btn btn-dark btn-block btn-rounded" type="submit" :disabled="loading" @click="handleLogin">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
        <div class="form-choice text-center">
          <label class="ls-m">or Login With</label>
          <div class="social-links">
            <a href="#" class="social-link social-google fab fa-google border-no"></a>
            <a href="#" class="social-link social-facebook fab fa-facebook-f border-no"></a>
            <a href="#" class="social-link social-twitter fab fa-twitter border-no"></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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

      // Show success message
      errorMessage.value = 'Login successful! Redirecting...';

      // Add a small delay before redirect
      await new Promise(resolve => setTimeout(resolve, 1000));

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
        window.location.href = route.query.redirect || '/';
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
</style>
