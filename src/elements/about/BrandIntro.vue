<template>
    <section class="s-brand-intro flat-spacing-6 pb-0">
        <div class="container">
            <div class="row d-flex align-items-center">
                <div class="col-md-6">
                    <div class="brand-intro_image mb-md-0">
                        <img :src="banner14" alt="BS Glow Skincare" class="lazyload intro-photo">
                        <div class="brand-box">
                            <img :src="banner14" alt="Featured Product" class="lazyload">
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <h6 class="brand-intro_subtitle">we are the modesse</h6>
                    <h2 class="brand-intro_title">
                        We believe in the power of simplicity.
                    </h2>
                    <p class="brand-intro_text">
                        In clean cuts, quiet colors, and fabric that speaks for itself. We believe in slowing down.
                        In making with intention, wearing with ease, and consuming with care. We create not to impress,
                        but to express. Not to overwhelm, but to offer clarity.
                    </p>
                    <span class="br-line"></span>
                    <div class="brand-intro_author flex-sm-nowrap">
                        <div class="author-info">
                            <img :src="logoimage" alt="Author" class="img-author">
                            <div class="info">
                                <h5 class="name"><a href="#" class="link">Samaruddhi Jain</a></h5>
                                <span class="duty text-main-4">Founder of The Modesse</span>
                            </div>
                        </div>
                        <div class="author-signature">
                            <img :src="logoimage" alt="Signature">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import banner14 from '@/assets/images/banner/product1.webp'
import logoimage from '@/assets/images/banner/themodesse.jpg'
</script> 