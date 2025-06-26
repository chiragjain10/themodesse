<template>
    <div class="right-col">
        <h3 class="title fw-normal">Get In Touch</h3>
        <p class="sub-title text-main-4">
            Our dedicated support team is here to help you with any questions about our skincare products,
            custom formulations, or general inquiries. We're committed to providing you with the best service.
        </p>
        <form @submit.prevent="handleSubmit" class="form-contact style-border">
            <div class="form-content">
                <div class="cols tf-grid-layout sm-col-2">
                    <fieldset>
                        <input v-model="form.name" type="text" placeholder="Name *" required
                            :class="{ 'error': errors.name }">
                        <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                    </fieldset>
                    <fieldset>
                        <input v-model="form.email" type="email" placeholder="Email *" required
                            :class="{ 'error': errors.email }">
                        <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                    </fieldset>
                </div>
                <fieldset>
                    <input v-model="form.phone" type="text" placeholder="Phone" :class="{ 'error': errors.phone }">
                    <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
                </fieldset>
                <fieldset>
                    <select v-model="form.type" required :class="{ 'error': errors.type }">
                        <option value="">Select Query Type *</option>
                        <option value="bulk_order">Bulk Order</option>
                        <option value="franchise">Franchise</option>
                        <option value="support">Support</option>
                        <option value="other">Other</option>
                    </select>
                    <span v-if="errors.type" class="error-message">{{ errors.type }}</span>
                </fieldset>
                <fieldset>
                    <input v-model="form.subject" type="text" placeholder="Subject *" required
                        :class="{ 'error': errors.subject }">
                    <span v-if="errors.subject" class="error-message">{{ errors.subject }}</span>
                </fieldset>
                <textarea v-model="form.message" placeholder="Message *" style="height: 229px;" required
                    :class="{ 'error': errors.message }"></textarea>
                <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
            </div>
            <div v-if="alert.message" :class="['alert', alert.type === 'success' ? 'alert-success' : 'alert-danger']"
                role="alert">
                {{ alert.message }}
            </div>
            <button type="submit" class="tf-btn btn-fill animate-btn w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status"
                    aria-hidden="true"></span>
                {{ loading ? 'SENDING...' : 'SEND MESSAGE' }}
            </button>
        </form>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const loading = ref(false)
const alert = reactive({ message: '', type: 'success' })
const form = reactive({
    name: '',
    email: '',
    phone: '',
    type: '',
    subject: '',
    message: ''
})
const errors = reactive({
    name: '',
    email: '',
    phone: '',
    type: '',
    subject: '',
    message: ''
})

const safeString = v => (typeof v === 'string' ? v : (v === undefined || v === null) ? '' : String(v))

const validateForm = () => {
    let isValid = true
    errors.name = ''
    errors.email = ''
    errors.phone = ''
    errors.type = ''
    errors.subject = ''
    errors.message = ''

    if (!safeString(form.name).trim()) {
        errors.name = 'Name is required'
        isValid = false
    }

    if (!safeString(form.email).trim()) {
        errors.email = 'Email is required'
        isValid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Please enter a valid email'
        isValid = false
    }

    if (safeString(form.phone) && !/^\+?[0-9\-\s]{7,20}$/.test(form.phone)) {
        errors.phone = 'Please enter a valid phone number'
        isValid = false
    }

    if (!safeString(form.type)) {
        errors.type = 'Query type is required'
        isValid = false
    }

    if (!safeString(form.subject).trim()) {
        errors.subject = 'Subject is required'
        isValid = false
    }

    if (!safeString(form.message).trim()) {
        errors.message = 'Message is required'
        isValid = false
    }

    return isValid
}

const handleSubmit = async () => {
    alert.message = ''
    if (!validateForm()) return

    loading.value = true
    try {
        const res = await fetch('/api/contacts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
        if (res.ok) {
            alert.message = 'Message sent successfully! We will get back to you soon.'
            alert.type = 'success'
            form.name = ''
            form.email = ''
            form.phone = ''
            form.type = ''
            form.subject = ''
            form.message = ''
        } else {
            const data = await res.json().catch(() => ({}))
            alert.message = data?.message || 'Failed to send message. Please try again later.'
            alert.type = 'danger'
        }
    } catch (error) {
        alert.message = 'Failed to send message. Please try again later.'
        alert.type = 'danger'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.error {
    border-color: #ff4d4f !important;
}

.error-message {
    color: #ff4d4f;
    font-size: 12px;
    margin-top: 4px;
    display: block;
}

.tf-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

fieldset {
    margin-bottom: 15px;
}

textarea {
    margin-bottom: 15px;
}
</style>