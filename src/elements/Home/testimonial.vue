<template>
    <section class="themesFlat testimonials">
        <div class="flat-spacing-7 parallaxie" style='background-image: url(bg3);'>
            <div class="container">
                <div class="sect-top wow fadeInUp">
                    <h2 class="s-title font-2 text-white text-capitalize">
                        Customer <span class="fst-italic">Reviews</span>
                    </h2>
                    <div class="group-btn-slider style-white">
                        <div class="nav-prev-swiper tf-sw-nav">
                            <i class="icon-arrow-left"></i>
                        </div>
                        <div class="nav-next-swiper tf-sw-nav">
                            <i class="icon-arrow-right"></i>
                        </div>
                    </div>
                </div>
                <div class="swiper tf-swiper" data-preview="4" data-tablet="3" data-mobile-sm="2" data-mobile="1"
                    data-space-lg="30" data-space-md="20" data-space="15" data-pagination="1" data-pagination-sm="2"
                    data-pagination-md="3" data-pagination-lg="4">
                    <div class="swiper-wrapper">
                        <div class="swiper-slide" v-for="review in reviews" :key="review.id">
                            <div class="box_testimonial--V02 wow fadeInLeft">
                                <div class="box_testimonial-content">
                                    <div class="tes-head">
                                        <ul class="rate-wrap">
                                            <li v-for="star in 5" :key="star">
                                                <i :class="['icon-star', star <= review.rating ? 'text-star' : '']"></i>
                                            </li>
                                        </ul>
                                        <div class="author-info">
                                            <p class="name">{{ review.user.name }}</p>
                                            <p class="verify">
                                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                                                    xmlns="http://www.w3.org/2000/svg">
                                                    <g>
                                                        <path
                                                            d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14Z"
                                                            fill="#48B02C" />
                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                            d="M5.30268 8.96231L10.2357 4.02924C10.306 3.95923 10.4011 3.91992 10.5003 3.91992C10.5995 3.91992 10.6946 3.95923 10.7649 4.02924L11.2444 4.50877C11.3144 4.57902 11.3537 4.67416 11.3537 4.77334C11.3537 4.87251 11.3144 4.96765 11.2444 5.0379L6.30583 9.97097C6.23582 10.0393 6.14186 10.0776 6.04402 10.0776C5.94618 10.0776 5.85222 10.0393 5.78221 9.97097L5.30268 9.49145C5.23267 9.42119 5.19336 9.32606 5.19336 9.22688C5.19336 9.1277 5.23267 9.03256 5.30268 8.96231Z"
                                                            fill="white" />
                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                            d="M3.76447 5.95293L6.7684 8.96238C6.83841 9.03263 6.87772 9.12776 6.87772 9.22694C6.87772 9.32612 6.83841 9.42126 6.7684 9.49151L6.29439 9.96553C6.22413 10.0355 6.129 10.0748 6.02982 10.0748C5.93064 10.0748 5.8355 10.0355 5.76525 9.96553L2.7558 6.96159C2.68579 6.89134 2.64648 6.7962 2.64648 6.69702C2.64648 6.59784 2.68579 6.50271 2.7558 6.43246L3.23533 5.95844C3.30558 5.88843 3.40072 5.84912 3.4999 5.84912C3.59908 5.84912 3.69421 5.88292 3.76447 5.95293Z"
                                                            fill="white" />
                                                    </g>
                                                </svg>
                                                Verified
                                            </p>
                                        </div>
                                    </div>
                                    <div class="tes-text">
                                        <p class="text">{{ review.comment }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="sw-dot-default style-white tf-sw-pagination"></div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { watch, onUnmounted } from 'vue';
import Swiper from 'swiper';

const props = defineProps({
  reviews: {
    type: Array,
    required: true
  }
});

let swiper = null;

const initSwiper = () => {
  if (swiper) {
    swiper.destroy();
  }

  swiper = new Swiper('.testimonials .tf-swiper', {
    slidesPerView: 4,
    spaceBetween: 30,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.tf-sw-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.nav-next-swiper',
      prevEl: '.nav-prev-swiper',
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
        spaceBetween: 20,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
    },
  });
};

watch(() => props.reviews, (newVal) => {
  if (newVal && newVal.length > 0) {
    setTimeout(() => {
      initSwiper();
    }, 100);
  }
}, { immediate: true });

onUnmounted(() => {
  if (swiper) {
    swiper.destroy();
  }
});
</script>