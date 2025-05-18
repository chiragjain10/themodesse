<template>
    <div class="page-content pt-7 pb-10">
        <div class="step-by pr-4 pl-4">
            <h3 class="title title-simple title-step active"><router-link to="/cart">1. Shopping Cart</router-link></h3>
            <h3 class="title title-simple title-step"><router-link to="/checkout">2. Checkout</router-link></h3>
            <h3 class="title title-simple title-step"><router-link to="/order">3. Order Complete</router-link></h3>
        </div>
        <div class="container mt-7 mb-2">
            <div class="row">
                <div class="col-lg-8 col-md-12 pr-lg-4">
                    <template v-if="loading">
                        <!-- Preloader shimmer -->
                        <div class="shimmer-loader" style="min-height: 300px;">
                            <div class="skeleton-table-row" v-for="n in 4" :key="n">
                                <div class="skeleton-cell" v-for="c in 6" :key="c"></div>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <table class="shop-table cart-table">
                            <thead>
                                <tr>
                                    <th><span>Product</span></th>
                                    <th></th>
                                    <th><span>Price</span></th>
                                    <th><span>quantity</span></th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <CartItems />
                        </table>
                        <div class="cart-actions mb-6 pt-4">
                            <router-link to="/shop" class="btn btn-dark btn-md btn-rounded btn-icon-left mr-4 mb-4"><i
                                    class="d-icon-arrow-left"></i>Continue Shopping</router-link>
                            <button type="submit" class="btn btn-outline btn-dark btn-md btn-rounded btn-disabled">Update
                                Cart</button>
                        </div>
                        <div class="cart-coupon-box mb-8">
                            <h4 class="title coupon-title text-uppercase ls-m">Coupon Discount</h4>
                            <input type="text" name="coupon_code" class="input-text form-control text-grey ls-m mb-4"
                                id="coupon_code" value="" placeholder="Enter coupon code here...">
                            <button type="submit" class="btn btn-md btn-dark btn-rounded btn-outline">Apply
                                Coupon</button>
                        </div>
                    </template>
                </div>
                <aside class="col-lg-4 sticky-sidebar-wrapper">
                    <div class="sticky-sidebar" data-sticky-options="{'bottom': 20}">
                        <div class="summary mb-4">
                            <h3 class="summary-title text-left">Cart Totals</h3>
                            <template v-if="loading">
                                <div class="shimmer-loader" style="min-height: 150px;">
                                    <div class="skeleton-table-row" v-for="n in 2" :key="n">
                                        <div class="skeleton-cell" v-for="c in 2" :key="c"></div>
                                    </div>
                                </div>
                            </template>
                            <template v-else>
                                <table class="shipping">
                                    <tr class="summary-subtotal">
                                        <td>
                                            <h4 class="summary-subtitle">Subtotal</h4>
                                        </td>
                                        <td>
                                            <p class="summary-subtotal-price">₹{{ cartTotal.toFixed(2) }}</p>
                                        </td>
                                    </tr>
                                    <tr class="sumnary-shipping shipping-row-last">
                                        <td colspan="2">
                                            <h4 class="summary-subtitle">Calculate Shipping</h4>
                                            <ul>
                                                <li>
                                                    <div class="custom-radio">
                                                        <input type="radio" id="flat_rate" name="shipping"
                                                            class="custom-control-input" checked>
                                                        <label class="custom-control-label" for="flat_rate">Flat
                                                            rate</label>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div class="custom-radio">
                                                        <input type="radio" id="free-shipping" name="shipping"
                                                            class="custom-control-input">
                                                        <label class="custom-control-label" for="free-shipping">Free
                                                            shipping</label>
                                                    </div>
                                                </li>

                                                <li>
                                                    <div class="custom-radio">
                                                        <input type="radio" id="local_pickup" name="shipping"
                                                            class="custom-control-input">
                                                        <label class="custom-control-label" for="local_pickup">Local
                                                            pickup</label>
                                                    </div>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                </table>
                                <div class="shipping-address">
                                    <label>Shipping to <strong>CA.</strong></label>
                                    <div class="select-box">
                                        <select name="country" class="form-control">
                                            <option value="us" selected>United States (US)</option>
                                            <option value="uk"> United Kingdom</option>
                                            <option value="fr">France</option>
                                            <option value="aus">Austria</option>
                                        </select>
                                    </div>
                                    <div class="select-box">
                                        <select name="country" class="form-control">
                                            <option value="us" selected>California</option>
                                            <option value="uk">Alaska</option>
                                            <option value="fr">Delaware</option>
                                            <option value="aus">Hawaii</option>
                                        </select>
                                    </div>
                                    <input type="text" class="form-control" name="code" placeholder="Town / City" />
                                    <input type="text" class="form-control" name="code" placeholder="ZIP" />
                                    <a href="#" class="btn btn-md btn-dark btn-rounded btn-outline">Update
                                        totals</a>
                                </div>
                                <table class="total">
                                    <tr class="summary-subtotal">
                                        <td>
                                            <h4 class="summary-subtitle">Total</h4>
                                        </td>
                                        <td>
                                            <p class="summary-total-price ls-s">₹{{ cartTotal.toFixed(2) }}</p>
                                        </td>
                                    </tr>
                                </table>
                                <router-link to="/checkout" class="btn btn-dark btn-rounded btn-checkout">Proceed to
                                    checkout</router-link>
                            </template>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </div>
</template>
<script setup>
import CartItems from './cartItems.vue';
import { computed } from 'vue';
import { useCartStore } from '@/stores/cart';
import { RouterLink } from 'vue-router';

const cart = useCartStore();
const cartTotal = computed(() => cart.total);
const loading = computed(() => cart.loading);
</script>
<style scoped>
.shimmer-loader {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #f6f7f8;
    border-radius: 8px;
    padding: 1rem;
}
.skeleton-table-row {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
}
.skeleton-cell {
    flex: 1;
    height: 32px;
    background: linear-gradient(90deg, #f6f7f8 25%, #edeef1 50%, #f6f7f8 75%);
    border-radius: 4px;
    animation: shimmer 1.2s infinite linear;
}
@keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
}
</style>
