<template>
    <!-- Collection -->
    <div class="flat-spacing-3 pb-0">
        <div class="container-full-2">
            <div class="tf-grid-layout sm-col-2 gap-x-10">
                <div v-for="collection in collections" :key="collection.id" class="wg-cls hover-img wow fadeInUp">
                    <a :href="collection.link" class="image img-style">
                        <img :src="collection.image" :data-src="collection.image" :alt="collection.title"
                            class="lazyload">
                    </a>
                    <div class="content">
                        <h3 class="title text-uppercase">{{ collection.title }}</h3>
                        <a :href="collection.link" class="tf-btn btn-def-2 type-black">
                            {{ collection.button_text }}
                            <i class="icon icon-arrow-top-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Collection -->
</template>

<script>
export default {
    name: 'Collection2',
    props: {
        collections: {
            type: Array,
            required: true
        }
    }
}
</script>