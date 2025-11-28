<template>
  <div class="contact-page">
    <!-- SEO Component -->
    <SEOHead 
      title="Contact The Modesse | Premium Womenswear Customer Support"
      description="Get in touch with The Modesse customer support team. We're here to help with orders, product inquiries, shipping, and any questions about our premium contemporary womenswear collection."
      keywords="contact The Modesse, customer support, premium womenswear support, order help, product inquiries, shipping information, customer service, The Modesse contact"
      :schema="contactSchema"
    />
    
    <section class="contact-hero">
      <div class="container">
        <h1 class="contact-title">Contact Us</h1>
        <p class="contact-subtitle">We're here to help. Reach out to us anytime.</p>
      </div>
    </section>

    <section class="contact-main">
      <div class="container">
        <div class="contact-grid">
          <!-- Left: Info & Socials -->
          <div class="contact-info">
            <ul class="info-list">
              <li>
                <span class="info-label">Email:</span>
                <a href="mailto:hello@themodesse.com" class="info-link">hello@themodesse.com</a>
              </li>
              <li>
                <span class="info-label">Opening Hours:</span>
                <span class="info-value">24 Hours at your service</span>
              </li>
            </ul>
            <ul class="social-list">
              <li>
                <a href="https://www.facebook.com/themodesse" target="_blank" aria-label="Facebook">
                  <i class="icon-facebook"></i>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/themodesse" target="_blank" aria-label="Instagram">
                  <i class="icon-instagram"></i>
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/company/themodesse" target="_blank" aria-label="LinkedIn">
                  <i class="icon-linkin"></i>
                </a>
              </li>
            </ul>
          </div>

          <!-- Right: Contact Form -->
          <div class="contact-form-block">
            <h2 class="form-title">Get In Touch</h2>
            <p class="form-desc">Our dedicated support team is here to help you with any questions about our products, orders, or general inquiries. We're committed to providing you with the best service.</p>
            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-row">
                <div style="width: 100%">
                  <input v-model="form.name" type="text" placeholder="Name *" required :class="{ error: errors.name }" />
                  <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
                </div>
                <div style="width: 100%">
                  <input v-model="form.email" type="email" placeholder="Email *" required :class="{ error: errors.email }" />
                  <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
                </div>
              </div>
              <div class="form-row">
                <input v-model="form.phone" type="text" placeholder="Phone" :class="{ error: errors.phone }" />
                <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
              </div>
              <div class="form-row">
                <select v-model="form.type" required :class="{ error: errors.type }">
                  <option value="">Select Query Type *</option>
                  <option value="Order">Order</option>
                  <option value="Product Inquiries">Product Inquiries</option>
                  <option value="Shipping & Delivery">Shipping & Delivery</option>
                  <option value="Custom / Bulk Orders">Custom / Bulk Orders</option>
                  <option value="Account & Payments">Account & Payments</option>
                  <option value="Collaborations & PR">Collaborations & PR</option>
                  <option value="Wholesale & Retail">Wholesale & Retail</option>
                  <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                  <option value="Careers & Internships">Careers & Internships</option>
                  <option value="Others & Miscellaneous">Others / Miscellaneous</option>
                </select>
                <span v-if="errors.type" class="error-message">{{ errors.type }}</span>
              </div>
              <div class="form-row">
                <input v-model="form.subject" type="text" placeholder="Subject *" required :class="{ error: errors.subject }" />
                <span v-if="errors.subject" class="error-message">{{ errors.subject }}</span>
              </div>
              <div class="form-row">
                <textarea v-model="form.message" rows="5" placeholder="Message *" required :class="{ error: errors.message }"></textarea>
                <span v-if="errors.message" class="error-message">{{ errors.message }}</span>
              </div>
              <div v-if="alert.message" :class="['alert', alert.type === 'success' ? 'alert-success' : 'alert-danger']" role="alert" style="margin-bottom: 10px;">
                {{ alert.message }}
              </div>
              <div class="form-row">
                <button type="submit" class="send-btn" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  {{ loading ? 'SENDING...' : 'Send Message' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import SEOHead from '@/components/SEOHead.vue'
import axios from '@/api/axios'

// Schema markup for Contact page
const contactSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact The Modesse",
  "description": "Get in touch with The Modesse customer support team for orders, product inquiries, and assistance",
  "url": "https://themodesse.com/contact",
  "mainEntity": {
    "@type": "Organization",
    "name": "The Modesse",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "hello@themodesse.com",
      "availableLanguage": "English"
    }
  }
};

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
    const { status, data } = await axios.post('/api/contacts', form)
    if (status >= 200 && status < 300) {
      alert.message = 'Message sent successfully! We will get back to you soon.'
      alert.type = 'success'
      form.name = ''
      form.email = ''
      form.phone = ''
      form.type = ''
      form.subject = ''
      form.message = ''
    } else {
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
.contact-page {
  background: var(--white);
  min-height: 100vh;
  font-family: inherit;
}

.contact-hero {
  padding: 70px 0 40px;
  text-align: center;
  border-bottom: 1px solid var(--line-3);
}

.contact-title {
  font-size: 2.5rem;
  font-weight: 400;
  color: var(--main);
  margin-bottom: 0.5rem;
}

.contact-subtitle {
  color: var(--main-4);
  font-size: 1.125rem;
  font-weight: 400;
}

.contact-main {
  padding: 60px 0 80px;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  max-width: 1100px;
  margin: 0 auto;
  align-items: flex-start;
}

.contact-info {
  border-radius: 10px;
  padding: 30px 0 0 0;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;
}
.info-list li {
  margin-bottom: 28px;
}
.info-label {
  display: block;
  color: var(--main);
  font-weight: 500;
  font-size: 1.05rem;
  margin-bottom: 2px;
}
.info-link, .info-value {
  color: var(--main-4);
  font-size: 1.05rem;
  text-decoration: none;
}
.info-link:hover {
  color: var(--primary);
  text-decoration: underline;
}

.social-list {
  display: flex;
  gap: 18px;
  padding: 0;
  margin: 0;
  list-style: none;
}
.social-list li a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f6f6f6;
  color: var(--main-4);
  font-size: 1.3rem;
  transition: background 0.2s, color 0.2s;
}
.social-list li a:hover {
  background: var(--main);
  color: var(--white);
}

