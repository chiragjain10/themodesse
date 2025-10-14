<template>
    <!-- Shopping Cart -->
    <div class="offcanvas offcanvas-end popup-shopping-cart" id="shoppingCart">
        <div class="canvas-wrapper">
            <div class="canvas-header">
                <h3 class="title fw-normal text-uppercase">shopping cart</h3>
                <span id="shoppingCartCloseBtn" class="icon-close link icon-close-popup" data-bs-dismiss="offcanvas"></span>
            </div>
            <div class="wrap list-file-delete">
                <div class="tf-mini-cart-threshold">
                    <h6 class="text fw-normal text-uppercase"><span class="fw-medium">Free
                            Shipping</span>
                    </h6>
                    <div class="tf-progress-bar tf-progress-ship">
                        <div class="value" :style="{ width: cartProgress + '%' }" :data-progress="cartProgress">
                            <i class="icon icon-delivery"></i>
                        </div>
                    </div>
                    <div class="tf-number-count">
                        <p class="text-uppercase"><span class="prd-count">{{ cartCount }}</span> products</p>

                        <a href="javascript:void(0)" class="tf-btn-line style-line-2 clear-file-delete"
                            @click.prevent="clearCart">
                            <span class="text-body">
                                Empty cart
                            </span>
                        </a>
                    </div>
                </div>
                <div class="tf-mini-cart-wrap">
                    <div class="tf-mini-cart-main">
                        <div class="tf-mini-cart-sroll">
                            <div v-if="loading">
                                <div class="col-xs-6 col-lg-3 mb-4" v-for="n in 4" :key="n">
                                    <div class="category shimmer-loader">
                                        <div class="skeleton-img"></div>
                                        <div class="skeleton-text mt-2"></div>
                                    </div>
                                </div>
                            </div>
                            <ul v-else-if="cartItems && cartItems.length > 0" class="tf-mini-cart-items">
                                <li v-for="item in cartItems" :key="item.id" class="tf-mini-cart-item file-delete">
                                    <div class="tf-mini-cart-image">
                                        <RouterLink :to="`/product/${item.product?.slug}`" @click="closeCartOffcanvas">
                                            <img :src="item.product?.image" :alt="item.product?.name">
                                        </RouterLink>
                                    </div>
                                    <div class="tf-mini-cart-info">
                                        <RouterLink :to="`/product/${item.product?.slug}`" class="prd-name link"
                                            @click="closeCartOffcanvas">
                                            {{ item.product?.name }}
                                        </RouterLink>
                                        <div class="prd-quantity">
                                            <p class="text-caption">
                                                Qty:
                                            </p>
                                            <div class="wg-quantity style-2">
                                                <button class="btn-quantity minus-quantity"
                                                    @click="updateQuantity(item.item_id, Number(item.qty) - 1)"
                                                    :disabled="Number(item.qty) <= 1"><i
                                                        class="icon-minus"></i></button>
                                                <input class="quantity-product" type="text" name="number"
                                                    :value="item.qty" readonly>
                                                <button class="btn-quantity plus-quantity"
                                                    @click="updateQuantity(item.item_id, Number(item.qty) + 1)"><i
                                                        class="icon-plus"></i></button>
                                            </div>
                                        </div>
                                        <a href="javascript:void(0)" class="tf-btn-line style-line-2 remove"
                                            @click.prevent="removeItem(item.item_id)">
                                            <span class="text-caption">
                                                Remove
                                            </span>
                                        </a>
                                    </div>
                                    <p class="tf-mini-card-price h6 fw-normal">
                                        ₹{{ (Number(item.product?.price || item.product?.price || 0) *
                                            Number(item.qty)).toFixed(2) }}
                                    </p>
                                </li>
                            </ul>
                            <div v-else class="empty-cart text-center py-4">
                                <p>Your cart is empty.</p>
                            </div>
                        </div>
                    </div>
                    <div v-if="cartItems && cartItems.length > 0" class="tf-mini-cart-bottom">
                        <!-- <div class="tf-mini-cart-tool">
                            <div class="tf-mini-cart-tool-btn btn-add-gift">
                                <i class="icon icon-gift"></i>
                                <p class="text-caption">Add gift wrap</p>
                            </div>
                            <div class="tf-mini-cart-tool-btn btn-add-note">
                                <i class="icon icon-note"></i>
                                <p class="text-caption">Order note</p>
                            </div>
                            <div class="tf-mini-cart-tool-btn btn-estimate-shipping">
                                <i class="icon icon-delivery-3"></i>
                                <p class="text-caption">Shipping</p>
                            </div>
                        </div> -->
                        <div class="tf-mini-cart-bottom-wrap">
                            <div class="tf-cart-totals-discounts">
                                <h6 class="tf-cart-total-text fw-normal text-uppercase">total:</h6>
                                <div class="tf-totals-total-value h6 fw-normal">₹{{ cartTotal.toFixed(2) }}</div>
                            </div>
                            <div class="tf-mini-cart-view-checkout">
                                <RouterLink to="/cart" class="tf-btn w-100 style-2" @click="closeCartOffcanvas">
                                    <span class="fw-medium">
                                        GO TO CART
                                    </span>
                                </RouterLink>
                                <RouterLink to="/checkout" class="tf-btn btn-fill animate-btn w-100"
                                    @click="closeCartOffcanvas">
                                    <span class="fw-medium">
                                        CHECKOUT
                                    </span>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                    <div class="tf-mini-cart-tool-openable add-gift">
                        <div class="overlay tf-mini-cart-tool-close"></div>
                        <form action="#" class="tf-mini-cart-tool-content">
                            <div class="tf-mini-cart-tool-text h5 fw-normal text-uppercase">Add gift wrap</div>
                            <div class="tf-mini-cart-tool-text1">The product will be wrapped carefully.
                                Fee is only <span class="text text-main">$10.00</span>. Do you want a
                                gift wrap?</div>
                            <div class="tf-cart-tool-btns">
                                <button class="subscribe-button tf-btn w-100 btn-fill animate-btn" type="submit">
                                    Add a Gift Wrap
                                </button>
                                <button type="button"
                                    class="tf-btn style-2 w-100 tf-mini-cart-tool-close">Cancel</button>
                            </div>
                        </form>
                    </div>
                    <div class="tf-mini-cart-tool-openable add-note">
                        <div class="overlay tf-mini-cart-tool-close"></div>
                        <form action="#" class="tf-mini-cart-tool-content style-border">
                            <label for="Cart-note" class="tf-mini-cart-tool-text h5 fw-normal text-uppercase">
                                Order note
                            </label>
                            <textarea name="note" id="Cart-note" placeholder="Instruction for seller..."
                                class="d-flex"></textarea>
                            <div class="tf-cart-tool-btns">
                                <button class="subscribe-button tf-btn w-100 btn-fill animate-btn" type="submit">
                                    Save
                                </button>
                                <button type="button"
                                    class="tf-btn style-2 w-100 tf-mini-cart-tool-close">Close</button>
                            </div>
                        </form>
                    </div>
                    <div class="tf-mini-cart-tool-openable estimate-shipping">
                        <div class="overlay tf-mini-cart-tool-close"></div>
                        <form id="shipping-form" class="tf-mini-cart-tool-content style-border">
                            <div class="tf-mini-cart-tool-text h5 fw-normal text-uppercase">Shipping estimates</div>
                            <div class="field">
                                <p class="text-sm">Country</p>
                                <div class="tf-select">
                                    <select class="w-100" id="shipping-country-form" name="address[country]"
                                        data-default="">
                                        <option value="Australia"
                                            data-provinces='[["Australian Capital Territory","Australian Capital Territory"],["New South Wales","New South Wales"],["Northern Territory","Northern Territory"],["Queensland","Queensland"],["South Australia","South Australia"],["Tasmania","Tasmania"],["Victoria","Victoria"],["Western Australia","Western Australia"]]'>
                                            Australia</option>
                                        <option value="Austria" data-provinces='[]'>Austria</option>
                                        <option value="Belgium" data-provinces='[]'>Belgium</option>
                                        <option value="Canada"
                                            data-provinces='[["Ontario","Ontario"],["Quebec","Quebec"]]'>Canada
                                        </option>
                                        <option value="Czech Republic" data-provinces='[]'>Czechia</option>
                                        <option value="Denmark" data-provinces='[]'>Denmark</option>
                                        <option value="Finland" data-provinces='[]'>Finland</option>
                                        <option value="France" data-provinces='[]'>France</option>
                                        <option value="Germany" data-provinces='[]'>Germany</option>
                                        <option selected value="United States"
                                            data-provinces='[["Alabama","Alabama"],["California","California"],["Florida","Florida"]]'>
                                            United States</option>
                                        <option value="United Kingdom"
                                            data-provinces='[["England","England"],["Scotland","Scotland"],["Wales","Wales"],["Northern Ireland","Northern Ireland"]]'>
                                            United Kingdom</option>
                                        <option value="India" data-provinces='[]'>India</option>
                                        <option value="Japan" data-provinces='[]'>Japan</option>
                                        <option value="Mexico" data-provinces='[]'>Mexico</option>
                                        <option value="South Korea" data-provinces='[]'>South Korea</option>
                                        <option value="Spain" data-provinces='[]'>Spain</option>
                                        <option value="Italy" data-provinces='[]'>Italy</option>
                                        <option value="Vietnam"
                                            data-provinces='[["Ha Noi","Ha Noi"],["Da Nang","Da Nang"],["Ho Chi Minh","Ho Chi Minh"]]'>
                                            Vietnam</option>
                                    </select>
                                </div>
                            </div>
                            <div class="field">
                                <p class="text-sm">State/Province</p>
                                <div class="tf-select">
                                    <select id="shipping-province-form" name="address[province]"
                                        data-default=""></select>
                                </div>
                            </div>
                            <div class="field">
                                <p class="text-sm">Zipcode</p>
                                <input type="text" data-opend-focus placeholder="41000" id="zipcode" name="address[zip]"
                                    value="">
                            </div>
                            <div id="zipcode-message" class="error" style="display: none;">
                                We found one shipping rate available for undefined.
                            </div>
                            <div id="zipcode-success" class="success" style="display: none;">
                                <p>We found one shipping rate available for your address:</p>
                                <p class="standard">Standard at <span>$0.00</span> USD</p>
                            </div>
                            <div class="tf-cart-tool-btns">
                                <button class="tf-btn w-100 btn-fill animate-btn" type="submit">
                                    Estimate
                                </button>
                                <div class="tf-mini-cart-tool-primary tf-btn style-2 w-100 tf-mini-cart-tool-close">
                                    Close</div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Shopping Cart -->
