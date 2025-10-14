<template>
    <div class="preload preload-container" id="preload">
        <div class="preload-bg"></div>
        <div class="preload-logo-anim">
            <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1487 237" width="120" height="19"
                class="modesse-logo">
                <use href="/src/assets/images/Logo.svg#Background" />
            </svg>
        </div>
    </div>
</template>

<script setup>
// No script needed for a simple loader component
</script>

<style scoped>
#preload {
    position: fixed;
    z-index: 9999;
    inset: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: none;
    transition: opacity 0.5s, transform 0.7s cubic-bezier(.77, 0, .18, 1);
}

#preload .preload-bg {
    position: absolute;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background-image: url("https://www.transparenttextures.com/patterns/fabric-of-squares.png"), linear-gradient(120deg, #fdf6ee 0%, #f8fafc 100%);
    background-size: auto, cover;
    background-repeat: repeat, no-repeat;
    z-index: 1;
    animation: fabric-move 12s linear infinite;
}

@keyframes fabric-move {
    0% {
        background-position: 0 0, 0 0;
    }
    100% {
        background-position: 200px 100px, 0 0;
    }
}

#preload .preload-logo-anim {
    z-index: 2;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
}

.modesse-logo {
    width: 140px;
    height: auto;
    animation: logo-bounce 1.5s infinite alternate cubic-bezier(.77, 0, .18, 1), logo-shimmer 2.5s infinite linear;
    filter: drop-shadow(0 4px 24px rgba(0, 0, 0, 0.08));
    position: relative;
}

@keyframes logo-shimmer {
    0% {
        filter: drop-shadow(0 4px 24px rgba(0,0,0,0.08)) brightness(1);
    }
    50% {
        filter: drop-shadow(0 4px 24px rgba(0,0,0,0.12)) brightness(1.15);
    }
    100% {
        filter: drop-shadow(0 4px 24px rgba(0,0,0,0.08)) brightness(1);
    }
}

@keyframes logo-bounce {
    0% {
        transform: scale(1) translateY(0);
        opacity: 1;
    }

    60% {
        transform: scale(1.08) translateY(-10px);
        opacity: 1;
    }

    100% {
        transform: scale(1) translateY(0);
        opacity: 1;
    }
}

#preload.loaded {
    opacity: 0;
    pointer-events: none;
    transform: translateY(100%);
    transition: opacity 0.5s, transform 0.7s cubic-bezier(.77, 0, .18, 1);
}
</style>