<template>
    <!-- Lookbook -->
    <section class="flat-spacing-3 px-xxl_15 Lookbook">
        <div class="container">
            <div class="banner_lookbook">
                <div class="image-left">
                    <div class="image ">
                        <img src="/src/assets/images/banner/banner-14.webp" data-src="/src/assets/images/banner/banner-14.webp" alt=""
                            class="lazyload">
                    </div>
                    <a href="#prd-lb" class="lookbook-item position1 swiper-button" data-slide="0">
                        <div class="dropup-center dropup">
                            <div class="tf-pin-btn">
                                <span></span>
                            </div>
                        </div>
                    </a>
                    <a href="#prd-lb" class="lookbook-item position2 swiper-button" data-slide="1">
                        <div class="dropup-center dropup">
                            <div class="tf-pin-btn">
                                <span></span>
                            </div>
                        </div>
                    </a>
                </div>
                <div class="product-right wow fadeInUp" id="prd-lb">
                    <h2 class="s-title font-2 text-capitalize">
                        Shop The <span class="fst-italic">Collection</span>
                    </h2>
                    <div dir="ltr" class="swiper tf-swiper sw-look" data-preview="2" data-tablet="1" data-mobile-sm="2"
                        data-pagination="1" data-space="10" data-space-md="0" data-pagination-sm="1"
                        data-pagination-md="1" data-pagination-lg="2">
                        <div class="swiper-wrapper">
                            <div class="swiper-slide" v-for="product in lookbookProducts" :key="product.id">
                                <div class="card_product--V01 style_2">
                                    <div class="card_product-wrapper">
                                        <a :href="'/product/' + product.slug" class="product-img">
                                            <img :src="product.image" :data-src="product.image" :alt="product.name"
                                                class="lazyload img-product">
                                            <img :src="product.hover_image" :data-src="product.hover_image" :alt="product.name"
                                                class="lazyload img-hover">
                                        </a>
                                        <ul class="list-product-btn">
                                            <li class="wishlist">
                                                <a href="javascript:void(0);" @click="handleWishlistClick(product)"
                                                    class="hover-tooltip tooltip-left box-icon">
                                                    <span class="icon icon-heart-2"></span>
                                                    <span class="tooltip">Add to Wishlist</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="#quickView" data-bs-toggle="modal" @click="handleQuickViewClick(product)"
                                                    class="hover-tooltip tooltip-left box-icon quickview">
                                                    <span class="icon icon-view"></span>
                                                    <span class="tooltip">Quick View</span>
                                                </a>
                                            </li>
                                        </ul>
                                        <div class="badge-box" v-if="product.discount_perc > 0">
                                            <span class="badge-item sale">{{ product.discount_perc }}% OFF</span>
                                        </div>
                                    </div>
                                    <div class="card_product-info">
                                        <a :href="'/product/' + product.slug"
                                            class="name-product h5 fw-normal link text-line-clamp-2">
                                            {{ product.name }}
                                        </a>
                                        <div class="price-wrap">
                                            <span class="price-new h5 text-secondary">₹{{ product.sale_price }}</span>
                                            <span class="price-old fw-normal" v-if="product.price > product.sale_price">₹{{ product.price }}</span>
                                        </div>
                                        <ul class="rate-wrap">
                                            <li v-for="star in 5" :key="star"><i class="icon-star"></i></li>
                                        </ul>
                                    </div>
                                    <div class="card_product-btn">
                                        <a href="#shoppingCart" data-bs-toggle="offcanvas" @click="handleAddToCartClick(product)"
                                            class="tf-btn hover-primary fw-medium w-100">
                                            ADD TO CART
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="sw-dot-default tf-sw-pagination"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!-- /Lookbook -->
</template>

<script setup>
import { onMounted } from 'vue';
import Swiper from 'swiper';
import { useProductActions } from '@/composables/useProductActions';

const { handleWishlist, openQuickView, addToCart } = useProductActions();

const handleWishlistClick = (product) => {
    handleWishlist(product);
};

const handleQuickViewClick = (product) => {
    openQuickView(product);
};

const handleAddToCartClick = (product) => {
    // You may want to pass the correct cartData structure as per your cart logic
    addToCart({
        productId: product.id || product.p_id,
        quantity: 1,
        selectedVariant: {},
        cartToken: localStorage.getItem('cartToken') || `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    });
};

onMounted(() => {
    const swiper = new Swiper('.Lookbook .sw-look', {
        slidesPerView: 2,
        spaceBetween: 10,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.tf-sw-pagination',
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            1024: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
        },
    });
});
</script>

<style scoped>
.Lookbook .banner_lookbook {
    display: flex;
    gap: 30px;
    align-items: center;
}

.Lookbook .image-left {
    flex: 1;
    position: relative;
}

.Lookbook .image-left .image {
    width: 100%;
    height: 600px;
    overflow: hidden;
}

.Lookbook .image-left .image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.Lookbook .product-right {
    flex: 1;
}

.Lookbook .s-title {
    font-size: 32px;
    margin-bottom: 30px;
    color: #1a1a1a;
}

.Lookbook .s-title .fst-italic {
    color: #666;
}

.Lookbook .card_product--V01 {
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
}

.Lookbook .card_product--V01:hover {
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.Lookbook .product-img {
    position: relative;
    display: block;
    padding-top: 100%;
}

.Lookbook .product-img img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.Lookbook .img-hover {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.Lookbook .product-img:hover .img-hover {
    opacity: 1;
}

.Lookbook .list-product-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    opacity: 0;
    transform: translateX(20px);
    transition: all 0.3s ease;
}

.Lookbook .card_product--V01:hover .list-product-btn {
    opacity: 1;
    transform: translateX(0);
}

.Lookbook .badge-box {
    position: absolute;
    top: 15px;
    left: 15px;
}

.Lookbook .badge-item {
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
}

.Lookbook .badge-item.sale {
    background: #ff4d4d;
    color: #fff;
}

.Lookbook .card_product-info {
    padding: 20px;
}

.Lookbook .name-product {
    color: #1a1a1a;
    margin-bottom: 10px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.Lookbook .price-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.Lookbook .price-new {
    color: #1a1a1a;
}

.Lookbook .price-old {
    color: #999;
    text-decoration: line-through;
}

.Lookbook .rate-wrap {
    display: flex;
    gap: 2px;
    color: #ffc107;
}

.Lookbook .card_product-btn {
    padding: 0 20px 20px;
}

.Lookbook .tf-btn {
    background: #1a1a1a;
    color: #fff;
    padding: 12px;
    border-radius: 4px;
    text-align: center;
    transition: all 0.3s ease;
}

.Lookbook .tf-btn:hover {
    background: #333;
}
</style>