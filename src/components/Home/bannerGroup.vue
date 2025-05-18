<template>
    <section class="banner-group mt-4">
        <div>
            <h2 class="title d-none">Banner Group</h2>

            <div class="row justify-content-center p-0">
                <div v-for="banner in banners" :key="banner.id"
                    :class="['col-lg-4', 'col-sm-6', 'mb-4', 'p-1', banner.orderClass]">
                    <div class="banner"
                        :class="[`banner-${banner.id}`, 'overlay-zoom', 'banner-fixed', 'banner-radius', 'content-middle', 'appear-animate']"
                        :data-animation-options="banner.animationOptions">
                        <figure>
                            <img :src="banner.image" :alt="banner.title" :width="banner.width" :height="banner.height"
                                :style="{ backgroundColor: banner.bgColor }" />
                        </figure>
                        <div class="banner-content" :class="banner.contentClass">
                            <template v-if="banner.id === 2">
                                <div class="mr-auto mb-4 mb-md-0">
                                    <h4 class="banner-subtitle text-white" v-html="banner.subtitle"></h4>
                                    <h3 class="banner-title text-light font-weight-bold lh-1 mb-0">{{ banner.title }}
                                    </h3>
                                </div>
                                <RouterLink :to="banner.link"
                                    class="btn btn-primary btn-outline btn-rounded font-weight-bold text-white">
                                    {{ banner.buttonText }}<i class="d-icon-arrow-right"></i>
                                </RouterLink>
                            </template>
                            <template v-else>
                                <h3 class="banner-title text-white mb-1">{{ banner.title }}</h3>
                                <h4 class="banner-subtitle text-uppercase font-weight-normal text-white"
                                    v-html="banner.subtitle"></h4>
                                <hr class="banner-divider">
                                <RouterLink :to="banner.link" class="btn btn-white btn-link btn-underline">
                                    {{ banner.buttonText }}<i class="d-icon-arrow-right"></i>
                                </RouterLink>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';

const banners = ref([
    {
        id: 1,
        title: "Premium Rubies",
        subtitle: "Starting at ₹2,999",
        image: "https://wjv.co.nz/wp-content/uploads/2021/07/july-birthstone-ruby-e1626254897111.png",
        width: 380,
        height: 207,
        bgColor: "#836648",               // deep ruby tone
        link: "/category/gemstones/ruby",   // or whatever route you use
        buttonText: "Explore Rubies",
        orderClass: "",
        animationOptions: "{'name':'fadeInLeftShorter','duration':'1s','delay':'.2s'}",
        contentClass: ""
    },
    {
        id: 2,
        title: "Blue Sapphire",
        subtitle: "Save 15% on<br><span class='ls-l'>May Emeralds</span>",
        image: "https://gemmartjaipur.com/wp-content/uploads/2025/01/DSC_2340-scaled.jpg",
        width: 350,
        height: 177,
        bgColor: "#1e1e1e",
        link: "/category/birthstones",
        buttonText: "Shop Birthstones",
        orderClass: "order-lg-auto order-sm-last",
        animationOptions: "{'name':'fadeIn','duration':'1s','delay':'.2s'}",
        contentClass: "d-flex align-items-center w-100 text-left"
    },
    {
        id: 3,
        title: "5 Mukhi Gemstones",
        subtitle: "Flat 20% Off",
        image: "https://rudradhyay.com/cdn/shop/files/5-1-4_1200x1200.jpg?v=1697017669",
        width: 380,
        height: 207,
        bgColor: "#97928b",                 // earthy green
        link: "/category/chakra-crystals",
        buttonText: "Balance Energy",
        orderClass: "",
        animationOptions: "{'name':'fadeInRightShorter','duration':'1s','delay':'.2s'}",
        contentClass: ""
    }
]);
</script>

<style scoped>
.banner {
    position: relative;
    overflow: hidden;
}

.banner-content {
    position: absolute;
    /* top: 50%;
    left: 50%; */
    transform: translate(-50%, -50%);
    text-align: center;
    width: 100%;
    padding: 0 2rem;
}

.banner-divider {
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    margin: 1rem 0;
}

.btn-link {
    text-decoration: none;
}

.btn-link:hover {
    text-decoration: underline;
}

.overlay-zoom img {
    transition: transform 0.3s ease;
}

.overlay-zoom:hover img {
    transform: scale(1.1);
}

.banner figure img{
    height: 400px;
}
</style>