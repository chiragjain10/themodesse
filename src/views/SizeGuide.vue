<template>
    <div class="size-guide-container">
        <div class="size-guide-card">
            <h2 class="size-guide-title">Size Guide</h2>
            <div class="size-guide-image-wrap">
                <img :src="SizeGuide" alt="Size Guide Chart" class="size-guide-image" />
            </div>
        </div>
    </div>
</template>

<script setup>
import SizeGuide from '@/assets/images/size-chart.jpg';
</script>

<style scoped>
.size-guide-container {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f8f8;
    padding: 2rem 0;
}

.size-guide-card {
    background: #fff;
    padding: 2.5rem 2rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.size-guide-title {
    font-size: 2rem;
    font-weight: 700;
    color: #72381C;
    margin-bottom: 2rem;
    text-align: center;
}

.size-guide-image-wrap {
    width: 100%;
    display: flex;
    justify-content: center;
}

.size-guide-image {
    max-width: 100%;
    width: 700px;
    border-radius: 10px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.10);
    padding: .5rem;
}

@media (max-width: 600px) {
    .size-guide-card {
        padding: 1.2rem 0.5rem;
    }

    .size-guide-image {
        width: 100%;
        padding: 0.5rem;
    }

    .size-guide-title {
        font-size: 1.3rem;
    }
}
</style>