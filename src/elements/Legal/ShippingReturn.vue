<template>
  <section class="legal-hero">
    <div class="container">
      <div class="page-title">
        <div class="breadcrumbs">
          <ul class="bread-wrap">
            <li><RouterLink to="/" class="text-main-4 link">Home</RouterLink></li>
            <li class="br-line w-12 bg-main"></li>
            <li>Shipping & Return Policy</li>
          </ul>
          <h1 class="heading fw-bold text-uppercase">
            Shipping & Return Policy
          </h1>
        </div>
      </div>
    </div>
  </section>

  <section class="legal-section">
    <div class="container">
      <div class="policy-card">
        <div class="policy-icon">
          <svg width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#F5F5F5"/><path d="M16 32V20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12" stroke="#B88E2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 32h24" stroke="#B88E2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 32v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4" stroke="#B88E2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="policy-content">
          <h2 class="policy-title">Domestic Orders</h2>
          <p class="policy-text">
            Please allow <span class="highlight">10-12 business days</span> for delivery. In case of any unexpected delays, we’ll keep you informed.
          </p>
        </div>
      </div>
      <div class="policy-card">
        <div class="policy-icon">
          <svg width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#F5F5F5"/><path d="M16 32V20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12" stroke="#B88E2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M24 16v16" stroke="#B88E2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="policy-content">
          <h2 class="policy-title">Handcrafted With Care</h2>
          <p class="policy-text">
            As a <span class="highlight">made-to-order</span> label, each piece is carefully handcrafted by our artisans only after your order is placed.
          </p>
        </div>
      </div>
      <div class="policy-card">
        <div class="policy-icon">
          <svg width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="24" cy="24" r="24" fill="#F5F5F5"/><path d="M16 32V20a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12" stroke="#B88E2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 28l4-4 4 4" stroke="#B88E2F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <div class="policy-content">
          <h2 class="policy-title">No Returns or Exchanges</h2>
          <p class="policy-text">
            We are unable to offer exchanges or returns. We appreciate your understanding and support for <span class="highlight">slow, intentional fashion</span>.
          </p>
        </div>
      </div>
      <div class="policy-footer">
        <p class="last-updated">Last Updated: {{ new Date().toLocaleDateString() }}</p>
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
.policy-card {
  display: flex;
  align-items: flex-start;
  background: #faf7f2;
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
.policy-text {
  font-size: 1.08rem;
  color: #333;
  line-height: 1.7;
}
.highlight {
  color: #B88E2F;
  font-weight: 600;
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