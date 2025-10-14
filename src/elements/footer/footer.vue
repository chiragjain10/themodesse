<template>
    <footer class="footer" style="border-top: 1px solid #0000002d;">
        <FooterBody />
    </footer>
</template>

<script setup>
import FooterBody from './FooterBody.vue'
</script>

<style scoped>
@media (max-width: 576px) {
    .footer {
        margin-bottom: 40px;
    }
}
</style>