<template>
    <div class="product-form product-variations product-color" v-if="colorAttribute">
        <label>{{ capitalize(colorAttribute.name) }}:</label>
        <div class="select-box">
            <select name="color" class="form-control" v-model="selectedColor">
                <option value="" disabled>Choose an Option</option>
                <option v-for="(option, index) in colorAttribute.attribute_options" :key="index" :value="option.value">
                    {{ capitalize(option.value) }}
                </option>
            </select>
        </div>
    </div>
</template>
<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
    product: Object
})

const selectedColor = ref('')

const colorAttribute = computed(() => {
    return props.product?.attributes?.find(attr => attr.name.toLowerCase() === 'color')
})

function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}
</script>
<style scoped></style>