.contact-form-block {
  background: var(--white);
  border-radius: 10px;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.04);
  padding: 40px 32px;
  max-width: 540px;
  margin: 0 auto;
}
.form-title {
  font-size: 1.4rem;
  font-weight: 500;
  color: var(--main);
  margin-bottom: 10px;
}
.form-desc {
  color: var(--main-4);
  font-size: 1rem;
  margin-bottom: 28px;
}
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.form-row {
  display: flex;
  gap: 18px;
}
.form-row input,
.form-row select,
.form-row textarea {
  flex: 1;
  padding: 14px 16px;
  border: 1px solid var(--line-3);
  border-radius: 5px;
  font-size: 1rem;
  background: var(--white);
  color: var(--main);
  outline: none;
  transition: border-color 0.2s;
}
.form-row input:focus,
.form-row select:focus,
.form-row textarea:focus {
  border-color: var(--primary);
}
.form-row textarea {
  resize: vertical;
  min-height: 120px;
}
.send-btn{
    display: block;
    padding: 10px;
    background: var(--primary);
    color: var(--white);
    border: none;
    border-radius: 5px;
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: background 0.2s;
    margin: auto;
}
.send-btn:hover {
  background: var(--main-2);
}

@media (max-width: 992px) {
  .contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .contact-form-block {
    max-width: 100%;
    padding: 32px 10px;
  }
  .contact-info {
    padding: 0;
    margin-bottom: 0;
  }
}
@media (max-width: 600px) {
  .contact-title {
    font-size: 2rem;
  }
  .contact-main {
    padding: 30px 0 40px;
  }
  .contact-form-block {
    padding: 18px 0;
  }
  .form-row {
    flex-direction: column;
    gap: 10px;
  }
}

.error {
  border-color: #ff4d4f !important;
}
.error-message {
  color: #ff4d4f;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}
</style>