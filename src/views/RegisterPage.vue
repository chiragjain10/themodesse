<template>
    <div class="page-content py-5">
        <div class="container">
            <div class="login-popup bg-white">
                <div class="form-box">
                    <form @submit.prevent="handleRegister">
                        <h2 class="form-title text-center">Register</h2>
                        <div class="form-group">
                            <input type="text" class="form-control" placeholder="Your Name *"
                                v-model="registerForm.name" required />
                        </div>
                        <div class="form-group">
                            <input type="email" class="form-control" placeholder="Your Email Address *"
                                v-model="registerForm.email" required />
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" placeholder="Password *"
                                v-model="registerForm.password" required />
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" placeholder="Confirm Password *"
                                v-model="registerForm.confirmPassword" required />
                        </div>
                        <div class="form-footer">
                            <div class="form-checkbox">
                                <input type="checkbox" class="custom-checkbox" v-model="registerForm.agree" required />
                                <label class="form-control-label">I agree to the privacy policy</label>
                            </div>
                        </div>
                        <button class="btn btn-dark btn-block btn-rounded" type="submit">Register</button>
                    </form>
                    <div class="form-choice text-center">
                        <label class="ls-m">or Register With</label>
                        <div class="social-links">
                            <a href="#" class="social-link social-google fab fa-google border-no"></a>
                            <a href="#" class="social-link social-facebook fab fa-facebook-f border-no"></a>
                            <a href="#" class="social-link social-twitter fab fa-twitter border-no"></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
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
        alert('Registration failed. Please try again.');
    }
};
</script>

<style scoped>
/* Register page specific styles */
</style>