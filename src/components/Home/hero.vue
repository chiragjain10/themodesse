<template>
    <section class="intro-section" style="position: static;">
        <div class="owl-carousel owl-theme row owl-dot-inner owl-dot-white intro-slider animation-slider cols-1 gutter-no"
            data-owl-options="{
                        'nav': false,
                        'dots': true,
                        'loop': false,
                        'items': 1,
                        'autoplay': false,
                        'autoplayTimeout': 8000
                    }">
            <div class="banner banner-fixed intro-slide1" style="background-color: #46b2e8;">
                <figure>
                    <img src="/src/assets/images/slides/banner2.jpg" alt="intro-banner" width="1903"
                        height="630" style="background-color: #34ace5;" />
                </figure>
                <div class="container">
                    <div class="banner-content y-50">
                        <h4 class="banner-subtitle font-weight-bold ls-l">
                            <span class="d-inline-block slide-animate text-white"
                                data-animation-options="{'name': 'fadeInRightShorter', 'duration': '1s', 'delay': '.2s'}">Buy
                                2 Gemstones</span>
                            <span class="d-inline-block label-star bg-white text-primary slide-animate"
                                data-animation-options="{'name': 'fadeInRightShorter', 'duration': '1s', 'delay': '.4s'}">1 Absolutely
                                Free</span>
                        </h4>
                        <h2 class="banner-title font-weight-bold text-white lh-1 ls-md slide-animate"
                            data-animation-options="{'name': 'fadeInUpShorter', 'duration': '1.2s', 'delay': '1s'}">
                            Elegant Stones,</h2>
                        <h3 class="font-weight-normal lh-1 ls-l text-white slide-animate"
                            data-animation-options="{'name': 'fadeInUpShorter', 'duration': '1.2s', 'delay': '1s'}">
                            Timeless Beauty</h3>
                        <p class="slide-animate text-white ls-s mb-7"
                            data-animation-options="{'name': 'fadeInUpShorter', 'duration': '1.2s', 'delay': '1s'}">
                            Enjoy free shipping on all orders above ₹7,999. Explore healing crystals, <br /> certified gems & spiritual jewelry – only from trusted sources.</p>
                        <a href="shop.html" class="btn btn-dark btn-rounded slide-animate"
                            data-animation-options="{'name': 'fadeInUpShorter', 'duration': '1s', 'delay': '1.8s'}">Shop
                            Now<i class="d-icon-arrow-right"></i></a>
                    </div>
                </div>
            </div>
            <div class="banner banner-fixed intro-slide2" style="background-color: #dddee0;">
                <figure>
                    <img src="/src/assets/images/slides/ruby.jpg" alt="intro-banner" width="1903"
                        height="630" style="background-color: #d8d9d9;" />
                </figure>
                <div class="container">
                    <div class="banner-content y-50 ml-auto text-right">
                        <h4 class="banner-subtitle ls-s mb-1 slide-animate"
                            data-animation-options="{'name': 'fadeInUp', 'duration': '.7s'}"><span
                                class="d-block text-uppercase mb-2 text-white">Something Magical is</span><strong
                                class="font-weight-semi-bold ls-m text-white">Coming</strong></h4>
                        <h2 class="lh-1 ls-l mb-2 d-inline-block font-weight-bold text-primary slide-animate"
                            data-animation-options="{'name': 'fadeInRight', 'duration': '1.2s', 'delay': '.5s'}">
                            The GemAura Festival</h2>
                        <p class="slide-animate font-primary ls-s mb-4 text-white"
                            data-animation-options="{'name': 'fadeInUp', 'duration': '1s', 'delay': '1.2s'}">
                            Up to 70% off on all products <br />online &amp; Free Shipping over $90</p>
                        <a href="shop.html" class="btn btn-dark btn-rounded slide-animate"
                            data-animation-options="{'name': 'fadeInUp', 'duration': '1s', 'delay': '1.4s'}">Shop
                            Now<i class="d-icon-arrow-right"></i></a>
                    </div>
                </div>
            </div>
            <div class="banner banner-fixed video-banner intro-slide3" style="background-color: #dddee0;">
                <!-- <figure>
                    <video src="/src/assets/video/memory-of-a-woman.mp4" width="1903" height="630"></video>
                </figure> -->
                <figure>
                    <img src="/src/assets/images/slides/Ruby_banner.jpeg" alt="intro-banner" width="1903"
                        height="630" style="background-color: #d8d9d9;" />
                </figure>
                <div class="container">
                    <div class="banner-content x-50 y-50 text-center">
                        <h4 class="banner-subtitle text-white text-uppercase mb-3 ls-normal slide-animate"
                            data-animation-options="{'name': 'fadeIn', 'duration': '.7s'}">100% Certified & Energized Stones
                        </h4>
                        <h2 class="banner-title mb-3 text-white font-weight-bold text-uppercase ls-m slide-animate"
                            data-animation-options="{'name': 'fadeInUp', 'duration': '.7s', 'delay': '.5s'}">
                            Authenticity You Can Feel</h2>
                        <p class="slide-animate mb-7 text-white ls-s font-primary "
                            data-animation-options="{'name': 'fadeInUp', 'duration': '1s', 'delay': '.8s'}">
                            Each gem is lab-certified, Vedic-energized, and astrologically recommended. <br/> Trusted by over 50,000+ happy souls across India. Begin your transformation today.</p>
                        <a href="shop.html" class="btn btn-dark btn-rounded slide-animate mb-1"
                            data-animation-options="{'name': 'fadeInLeft', 'duration': '1s', 'delay': '1.5s'}">Shop
                            Now<i class="d-icon-arrow-right"></i></a>
                    </div>
                </div>
            </div>
        </div>

        <div class="container mt-6 appear-animate">
            <div class="service-list">
                <div class="owl-carousel owl-theme row cols-lg-3 cols-sm-2 cols-1" data-owl-options="{
                                    'items': 3,
                                    'nav': false,
                                    'dots': false,
                                    'loop': true,
                                    'autoplay': false,
                                    'autoplayTimeout': 5000,
                                    'responsive': {
                                        '0': {
                                            'items': 1
                                        },
                                        '576': {
                                            'items': 2
                                        },
                                        '768': {
                                            'items': 3,
                                            'loop': false
                                        }
                                    }
                                }">
                    <div class="icon-box icon-box-side icon-box1 appear-animate" data-animation-options="{
                                        'name': 'fadeInRightShorter',
                                        'delay': '.3s'
                                    }">
                        <i class="icon-box-icon d-icon-truck"></i>
                        <div class="icon-box-content">
                            <h4 class="icon-box-title text-capitalize ls-normal lh-1">Free Shipping &amp;
                                Return
                            </h4>
                            <p class="ls-s lh-1">Free shipping on orders over $99</p>
                        </div>
                    </div>

                    <div class="icon-box icon-box-side icon-box2 appear-animate" data-animation-options="{
                                        'name': 'fadeInRightShorter',
                                        'delay': '.4s'
                                    }">
                        <i class="icon-box-icon d-icon-service"></i>
                        <div class="icon-box-content">
                            <h4 class="icon-box-title text-capitalize ls-normal lh-1">Customer Support 24/7
                            </h4>
                            <p class="ls-s lh-1">Instant access to perfect support</p>
                        </div>
                    </div>

                    <div class="icon-box icon-box-side icon-box3 appear-animate" data-animation-options="{
                                        'name': 'fadeInRightShorter',
                                        'delay': '.5s'
                                    }">
                        <i class="icon-box-icon d-icon-secure"></i>
                        <div class="icon-box-content">
                            <h4 class="icon-box-title text-capitalize ls-normal lh-1">100% Secure Payment
                            </h4>
                            <p class="ls-s lh-1">We ensure secure payment!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
// Home page ke liye agar koi JavaScript logic hai toh yahaan
</script>

<style scoped>
/* Home page ke liye specific styles yahaan */
</style>