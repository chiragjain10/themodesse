<template>
    <section class="about-section">

        <div class="about-quote">
            “Where Strength Meets Subtlety
            This is more than just a space for clothing — it’s a conversation in form, fabric, and feeling. Rooted in
            purpose, shaped by stories, and led by curiosity, our work is driven by the ever-evolving identities of
            modern individuals — bold, gentle, complex, and real. <br> <br>

            We celebrate the beauty of contrast: structure and softness, tradition and transformation, clarity and
            chaos. Whether you’re chasing a dream, running a business, or simply showing up as yourself — we design for
            those who carry power with quiet grace. <br> <br>

            Here, every silhouette is a tribute. Every detail is deliberate.
            Because you don’t just wear a garment — you become part of something.”
        </div>
    </section>
</template>

<script setup>

</script>

<style scoped>
.about-section {
    width: 100vw;
    max-width: 100vw;
    margin: 0 auto;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.about-quote {
    max-width: 900px;
    margin: 2.5rem auto 0 auto;
    font-size: 1rem;
    color: #444;
    text-align: center;
    line-height: 1.7;
    font-weight: 400;
    letter-spacing: 0.01em;
    padding: 0 1.5rem 2.5rem 1.5rem;
}

@media (max-width: 768px) {
    .marquee {
        font-size: 1rem;
        padding: 0.8rem 0;
    }

    .about-quote {
        font-size: .7rem;
        padding: 0 0.5rem 2rem 0.5rem;
    }
}
</style>
