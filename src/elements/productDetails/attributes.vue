<template>
    <div class="product-accordion">
        <!-- Description Section -->
        <div class="accordion-item">
            <div class="accordion-header" @click="toggleAccordion('description')">
                <h6 class="fw-normal">Description</h6>
                <i class="icon" :class="activeAccordion === 'description' ? 'icon-minus' : 'icon-plus'"></i>
            </div>
            <div class="accordion-content" v-show="activeAccordion === 'description'">
                <div class="description-content">
                    <p>{{ productDescription }}</p>
                </div>
            </div>
        </div>

        <!-- Colors & Size Section -->
        <div class="accordion-item">
            <div class="accordion-header" @click="toggleAccordion('colorsSize')">
                <h6 class="">Size & Material</h6>
                <i class="icon" :class="activeAccordion === 'colorsSize' ? 'icon-minus' : 'icon-plus'"></i>
            </div>
            <div class="accordion-content" v-show="activeAccordion === 'colorsSize'">
                <div class="tf-product-info-variant">
                    <div v-for="(attribute, index) in attributes" :key="index" class="variant-picker-item" :class="`variant-${attribute.type}`">
                        <div class="variant-picker-label h6 ">
                            {{ attribute.name }}:
                            <span class="variant-picker-label-value" :class="`value-current${attribute.type}`">
                                {{ selectedVariants[attribute.name] || '' }}
                            </span>
                        </div>
                        <div class="variant-picker-values">
                            <template v-if="attribute.type === 'color'">
                                <div v-for="option in attribute.options" :key="option.value"
                                    class="hover-tooltip color-btn style-image-square"
                                    :class="{ active: selectedVariants[attribute.name] === option.value }"
                                    @click="selectVariant(attribute.name, option.value)">
                                    <span class="check-color">
                                        <img :src="option.image" :alt="option.label">
                                    </span>
                                    <span class="tooltip">{{ option.label }}</span>
                                </div>
                            </template>
                            <template v-else>
                                <div class="tf-select">
                                    <select class="form-select" 
                                        :value="selectedVariants[attribute.name]"
                                        @change="selectVariant(attribute.name, $event.target.value)">
                                        <option value="">Select {{ attribute.name }}</option>
                                        <option v-for="option in attribute.options" 
                                            :key="option.value"
                                            :value="option.value">
                                            {{ option.label }}
                                        </option>
                                    </select>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="variant-picker-item">
                        <div class="variant-picker-label h6 fw-normal">Quantity</div>
                        <div class="variant-picker-values">
                            <div class="wg-quantity">
                                <button class="btn-quantity btn-decrease" @click="decreaseQuantity">
                                    <i class="icon-minus"></i>
                                </button>
                                <input class="quantity-product" type="text" name="number" v-model="localQuantity" @input="updateQuantity">
                                <button class="btn-quantity btn-increase" @click="increaseQuantity">
                                    <i class="icon-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Size Chart Section -->
        <div class="size-chart-section">
            <button class="size-chart-btn" @click="showSizeChart = true">Size Chart</button>
            <div v-if="showSizeChart" class="size-chart-modal" @click.self="showSizeChart = false">
                <div class="size-chart-modal-content">
                    <img src="/src/assets/images/size-chart.jpg" alt="Size Chart" class="size-chart-img" />
                    <button class="close-btn" @click="showSizeChart = false">&times;</button>
                </div>
            </div>
        </div>

        <!-- Country of Origin Section -->
        <div class="accordion-item">
            <div class="accordion-header" @click="toggleAccordion('careInstructions')">
                <h6 class="">Care Instructions</h6>
                <i class="icon" :class="activeAccordion === 'careInstructions' ? 'icon-minus' : 'icon-plus'"></i>
            </div>
            <div class="accordion-content" v-show="activeAccordion === 'careInstructions'">
                <div class="care-instructions-content">
                    <p>At The Modesse, each garment is crafted with care using pure, natural fabrics that deserve gentle handling. For best results, we recommend dry cleaning only and avoiding exposure to harsh sunlight to preserve the fabric's natural hues. Do not wring, soak, or tumble dry, and always iron on the reverse side to maintain its texture. Hand-dyed pieces may release some color during the initial washes—this is normal and will soften into graceful, lived-in fades over time. You may also notice slight irregularities in the weave or thread, especially in handwoven silks—these are not flaws, but beautiful reminders of the craftsmanship.</p>
                </div>
            </div>
        </div>

        <!-- Note Section -->
        <div class="accordion-item">
            <div class="accordion-header" @click="toggleAccordion('note')">
                <h6 class="">Note</h6>
                <i class="icon" :class="activeAccordion === 'note' ? 'icon-minus' : 'icon-plus'"></i>
            </div>
            <div class="accordion-content" v-show="activeAccordion === 'note'">
                <div class="note-content">
                    <p>This piece will be handcrafted exclusively for you, which means slight variations in colour, texture, or pattern may occur. These subtle differences are a natural result of the artisan-led techniques we use—and are what make each garment uniquely yours.</p>
                </div>
            </div>
        </div>

        <!-- Shipping and Returns Section -->
        <div class="accordion-item">
            <div class="accordion-header" @click="toggleAccordion('shippingReturns')">
                <h6 class="">Shipping and Returns</h6>
                <i class="icon" :class="activeAccordion === 'shippingReturns' ? 'icon-minus' : 'icon-plus'"></i>
            </div>
            <div class="accordion-content" v-show="activeAccordion === 'shippingReturns'">
                <div class="shipping-returns-content">
                    <p><strong>Domestic Orders:</strong> Please allow 10-12 business days for delivery. In case of any unexpected delays, we'll keep you informed.</p>
                    <p>As a made-to-order label, each piece is carefully handcrafted by our artisans only after your order is placed. For this reason, we are unable to offer exchanges or returns. We appreciate your understanding and support for slow, intentional fashion.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    attributes: {
        type: Array,
        default: () => []
    },
    variants: {
        type: Array,
        default: () => []
    },
    product: {
        type: Object,
        default: () => {}
    }
})

