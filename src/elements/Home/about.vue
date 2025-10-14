<template>
  <section class="about-section">
    <div class="carousel-words">
      <div class="marquee">
        <span v-for="(word, idx) in words" :key="idx">
          <span class="second-span" v-if="idx !== words.length - 1"> &bull; </span>
          {{ word }}  
        </span>
      </div>
    </div>
    <div class="about-quote">
      “Rooted in India's textile legacy, designed for the modern woman. We bring together sustainable practices and refined silhouettes, creating timeless pieces that honour the maker, the wearer, and the earth.”
    </div>
  </section>
</template>

<script setup>
const words = [
  'Contemporary womenswear',
  'Sustainable fashion brand',
  'Ethical clothing India',
  'Slow fashion label',
  'Conscious clothing brand',
  'Small batch production',
  'Made in India',
  'Handmade with love',
  'Artisan-crafted garments',
  'Eco-friendly fashion'
];
</script>

<style scoped>
.about-section {
  width: 100vw;
  max-width: 100vw;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.carousel-words {
  width: 100vw;
  overflow: hidden;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background: #fcf7f1;
}
.marquee {
  display: flex;
  white-space: nowrap;
  animation: marquee 28s linear infinite;
  color: #222;
  padding: 1.2rem 0;
  gap: 2rem;
}
.marquee span {
  margin-right: 2.5rem;
  opacity: 0.85;
}

.second-span{
  margin-right: .5rem !important;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.about-quote {
  max-width: 900px;
  margin: 2.5rem auto 0 auto;
  font-size: 1.3rem;
  color: #444;
  text-align: center;
  line-height: 1.7;
  font-weight: 400;
  letter-spacing: 0.01em;
  padding: 0 1.5rem 2.5rem 1.5rem;
}
@media (max-width: 768px) {
  .marquee {
    font-size: 1rem;
    padding: 0.8rem 0;
  }
  .about-quote {
    font-size: 1.05rem;
    padding: 0 0.5rem 2rem 0.5rem;
  }
}
</style>