</template>

<script setup>
import { computed, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useToast } from 'vue-toast-notification';
import { useRouter } from 'vue-router';

const cart = useCartStore();
const toast = useToast();
const cartItems = computed(() => cart.items);
const cartCount = computed(() => cart.count);
const cartTotal = computed(() => cart.total);
const loading = computed(() => cart.loading);

const freeShippingThreshold = 100;
const cartProgress = computed(() => {
    if (!cart.total) return 0;
    const progress = (cart.total / freeShippingThreshold) * 100;
    return Math.min(progress, 100);
});

const fetchCartData = async () => {
    try {
        await cart.fetchCart();
    } catch (error) {
        console.error('Error fetching cart:', error);
    }
};

const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
        await cart.updateItem(itemId, newQuantity);

    } catch (error) {
        console.error('Error updating cart item quantity:', error);

        toast.error('Failed to update item quantity');
    }
};

const removeItem = async (itemId) => {
    try {
        await cart.removeItem(itemId);
        await cart.fetchCart();
        toast.success('Item removed from cart');
    } catch (error) {
        console.error('Error removing cart item:', error);
        toast.error('Failed to remove item from cart');
    }
};

const clearCart = async () => {
    try {
        await cart.clearCart();
        toast.success('Cart cleared successfully');
    } catch (error) {
        console.error('Error clearing cart:', error);
        toast.error('Failed to clear cart');
    }
};

