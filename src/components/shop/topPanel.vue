<template>
    <nav class="toolbox sticky-toolbox sticky-content fix-top">
        <div class="toolbox-left">
            <a href="#"
                class="toolbox-item left-sidebar-toggle btn btn-sm btn-outline btn-primary btn-rounded btn-icon-right d-lg-none"
                @click="$emit('toggle-sidebar')">Filter<i class="d-icon-arrow-right"></i></a>
            <div class="toolbox-item toolbox-sort select-box text-dark">
                <label>Sort By :</label>
                <select name="orderby" class="form-control" :value="modelValue.sort" @change="updateSort">
                    <option value="default">Default</option>
                    <option value="popularity">Most Popular</option>
                    <option value="rating">Average rating</option>
                    <option value="date">Latest</option>
                    <option value="price-low">Sort forward price low</option>
                    <option value="price-high">Sort forward price high</option>
                </select>
            </div>
        </div>
        <div class="toolbox-right">
            <div class="toolbox-item toolbox-show select-box text-dark">
                <label>Show :</label>
                <select name="count" class="form-control" :value="modelValue.itemsPerPage" @change="updateItemsPerPage">
                    <option value="12">12</option>
                    <option value="24">24</option>
                    <option value="36">36</option>
                </select>
            </div>
            <div class="toolbox-item toolbox-layout">
                <a href="#" class="d-icon-mode-list btn-layout" 
                   :class="{ active: modelValue.layout === 'list' }"
                   @click.prevent="updateLayout('list')"></a>
                <a href="#" class="d-icon-mode-grid btn-layout" 
                   :class="{ active: modelValue.layout === 'grid' }"
                   @click.prevent="updateLayout('grid')"></a>
            </div>
        </div>
    </nav>
</template>

<script setup>
const emit = defineEmits(['update:modelValue', 'toggle-sidebar']);

const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
        default: () => ({
            sort: 'popularity',
            itemsPerPage: 12,
            layout: 'grid'
        })
    }
});

const updateSort = (event) => {
    emit('update:modelValue', {
        ...props.modelValue,
        sort: event.target.value
    });
};

const updateItemsPerPage = (event) => {
    emit('update:modelValue', {
        ...props.modelValue,
        itemsPerPage: parseInt(event.target.value)
    });
};

const updateLayout = (newLayout) => {
    emit('update:modelValue', {
        ...props.modelValue,
        layout: newLayout
    });
};
</script>


<style scoped>
.btn-layout {
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.3s;
}

.btn-layout.active {
    opacity: 1;
}
</style>
