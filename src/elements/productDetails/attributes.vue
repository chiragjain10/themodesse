<template>
    <!-- Minimal working example for size chart modal -->
    <div class="size-chart-section">
        <button class="size-chart-btn" @click="showSizeChartFn()">Size Chart</button>
    </div>
    <div v-if="showSizeChart" class="size-chart-modal">
        <div class="size-chart-modal-content">
            <img :src="sizeChartImg" alt="Size Chart" class="size-chart-img">
            <button class="close-btn" @click="hideSizeChart()">X</button>
        </div>
    </div>

    <!-- Size Section -->
    <div v-for="(attribute, index) in attributes" :key="attribute.id" class="variant-picker-item"
        :class="`variant-${attribute.type}`">
        <div class="variant-picker-label h6 ">
            {{ attribute.name }}:
            <span class="variant-picker-label-value" :class="`value-current${attribute.type}`">
                {{ selectedVariants[attribute.name] || '' }}
            </span>
        </div>
        <div class="variant-picker-values flex-column">
            <div class="tf-select" style="width:100%">
                <select class="form-select" v-model="selectedVariants[attribute.name]">
                    <option value="">Select {{ attribute.name }}</option>
                    <option v-for="option in getSortedOptions(attribute)" :key="option.id" :value="option.value">
                        {{ option.value }}
                    </option>
                </select>
            </div>
            <!-- Show disabled textbox with edit if custom size is set -->
            <div v-if="attribute.name === 'Size' && selectedVariants[attribute.name] && selectedVariants[attribute.name].includes('Custom') && customSizeInputSaved"
                class="mt-2 d-flex align-items-center gap-2 w-100">
                <input type="text" class="form-control w-100 py-2 px-3" :value="selectedVariants[attribute.name]"
                    disabled />
                <button class="btn btn-link p-0" @click="openCustomEdit"><i class="fas fa-edit"></i> Edit</button>
            </div>
        </div>
    </div>

    <div class="variant-picker-item mb-4">
        <div class="variant-picker-label h6 mb-3">Quantity:</div>
        <div class="variant-picker-values">
            <div class="wg-quantity">
                <button class="btn-quantity btn-decrease" @click="decreaseQuantity">
                    <i class="icon-minus"></i>
                </button>
                <input class="quantity-product" type="text" name="number" v-model="localQuantity">
                <button class="btn-quantity btn-increase" @click="increaseQuantity">
                    <i class="icon-plus"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- add to cart -->
    <Buttons :product="props.product" :selected-variants="selectedVariants" :quantity="localQuantity" />

    <div class="mb-3 px-2">
        <p v-html="formatMeta(props.product?.meta_title)"></p>
    </div>

    <div class="product-accordion">
        <!-- Description Section -->
        <div class="accordion-item">
            <div class="accordion-header" @click="toggleAccordion('description')">
                <h6 class="fw-normal">Description</h6>
                <i class="icon" :class="activeAccordion === 'description' ? 'icon-minus' : 'icon-plus'"></i>
            </div>
            <div class="accordion-content" v-show="activeAccordion === 'description'">
                <div class="description-content">
                    <p>{{ capitalizeFirstLetter(productDescription) }}</p>
                </div>
            </div>
        </div>
        <!-- Style Note Section -->
        <div class="accordion-item">
            <div class="accordion-header" @click="toggleAccordion('meta_description')">
                <h6 class="fw-normal">Style Note</h6>
                <i class="icon" :class="activeAccordion === 'meta_description' ? 'icon-minus' : 'icon-plus'"></i>
            </div>
            <div class="accordion-content" v-show="activeAccordion === 'meta_description'">
                <div class="meta_description-content">
                    <p>{{ capitalizeFirstLetter(productMetaDescription) }}</p>
                </div>
            </div>
        </div>
        <!-- Care Instructions Section -->
        <div class="accordion-item">
            <div class="accordion-header" @click="toggleAccordion('careInstructions')">
                <h6 class="fw-normal">Care Instructions</h6>
                <i class="icon" :class="activeAccordion === 'careInstructions' ? 'icon-minus' : 'icon-plus'"></i>
            </div>
            <div class="accordion-content" v-show="activeAccordion === 'careInstructions'">
                <div class="care-instructions-content">
                    <p>At The Modesse, our garments are made from pure, natural fabrics that require gentle care. Dry
                        clean
                        only. Avoid harsh sunlight, wringing, soaking, or tumble drying. Iron on the reverse side.
                        Hand-dyed
                        pieces may bleed initially and soften with time. Minor weave variations are a mark of true
                        craftsmanship. </p>
                </div>
            </div>
        </div>

        <!-- Note Section -->
        <div class="accordion-item">
            <div class="accordion-header" @click="toggleAccordion('note')">
                <h6 class="fw-normal">Note</h6>
                <i class="icon" :class="activeAccordion === 'note' ? 'icon-minus' : 'icon-plus'"></i>
            </div>
            <div class="accordion-content" v-show="activeAccordion === 'note'">
                <div class="note-content">
                    <p>This piece will be handcrafted exclusively for you, which means slight variations in colour,
                        texture,
                        or pattern may occur. These subtle differences are a natural result of the artisan-led
                        techniques we
                        use—and are what make each garment uniquely yours.</p>
                </div>
            </div>
        </div>

        <!-- Shipping and Returns Section -->
        <div class="accordion-item">
            <div class="accordion-header" @click="toggleAccordion('shippingReturns')">
                <h6 class="fw-normal">Shipping and Returns</h6>
                <i class="icon" :class="activeAccordion === 'shippingReturns' ? 'icon-minus' : 'icon-plus'"></i>
            </div>
            <div class="accordion-content" v-show="activeAccordion === 'shippingReturns'">
                <div class="shipping-returns-content">
                    <p><strong>Domestic Orders:</strong> Please allow 10-12 business days for delivery. In case of any
                        unexpected delays, we'll keep you informed.</p>
                    <p>As a <b>made-to-order label</b>, each piece is carefully handcrafted by our artisans only after
                        your
                        order
                        is placed. For this reason, we are unable to offer exchanges or returns. We appreciate your
                        understanding and support for slow, intentional fashion.</p>
                </div>
            </div>
        </div>
    </div>
    <!-- Custom Size Modal -->
    <div v-if="showCustomModal" class="custom-modal-overlay">
        <div class="custom-modal">
            <h5 class="mb-3">Enter your Measurements (in inches)</h5>
            <div class="form-group mb-3">
                <label class="form-label">Bust <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="bustSizeInput" placeholder="Enter bust measurement" />
            </div>
            <div class="form-group mb-3">
                <label class="form-label">Waist <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="waistSizeInput"
                    placeholder="Enter waist measurement" />
            </div>
            <div class="form-group mb-3">
                <label class="form-label">Hip <span class="text-danger">*</span></label>
                <input type="text" class="form-control" v-model="hipSizeInput" placeholder="Enter hip measurement" />
            </div>
            <div class="form-group mb-3">
                <label class="form-label">Additional Notes (Optional)</label>
                <input type="text" class="form-control" v-model="additionalNotesInput"
                    placeholder="If anything specific, please mention." />
            </div>
            <div class="d-flex justify-content-end gap-2 mt-3">
                <button class="btn btn-secondary" @click="handleCustomCancel">Cancel</button>
                <button class="btn btn-primary" @click="handleCustomSave">Save Measurements</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Buttons from './buttons.vue'
