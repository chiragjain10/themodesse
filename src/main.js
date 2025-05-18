import { createApp } from 'vue'
import { createPinia } from 'pinia'
import "./assets/vendor/fontawesome-free/css/all.min.css"
import "./assets/vendor/animate/animate.min.css"
import "./assets/vendor/magnific-popup/magnific-popup.min.css"
import "./assets/vendor/owl-carousel/owl.carousel.min.css"
import "./assets/vendor/sticky-icon/stickyicon.css"
import './style.css'
import "./assets/css/demo1.min.css"
import './assets/css/style.min.css'
import router from './router/index.js'
import App from './App.vue'

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');
