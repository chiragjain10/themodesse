<template>
    <!-- Quick Add -->
    <div class="modal modalCentered fade modal-quick-add" id="quickAdd">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="tf-product-info-wrap mt-0">
                    <div class="tf-product-info-inner tf-product-info-list mb-0">
                        <div class="tf-product-mini-view">
                            <a href="product-default.html" class="prd-image">
                                <img src="/src/assets/images/products/product-28.jpg" alt="Image Product">
                            </a>
                            <div class="prd-content">
                                <a href="product-default.html" class="prd-name link h6 fw-normal text-uppercase">
                                    engagement ring in 18k yellow gold
                                </a>
                                <div class="price-wrap">
                                    <span class="price-new price-on-sale h5">$2,499.00</span>
                                    <span class="price-old compare-at-price">$2,899.00</span>
                                </div>
                            </div>
                            <span class="icon-close icon-close-popup" data-bs-dismiss="modal"></span>
                        </div>
                        <div class="tf-product-info-variant">
                            <div class="variant-picker-item variant-color">
                                <div class="variant-picker-label h6 fw-normal">
                                    Material:
                                    <span class="variant-picker-label-value value-currentColor">gold</span>
                                </div>
                                <div class="variant-picker-values">
                                    <div class="hover-tooltip color-btn style-image-square active" data-color="gold"
                                        data-price="2,499.00">
                                        <span class="check-color">
                                            <img src="/src/assets/images/products/material/yellow.jpg" alt="">
                                        </span>
                                        <span class="tooltip">Gold</span>
                                    </div>
                                    <div class="hover-tooltip color-btn style-image-square" data-color="rose"
                                        data-price="2,599.00">
                                        <span class="check-color">
                                            <img src="/src/assets/images/products/material/pink.jpg" alt="">
                                        </span>
                                        <span class="tooltip">Rose</span>
                                    </div>
                                    <div class="hover-tooltip color-btn style-image-square" data-color="titanium"
                                        data-price="2,699.00">
                                        <span class="check-color">
                                            <img src="/src/assets/images/products/material/gray.jpg" alt="">
                                        </span>
                                        <span class="tooltip">Titanium</span>
                                    </div>
                                </div>
                            </div>
                            <div class="variant-picker-item variant-size">
                                <div class="variant-picker-label h6 fw-normal">
                                    Size:
                                    <span class="variant-picker-label-value value-currentSize">48</span>
                                </div>
                                <div class="variant-picker-values">
                                    <div class="variant-picker-values">
                                        <div class="btn-group">
                                            <span class="size-btn active" data-size="48" data-price="2,499.00">48</span>
                                            <span class="size-btn" data-size="50" data-price="999.00">50</span>
                                            <span class="size-btn" data-size="52" data-price="1,999.00">52</span>
                                            <span class="size-btn" data-size="54" data-price="2,199.00">54</span>
                                        </div>
                                        <a href="#sizeGuide" data-bs-toggle="offcanvas"
                                            class="tf-btn-line style-line-2 fw-normal">
                                            <span class="text-caption">Size Guide</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="variant-picker-item">
                                <div class="variant-picker-label h6 fw-normal">Quantity</div>
                                <div class="variant-picker-values">
                                    <div class="wg-quantity">
                                        <button class="btn-quantity btn-decrease"><i class="icon-minus"></i></button>
                                        <input class="quantity-product" type="text" name="number" value="1">
                                        <button class="btn-quantity btn-increase"><i class="icon-plus"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="tf-product-total-quantity mb-0">
                            <div class="group-btn">
                                <button 
                                    class="tf-btn btn-fill-2 text-uppercase fw-medium animate-btn add-to-cart-button"
                                    @click="handleAddToCartClick"
                                    :disabled="loading"
                                >
                                   <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                   <span v-else-if="success" class="icon icon-check"></span>
                                   <span v-else>
                                    add to bag
                                    <i class="icon-minus d-none d-sm-block"></i>
                                    <span class="price-add d-none d-sm-block">$2,499.00</span>
                                   </span>
                                </button>
                                <div class="group-btn-action">
                                    <a href="javascript:void(0);" class="tf-btn-icon hover-tooltip btn-add-wishlist">
                                        <span class="icon icon-heart-2"></span>
                                        <span class="tooltip">Add to Wishlist</span>
                                    </a>
                                    <a href="#compare" data-bs-toggle="modal" aria-controls="compare"
                                        class="tf-btn-icon hover-tooltip">
                                        <span class="icon icon-compare"></span>
                                        <span class="tooltip">Compare</span>
                                    </a>
                                </div>
                            </div>
                            <a href="checkout.html" class="tf-btn w-100 text-uppercase fw-medium">
                                buy it now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Quick Add -->
</template>

<script setup>
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useQuickViewStore } from '@/stores/quickView';
import { useToast } from 'vue-toast-notification';
import { storeToRefs } from 'pinia';

const cart = useCartStore();
const quickView = useQuickViewStore();
const toast = useToast();

const { currentProduct } = storeToRefs(quickView);

const loading = ref(false);
const success = ref(false);

const quantity = ref(1);
const selectedMaterial = ref('gold');
const selectedSize = ref('48');

const handleAddToCartClick = async () => {
    const product = currentProduct.value;
    if (!product) return;

    loading.value = true;
    success.value = false;

    try {
        const cartData = {
            productId: product.id,
            quantity: quantity.value,
            selectedVariant: {
                material: selectedMaterial.value,
                size: selectedSize.value
            },
            cartToken: localStorage.getItem('cartToken') || generateCartToken()
        };

        const response = await cart.addToCart(cartData);

        if (response.status === 'success') {
            if (response.cartToken) {
                localStorage.setItem('cartToken', response.cartToken);
            }

            await cart.getCartCount();

            toast.success('Product added to cart successfully');

            success.value = true;
            setTimeout(() => {
                success.value = false;
            }, 2000);

        } else {
            toast.error(response.message || 'Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error adding to cart from Quick Add:', error);
        toast.error('Failed to add product to cart');
    } finally {
        loading.value = false;
    }
};

const generateCartToken = () => {
    return 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

</script>

<style scoped>
.add-to-cart-button .icon-check {
    font-size: 18px;
    vertical-align: middle;
}
</style>