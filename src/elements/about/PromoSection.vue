<template>
    <section class="flat-spacing-3">
        <div class="container">
            <div class="banner_promo">
                <h2 class="title fw-normal">Join Our Community</h2>
                <p class="sub-title text-main-4">
                    Subscribe to receive updates on new collections, sustainable fashion tips, and exclusive offers. Be the first to know when we release our latest pieces.
                </p>
                <form @submit.prevent="handleSubmit" class="form-email-2 style-border">
                    <div class="form-content">
                        <input type="email" v-model="email" placeholder="Email address" required>
                    </div>
                    <button type="submit" class="tf-btn btn-def-2 type-large px-0">
                        subscribe now
                        <i class="icon-arrow-right-3"></i>
                    </button>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

export default {
    name: 'PromoSection',
    setup() {
        const email = ref('')
        const toast = useToast()

        const handleSubmit = () => {
            // Here you would typically make an API call to subscribe the user
            toast.success('Thank you for subscribing! Check your email for the discount code.')
            email.value = ''
        }

        return {
            email,
            handleSubmit
        }
    }
}
</script> 