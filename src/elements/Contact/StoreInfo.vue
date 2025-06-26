<template>
    <div class="left-col mb-lg-0">
        <h3 class="title fw-normal">Visit Our Store</h3>
        <ul class="store-info-list">
            <li>
                <p class="caption">Address:</p>
                <a href="https://maps.app.goo.gl/UVTa79HV4XZdUnxH6"
                    class="link text-main-4" target="_blank">
                    Rami Kanak Raj Residency, Gumasta Nagar, Scheme No. 71, Indore (452009)
                </a>
            </li>
            <li>
                <p class="caption">Email:</p>
                <a href="mailto:hello@themodesse.com" class="link text-main-4">
                    hello@themodesse.com
                </a>
            </li>
            <li>
                <p class="caption">Phone:</p>
                <a href="tel:+919300125126" class="link text-main-4">
                    +91 93001 25126
                </a>
            </li>
            <li>
                <p class="caption">Opening Hours:</p>
                <p class="text-main-4">
                    24 Hours at your service
                </p>
            </li>
        </ul>
        <ul class="tf-social-icon">
            <li>
                <a href="https://www.facebook.com/themodesse" target="_blank" class="social-facebook">
                    <span class="icon"><i class="icon-facebook"></i></span>
                </a>
            </li>
            <li>
                <a href="https://www.instagram.com/themodesse" target="_blank" class="social-instagram">
                    <span class="icon"><i class="icon-instagram"></i></span>
                </a>
            </li>
            <li>
                <a href="https://www.pinterest.com/themodesse" target="_blank" class="social-pinterest">
                    <span class="icon"><i class="icon-pinterest"></i></span>
                </a>
            </li>
            <li>
                <a href="https://www.youtube.com/@themodesse" target="_blank" class="social-youtube">
                    <span class="icon"><i class="icon-youtube"></i></span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup>
</script>

<style scoped>
.store-info-list {
    margin-bottom: 30px;
}

.store-info-list li {
    margin-bottom: 15px;
}

.store-info-list .caption {
    font-weight: 600;
    margin-bottom: 5px;
}

.tf-social-icon {
    display: flex;
    gap: 15px;
}

.tf-social-icon a {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #f5f5f5;
    transition: all 0.3s ease;
}

.tf-social-icon a:hover {
    background: var(--primary-color);
    color: white;
}
</style>