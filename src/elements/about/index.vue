<template>
  <div class="about-page">
    <!-- SEO Component -->
    <SEOHead 
      title="About The Modesse | Premium Contemporary Womenswear Brand Story"
      description="Discover the story behind The Modesse - a premium contemporary womenswear brand crafting handcrafted designer clothing from finest Indian fabrics. Learn about our sustainable fashion philosophy and commitment to quality."
      keywords="about The Modesse, premium womenswear brand, sustainable fashion, handcrafted clothing, Indian designer brand, contemporary fashion brand, luxury clothing brand, ethical fashion, slow fashion, artisan-made clothing"
      :schema="aboutSchema"
    />
    
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">About Us</h1>
        </div>
      </div>
    </section>

    <!-- Main Content Section -->
    <section class="main-content">
      <div class="container">
        <div class="content-wrapper">
          <div class="content-text">
            <p class="main-paragraph">
              At The Modesse, we believe in crafting clothing that feels as honest as it looks — rooted in nature, made
              with intention, and designed to last beyond trends.
            </p>
            <p class="main-paragraph">
              We create contemporary womenswear using India's most treasured natural fabrics — khadi, handloom, linen,
              and pure cotton. Each piece is thoughtfully designed to balance structure with softness, heritage with
              modernity, and style with sustainability.
            </p>
            <p class="main-paragraph">
              <strong>Our Philosophy</strong><br>
              We don't chase seasons.<br>
              We don't mass-produce.<br>
              We believe in slow fashion that respects the hands that make it and the earth that sustains it.
            </p>
            <p class="main-paragraph">
              Every garment is handcrafted in small batches, allowing us to focus on quality, reduce waste, and
              celebrate the charm of imperfection that comes with artisan-made pieces.
            </p>
            <p class="main-paragraph">
              <strong>Conscious Choices, Always</strong><br>
              From fabric-made buttons instead of plastic to cotton labels that feel gentle on your skin, we carefully
              consider every element of our clothing. Even our price tags are embedded with seeds — so nothing goes to
              waste, and something beautiful grows in its place.
            </p>
            <p class="main-paragraph">
              We are proud to support Indian craftspeople, work closely with small weaving communities, and revive
              traditional techniques with a modern lens.
            </p>
            <p class="main-paragraph highlight-text">
              <strong>More Than Fashion</strong><br>
              The Modesse is more than just clothing. It's a return to feeling — of touch, of texture, of truth. It's
              fashion that breathes, flows, and ages gracefully, just like the women who wear it.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import SEOHead from '@/components/SEOHead.vue';

// Schema markup for About page
const aboutSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "The Modesse",
  "url": "https://themodesse.com/about",
  "description": "Premium contemporary womenswear brand crafting handcrafted designer clothing from finest Indian fabrics",
  "foundingDate": "2020",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-93001-25126",
    "contactType": "customer service",
    "email": "hello@themodesse.com"
  },
  "sameAs": [
    "https://www.instagram.com/themodesse",
    "https://www.facebook.com/themodesse",
    "https://www.linkedin.com/company/themodesse"
  ],
  "knowsAbout": [
    "Premium Contemporary Womenswear",
    "Sustainable Fashion",
    "Handcrafted Designer Clothing",
    "Indian Fabrics",
    "Khadi Clothing",
    "Handloom Dresses",
    "Modern Ethnic Wear"
  ]
};
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background-color: #fcf7f1;
  font-family: inherit;
  background-image: url("https://www.transparenttextures.com/patterns/fabric-of-squares.png"), linear-gradient(120deg, #fdf6ee 0%, #f8fafc 100%);
}

/* Hero Section */
.hero-section {
  padding: 80px 0 60px;
  text-align: center;
  border-bottom: 1px solid var(--line-3);
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 400;
  color: var(--main);
  margin: 0;
  letter-spacing: -0.01em;
  text-transform: none;
}

/* Main Content Section */
.main-content {
  padding: 80px 0;
  background-color: transparent;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-text {
  text-align: left;
}

.main-paragraph {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--main-4);
  margin-bottom: 2rem;
  font-weight: 400;
  text-align: left;
}

.main-paragraph:last-of-type {
  margin-bottom: 0;
}

.highlight-text {
  font-weight: 500;
  color: var(--main);
}

/* Email Section */
.email-section {
  padding: 80px 0;
  background-color: var(--bg);
  border-top: 1px solid var(--line-3);
}

.email-content {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
  padding: 0 20px;
}

.email-title {
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--main);
  margin-bottom: 2rem;
  text-transform: none;
}

.email-form {
  display: flex;
  gap: 10px;
  max-width: 400px;
  margin: 0 auto;
}

.email-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--line-3);
  border-radius: 4px;
  font-size: 1rem;
  background-color: var(--white);
  color: var(--main);
  outline: none;
  transition: border-color 0.3s ease;
}

.email-input:focus {
  border-color: var(--primary);
}

.email-input::placeholder {
  color: var(--main-5);
}

.email-button {
  padding: 12px 24px;
  background-color: var(--main);
  color: var(--white);
  border: 1px solid var(--main);
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: none;
}

.email-button:hover {
  background-color: var(--main-2);
  border-color: var(--main-2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0 40px;
  }

  .main-content {
    padding: 60px 0;
  }

  .email-section {
    padding: 60px 0;
  }

  .hero-title {
    font-size: 2rem;
  }

  .main-paragraph {
    font-size: 1rem;
    line-height: 1.7;
  }

  .email-title {
    font-size: 1.25rem;
  }

  .email-form {
    flex-direction: column;
    gap: 15px;
  }

  .email-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 1.75rem;
  }

  .content-wrapper {
    padding: 0 15px;
  }

  .email-content {
    padding: 0 15px;
  }
}
</style>