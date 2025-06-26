<template>
    <div class="flat-spacing-5 bg-linear">
        <div class="container">
            <div class="tf-sw-thumbs tes_thumb">
                <div class="swiper sw-thumb sw-tes-thumb">
                    <div class="swiper-wrapper">
                        <div v-for="testimonial in testimonials" :key="testimonial.id" class="swiper-slide">
                            <div class="image">
                                <img :src="testimonial.image" :alt="testimonial.name" class="lazyload">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="swiper sw-main-thumb sw-tes">
                    <div class="swiper-wrapper">
                        <div v-for="testimonial in testimonials" :key="testimonial.id" class="swiper-slide">
                            <h3 class="tes-text">
                                "{{ testimonial.text }}"
                            </h3>
                            <div class="tes-author">
                                <h5 class="name">{{ testimonial.name }}</h5>
                                <p class="duty">{{ testimonial.role }}</p>
                            </div>
                        </div>
                    </div>
                    <div class="sw-group-pagination">
                        <div class="pagination-tes prev-thumb">
                            <i class="icon-arrow-left"></i>
                        </div>
                        <div class="pagination-tes next-thumb">
                            <i class="icon-arrow-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swiper from 'swiper'

import logoimage from '/src/assets/images/banner/themodesse.jpg'

const testimonials = ref([
    {
        id: 1,
        name: 'Priya Patel',
        role: 'Fashion Blogger',
        image: logoimage,
        text: 'The Modesse pieces have become my wardrobe essentials. They move with me, breathe with me, and make me feel like my most authentic self. The quality and comfort are unmatched!'
    },
    {
        id: 2,
        name: 'Ananya Singh',
        role: 'Sustainable Fashion Advocate',
        image: logoimage,
        text: 'I love how The Modesse creates timeless pieces that don\'t chase trends. Their commitment to sustainable fashion and quality craftsmanship is truly inspiring.'
    }
])

onMounted(() => {
    new Swiper('.sw-tes-thumb', {
        slidesPerView: 2,
        spaceBetween: 20,
        watchSlidesProgress: true
    })

    new Swiper('.sw-tes', {
        slidesPerView: 1,
        spaceBetween: 30,
        navigation: {
            nextEl: '.next-thumb',
            prevEl: '.prev-thumb'
        },
        thumbs: {
            swiper: '.sw-tes-thumb'
        }
    })
})

</script>