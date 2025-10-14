<template>
  <section class="legal-hero">
    <div class="container">
      <div class="page-title">
        <div class="breadcrumbs">
          <ul class="bread-wrap">
            <li><RouterLink to="/" class="text-main-4 link">Home</RouterLink></li>
            <li class="br-line w-12 bg-main"></li>
            <li>Exchange & Return Policy</li>
          </ul>
          <h1 class="heading fw-bold text-uppercase">
            Exchange & Return Policy
          </h1>
        </div>
      </div>
    </div>
  </section>

  <section class="legal-section">
    <div class="container">
      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">1. No Returns & No Refunds</h2>
          <ul>
            <li>We do not accept returns or issue refunds for any reason including change of mind, delivery delays, or color variations</li>
            <li>All sales are final</li>
          </ul>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">2. Exchange Policy (Size Issues Only)</h2>
          <p class="policy-text">We accept exchanges only in the following cases:</p>
          <ul>
            <li>Size issue (if the ordered size doesn't fit as expected)</li>
            <li>The product is unused, unwashed, and in original condition with all tags intact</li>
            <li>You must inform us within 48 hours of receiving the product</li>
            <li>Shipping costs for sending the item back to us are borne by the customer. The replacement piece will be shipped free of charge</li>
          </ul>
          <p class="policy-note"><strong>Note:</strong> Exchange is allowed only once per order and only for the same product in a different size. We do not offer credit notes or alternate style exchanges.</p>
        </div>
      </div>

      <div class="policy-card">
        <div class="policy-content">
          <h2 class="policy-title">3. In Case of Damaged or Incorrect Product</h2>
          <p class="policy-text">If you receive a damaged or incorrect item:</p>
          <ul>
            <li>Contact us within 48 hours of delivery</li>
            <li>Share clear images and your order details at <a href="mailto:hello@themodesse.com" class="contact-link">hello@themodesse.com</a></li>
            <li>We will review the issue and offer a resolution (repair, exchange, or replacement) at our discretion</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ShippingReturn'
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
.policy-note {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
  font-size: 1rem;
  color: #856404;
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