<template>
    <div class="blog-detail-bg">
        <div class="container">
            <div class="blog-main">
                <!-- Left Section -->
                <div class="blog-left">
                    <div v-if="blog && blog.id" class="blog-card">
                        <img :src="blog.image" :alt="blog.title" class="blog-main-img" height="300" />
                        <div class="blog-meta text-muted">
                            <span class="blog-date">{{ blog.date }}</span>
                            <span class="blog-rating">
                                <span v-for="n in 5" :key="n" class="star"
                                    :class="{ filled: n <= blog.rating }">★</span>
                                <span class="rating-num">({{ blog.rating }})</span>
                            </span>
                        </div>
                        <h1 class="blog-title">{{ blog.title }}</h1>
                        <div class="blog-content" v-html="blog.excerpt"></div>
                        <div class="blog-nav-btns">
                            <button class="blog-nav-btn outline" :disabled="!prevBlog" @click="goToBlog(prevBlog)">←
                                Prev</button>
                            <button class="blog-nav-btn outline" :disabled="!nextBlog" @click="goToBlog(nextBlog)">Next
                                →</button>
                        </div>
                        <div class="blog-comments">
                            <h3>Leave a Comment</h3>
                            <textarea v-model="comment" placeholder="Write your comment..."
                                class="comment-box"></textarea>
                            <button class="comment-submit">Submit</button>
                        </div>
                    </div>
                    <div v-else class="blog-card blog-notfound">
                        <h2 v-if="blogs.length === 0">Loading...</h2>
                        <h2 v-else>Blog not found.</h2>
                    </div>
                </div>
                <!-- Right Section -->
                <aside class="blog-right bg-white border p-5">
                    <div class="blog-search-card">
                        <span class="search-icon">
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="9" cy="9" r="7" stroke="#bfa77a" stroke-width="2"/>
                                <line x1="14.4142" y1="14" x2="18" y2="17.5858" stroke="#bfa77a" stroke-width="2" stroke-linecap="round"/>
                            </svg>
                        </span>
                        <input
                            v-model="search"
                            type="text"
                            placeholder="Search blogs..."
                            class="blog-search-input"
                        />
                    </div>
                    <div class="recent-blogs-card">
                        <h4>Recent Blogs ({{ filteredRecentBlogs.length }})</h4>
                        <ul>
                            <li v-for="recent in filteredRecentBlogs" :key="recent.id">
                                <RouterLink :to="`/blogs/${recent.id}`" class="recent-link">{{ recent.title }}
                                </RouterLink>
                            </li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';

const blogs = ref([]);
const blog = ref({});
const recentBlogs = ref([]);
const route = useRoute();
const router = useRouter();
const comment = ref('');
const search = ref('');

onMounted(async () => {
  const data = await import('./BlogBackup.json');
  blogs.value = data.default;
  setBlogById(route.params.id);
  recentBlogs.value = blogs.value.slice(0, 5);
});

function setBlogById(id) {
  blog.value = blogs.value.find(b => b.id == id) || {};
}

function goToBlog(target) {
  if (!target) return;
  router.push(`/blogs/${target.id}`);
}

const prevBlog = computed(() => {
  const idx = blogs.value.findIndex(b => b.id == blog.value.id);
  return idx > 0 ? blogs.value[idx - 1] : null;
});
const nextBlog = computed(() => {
  const idx = blogs.value.findIndex(b => b.id == blog.value.id);
  return idx < blogs.value.length - 1 ? blogs.value[idx + 1] : null;
});

watch(() => route.params.id, (newId) => {
  setBlogById(newId);
});

const filteredRecentBlogs = computed(() => {
  let arr = blogs.value;
  
  // Exclude the current blog from recent blogs
  arr = arr.filter(b => b && b.id && b.id != blog.value.id);
  
  if (search.value.trim()) {
    const q = search.value.trim().toLowerCase();
    arr = arr.filter(b =>
      b && b.id && (
        b.title.toLowerCase().includes(q) ||
        (b.excerpt && b.excerpt.toLowerCase().includes(q))
      )
    );
  }
  
  const result = arr.filter(b => b && b.id); // Remove slice limit temporarily
  
  return result;
});
</script>

<style scoped>
.blog-detail-bg {
    background: #faf9f6;
    min-height: 100vh;
    padding: 48px 0 64px 0;
}

.blog-main {
    display: flex;
    gap: 48px;
    align-items: flex-start;
}

