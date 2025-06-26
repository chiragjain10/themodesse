<template>
    <!-- Icon Box -->
    <div class="flat-spacing-8 bg-main ShopIconBoxSwiper">
        <div class="container">
            <div class="tf-swiper swiper sw-iconbox" data-preview="4" data-tablet="3" data-mobile-sm="2" data-mobile="1"
                data-space-lg="80" data-space-md="30" data-space="15" data-pagination="1" data-pagination-sm="2"
                data-pagination-md="3" data-pagination-lg="4">
                <div class="swiper-wrapper">
                    <!-- item 1 -->
                    <div class="swiper-slide">
                        <div class="box_icon--V01 style-white wow fadeInLeft">
                            <span class="icon">
                                <i class="icon-box text-primary"></i>
                            </span>
                            <div class="content">
                                <h4 class="title">Free Shipping</h4>
                                <p class="text">Enjoy free shipping on all orders</p>
                            </div>
                        </div>
                    </div>
                    <!-- item 2 -->
                    <div class="swiper-slide">
                        <div class="box_icon--V01 style-white wow fadeInLeft" data-wow-delay="0.1s">
                            <span class="icon">
                                <i class="icon-credit-card text-primary"></i>
                            </span>
                            <div class="content">
                                <h4 class="title">Flexible Payment</h4>
                                <p class="text">Pay with Multiple Credit Cards</p>
                            </div>
                        </div>
                    </div>
                    <!-- item 3 -->
                    <div class="swiper-slide">
                        <div class="box_icon--V01 style-white wow fadeInLeft" data-wow-delay="0.2s">
                            <span class="icon">
                                <i class="icon-return text-primary"></i>
                            </span>
                            <div class="content">
                                <h4 class="title">14 - Days Return</h4>
                                <p class="text">Free return/exchange within 30 days</p>
                            </div>
                        </div>
                    </div>
                    <!-- item 4 -->
                    <div class="swiper-slide">
                        <div class="box_icon--V01 style-white wow fadeInLeft" data-wow-delay="0.3s">
                            <span class="icon">
                                <i class="icon-headphone text-primary"></i>
                            </span>
                            <div class="content">
                                <h4 class="title">Premium Support</h4>
                                <p class="text">Enjoy our premium support</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="sw-dot-default style-white tf-sw-pagination"></div>
            </div>
        </div>
    </div>
    <!-- /Icon Box -->
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import Swiper from 'swiper';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

Swiper.use([Pagination, Navigation, Autoplay]);

let iconBoxSwiper = null;

const initSwiper = () => {
    if (iconBoxSwiper) {
        iconBoxSwiper.destroy(true, true);
    }
    iconBoxSwiper = new Swiper('.ShopIconBoxSwiper .tf-swiper', {
        slidesPerView: 4,
        spaceBetween: 80,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.ShopIconBoxSwiper .tf-sw-pagination',
            clickable: true,
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 15,
            },
            480: {
                slidesPerView: 2,
                spaceBetween: 15,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 80,
            },
        },
    });
};

onMounted(() => {
    nextTick(() => {
        initSwiper();
    });
});
</script>

<style scoped></style> 