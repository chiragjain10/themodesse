<template>
    <section class="banner banner-background parallax text-center" 
        :data-option="bannerData.parallaxOption"
        :data-image-src="bannerData.backgroundImage" 
        :style="{ backgroundColor: bannerData.backgroundColor }">
        <div class="container">
            <div class="banner-content appear-animate"
                :data-animation-options="bannerData.animationOptions">
                <h4 class="banner-subtitle text-white font-weight-bold ls-l" v-html="bannerData.subtitle"></h4>
                <h3 class="banner-title font-weight-bold text-white">{{ bannerData.title }}</h3>
                <p class="text-white ls-s">{{ bannerData.description }}</p>
                <RouterLink :to="bannerData.buttonLink" class="btn btn-primary btn-rounded btn-icon-right">
                    {{ bannerData.buttonText }}<i class="d-icon-arrow-right"></i>
                </RouterLink>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getData } from '@/stores/getApi';

const bannerData = ref({
    parallaxOption: "{'offset': -60}",
    backgroundImage: "/src/assets/images/demos/demo1/parallax.jpg",
    backgroundColor: "#2d2f33",
    animationOptions: "{'name': 'blurIn', 'duration': '1s', 'delay': '.2s'}",
    subtitle: "Extra<span class='d-inline-block label-star bg-dark text-primary ml-4 mr-2'>30% Off</span>Online",
    title: "Summer Season Sale",
    description: "Free shipping on orders over ₹999",
    buttonText: "Shop Now",
    buttonLink: "/shop"
});

onMounted(async () => {
    try {
        const response = await getData('/api/home/banner2');
        if (response.banner) {
            bannerData.value = {
                ...bannerData.value,
                ...response.banner,
                // Ensure these fields are always present with defaults
                parallaxOption: response.banner.parallaxOption || "{'offset': -60}",
                animationOptions: response.banner.animationOptions || "{'name': 'blurIn', 'duration': '1s', 'delay': '.2s'}",
                buttonText: response.banner.buttonText || "Shop Now",
                buttonLink: response.banner.buttonLink || "/shop"
            };
        }
    } catch (error) {
        console.error('Error loading banner data:', error);
    }
});
</script>

<style scoped>
.banner {
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 5rem 0;
}

.banner-content {
    position: relative;
    z-index: 1;
}

.label-star {
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 1.2rem;
}

.btn-icon-right i {
    margin-left: 0.5rem;
}

/* Parallax effect */
.parallax {
    background-attachment: fixed;
}

/* Responsive adjustments */
@media (max-width: 767px) {
    .banner {
        padding: 3rem 0;
    }
    
    .banner-title {
        font-size: 1.8rem;
    }
    
    .banner-subtitle {
        font-size: 1.2rem;
    }
}
</style>