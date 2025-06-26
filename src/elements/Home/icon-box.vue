<template>
    <!-- Icon Box -->
    <div class="themesFlat">
        <div class="container">
            <div class="line-bt py-20">
                <div dir="ltr" class="swiper tf-swiper" data-preview="4" data-tablet="3" data-mobile-sm="2"
                    data-mobile="1" data-space-lg="48" data-space-md="30" data-space="15" data-pagination="1"
                    data-pagination-sm="2" data-pagination-md="3" data-pagination-lg="4">
                    <div class="swiper-wrapper">
                        <!-- item 1 -->
                        <div class="swiper-slide">
                            <div class="box_icon--V02 style_2 border-0 wow fadeInLeft">
                                <span class="icon">
                                    <i class="icon-box"></i>
                                </span>
                                <div class="content">
                                    <h5 class="title">Free Shipping</h5>
                                    <p class="text">Enjoy free shipping on all orders</p>
                                </div>
                            </div>
                        </div>
                        <!-- item 2 -->
                        <div class="swiper-slide">
                            <div class="box_icon--V02 style_2 border-0 wow fadeInLeft" data-wow-delay="0.1s">
                                <span class="icon">
                                    <i class="icon-credit-card"></i>
                                </span>
                                <div class="content">
                                    <h5 class="title">Secured Payment</h5>
                                    <p class="text">Secured payment</p>
                                </div>
                            </div>
                        </div>
                        <!-- item 3 -->
                        <div class="swiper-slide">
                            <div class="box_icon--V02 style_2 border-0 wow fadeInLeft" data-wow-delay="0.2s">
                                <span class="icon">
                                    <i class="icon-return"></i>
                                </span>
                                <div class="content">
                                    <h5 class="title">14 - Days Return</h5>
                                    <p class="text">Free return in 14 days</p>
                                </div>
                            </div>
                        </div>
                        <!-- item 4 -->
                        <div class="swiper-slide">
                            <div class="box_icon--V02 style_2 border-0 wow fadeInLeft" data-wow-delay="0.3s">
                                <span class="icon">
                                    <i class="icon-headphone"></i>
                                </span>
                                <div class="content">
                                    <h5 class="title">Premium Support</h5>
                                    <p class="text">Enjoy our support 24/7</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="sw-dot-default tf-sw-pagination"></div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Icon Box -->
</template>

<script>
import { onMounted } from 'vue';
import Swiper from 'swiper';

export default {
    name: 'IconBox',
    setup() {
        onMounted(() => {
            const swiper = new Swiper('.themesFlat .tf-swiper', {
                slidesPerView: 4,
                spaceBetween: 48,
                pagination: {
                    el: '.tf-sw-pagination',
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
                        spaceBetween: 48,
                    },
                },
            });
        });
    }
}
</script>