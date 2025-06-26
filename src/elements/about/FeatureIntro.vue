<template>
    <section class="flat-spacing-3 feature-intro">
        <div class="container">
            <div class="row flex-wrap-reverse">
                <div class="col-xxl-5 offset-xxl-1 col-md-6 d-flex align-items-center">
                    <div class="text-content">
                        <h2 class="feature-title">WELCOME TO MODESSE</h2>
                        <p class="feature-subtitle">
                            Discover timeless elegance and effortless comfort. At Modesse, every collection is crafted to empower your individuality and celebrate your unique journey. Our pieces are designed to move with you, offering sophistication and ease for every moment. Experience fashion that feels as good as it looks—made for you, made to last.
                        </p>
                        <RouterLink to="/shop" class="cta-btn tf-btn type-large">
                            explore our collections
                            <i class="icon-arrow-right-2 fs-24"> </i>
                        </RouterLink>
                    </div>
                </div>
                <div class="col-xxl-5 col-md-6">
                    <div class="visual-content mb-xl-0">
                        <img :src="banner14" alt="Modesse Products" class="lazyload img-visual">
                        <div class="brand-box">
                            <img :src="banner14" alt="Featured Product" class="lazyload">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import banner14 from '@/assets/images/banner/product1.webp'
</script> 