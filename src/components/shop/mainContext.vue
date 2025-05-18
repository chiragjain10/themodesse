<script setup>
import { ref } from 'vue';
import LeftPanel from './leftPanel.vue';
import TopPanel from './topPanel.vue';
import RightPanel from './rightPanel.vue';
import Pagination from './pagination.vue';

const showSidebar = ref(false);

const panelState = ref({
    layout: 'grid',
    sort: 'popularity',
    itemsPerPage: 12
});

const toggleSidebar = () => {
    showSidebar.value = !showSidebar.value;
};
</script>

<template>
    <div class="page-content mb-10 pb-3"> 
        <div class="container">
            <div class="row main-content-wrap gutter-lg">
                <LeftPanel :class="{ 'show': showSidebar }" />
                <div class="col-lg-9 main-content">
                    <!-- <TopPanel v-model="filterOptions" @toggle-sidebar="$emit('toggle-sidebar')" /> -->
                    <RightPanel 
                        :layout="panelState.layout" 
                        :sort="panelState.sort" 
                        :itemsPerPage="panelState.itemsPerPage"
                    />
                    <Pagination />
                </div>
            </div>
        </div>
    </div>
</template>
