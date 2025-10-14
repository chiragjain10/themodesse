<template>
  <section class="legal-hero">
    <div class="container">
      <div class="page-title">
        <div class="breadcrumbs">
          <ul class="bread-wrap">
            <li><RouterLink to="/" class="text-main-4 link">Home</RouterLink></li>
            <li class="br-line w-12 bg-main"></li>
            <li>Terms & Conditions</li>
          </ul>
          <h1 class="heading fw-bold text-uppercase">
            Terms & Conditions
          </h1>
        </div>
      </div>
    </div>
  </section>

  <section class="legal-section">
    <div class="container">
      <div class="policy-card">
        
        <div class="policy-content">
          <h2 class="policy-title">1. General</h2>
          <ul>
            <li>The Modesse is a contemporary womenswear label committed to mindful production and sustainability</li>
            <li>All garments are handcrafted after receiving an order using natural Indian fabrics</li>
            <li>Slight variations in texture, color, or weave are part of the artisanal process</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">2. Orders & Fulfilment</h2>
          <ul>
            <li>All products are made-to-order. Once an order is confirmed, it cannot be canceled</li>
            <li>Dispatch typically takes 12–15 business days</li>
            <li>Delivery timelines may vary depending on your location</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">3. Product Variation</h2>
          <ul>
            <li>Due to the nature of handwoven and hand-dyed fabrics, slight differences in color or finish may occur</li>
            <li>These are not defects but characteristics of handcrafted garments</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">4. Pricing & Payment</h2>
          <ul>
            <li>Prices are in INR and inclusive of all applicable taxes unless specified otherwise</li>
            <li>Payment must be made in full before order processing</li>
            <li>We accept all major digital payment methods via secure gateways</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">5. Exchange Policy</h2>
          <ul>
            <li>We do not offer returns or refunds under any circumstances</li>
            <li>Exchanges may be accepted for size-related issues only, subject to the conditions listed in our Exchange Policy</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">6. Intellectual Property</h2>
          <ul>
            <li>All content on this website including text, images, logos, graphics, and product designs is the property of The Modesse</li>
            <li>Content may not be reproduced without written consent</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">7. Limitation of Liability</h2>
          <ul>
            <li>We are not liable for any indirect or consequential loss from the use of our website or products</li>
            <li>This includes delays beyond our control</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">8. Governing Law</h2>
          <ul>
            <li>These terms are governed by Indian law</li>
            <li>Any disputes will be handled exclusively in the courts of Indore, Madhya Pradesh</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TermsConditions'
}
</script>

<style scoped>
.legal-hero {
  background: linear-gradient(90deg, #fff8f0 0%, #f5f5f5 100%);
  padding: 40px 0 0 0;
}
.page-title {
  padding-bottom: 0;
}
.heading {
  color: #B88E2F;
  font-size: 2.2rem;
  margin-top: 10px;
}
.legal-section {
  background: #fff;
  padding: 40px 0 60px 0;
}

.policy-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 15px;
  border: 1px solid #dee2e6;
}

.policy-main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #B88E2F;
  margin-bottom: 15px;
  text-align: center;
}

.policy-date {
  font-size: 1.1rem;
  color: #6c757d;
  margin-bottom: 20px;
  font-weight: 500;
}

.policy-intro {
  font-size: 1.2rem;
  color: #495057;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
}

.policy-card {
  display: flex;
  align-items: flex-start;
  background: #f7f7f7;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(184, 142, 47, 0.07);
  padding: 32px 28px;
  margin-bottom: 28px;
  transition: box-shadow 0.2s;
}
.policy-card:hover {
  box-shadow: 0 4px 24px rgba(184, 142, 47, 0.13);
}
.policy-icon {
  flex-shrink: 0;
  margin-right: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.policy-title {
  font-size: 1.3rem;
  color: #B88E2F;
  margin-bottom: 8px;
  font-weight: 600;
}
.policy-content ul {
  margin-bottom: 10px;
  padding-left: 20px;
}
.policy-content li {
  margin-bottom: 8px;
  line-height: 1.6;
}
.policy-text, .policy-content p {
  font-size: 1.08rem;
  color: #333;
  line-height: 1.7;
}
.policy-footer {
  text-align: right;
  margin-top: 30px;
}
.last-updated {
  font-style: italic;
  color: #888;
  font-size: 0.98rem;
}
@media (max-width: 767px) {
  .policy-header {
    padding: 20px 15px;
    margin-bottom: 30px;
  }
  
  .policy-main-title {
    font-size: 1.8rem;
  }
  
  .policy-intro {
    font-size: 1rem;
  }
  
  .policy-card {
    flex-direction: column;
    align-items: flex-start;
    padding: 20px 12px;
  }
  .policy-icon {
    margin-bottom: 12px;
    margin-right: 0;
  }
  .legal-section {
    padding: 24px 0 32px 0;
  }
  .heading {
    font-size: 1.3rem;
  }
}
</style> 