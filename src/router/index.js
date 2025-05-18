import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../components/Home/index.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';
import { useAuthStore } from '../stores/auth';
import ShopPage from '../components/shop/index.vue';
import ProductDetail from '../components/shop/productDetails/productDetailed.vue'
import UserDashboard from '../layouts/userDashboard.vue';
import CartPage from '../components/cart/index.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'Home', component: HomePage },
        { path: '/login', name: 'Login', component: LoginPage, meta: { guest: true } },
        { path: '/register', name: 'Register', component: RegisterPage, meta: { guest: true } },
        { path: '/shop', name: 'Shop', component: ShopPage },
        { path: '/shop/:slug', name: 'ShopByCategory', component: ShopPage },
        { path: '/product/:slug', name: 'ProductDetail', component: ProductDetail },
        { path: '/cart', name: 'Cart', component: CartPage },
        { path: '/userDashBoard', name: 'UserDashboard', component: UserDashboard },
    ],
});

router.beforeEach((to, from) => {
    const authStore = useAuthStore();

    // If route requires auth and user is not authenticated
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return { path: '/login' };
    }

    // If user is authenticated and tries to access guest pages (login/register)
    if (to.meta.guest && authStore.isAuthenticated) {
        return { path: '/userDashBoard' };
    }
});

export default router;