const closeCartOffcanvas = () => {
    const el = document.getElementById('shoppingCart');
    if (el && window.bootstrap && window.bootstrap.Offcanvas) {
        const offcanvas = window.bootstrap.Offcanvas.getOrCreateInstance(el);
        offcanvas.hide();
        document.querySelector(".offcanvas-backdrop").style.display = "none";
        if (document.querySelector(".offcanvas-backdrop").classList.contains("show")) {
            document.querySelector(".offcanvas-backdrop").classList.remove("show");
        }
    }
};

const router = useRouter();
let cartOffcanvasCloseHook = null;

function removeAllBackdrops() {
    document.querySelectorAll('.offcanvas-backdrop, .modal-backdrop').forEach(el => el.remove());
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    document.body.classList.remove('modal-open', 'offcanvas-open');
}

onMounted(() => {
    cartOffcanvasCloseHook = router.afterEach(() => {
        document.getElementById('shoppingCartCloseBtn')?.click();
        removeAllBackdrops();
    });
    fetchCartData();
});

onUnmounted(() => {
    if (cartOffcanvasCloseHook) cartOffcanvasCloseHook();
});
</script>

<style scoped>
/* Add component specific styles here */
.popup-shopping-cart .canvas-header {
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 15px;
}

.tf-mini-cart-threshold {
    margin-bottom: 20px;
}