const emit = defineEmits(['update:selected-variants', 'update:quantity'])

const selectedVariants = ref({})
const localQuantity = ref(1)
const activeAccordion = ref('description')
const productDescription = ref(props.product?.description)
const showSizeChart = ref(false)

const toggleAccordion = (section) => {
    activeAccordion.value = activeAccordion.value === section ? null : section
}

const decreaseQuantity = () => {
    if (localQuantity.value > 1) {
        localQuantity.value--
        emit('update:quantity', localQuantity.value)
    }
}

const increaseQuantity = () => {
    localQuantity.value++
    emit('update:quantity', localQuantity.value)
}

const updateQuantity = (event) => {
    const value = parseInt(event.target.value)
    if (!isNaN(value) && value > 0) {
        localQuantity.value = value
        emit('update:quantity', localQuantity.value)
    } else {
        localQuantity.value = 1
        emit('update:quantity', localQuantity.value)
    }
}

const updateSelectedVariants = () => {
    emit('update:selected-variants', selectedVariants.value)
}

watch(() => props.product, (newProduct) => {
    // Initialize selected variants
    if (newProduct?.attributes) {
        newProduct.attributes.forEach(attr => {
            selectedVariants.value[attr.name] = ''
        })
    }
}, { immediate: true })
</script>

<style scoped>
.product-accordion {
    border: 1px solid #e5e5e5;
    border-radius: 4px;
}

.accordion-item {
    border-bottom: 1px solid #e5e5e5;
}

.accordion-item:last-child {
    border-bottom: none;
}

.accordion-header {
    padding: 15px 20px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f9f9f9;
}

.accordion-header:hover {
    background-color: #f0f0f0;
}

.accordion-content {
    padding: 20px;
    background-color: #ffffff;
}

.variant-picker-item {
    margin-bottom: 15px;
}

.variant-picker-label {
    margin-bottom: 8px;
}

.tf-select select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.wg-quantity {
    display: flex;
    align-items: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    overflow: hidden;
}

.btn-quantity {
    padding: 8px 12px;
    background: #f8f9fa;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
}

.btn-quantity:hover {
    background: #e9ecef;
}

.quantity-product {
    width: 50px;
    text-align: center;
    border: none;
    border-left: 1px solid #ddd;
    border-right: 1px solid #ddd;
    padding: 8px 0;
}

.box-contents-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.box-contents-list li {
    padding: 8px 0;
    border-bottom: 1px solid #eee;
}

.box-contents-list li:last-child {
    border-bottom: none;
}

.info-table {
    width: 100%;
    border-collapse: collapse;
}

.info-table td {
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.info-table td:first-child {
    font-weight: 600;
    width: 40%;
}

.size-chart-section {
    margin-bottom: 1.5rem;
}

.size-chart-btn {
    background: none;
    border: none;
    color: #111;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    position: relative;
    padding: 0 0 0.25rem 0;
    outline: none;
}

.size-chart-btn::after {
    content: '';
    display: block;
    width: 100%;
    height: 2px;
    background: #111;
    position: absolute;
    left: 0;
    bottom: 0;
}

.size-chart-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.size-chart-modal-content {
    background: #fff;
    border-radius: 8px;
    padding: 1.5rem 1rem 1rem 1rem;
    width: 50vw;
    max-width: 500px;
    min-width: 280px;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.size-chart-img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 4px;
}

.close-btn {
    position: absolute;
    top: 0.5rem;
    right: 0.75rem;
    background: none;
    border: none;
    font-size: 2rem;
    color: #222;
    cursor: pointer;
    line-height: 1;
}

@media (max-width: 767px) {
    .variant-picker-item {
        flex-direction: column;
        align-items: flex-start;
    }

    .variant-picker-label,
    .variant-picker-values {
        width: 100%;
    }

    .variant-picker-values {
        margin-top: 8px;
    }
}

@media (max-width: 600px) {
    .size-chart-modal-content {
        width: 90vw;
        max-width: 98vw;
        padding: 1rem 0.5rem 0.5rem 0.5rem;
    }
}
</style>