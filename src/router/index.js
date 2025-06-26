import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../elements/Home/index.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import Cart from '../elements/cart/index.vue';
import ShopPage from '../elements/shop/index.vue';
import ProductDetails from '@/elements/productDetails/index.vue'
import About from '../elements/About/index.vue';
import Contact from '../elements/Contact/index.vue';
import PrivacyPolicy from '@/elements/Legal/PrivacyPolicy.vue'
import TermsConditions from '@/elements/Legal/TermsConditions.vue'
import ShippingReturn from '@/elements/Legal/ShippingReturn.vue'
import Checkout from '@/elements/checkout/index.vue'
import OrderConfirmation from '@/elements/order-confirmation/index.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'Home', component: HomePage },
        { path: '/login', name: 'Login', component: LoginPage, meta: { guest: true } },
        { path: '/register', name: 'Register', component: RegisterPage, meta: { guest: true } },
        { path: '/cart', name: 'Cart', component: Cart },
        { path: '/checkout', name: 'Checkout', component: Checkout, meta: { requiresAuth: true } },
        { path: '/order-confirmation/:orderId', name: 'OrderConfirmation', component: OrderConfirmation, meta: { requiresAuth: true } },
        { path: '/our-story', name: 'OurStory', component: About },
        { path: '/about', name: 'About', component: About },
        { path: '/contact', name: 'ContactUs', component: Contact },
        {
            path: '/shop',
            name: 'Shop',
            component: ShopPage,
            props: true
        },
        {
            path: '/shop/:slug',
            name: 'ShopCategory',
            component: ShopPage,
            props: true
        },
        {
            path: '/product/:slug',
            name: 'ProductDetails',
            component: ProductDetails,
            props: true
        },
        {
            path: '/privacy-policy',
            name: 'PrivacyPolicy',
            component: PrivacyPolicy,
            meta: {
                title: 'Privacy Policy - BS Glow'
            }
        },
        {
            path: '/terms-conditions',
            name: 'TermsConditions',
            component: TermsConditions,
            meta: {
                title: 'Terms & Conditions - BS Glow'
            }
        },
        {
            path: '/shipping-return',
            name: 'ShippingReturn',
            component: ShippingReturn,
            meta: {
                title: 'Shipping & Return Policy - BS Glow'
            }
        },
        {
            path: '/:pathMatch(.*)*',
            name: '404',
            component: () => import('../elements/pagenotfound/index.vue')
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
        return { top: 0 }
        }
    }
});

// router.beforeEach((to, from) => {
//     const authStore = useAuthStore();

//     // If route requires auth and user is not authenticated
//     if (to.meta.requiresAuth && !authStore.isAuthenticated) {
//         return { path: '/login' };
//     }

//     // If user is authenticated and tries to access guest pages (login/register)
//     if (to.meta.guest && authStore.isAuthenticated) {
//         return { path: '/userDashBoard' };
//     }
// });

export default router;