.tf-progress-bar.tf-progress-ship {
    height: 8px;
    background-color: #f0f0f0;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 5px;
}

.tf-progress-bar.tf-progress-ship .value {
    height: 100%;
    background-color: var(--primary);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 5px;
    transition: width 0.5s ease-in-out;
}

.tf-progress-bar.tf-progress-ship .value i {
    color: white;
    font-size: 10px;
}

.tf-number-count {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 5px;
}

.tf-mini-cart-wrap {
    max-height: 60vh;
    /* Adjust as needed */
    overflow-y: auto;
}

.tf-mini-cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
}

.tf-mini-cart-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
}

.tf-mini-cart-image {
    width: 80px;
    height: 80px;
    margin-right: 15px;
    flex-shrink: 0;
}

.tf-mini-cart-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 1px solid #ddd;
    padding: 5px;
}

.tf-mini-cart-info {
    flex-grow: 1;
    margin-right: 15px;
}

.tf-mini-cart-info .prd-name {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
}

.tf-mini-cart-info .prd-quantity {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.tf-mini-cart-info .prd-quantity .text-caption {
    margin-right: 10px;
    font-size: 12px;
}

.tf-mini-cart-info .wg-quantity.style-2 {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.tf-mini-cart-info .wg-quantity.style-2 button {
    padding: 5px 10px;
    border: none;
    background: #f9f9f9;
    cursor: pointer;
}

.tf-mini-cart-info .wg-quantity.style-2 input {
    width: 40px;
    text-align: center;
    border: none;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    padding: 5px 0;
}

.tf-mini-cart-info .remove {
    font-size: 12px;
    color: #dc3545;
    margin-top: 5px;
    display: inline-block;
}

.tf-mini-card-price {
    flex-shrink: 0;
}

.empty-cart {
    padding: 20px;
    border: 1px dashed #ddd;
    margin-top: 20px;
}

.tf-mini-cart-bottom {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.tf-mini-cart-tool {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}

.tf-mini-cart-tool-btn {
    text-align: center;
    cursor: pointer;
}

.tf-mini-cart-tool-btn i {
    font-size: 20px;
    margin-bottom: 5px;
}

.tf-mini-cart-bottom-wrap {
    border-top: 1px solid #eee;
    padding-top: 20px;
}

.tf-cart-totals-discounts {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.tf-mini-cart-view-checkout a {
    display: block;
    margin-bottom: 10px;
    text-align: center;
}

.tf-mini-cart-tool-openable {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1050;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
}

.tf-mini-cart-tool-openable.show {
    visibility: visible;
    opacity: 1;
}

.tf-mini-cart-tool-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    position: relative;
    transform: translateY(20px);
    transition: transform 0.3s ease-in-out;
}

.tf-mini-cart-tool-openable.show .tf-mini-cart-tool-content {
    transform: translateY(0);
}

.tf-mini-cart-tool-text {
    margin-bottom: 15px;
}

.tf-mini-cart-tool-text1 {
    margin-bottom: 15px;
    font-size: 14px;
    color: #555;
}

.tf-cart-tool-btns button,
.tf-cart-tool-btns .tf-btn {
    margin-bottom: 10px;
}

.tf-mini-cart-tool-content.style-border {
    border: 1px solid #eee;
}

.tf-mini-cart-tool-content label {
    display: block;
    margin-bottom: 10px;
}

.tf-mini-cart-tool-content textarea {
    width: 100%;
    height: 100px;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 15px;
}

.field {
    margin-bottom: 15px;
}

.field p.text-sm {
    font-size: 12px;
    margin-bottom: 5px;
    color: #555;
}

.tf-select select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

#zipcode {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

#zipcode-message,
#zipcode-success {
    margin-top: 10px;
    padding: 10px;
    border-radius: 4px;
}

#zipcode-message {
    color: #dc3545;
    background-color: #f8d7da;
    border-color: #f5c6cb;
}

#zipcode-success {
    color: #28a745;
    background-color: #d4edda;
    border-color: #c3e6cb;
}

#zipcode-success .standard span {
    font-weight: bold;
}

.offcanvas.popup-shopping-cart.show {
    transform: translateX(0);
}
</style>