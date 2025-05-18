<template>
    <div class="header-top">
        <div class="container">
            <div class="header-left">
                <p class="welcome-msg">{{ props.welcomeMessage }}</p>
            </div>
            <div class="header-right">

                <!-- Currency Dropdown -->
                <div class="dropdown" @click="toggleCurrency">
                    <a href="#currency">{{ selectedCurrency }}</a>
                    <ul class="dropdown-box" v-show="showCurrencyDropdown">
                        <li v-for="cur in currencies" :key="cur" @click="selectedCurrency = cur">{{ cur }}</li>
                    </ul>
                </div>

                <!-- Language Dropdown -->
                <div class="dropdown ml-5" @click="toggleLanguage">
                    <a href="#language">{{ selectedLanguage }}</a>
                    <ul class="dropdown-box" v-show="showLanguageDropdown">
                        <li v-for="lang in languages" :key="lang" @click="selectedLanguage = lang">{{ lang }}</li>
                    </ul>
                </div>

                <span class="divider"></span>

                <!-- Contact / Help -->
                <a href="/contact-us" class="contact d-lg-show"><i class="d-icon-map"></i>Contact</a>
                <a href="/help" class="help d-lg-show"><i class="d-icon-info"></i> Need Help</a>

                <!-- Auth Buttons -->
                <template v-if="!props.user">
                    <RouterLink to="/login" class="login-toggle d-md-show">
                        <i class="d-icon-user"></i> Sign in
                    </RouterLink>
                    <span class="delimiter">/</span>
                    <RouterLink to="/register" class="register-toggle d-md-show ml-0">Register</RouterLink>
                </template>

                <template v-else>
                    <span class="user-name d-md-show"><i class="d-icon-user"></i> {{ props.user.name }}</span>
                    <span class="delimiter">/</span>
                    <a href="#" @click.prevent="logout" class="logout-toggle d-md-show ml-0">Logout</a>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

// Props
const props = defineProps({
    welcomeMessage: {
        type: String,
        default: 'Welcome to Phalit Gems store!'
    },
    user: {
        type: Object,
        default: null
    }
})

// Dropdown states
const currencies = ['USD', 'EUR']
const languages = ['ENG', 'FRH']

const selectedCurrency = ref('USD')
const selectedLanguage = ref('ENG')

// Dropdown toggles (optional)
const showCurrencyDropdown = ref(false)
const showLanguageDropdown = ref(false)

function toggleCurrency() {
    showCurrencyDropdown.value = !showCurrencyDropdown.value
}

function toggleLanguage() {
    showLanguageDropdown.value = !showLanguageDropdown.value
}

function logout() {
    // Implement logout logic here (emit event or call API)
    alert('Logging out...')
}
</script>

<style scoped>
.dropdown-box {
    display: none;
    position: absolute;
    background: white;
    list-style: none;
    padding: 10px;
    z-index: 10;
    border: 1px solid #ccc;
}

.dropdown-box li {
    cursor: pointer;
}

.dropdown:hover .dropdown-box {
    display: block;
}
</style>