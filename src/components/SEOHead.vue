<template>
  <!-- This component doesn't render anything visible -->
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  keywords: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: '/src/assets/images/themodesse.jpg'
  },
  url: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'website'
  },
  schema: {
    type: Object,
    default: null
  },
  noindex: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

const currentUrl = computed(() => {
  return props.url || `https://themodesse.com${route.path}`
})

const metaTags = computed(() => {
  const tags = {
    title: props.title,
    meta: [
      {
        name: 'description',
        content: props.description
      },
      {
        name: 'keywords',
        content: props.keywords || 'premium contemporary clothing, designer womenswear, luxury fashion, contemporary wear, handcrafted garments, sustainable fashion, elegant dresses, contemporary fashion, themodesse, the modesse, the modesse.com'
      },
      {
        name: 'robots',
        content: props.noindex ? 'noindex, nofollow' : 'index, follow'
      },
      {
        name: 'author',
        content: 'The Modesse'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      },
      // Open Graph
      {
        property: 'og:title',
        content: props.title
      },
      {
        property: 'og:description',
        content: props.description
      },
      {
        property: 'og:image',
        content: props.image
      },
      {
        property: 'og:url',
        content: currentUrl.value
      },
      {
        property: 'og:type',
        content: props.type
      },
      {
        property: 'og:site_name',
        content: 'The Modesse'
      },
      // Twitter Card
      {
        name: 'twitter:card',
        content: 'summary_large_image'
      },
      {
        name: 'twitter:title',
        content: props.title
      },
      {
        name: 'twitter:description',
        content: props.description
      },
      {
        name: 'twitter:image',
        content: props.image
      },
      {
        name: 'twitter:site',
        content: '@themodesse'
      }
    ],
    link: [
      {
        rel: 'canonical',
        href: currentUrl.value
      }
    ]
  }

  // Add schema markup if provided
  if (props.schema) {
    tags.script = [
      {
        type: 'application/ld+json',
        children: JSON.stringify(props.schema)
      }
    ]
  }

  return tags
})

// Update head when props change
watch(metaTags, (newTags) => {
  useHead(newTags)
}, { immediate: true })

onMounted(() => {
  useHead(metaTags.value)
})
</script> 