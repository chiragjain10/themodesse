<template>
    <section class="home-blogs-section mt-5">
        <div class="container">
            <div class="blogs-header">
                <h3 class="s-title text-capitalize d-md-none ms-md-5 mb-0">Blogs</h3>
                <h1 class="s-title text-capitalize d-none d-md-block ms-md-5 mb-0">Blogs</h1>
                <div class="blogs-nav">
                    <button class="nav-btn" :disabled="currentSlide === 0" @click="prevSlide" aria-label="Previous">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M14 18L8 11L14 4" stroke="#bfa77a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                    <button class="nav-btn" :disabled="currentSlide === totalSlides - 1" @click="nextSlide" aria-label="Next">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M8 4L14 11L8 18" stroke="#bfa77a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    </button>
                </div>
            </div>
            <div class="home-blogs-slider">
                <div class="slider-track">
                    <div
                        v-for="blog in visibleBlogs"
                        :key="blog.id"
                        class="blog-card no-image"
                    >
                        <div class="blog-info">
                            <div class="blog-date">{{ formatDate(blog.date) }}</div>
                            <div class="blog-title">{{ blog.title }}</div>
                            <div class="blog-des">{{ getTruncatedContent(blog.content) }}</div>
                            <button class="read-more-btn" @click="router.push('/blog')">Read More</button>
                        </div>
                    </div>
                </div>
                <div>
                    
                </div>
                <div class="slider-dots">
                    <span
                        v-for="n in totalSlides"
                        :key="n"
                        class="dot"
                        :class="{ active: currentSlide === n - 1 }"
                        @click="goToSlide(n - 1)"
                    ></span>
                   
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
const blogs = ref([]);
const currentSlide = ref(0);
const blogsPerSlide = ref(3);
let interval = null;
const router = useRouter();

// Helper to truncate content to 3-4 lines (about 120 chars)
function getTruncatedContent(content) {
    if (!content) return '';
    if (content.length > 120) return content.slice(0, 120) + '...';
    return content;
}

function updateBlogsPerSlide() {
    if (window.innerWidth < 600) blogsPerSlide.value = 1;
    else if (window.innerWidth < 900) blogsPerSlide.value = 2;
    else blogsPerSlide.value = 3;
}

onMounted(async () => {
    const data = await import('../Blogs/BlogsData.json');
    blogs.value = data.default;
    updateBlogsPerSlide();
    window.addEventListener('resize', updateBlogsPerSlide);
    startAutoSlide();
});
onUnmounted(() => {
    stopAutoSlide();
    window.removeEventListener('resize', updateBlogsPerSlide);
});

const totalSlides = computed(() =>
    blogs.value.length ? Math.ceil(blogs.value.length / blogsPerSlide.value) : 1
);
const visibleBlogs = computed(() => {
    const start = currentSlide.value * blogsPerSlide.value;
    return blogs.value.slice(start, start + blogsPerSlide.value);
});
function goToSlide(idx) {
    currentSlide.value = idx;
    restartAutoSlide();
}
function nextSlide() {
    if (currentSlide.value < totalSlides.value - 1) currentSlide.value++;
    else currentSlide.value = 0;
    restartAutoSlide();
}
function prevSlide() {
    if (currentSlide.value > 0) currentSlide.value--;
    else currentSlide.value = totalSlides.value - 1;
    restartAutoSlide();
}
function startAutoSlide() {
    interval = setInterval(() => {
        if (currentSlide.value < totalSlides.value - 1) currentSlide.value++;
        else currentSlide.value = 0;
    }, 3500);
}
function stopAutoSlide() {
    if (interval) clearInterval(interval);
}
function restartAutoSlide() {
    stopAutoSlide();
    startAutoSlide();
}
function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}
</script>

<style scoped>
.home-blogs-section {
    width: 100%;
    padding: 0 0 48px 0;
    background: none;
}
.blogs-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
}
.blogs-title {
    font-size: 2rem;
    font-weight: 800;
    color: #2a2a2a;
    margin: 0;
}
.blogs-nav {
    display: flex;
    gap: 10px;
}
.nav-btn {
    background: #fff;
    border: 1.5px solid #bfa77a;
    border-radius: 50%;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.18s, border 0.18s, box-shadow 0.18s, transform 0.18s;
    box-shadow: 0 2px 8px rgba(191,167,122,0.07);
    padding: 0;
}
.nav-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    background: #f7f7f7;
}
.nav-btn:not(:disabled):hover {
    background: #ffe6b0;
    border-color: #bfa77a;
    transform: scale(1.08);
}
.home-blogs-slider {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.slider-track {
    display: flex;
    gap: 24px;
    width: 100%;
    justify-content: center;
    margin-bottom: 18px;
    transition: all 0.3s cubic-bezier(.4,1.4,.6,1);
}
.blog-card {
    background: #fff;
    border-radius: 14px;
    box-shadow: 0 2px 12px rgba(191, 167, 122, 0.07);
    border: 1px solid #ececec;
    width: 100%;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: hidden;
    transition: box-shadow 0.18s, transform 0.18s;
    text-decoration: none;
    /* Remove image height and padding for no-image version */
    min-height: 120px;
    justify-content: center;
}
.blog-card.no-image {
    padding: 32px 18px 28px 18px;
    align-items: flex-start;
}
.blog-card:hover {
    box-shadow: 0 6px 24px #ffe6b0cc;
    transform: translateY(-2px) scale(1.03);
}
/* Remove .blog-img styles since image is gone */
.blog-info {
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.blog-date {
    font-size: 0.98rem;
    color: #bfa77a;
    font-weight: 500;
    margin-bottom: 2px;
}
.blog-title {
    font-weight: 700;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    font-size: 1.18rem;
    color: #222;
}
.blog-des {
    color: #444;
    font-size: 1rem;
    margin: 8px 0 12px 0;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    min-height: 3.8em;
}
.read-more-btn {
    background: #222;
    color: #fff;
    font-weight: 600;
    padding: 0.35rem 1.1rem;
    border-radius: 2px;
    border: none;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.10);
    font-size: 0.98rem;
    margin-top: 2px;
}
.read-more-btn:hover {
    background: #fff;
    color: #222;
    border: 1px solid #222;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
}
.slider-dots {
    display: flex;
    gap: 10px;
    justify-content: center;
    align-items: center;
    margin-top: 2px;
}
.dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ececec;
    transition: background 0.18s, transform 0.18s;
    cursor: pointer;
    border: 1.5px solid #bfa77a;
}
.dot.active {
    background: #ffe6b0;
    transform: scale(1.18);
    border-color: #bfa77a;
}
@media (max-width: 900px) {
    .slider-track {
        gap: 12px;
        min-height: 120px;
    }
    .blog-card.no-image {
        padding: 22px 10px 18px 10px;
    }
}
@media (max-width: 600px) {
    .slider-track {
        flex-wrap: wrap;
        gap: 8px;
        min-height: 100px;
    }
    .blog-card.no-image {
        max-width: 100%;
        min-width: 0;
        flex: 1 1 100%;
        padding: 16px 6px 14px 10px;
    }
    .blogs-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    .blogs-title {
        font-size: 1.2rem;
    }
}
</style>