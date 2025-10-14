import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
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
        { path: '/checkout', name: 'Checkout', component: Checkout },
        { path: '/order-confirmation/:orderId', name: 'OrderConfirmation', component: OrderConfirmation },
        { path: '/our-story', name: 'OurStory', component: About },
        { path: '/about', name: 'About', component: About },
        { path: '/contact', name: 'ContactUs', component: Contact },
        { path: '/account', name: 'UserAccount', component: Account, meta: { requiresAuth: true } },
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
        // { path: '/dashboard', name: 'UserDashboardNew', component: () => import('@/views/UserDashboard.vue'), meta: { requiresAuth: true } },
        { path: '/payment-cancelled', name: 'PaymentCancelled', component: () => import('@/views/PaymentCancelled.vue') },
        
        {
            path: '/product-collection',
            name: 'ProductCollection',
            component: () => import('@/elements/Home/ProductCollection.vue'),
            props: route => ({ key: route.query.key, label: route.query.label })
        },
        {
            path: '/shop-by-category',
            name: 'ShopByCategory',
            component: () => import('@/elements/Home/ShopCategoryLanding.vue')
        },
        {
            path: '/shop-by-edits',
            name: 'ShopByEdits',
            component: () => import('@/elements/Home/ShopEditsLanding.vue')
        },
        // Legacy redirects (backward compatibility)
        {
            path: '/evening-collection',
            redirect: { path: '/product-collection', query: { key: 'eveningWearBanner', label: 'Evening' } }
        },
        {
            path: '/workwear-collection',
            redirect: { path: '/product-collection', query: { key: 'workwearCollection', label: 'Work' } }
        },
        {
            path: '/vacation-collection',
            redirect: { path: '/product-collection', query: { key: 'vacationCollection', label: 'Vacation' } }
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
        // {
        //     path: '/admin',
        //     component: () => import('@/admin/AdminLayout.vue'),
        //     meta: { requiresAuth: true, requiresAdmin: true },
        //     children: [
        //         { path: '', name: 'AdminDashboard', component: () => import('@/admin/pages/Dashboard.vue') },
        //         { path: 'payments', name: 'AdminPayments', component: () => import('@/admin/pages/Payments.vue') },
        //         { path: 'blogs', name: 'AdminBlogs', component: () => import('@/admin/pages/Blogs.vue') },
        //         { path: 'products', name: 'AdminProducts', component: () => import('@/admin/pages/Products.vue') },
        //         { path: 'customers', name: 'AdminCustomers', component: () => import('@/admin/pages/Customers.vue') },
        //         { path: 'reviews', name: 'AdminReviews', component: () => import('@/admin/pages/Reviews.vue') },
        //         { path: 'categories', name: 'AdminCategories', component: () => import('@/admin/pages/Categories.vue') },
        //         { path: 'sub-categories', name: 'AdminSubCategories', component: () => import('@/admin/pages/SubCategories.vue') },
        //         { path: 'attributes', name: 'AdminAttributes', component: () => import('@/admin/pages/Attributes.vue') },
        //         { path: 'offers', name: 'AdminOffers', component: () => import('@/admin/pages/Offers.vue') },
        //         { path: 'orders', name: 'AdminOrders', component: () => import('@/admin/pages/Orders.vue') },
        //         { path: 'users', name: 'AdminUsers', component: () => import('@/admin/pages/Users.vue') },
        //         { path: 'receipts', name: 'AdminReceipts', component: () => import('@/admin/pages/Receipts.vue') },
        //         { path: 'stocks', name: 'AdminStocks', component: () => import('@/admin/pages/Stocks.vue') },
        //         { path: 'settings', name: 'AdminSettings', component: () => import('@/admin/pages/Settings.vue') },
        //         { path: 'profile', name: 'AdminProfile', component: () => import('@/admin/pages/Profile.vue') },
        //     ]
        // },
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

// Global navigation guard: auth and admin gating
router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore();

    // Try to populate user from token once per app load
    if (!auth.userLoaded) {
        try {
            await auth.fetchUser();
        } catch (e) {
            // ignore, store handles resetting state
        }
    }

    const requiresAuth = to.matched.some(r => r.meta && r.meta.requiresAuth);
    const guestOnly = to.matched.some(r => r.meta && r.meta.guest);
    const requiresAdmin = to.matched.some(r => r.meta && r.meta.requiresAdmin);

    if (requiresAuth && !auth.isAuthenticated) {
        // Redirect unauthenticated users to login with redirect back
        return next({ path: '/login', query: { redirect: to.fullPath } });
    }

    if (guestOnly && auth.isAuthenticated) {
        // Prevent logged-in users from visiting guest pages
        return next({ path: '/account' });
    }

    if (requiresAdmin) {
        if (!auth.isAuthenticated) {
            return next({ path: '/login', query: { redirect: to.fullPath } });
        }
        // Assume backend sets is_admin (or role). Fallback to role === 'admin'
        const isAdmin = auth.user?.is_admin || auth.user?.role === 'admin';
        if (!isAdmin) {
            return next({ path: '/' });
        }
    }

    return next();
});

export default router;