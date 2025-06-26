<template>
    <div class="register-page d-flex align-items-center justify-content-center py-5">
        <div class="register-popup bg-white p-4 rounded shadow">
            <form @submit.prevent="handleRegister">
                <h2 class="form-title text-center mb-4">Register</h2>
                <div class="form-group mb-3">
                    <label for="register-name" class="form-label">Your Name *</label>
                    <input type="text" class="form-control" id="register-name" placeholder="Your Name *"
                        v-model="registerForm.name" required />
                </div>
                <div class="form-group mb-3">
                    <label for="register-email" class="form-label">Your Email Address *</label>
                    <input type="email" class="form-control" id="register-email" placeholder="Your Email Address *"
                        v-model="registerForm.email" required />
                </div>
                <div class="form-group mb-3">
                    <label for="register-password" class="form-label">Password *</label>
                    <input type="password" class="form-control" id="register-password" placeholder="Password *"
                        v-model="registerForm.password" required />
                </div>
                <div class="form-group mb-3">
                    <label for="register-confirm-password" class="form-label">Confirm Password *</label>
                    <input type="password" class="form-control" id="register-confirm-password" placeholder="Confirm Password *"
                        v-model="registerForm.confirmPassword" required />
                </div>
                <div class="form-footer mb-3">
                    <div class="form-checkbox">
                        <input type="checkbox" class="form-check-input" id="agree-policy" v-model="registerForm.agree" required />
                        <label class="form-check-label" for="agree-policy">I agree to the privacy policy</label>
                    </div>
                </div>
                <button class="btn btn-dark btn-block btn-rounded w-100 mb-3" type="submit">Register</button>
            </form>
            <div class="form-choice text-center mb-3">
                <label class="ls-m">or Register With</label>
                <div class="social-links mt-2">
                    <a href="#" class="social-link social-google fab fa-google border-no mx-1"></a>
                    <a href="#" class="social-link social-facebook fab fa-facebook-f border-no mx-1"></a>
                    <a href="#" class="social-link social-twitter fab fa-twitter border-no mx-1"></a>
                </div>
            </div>
            <p class="text-center mt-3">Already have an account? <RouterLink to="/login">Login</RouterLink></p>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth'; // Using Pinia

const authStore = useAuthStore();
const router = useRouter();

const registerForm = reactive({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
});

const handleRegister = async () => {
    try {
        // Basic password match check
        if (registerForm.password !== registerForm.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        
        await authStore.register(registerForm);
        
        // Check if there's a pending cart item
        const pendingCartItem = localStorage.getItem('pendingCartItem');
        if (pendingCartItem) {
            // Redirect to login with the pending cart item info
            router.push({
                name: 'Login',
                query: { 
                    registered: true,
                    redirect: `/product/${JSON.parse(pendingCartItem).productId}`,
                    addToCart: true,
                    qty: JSON.parse(pendingCartItem).quantity
                }
            });
        } else {
            // Normal redirect to login
            router.push({ name: 'Login', query: { registered: true } });
        }
    } catch (error) {
        console.error('Registration failed:', error);
        // Display error message to the user
        alert(error.message || 'Registration failed. Please try again.');
    }
};
</script>

<style scoped>
.register-page {
  padding: 50px 0;
  background-color: #f8f4ec; /* Example background color */
}

.register-popup {
  max-width: 400px; /* Limit the width of the form */
  width: 100%;
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