.blog-left {
    flex: 2;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.blog-card {
    background: #fff;
    border-radius: 18px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
    border: 1px solid #ececec;
    padding: 20px;
    width: 100%;
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.blog-main-img {
    width: 100%;
    height: 500px;
    object-fit: cover;
    border-radius: 12px;
    margin: 0 auto 24px auto;
    display: block;
}

.blog-meta {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-bottom: 18px;
    font-size: 1rem;
    font-weight: 500;
}

.blog-rating .star {
    color: #e2b04a;
    font-size: 1.1em;
    margin-right: 2px;
}

.blog-rating .star.filled {
    color: #e2b04a;
}

.rating-num {
    color: #aaa;
    font-size: 0.98em;
    margin-left: 4px;
}

.blog-title {
    font-size: 1.6rem;
    margin-bottom: 20px;
    line-height: 1.3;
    font-weight: 800;
    letter-spacing: -0.7px;
}

.blog-content {
    font-size: 1.15rem;
    color: #3a3a3a;
    line-height: 1.75;
    margin-bottom: 40px;
    word-break: break-word;
}

.blog-nav-btns {
    display: flex;
    gap: 20px;
    margin-bottom: 36px;
}

.blog-nav-btn {
    background: #fff;
    color: #72381C;
    border: 1.5px solid #72381C;
    border-radius: 8px;
    padding: 10px 28px;
    font-size: 1.08rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s, color 0.18s, border 0.18s, transform 0.18s;
    box-shadow: 0 1px 4px rgba(114, 56, 28, 0.04);
}

.blog-nav-btn:disabled {
    background: #f3f3f3;
    color: #bbb;
    border: 1.5px solid #ececec;
    cursor: not-allowed;
}

.blog-nav-btn:not(:disabled):hover {
    background: #72381C;
    color: #fff;
    border: 1.5px solid #72381C;
    transform: translateY(-2px) scale(1.04);
}

.blog-comments {
    width: 100%;
    margin-top: 24px;
    border-top: 1px solid #f0f0f0;
    padding-top: 24px;
}

.blog-comments h3 {
    font-size: 1.13rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: #72381C;
}

.comment-box {
    width: 100%;
    min-height: 70px;
    border-radius: 8px;
    border: 1px solid #ececec;
    padding: 12px;
    font-size: 1.05rem;
    margin-bottom: 12px;
    resize: vertical;
    background: #faf9f6;
}

.comment-submit {
    background: #72381C;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 28px;
    font-size: 1.05rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s, transform 0.18s;
}

.comment-submit:hover {
    background: #4e250f;
    transform: translateY(-2px) scale(1.04);
}

.blog-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 260px;
    max-width: 40%;
}

.blog-search-card {
    display: flex;
    align-items: center;
    background: #faf9f6;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(191, 167, 122, 0.07);
    border: 1.5px solid #ececec;
    padding: 10px 16px;
    margin-bottom: 18px;
    position: relative;
}

.search-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    color: #bfa77a;
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
}

.blog-search-input {
    flex: 1;
    border-radius: 8px;
    border: none !important;
    outline: none !important;
    padding: 10px 14px 10px 38px;
    font-size: 1.05rem;
    background: transparent;
    color: #3a3a3a;
    box-shadow: none;
    transition: border 0.18s, box-shadow 0.18s;
}

.recent-blogs-card h4 {
    font-size: 1.13rem;
    font-weight: 700;
    margin-bottom: 12px;
}

.recent-blogs-card ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.recent-blogs-card li {
    margin-bottom: 12px;
    position: relative;
    padding-left: 18px;
}

.recent-blogs-card li::before {
    content: '•';
    position: absolute;
    left: 0;
    top: 0.1em;
    color: #bfa77a;
    font-size: 1.1em;
    line-height: 1;
}

.recent-link {
    color: #72381C;
    text-decoration: none;
    transition: color 0.18s;
    font-weight: 500;
}

.recent-link:hover {
    color: #4e250f;
    text-decoration: underline;
}

@media (max-width: 900px) {
    .blog-main {
        flex-direction: column;
        gap: 32px;
    }

    .blog-right {
        max-width: 100%;
        min-width: 0;
        padding: 0;
    }

    .blog-left {
        padding: 0;
    }
}

@media (max-width: 600px) {
    .blog-detail-container {
        padding: 0 2px;
    }

    .blog-main-img {
        max-width: 100%;
    }

    .blog-title {
        font-size: 1.2rem;
    }

    .blog-card {
        padding: 18px 6px 16px 6px;
        border-radius: 10px;
    }

    .blog-search-card,
    .recent-blogs-card {
        padding: 12px 6px 10px 6px;
        border-radius: 8px;
    }
}
</style>