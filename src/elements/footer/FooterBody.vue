<template>
    <div class="footer-body p-xl-0">
        <div class="container">
            <div class="row-footer">
                <div class="col-s1">
                    <div class="footer-inner-wrap flex-lg-nowrap align-items-end">
                        <div class="box-title">
                            <h6>JOIN THE <span class="text-primary">#THEMODESSE</span> COMMUNITY</h6>
                            <p class="notice font-2">
                                <span class="fst-italic">Timeless Elegance</span>
                                Awaits - 20% Off Your First Order!
                            </p>
                        </div>
                        <div class="box-email">
                            <p class="text-body text-main-3">Get exclusive access to new collections, styling tips, and special offers.</p>
                            <form class="form-email" @submit.prevent="handleNewsletterSubmit">
                                <fieldset>
                                    <input v-model="name" class="bg-transparent" type="text" placeholder="Your Name" required>
                                </fieldset>
                                <fieldset>
                                    <input v-model="email" class="bg-transparent" type="email" placeholder="Your_email@example.com" required>
                                </fieldset>
                                <fieldset>
                                    <input v-model="message" class="bg-transparent" type="text" placeholder="Why do you want to join? (Optional)" >
                                </fieldset>
                                <div class="box-btn">
                                    <button type="submit" class="btn-submit link">
                                        <i class="icon-arrow-right-2"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-s2">
                    <div class="footer-inner-wrap flex-sm-nowrap s2">
                        <div class="footer-col-block">
                            <p class="footer-heading footer-heading-mobile font-2">
                                CONTACT US
                            </p>
                            <div class="tf-collapse-content">
                                <ul class="footer-menu-list mb-24">
                                    <li>
                                        <p class="text-main-4">Connect with us for personalized styling advice.</p>
                                    </li>
                                    <li>
                                        <RouterLink to="/contact" class="text-main-4 link text-decoration-underline">
                                            Visit Our Showroom
                                        </RouterLink>
                                    </li>
                                    <li>
                                        <a :href="`tel:${contactInfo.phone}`" class="text-main-4 link">
                                            {{ contactInfo.phone }}
                                        </a>
                                    </li>
                                    <li>
                                        <a :href="`mailto:${contactInfo.email}`" class="text-main-4 link">
                                            {{ contactInfo.email }}
                                        </a>
                                    </li>
                                </ul>
                                <ul class="tf-social-icon">
                                    <li v-for="social in socialLinks" :key="social.name">
                                        <a :href="social.url" target="_blank" :class="`social-${social.name}`">
                                            <span class="icon"><i :class="`icon-${social.name}`"></i></span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer-col-block p-xl-0">
                            <p class="footer-heading footer-heading-mobile font-2">
                                HELP
                            </p>
                            <div class="tf-collapse-content">
                                <ul class="footer-menu-list">
                                    <li v-for="link in helpLinks" :key="link.path">
                                        <RouterLink :to="link.path" class="text-main-4 link">
                                            {{ link.name }}
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="footer-col-block">
                            <p class="footer-heading footer-heading-mobile font-2">
                                ABOUT US
                            </p>
                            <div class="tf-collapse-content">
                                <ul class="footer-menu-list">
                                    <li v-for="link in aboutLinks" :key="link.path">
                                        <RouterLink :to="link.path" class="text-main-4 link">
                                            {{ link.name }}
                                        </RouterLink>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import axiosInstance from '@/api/axios';

const toast = useToast();
const email = ref('');
const name = ref('');
const message = ref('');

// Contact Information
const contactInfo = {
    phone: '+91 93001 25126',
    email: 'hello@themodesse.com'
};

// Social Media Links
const socialLinks = [
    { name: 'facebook', url: 'https://facebook.com/themodesse' },
    { name: 'instagram', url: 'https://instagram.com/themodesse' },
    { name: 'pinterest', url: 'https://pinterest.com/themodesse' },
    { name: 'youtube', url: 'https://youtube.com/@themodesse' }
];

// Help Links
const helpLinks = [
    { name: 'Shipping & Returns', path: '/shipping-return' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'Size Guide', path: '/size-guide' },
    { name: 'Care Instructions', path: '/care-instructions' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms-conditions' }
];

// About Links
const aboutLinks = [
    { name: 'Our Story', path: '/about' },
    { name: 'Shop', path: '/shop' },
    { name: 'Blogs', path: '/blogs' },
    { name: 'Contact Us', path: '/contact' }
];

// Newsletter Subscription Handler
const handleNewsletterSubmit = async () => {
    try {
        await axiosInstance.post('/api/contacts', {
            name: name.value,
            email: email.value,
            subject: 'Newsletter Subscription',
            type: 'other',
            message: message.value || 'Newsletter subscription request.'
        });
        toast.success('Thank you for subscribing to The Modesse newsletter!');
        name.value = '';
        email.value = '';
        message.value = '';
    } catch (error) {
        toast.error(error?.response?.data?.message || 'Something went wrong. Please try again.');
    }
};
</script>

<style scoped>
.footer-body {
    padding: 60px 0;
    background-color: #f8f8f8;
}

.box-title h6 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

.text-primary {
    color: #72381C !important;
}

.notice {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

.form-email {
    display: flex;
    gap: 10px;
    margin-top: 1rem;
}

.form-email input {
    flex: 1;
    padding: 10px 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.btn-submit {
    background-color: #72381C;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-submit:hover {
    background-color: #6B5B43;
}

.footer-heading {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    color: #333;
}

.footer-menu-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-menu-list li {
    margin-bottom: 0.8rem;
}

.footer-menu-list a {
    color: #666;
    text-decoration: none;
    transition: color 0.3s;
}

.footer-menu-list a:hover {
    color: #72381C;
}

.tf-social-icon {
    display: flex;
    gap: 15px;
    list-style: none;
    padding: 0;
    margin: 0;
}

.tf-social-icon a {
    color: #666;
    font-size: 1.2rem;
    transition: color 0.3s;
}

.tf-social-icon a:hover {
    color: #72381C;
}

@media (max-width: 768px) {
    .footer-inner-wrap {
        flex-direction: column;
    }
    
    .box-title {
        text-align: center;
        margin-bottom: 2rem;
    }
    
    .footer-col-block {
        margin-bottom: 2rem;
    }
}
</style> 