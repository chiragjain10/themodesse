import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './assets/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import "./assets/css/swiper-bundle.min.css"
import "./assets/css/animate.css"
import "./assets/css/styles.css"
import "./style.css"
import router from './router/index.js'
import App from './App.vue'
import VueLazyload from 'vue-lazyload';
// import loadingImg from '@/assets/images/loading.gif';
// import errorImg from '@/assets/images/error.png';

const app = createApp(App);
const head = createHead();

app.use(VueLazyload, {
  preLoad: 1.0,
  // error: errorImg,
  // loading: loadingImg,
  attempt: 1,
  // Optimize for faster loading
  observer: true,
  observerOptions: {
    rootMargin: '0px',
    threshold: 0.1
  }
});

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
app.use(head);
app.use(Toast, toastOptions);
app.mount('#app');
