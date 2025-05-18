<template>
    <section class="blog-post-wrapper mt-6 mt-md-10 pt-7 appear-animate"
        data-animation-options="{'name': 'fadeIn', 'duration': '1s'}">
        <div class="container">
            <h2 class="title title-center">Featured Articles</h2>
            <div v-if="!loading" class="owl-carousel owl-theme post-slider row cols-lg-3 cols-sm-2 cols-1" 
                data-owl-options="{
                    'nav': false,
                    'dots': true,
                    'margin': 20,
                    'responsive': {
                        '0': { 'items': 1 },
                        '576': { 'items': 2 },
                        '992': { 'items': 3, 'dots': false }
                    }
                }">
                <div class="blog-post mb-4" v-for="blog in blogs" :key="blog.id">
                    <article class="post post-frame overlay-zoom">
                        <figure class="post-media">
                            <RouterLink :to="`/blog/${blog.slug}`">
                                <img :src="blog.image" :alt="blog.title" width="340" height="206"
                                    :style="{ backgroundColor: blog.bgColor }" />
                            </RouterLink>
                            <div class="post-calendar">
                                <span class="post-day">{{ formatDate(blog.created_at, 'DD') }}</span>
                                <span class="post-month">{{ formatDate(blog.created_at, 'MMM') }}</span>
                            </div>
                        </figure>
                        <div class="post-details">
                            <h4 class="post-title">
                                <RouterLink :to="`/blog/${blog.slug}`">{{ blog.title }}</RouterLink>
                            </h4>
                            <p class="post-content">{{ blog.excerpt }}</p>
                            <RouterLink :to="`/blog/${blog.slug}`" class="btn btn-primary btn-link btn-underline">
                                Read More<i class="d-icon-arrow-right"></i>
                            </RouterLink>
                        </div>
                    </article>
                </div>
            </div>

            <!-- Loading Skeleton -->
            <div v-else class="row">
                <div class="col-lg-4 col-sm-6 mb-4" v-for="n in 3" :key="n">
                    <div class="blog-post shimmer-loader">
                        <div class="skeleton-img"></div>
                        <div class="skeleton-text mt-3"></div>
                        <div class="skeleton-text mt-2" style="width: 70%"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getData } from '@/stores/getApi';
import dayjs from 'dayjs';

const blogs = ref([]);
const loading = ref(true);

// Temporary data until API is ready
const tempBlogs = [
    {
        id: 1,
        title: "The Healing Power of Gemstones",
        slug: "healing-power-gemstones",
        image: "/src/assets/images/blog/frame/0.jpg",
        bgColor: "#919fbc",
        excerpt: "Discover how different gemstones can help balance your energy and promote healing...",
        created_at: "2024-03-19"
    },
    {
        id: 2,
        title: "Understanding Rudraksha Benefits",
        slug: "rudraksha-benefits",
        image: "/src/assets/images/blog/frame/0.jpg",
        bgColor: "#e5e6e6",
        excerpt: "Learn about the spiritual and physical benefits of wearing Rudraksha beads...",
        created_at: "2024-03-18"
    },
    {
        id: 3,
        title: "Guide to Birthstones",
        slug: "birthstone-guide",
        image: "/src/assets/images/blog/frame/0.jpg",
        bgColor: "#eaeef1",
        excerpt: "Find your perfect birthstone and understand its significance in your life...",
        created_at: "2024-03-17"
    }
];

const formatDate = (date, format) => {
    return dayjs(date).format(format);
};

onMounted(async () => {
    try {
        // When API is ready, uncomment this:
        // const response = await getData('/api/home/blogs');
        // blogs.value = response.blogs || [];
        
        // Temporary: using static data
        blogs.value = tempBlogs;
    } catch (error) {
        console.error('Error loading blogs:', error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.blog-post {
    position: relative;
    transition: all 0.3s ease;
}

.post-media {
    position: relative;
    overflow: hidden;
}

.post-media img {
    transition: transform 0.3s ease;
}

.overlay-zoom:hover img {
    transform: scale(1.1);
}

.post-calendar {
    position: absolute;
    top: 1rem;
    left: 1rem;
    background: #fff;
    padding: 0.5rem;
    text-align: center;
    border-radius: 4px;
}

.post-day {
    display: block;
    font-size: 1.2rem;
    font-weight: 600;
    color: #c96;
}

.post-month {
    display: block;
    font-size: 0.9rem;
    color: #666;
}

.post-details {
    padding: 1.5rem;
    background: #fff;
}

.post-title {
    font-size: 1.2rem;
    margin-bottom: 1rem;
}

.post-title a {
    color: #333;
    transition: color 0.3s ease;
}

.post-title a:hover {
    color: #c96;
}

.post-content {
    color: #666;
    margin-bottom: 1rem;
    line-height: 1.6;
}

.btn-link {
    color: #c96;
    text-decoration: none;
}

.btn-link:hover {
    text-decoration: underline;
}

/* Loading Skeleton */
.shimmer-loader {
    background: #f6f7f8;
    border-radius: 4px;
    overflow: hidden;
}

.skeleton-img {
    height: 200px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

.skeleton-text {
    height: 20px;
    margin: 10px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
</style>