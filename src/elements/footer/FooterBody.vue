<template>
    <div class="footer-body p-xl-0">
        <div class="container">
            <div class="row-footer">
                <div class="col-s1">
                    <div class="footer-inner-wrap flex-lg-nowrap align-items-end">
                        <div class="box-title">
                            <h6>JOIN THE <span class="text-primary">#THEMODESSE</span> COMMUNITY</h6>
                            
                        </div>
                        <div class="box-email">
                            <p class="text-body text-main-3">Get exclusive access to new collections, styling tips, and
                                special offers.</p>
                            <form class="form-email" @submit.prevent="handleNewsletterSubmit">
                                <fieldset>
                                    <input v-model="name" class="bg-transparent" type="text" placeholder="Your Name"
                                        required>
                                </fieldset>
                                <div class="box-btn">
                                    <button type="submit" class="btn-submit link">
                                        <i class="icon-arrow-right-2 text-white"></i>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-s2">
                    <div class="footer-inner-wrap flex-sm-nowrap s2">
                        <div class="footer-col-block">
                            <p class="footer-heading footer-heading-mobile">
                                CONTACT US
                            </p>
                            <div class="tf-collapse-content">
                                <ul class="footer-menu-list mb-24">
                                    <li>
                                        <p class="text-main-4">Connect with us for personalized styling advice.</p>
                                    </li>
                                    <li>
                                        <a :href="`tel:${contactInfo.phone}`" class="text-main-4 link shine-effect">
                                            {{ contactInfo.phone }}
                                        </a>
                                    </li>
                                    <li>
                                        <a :href="`mailto:${contactInfo.email}`" class="text-main-4 link shine-effect">
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
                            <p class="footer-heading footer-heading-mobile">
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
                            <p class="footer-heading footer-heading-mobile">
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
import { RouterLink } from 'vue-router';
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
    { name: 'linkin', url: 'https://linkedin.com/company/themodesse' },
];

// Help Links
const helpLinks = [
    { name: 'Shipping & Returns', path: '/shipping-return' },
    { name: 'Track Order', path: '/track-order' },
    { name: 'Size Guide', path: '/size-guide' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms & Conditions', path: '/terms-conditions' }
];

// About Links
const aboutLinks = [
    { name: 'Our Story', path: '/about' },
    { name: 'Shop', path: '/shop' },
    { name: 'Blogs', path: '/journals' },
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
    padding: 35px 0;
    background-color: #fcf7f1;
}

.box-title h6 {
    font-size: 1rem;
    /* margin-bottom: 0rem; */
}

.text-primary {
    color: #72381C !important;
}

.notice {
    font-size: 1.2rem;
    margin-bottom: 2rem;
}

.form-email {
    display: block;
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
    font-size: 1rem;
    margin-bottom: 1rem;
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
    color: #fff;
}

.footer-col-block {
    width: 33.33% !important;
}

@media (max-width: 768px) {
    .footer-inner-wrap {
        flex-direction: column;
        gap: 0;
    }

    .box-title {
        text-align: center;
        margin-bottom: .5rem;
    }
    .text-body{
        text-align: center;
    }

    .footer-col-block {
        margin-bottom: 2rem;
        width: initial !important;
    }
}

/* Shine Effect for Clickable Links */
.shine-effect {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.shine-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(184, 142, 47, 0.3),
        transparent
    );
    transition: left 0.5s ease;
    z-index: 1;
    pointer-events: none;
}

.shine-effect:hover::before {
    left: 100%;
}

.shine-effect:hover {
    color: #B88E2F !important;
    transform: translateY(-1px);
    text-shadow: 0 2px 4px rgba(184, 142, 47, 0.2);
}
</style>