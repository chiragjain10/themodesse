<template>
    <section class="journal-hub-bg">
        <div class="flat-spacing-16 pb-0">
            <div class="container">
                <div class="page-title border-0">
                    <div class="breadcrumbs">
                        <ul class="bread-wrap mb-0">
                            <li><RouterLink to="/" class="text-main-4 link">Home</RouterLink></li>
                            <li class="br-line w-12 bg-main"></li>
                            <li>
                                <span class="text-main-4">Journals</span>
                            </li>
                        </ul>   
                    </div>
                </div>
            </div>
        </div>
        <div class="journal-hub-container">
            <div v-for="(blog, idx) in blogs" :key="blog.id" class="blog-row" :class="{ reverse: idx % 2 === 1 }">
                <div class="blog-content blog-card">
                    <h2 class="blog-heading">{{ blog.title }}</h2>
                    <p class="blog-excerpt" v-html="blog.excerpt"></p>
                    <RouterLink :to="`/blogs/${blog.id}`" class="tf-btn btn-fill-2 fw-medium animate-btn blog-btn">
                        Read More <span class="arrow">→</span>
                    </RouterLink>
                </div>
                <div class="blog-img-wrap blog-card">
                    <img :src="blog.image" :alt="blog.title" class="blog-img" />
                </div>
            </div>
        </div>
    </section>
    <Swatches />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import Swatches from '../Home/Swatches.vue';
const blogs = ref([]);

onMounted(async () => {
  const data = await import('../Blogs/BlogBackup.json');
  blogs.value = data.default;
});
</script>

<style scoped>
/***** Breadcrumb and Title Section *****/
.flat-spacing-16 {
    padding-top: 32px;
    padding-bottom: 0;
}
.page-title {
    margin-bottom: 0;
    border: none;
    background: none;
}
.breadcrumbs {
    margin-bottom: 0;
}
.bread-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    list-style: none;
    padding: 0;
    margin: 0;
}
.bread-wrap li {
    font-size: 1.05rem;
    color: #72381C;
    font-weight: 500;
}
.bread-wrap .link {
    color: #72381C;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.18s;
}
.bread-wrap .link:hover {
    color: #4e250f;
    text-decoration: underline;
}
.br-line {
    width: 16px;
    height: 2px;
    background: #72381C;
    border-radius: 2px;
    display: inline-block;
    margin: 0 6px;
}
.w-12 {
    width: 12px;
}
.bg-main {
    background: #72381C;
}
.text-main-4 {
    color: #72381C;
}
/***** End Breadcrumb and Title Section *****/

.journal-hub-bg {
    /* Cream color with a subtle SVG dot pattern overlay for texture */
    background-color: #fdf6ee;
    background-image: url("https://www.transparenttextures.com/patterns/fabric-of-squares.png"), linear-gradient(120deg, #fdf6ee 0%, #f8fafc 100%);
    background-repeat: repeat;
    min-height: 100vh;
    padding: 60px 0 80px 0;
}

.journal-title {
    font-size: 2.7rem;
    color: #1a1a1a;
    margin-bottom: 3.2rem;
    text-align: center;
}

.blog-row {
    display: flex;
    align-items: stretch;
    margin-bottom: 40px;
    gap: 56px;
    flex-wrap: wrap;
    justify-content: center;
    background-color: #fff;
    padding: 30px;
    border: 1px solid #0000002d;
    border-radius: 10px;
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
}

.blog-row.reverse {
    flex-direction: row-reverse;
}

.blog-card {
    background: linear-gradient(120deg, #fff 80%, #f3f4f6 100%);
    border: 1.5px solid #e0e7ef;
    border-radius: 22px;
    box-shadow: 0 4px 32px rgba(0, 0, 0, 0.08);
    padding: 38px 32px 32px 32px;
    margin: 0;
    transition: box-shadow 0.2s, border-color 0.2s;
    position: relative;
    z-index: 1;
}

.blog-content {
    flex: 1 1 380px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    min-width: 260px;
    max-width: 520px;
    background: transparent;
    box-shadow: none;
    border: none;
    padding: 0 0 0 0;
}

.blog-heading {
    margin-bottom: 18px;
}

.blog-excerpt {
    font-size: 1.13rem;
    color: #444;
    margin-bottom: 26px;
    line-height: 1.7;
    display: -webkit-box;
    -webkit-line-clamp: 6;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-height: calc(1.7em * 6);
    min-height: 0;
    word-break: break-word;
}

.blog-btn {
    border-radius: 10px;
    transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 2px 12px rgba(114, 56, 28, 0.10);
    border: none;
    outline: none;
    animation: blink-shadow 1.6s infinite alternate;
    margin-top: auto;
}

@keyframes blink-shadow {
    0% {
        box-shadow: 0 2px 12px rgba(114, 56, 28, 0.10);
    }

    60% {
        box-shadow: 0 0 10px 0 #72381C, 0 8px 40px rgba(114, 56, 28, 0.18);
    }

    100% {
        box-shadow: 0 2px 12px rgba(114, 56, 28, 0.10);
    }
}

.blog-btn:hover {
    background: #000;
    box-shadow: 0 6px 32px 0 #72381C, 0 12px 40px rgba(114, 56, 28, 0.22);
    transform: translateY(-2px) scale(1.06);
    color: #fff;
}

.arrow {
    font-size: 1.3em;
    margin-left: 10px;
    transition: margin-left 0.2s;
}

.blog-btn:hover .arrow {
    margin-left: 18px;
}

.blog-img-wrap {
    flex: 1 1 340px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 220px;
    max-width: 420px;
    background: transparent;
    box-shadow: none;
    border: none;
    padding: 0 0 0 0;
}

.blog-img {
    width: 100%;
    max-width: 380px;
    border-radius: 18px;
    box-shadow: 0 4px 24px rgba(99, 102, 241, 0.10);
    object-fit: cover;
    border: 1.5px solid #e0e7ef;
    background: #fff;
}

@media (max-width: 1100px) {
    .journal-hub-container {
        max-width: 98vw;
    }

    .blog-row,
    .blog-row.reverse {
        gap: 24px;
    }
}

@media (max-width: 900px) {

    .blog-row,
    .blog-row.reverse {
        flex-direction: column !important;
        gap: 24px;
        align-items: stretch;
    }

    .blog-img {
        max-width: 100%;
    }

    .blog-content {
        align-items: flex-start;
        text-align: left;
        max-width: 100%;
        padding: 0;
    }

    .blog-img-wrap {
        max-width: 100%;
    }
}

@media (max-width: 600px) {
    .journal-title {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
    }
    .blog-btn{
        margin-top: 0;
    }

    .blog-heading {
        font-size: 1.1rem;
    }

    .blog-row {
        margin-bottom: 32px;
    }

    .blog-card {
        padding: 18px 8px 16px 8px;
        border-radius: 12px;
    }

    .blog-excerpt {
        font-size: 1rem;
        -webkit-line-clamp: 5;
        max-height: calc(1.7em * 5);
    }
}
</style>