<template>
    <div class="tf-product-share">
        <ul class="tf-social-icon">
            <li v-for="(social, index) in socialLinks" :key="index">
                <a :href="getShareUrl(social.platform)" 
                   :class="`social-${social.platform}`"
                   target="_blank"
                   @click.prevent="shareProduct(social.platform)">
                    <span class="icon"><i :class="`icon-${social.platform}`"></i></span>
                </a>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    product: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['share'])

const socialLinks = [
    { platform: 'facebook', icon: 'icon-facebook' },
    { platform: 'instagram', icon: 'icon-instagram' },
    { platform: 'x', icon: 'icon-x' },
    { platform: 'snapchat', icon: 'icon-snapchat' }
]

const getShareUrl = (platform) => {
    const productUrl = window.location.href
    const productName = props.product.name
    const productDescription = props.product.short_description

    switch (platform) {
        case 'facebook':
            return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`
        case 'x':
            return `https://twitter.com/intent/tweet?text=${encodeURIComponent(productName)}&url=${encodeURIComponent(productUrl)}`
        case 'instagram':
            // Instagram doesn't support direct sharing via URL
            return '#'
        case 'snapchat':
            // Snapchat doesn't support direct sharing via URL
            return '#'
        default:
            return '#'
    }
}

const shareProduct = (platform) => {
    emit('share', platform)
}
</script>