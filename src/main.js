import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import "./assets/css/swiper-bundle.min.css"
import "./assets/css/animate.css"
import "./assets/css/styles.css"
import "./style.css"
import router from './router/index.js'
import App from './App.vue'

const app = createApp(App);

// Toast configuration
const toastOptions = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false
}

app.use(createPinia());
app.use(router);
app.use(Toast, toastOptions);
app.mount('#app');
