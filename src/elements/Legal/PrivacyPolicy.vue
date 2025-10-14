<template>
  <section class="legal-hero">
    <div class="container">
      <div class="page-title">
        <div class="breadcrumbs">
          <ul class="bread-wrap">
            <li><RouterLink to="/" class="text-main-4 link">Home</RouterLink></li>
            <li class="br-line w-12 bg-main"></li>
            <li>Privacy Policy</li>
          </ul>
          <h1 class="heading fw-bold text-uppercase">
            Privacy Policy
          </h1>
        </div>
      </div>
    </div>
  </section>

  <section class="legal-section">
    <div class="container">
      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">1. What We Collect</h2>
          <ul>
            <li>Name, email, phone number, billing and shipping addresses</li>
            <li>Order and transaction information</li>
            <li>Device data and browsing behavior via cookies and analytics</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">2. How We Use It</h2>
          <ul>
            <li>To process and ship your orders</li>
            <li>To communicate about your purchase or respond to queries</li>
            <li>To improve website functionality and customer experience</li>
            <li>To send promotional content (if you opt in)</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">3. Data Security</h2>
          <ul>
            <li>Payments are handled via encrypted third-party gateways. We do not store sensitive payment information</li>
            <li>Your data will never be sold, rented, or shared with unauthorized third parties</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">4. Cookies</h2>
          <p>Our website uses cookies to personalize your browsing experience. You can modify cookie preferences through your browser.</p>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">5. Third-Party Links</h2>
          <p>Our website may contain links to external platforms. We are not responsible for their privacy practices.</p>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">6. Your Rights</h2>
          <p>You may request access, correction, or deletion of your personal data by writing to us at <a href="mailto:hello@themodesse.com" class="contact-link">hello@themodesse.com</a></p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PrivacyPolicy'
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

.contact-link {
  color: #B88E2F;
  text-decoration: none;
  font-weight: 600;
}

.contact-link:hover {
  text-decoration: underline;
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