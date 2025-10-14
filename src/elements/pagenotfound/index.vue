<template>
  <div class="notfound-bg">
    <div class="notfound-card">
      <img :src="product1" alt="404 Not Found" class="notfound-img" />
      <h1 class="notfound-title"><span class="text-primary">Oops!</span> Page not found</h1>
      <p class="notfound-desc">
        Sorry, the page you are looking for does not exist, has been moved, or is temporarily unavailable.<br>
        Please check the URL or return to the homepage.
      </p>
                      <a href="/" class="notfound-btn" @click="handleHomeClick">Return to Homepage</a>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import product1 from '@/assets/images/themodesse.jpg'

const router = useRouter()

// Handle home click to refresh page
const handleHomeClick = (event) => {
    event.preventDefault()
    
    // If we're already on home page, refresh it
    if (router.currentRoute.value.path === '/') {
        window.location.reload()
    } else {
        // Navigate to home and then refresh
        router.push('/').then(() => {
            window.location.reload()
        })
    }
}
</script>

<style scoped>
.notfound-bg {
  min-height: 100vh;
  background: linear-gradient(120deg, #f8fafc 0%, #f3f3f3 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
}
.notfound-card {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 32px rgba(191,167,122,0.10), 0 1.5px 8px rgba(0,0,0,0.04);
  padding: 48px 36px 36px 36px;
  max-width: 420px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.notfound-img {
  width: 140px;
  height: 140px;
  object-fit: contain;
  margin-bottom: 24px;
}
.notfound-title {
  font-size: 2.1rem;
  font-weight: 800;
  color: #232f3e;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
}
.text-primary {
  color: #bfa77a;
}
.notfound-desc {
  font-size: 1.08rem;
  color: #444;
  margin-bottom: 32px;
  line-height: 1.6;
}
.notfound-btn {
  display: inline-block;
  background: linear-gradient(90deg, #ffe6b0 0%, #bfa77a 100%);
  color: #232f3e;
  font-weight: 700;
  font-size: 1.08rem;
  border: none;
  border-radius: 8px;
  padding: 14px 36px;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(191,167,122,0.10);
  transition: background 0.18s, color 0.18s, box-shadow 0.18s, transform 0.18s;
  letter-spacing: 0.2px;
}
.notfound-btn:hover {
  background: linear-gradient(90deg, #bfa77a 0%, #ffe6b0 100%);
  color: #232f3e;
  box-shadow: 0 4px 16px #ffe6b0cc;
  transform: translateY(-2px) scale(1.04);
}
@media (max-width: 600px) {
  .notfound-card {
    padding: 28px 8px 24px 8px;
    max-width: 98vw;
  }
  .notfound-title {
    font-size: 1.2rem;
  }
  .notfound-img {
    width: 80px;
    height: 80px;
  }
}
</style> 