<template>
    <div class="app-loader">
        <div class="spinner"></div>
    </div>
</template>

<script setup>
// No script needed for a simple loader component
</script>

<style scoped>
.app-loader {
    display: flex;
    justify-content: center;
    align-items: center;
    /* You might want to make the loader cover its parent or the whole screen */
    /* position: absolute; */
    /* top: 0; */
    /* left: 0; */
    /* width: 100%; */
    /* height: 100%; */
    /* background-color: rgba(255, 255, 255, 0.8); */
    z-index: 10;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3; /* Light grey */
    border-top: 4px solid #3498db; /* Blue */
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style> 