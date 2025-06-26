<template>
    <div class="tf-shop-control style-2 mb_10 border-0">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-3">
                    <div class="tf-control-filter justify-content-between pe-xxl-30">
                        <button class="tf-btn-filter h5 link" @click="$emit('toggle-sidebar')">
                            <span class="icon icon-filter d-xl-none"></span>
                            <span class="text">FILTER</span>
                        </button>
                        <button v-if="hasActiveFilters" @click="handleClearAll" class="btn-check-none tf-btn-line">
                            <span class="text-body">Clear all</span>
                        </button>
                    </div>
                </div>
                <div class="col-9">
                    <div class="tf-group-layout justify-content-end">
                        <ul class="tf-control-layout">
                            <li 
                                class="tf-view-layout-switch sw-layout-2 d-none d-md-flex" 
                                :class="{ 'active': modelValue.view === 'grid-2' }"
                                @click="updateView('grid-2')"
                            >
                                <div class="item icon-grid-2">
                                    <span></span>
                                    <span></span>
                                </div>
                            </li>
                            <li 
                                class="tf-view-layout-switch sw-layout-3 d-none d-md-flex"
                                :class="{ 'active': modelValue.view === 'grid-3' }"
                                @click="updateView('grid-3')"
                            >
                                <div class="item icon-grid-3">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </li>
                            <li 
                                class="tf-view-layout-switch sw-layout-4 d-none d-xl-flex"
                                :class="{ 'active': modelValue.view === 'grid-4' }"
                                @click="updateView('grid-4')"
                            >
                                <div class="item icon-grid-4">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </li>
                        </ul>
                        <!-- Sorting Dropdown -->
                        <div class="tf-dropdown-sort">
                            <select :value="modelValue.sort" @change="updateSort" class="form-select">
                                <option 
                                    v-for="option in sortOptions" 
                                    :key="option.value"
                                    :value="option.value"
                                >
                                    {{ option.text }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
        default: () => ({
            sort: 'default',
            view: 'grid-3'
        })
    },
    hasActiveFilters: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'toggle-sidebar', 'clear-filters', 'apply-filters']);

const sortOptions = [
    { value: 'default', text: 'Default Sorting' },
    { value: 'price_asc', text: 'Price: Low to High' },
    { value: 'price_desc', text: 'Price: High to Low' },
    { value: 'name_asc', text: 'Name: A to Z' },
    { value: 'name_desc', text: 'Name: Z to A' }
];

const updateSort = (event) => {
    emit('update:modelValue', {
        ...props.modelValue,
        sort: event.target.value
    });
};

const updateView = (view) => {
    emit('update:modelValue', {
        ...props.modelValue,
        view
    });
};

const handleClearAll = () => {
    emit('clear-filters');
    // Reset sort to default
    emit('update:modelValue', {
        ...props.modelValue,
        sort: 'default'
    });
};
</script>

<style scoped>
.tf-shop-control {
    background: #fff;
    padding: 1rem 0;
}

.tf-control-filter {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.tf-btn-filter {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
    border: none;
    background: none;
    cursor: pointer;
}

.tf-btn-filter:hover {
    color: #666;
}

.btn-check-none {
    color: #666;
    text-decoration: underline;
    border: none;
    background: none;
    cursor: pointer;
    padding: 0.5rem;
    transition: all 0.3s ease;
}

.btn-check-none:hover {
    color: #333;
    text-decoration: none;
}

.tf-control-layout {
    display: flex;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
}

.tf-view-layout-switch {
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.tf-view-layout-switch:hover {
    background: #f5f5f5;
}

.tf-view-layout-switch.active {
    background: #e9ecef;
}

.tf-dropdown-sort {
    margin-left: 1rem;
}

.form-select {
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
}

.form-select:hover {
    border-color: #999;
}

@media (max-width: 767px) {
    .tf-control-filter {
        justify-content: flex-start;
    }
    
    .tf-group-layout {
        justify-content: flex-end;
    }
}
</style>