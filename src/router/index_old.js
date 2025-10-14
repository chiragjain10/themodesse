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
import Wishlist from '@/elements/wishlist/index.vue'
import TrackOrder from '../views/TrackOrder.vue';
import SizeGuide from '../views/SizeGuide.vue';
import Account from '../elements/MyAccount/index.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'Home', component: HomePage },
        { path: '/login', name: 'Login', component: LoginPage, meta: { guest: true } },
        { path: '/register', name: 'Register', component: RegisterPage, meta: { guest: true } },
        { path: '/cart', name: 'Cart', component: Cart },
        { path: '/wishlist', name: 'Wishlist', component: Wishlist },
        { path: '/checkout', name: 'Checkout', component: Checkout, meta: { requiresAuth: true } },
        { path: '/order-confirmation/:orderId', name: 'OrderConfirmation', component: OrderConfirmation, meta: { requiresAuth: true } },
        { path: '/our-story', name: 'OurStory', component: About },
        { path: '/about', name: 'About', component: About },
        { path: '/contact', name: 'ContactUs', component: Contact },
        { path: '/account', name: 'UserAccount', component: Account },
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
        { path: '/track-order', name: 'TrackOrder', component: TrackOrder },
        { path: '/size-guide', name: 'SizeGuide', component: SizeGuide },
        { path: '/payment-success', name: 'PaymentSuccess', component: () => import('@/views/PaymentSuccess.vue') },
        { path: '/payment-cancelled', name: 'PaymentCancelled', component: () => import('@/views/PaymentCancelled.vue') },
        { path: '/track-order', name: 'OrderTracking', component: () => import('@/views/OrderTracking.vue') },
        {
            path: '/workwear-collection',
            name: 'WorkwearCollection',
            component: () => import('@/elements/Home/WorkwearCollection.vue'),
        },
        {
            path: '/vacation-collection',
            name: 'VacationCollection',
            component: () => import('@/elements/Home/VacationCollection.vue'),
        },
        {
            path: '/evening-collection',
            name: 'EveningCollection',
            component: () => import('@/elements/Home/EveningCollection.vue'),
        },
        {
            path: '/journals',
            name: 'JournalHub',
            component: () => import('@/elements/Journals/JournalHub.vue'),
            props: true
        },
        {
            path: '/blogs/:id',
            name: 'blogs',
            component: () => import('@/elements/Blogs/Blogs.vue'),
            props: true
        },
        {   
            path: '/forgot-password',
            name: 'ForgotPassword',
            component: () => import('@/elements/ResetPassword.vue'),
            meta: { guest: true }
        },
        {
            path: '/reset-password/:token',
            name: 'ResetNewPassword',
            component: () => import('@/elements/ResetNewPassword.vue'),
            meta: { guest: true }
        },
        {
            path: '/:pathMatch(.*)*',
            name: '404',
            component: () => import('@/elements/pagenotfound/index.vue')
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            // Use instant scroll for faster navigation
            return { top: 0, behavior: 'instant' }
        }
    }
});

export default router;