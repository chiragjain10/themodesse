<template>
    <div class="product-form product-variations product-size" v-if="sizeAttribute">
        <label>Size:</label>
        <div class="product-form-group">
            <div class="select-box">
                <select name="color" class="form-control" v-model="selectedSize">
                    <option value="" disabled>Choose an Option</option>
                    <option v-for="(option, index) in sizeAttribute.attribute_options" :key="index"
                        :value="option.value">
                        {{ capitalize(option.value) }}
                    </option>
                </select>
            </div>
            <a href="#" class="product-variation-clean" @click.prevent="clearSelection"
                v-show="selectedSize">
                Clean All
            </a>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    product: Object
})

const selectedSize = ref('')

const sizeAttribute = computed(() => {
    return props.product?.attributes?.find(attr => attr.name.toLowerCase() === 'size')
})

function clearSelection() {
    selectedSize.value = ''
}

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}
</script>
<style scoped></style>