import sizeChartImg from '@/assets/images/size-chart.png'

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
        default: () => { }
    }
})

const emit = defineEmits(['update:selected-variants', 'update:quantity'])

const selectedVariants = ref({})
const bustSizeInput = ref('')
const waistSizeInput = ref('')
const hipSizeInput = ref('')
const additionalNotesInput = ref('')
const localQuantity = ref(1)
const activeAccordion = ref('')
const productDescription = ref(props.product?.description)
const productMetaDescription = ref(props.product?.meta_description)
const showSizeChart = ref(false)
const showCustomModal = ref(false);
const customSizeInputSaved = ref(false);

function formatMeta(metaText) {
    if (!metaText) return ''
    // Replace keys before ":" with bold
    return metaText.replace(/([\w\s]+):/g, '<strong>$1:</strong>')
}

function capitalizeFirstLetter(str) {
    if (str.length === 0) {
        return "";
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function getSortedOptions(attribute) {
    const opts = Array.isArray(attribute?.options) ? attribute.options : [];
    if ((attribute?.name || '').toLowerCase() !== 'size') return opts;
    const order = ['XS', 'S', 'M', 'L', 'XL', 'Custom'];
    const indexOf = (val) => {
        const v = String(val || '').trim().toUpperCase();
        const i = order.findIndex(o => o.toUpperCase() === v);
        return i === -1 ? Number.MAX_SAFE_INTEGER : i;
    };
    return [...opts].sort((a, b) => indexOf(a?.value) - indexOf(b?.value));
}

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

onMounted(() => {
    emit('update:selected-variants', selectedVariants.value)
    emit('update:quantity', localQuantity.value)
})

watch(() => selectedVariants.value['Size'], (newVal, oldVal) => {
    if (newVal === 'Custom') {
        showCustomModal.value = true;
        bustSizeInput.value = '';
        waistSizeInput.value = '';
        hipSizeInput.value = '';
        additionalNotesInput.value = '';
        customSizeInputSaved.value = false;
    } else if (oldVal === 'Custom' && newVal && newVal !== 'Custom') {
        // When custom value is saved
        customSizeInputSaved.value = true;
        showCustomModal.value = false;
    } else if (!newVal) {
        bustSizeInput.value = '';
        waistSizeInput.value = '';
        hipSizeInput.value = '';
        additionalNotesInput.value = '';
        showCustomModal.value = false;
        customSizeInputSaved.value = false;
    } else if (oldVal === 'Custom' && newVal !== 'Custom') {
        // Clear custom measurements when changing from Custom to another size
        selectedVariants.value['Size'] = '';
        selectedVariants.value['customMeasurements'] = null;
        customSizeInputSaved.value = false;
    }
});

// Watch for when custom measurements are saved
watch(() => selectedVariants.value['customMeasurements'], (newVal) => {
    if (newVal) {
        customSizeInputSaved.value = true;
        showCustomModal.value = false;
    }
});

function handleCustomSave() {
    // Validate required fields
    if (!bustSizeInput.value.trim()) {
        alert('Please enter your bust measurement');
        return;
    }
    if (!waistSizeInput.value.trim()) {
        alert('Please enter your waist measurement');
        return;
    }
    if (!hipSizeInput.value.trim()) {
        alert('Please enter your hip measurement');
        return;
    }

    // Create merged custom size data
    const customSizeData = {
        bust: bustSizeInput.value.trim(),
        waist: waistSizeInput.value.trim(),
        hip: hipSizeInput.value.trim(),
        additionalNotes: additionalNotesInput.value.trim()
    };

    // Merge all measurements into a single string for backend
    const mergedSizeString = `Custom - Bust: ${customSizeData.bust}", Waist: ${customSizeData.waist}", Hip: ${customSizeData.hip}"${customSizeData.additionalNotes ? `, Notes: ${customSizeData.additionalNotes}` : ''}`;

    // Set the merged data to the Size attribute
    selectedVariants.value['Size'] = mergedSizeString;

    // Store individual measurements for editing
    selectedVariants.value['customMeasurements'] = customSizeData;

    customSizeInputSaved.value = true;
    showCustomModal.value = false;

}

function handleCustomCancel() {
    bustSizeInput.value = '';
    waistSizeInput.value = '';
    hipSizeInput.value = '';
    additionalNotesInput.value = '';
    showCustomModal.value = false;
    customSizeInputSaved.value = false;
}

function openCustomEdit() {
    showCustomModal.value = true;

    // Load saved custom measurements if available
    if (selectedVariants.value['customMeasurements']) {
        const measurements = selectedVariants.value['customMeasurements'];
        bustSizeInput.value = measurements.bust || '';
        waistSizeInput.value = measurements.waist || '';
        hipSizeInput.value = measurements.hip || '';
        additionalNotesInput.value = measurements.additionalNotes || '';
    } else {
        // Fallback to old format if customMeasurements doesn't exist
        // Try to parse from the Size value if it contains custom measurements
        const sizeValue = selectedVariants.value['Size'] || '';
        if (sizeValue.includes('Custom')) {
            // Extract measurements from the merged string
            const bustMatch = sizeValue.match(/Bust: ([^"]+)"/);
            const waistMatch = sizeValue.match(/Waist: ([^"]+)"/);
            const hipMatch = sizeValue.match(/Hip: ([^"]+)"/);
            const notesMatch = sizeValue.match(/Notes: (.+)$/);

            bustSizeInput.value = bustMatch ? bustMatch[1] : '';
            waistSizeInput.value = waistMatch ? waistMatch[1] : '';
            hipSizeInput.value = hipMatch ? hipMatch[1] : '';
            additionalNotesInput.value = notesMatch ? notesMatch[1] : '';
        } else {
            bustSizeInput.value = '';
            waistSizeInput.value = '';
            hipSizeInput.value = '';
            additionalNotesInput.value = '';
        }
    }
}

watch(selectedVariants, (val) => {
    emit('update:selected-variants', val)
}, { deep: true })

function showSizeChartFn() {
    showSizeChart.value = true
}

function hideSizeChart() {
    showSizeChart.value = false
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
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.tf-select::after {
    content: "";
}

.wg-quantity {
    display: flex;
    background-color: #fff;
    justify-content: space-between;
    align-items: center;
    border: 1px solid rgba(0, 0, 0, .3);
    overflow: hidden;
    padding: 10px;
    width: 40%;
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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
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

.custom-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.custom-modal {
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    min-width: 450px;
    box-shadow: 0 2px 16px rgba(0, 0, 0, 0.2);
}

.form-group {
    margin-bottom: 1rem;
}

.form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
}

.form-control {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
}

.form-control:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.text-danger {
    color: #dc3545;
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