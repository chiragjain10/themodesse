<template>
    <div class="toast-container">
        <div v-for="toast in toasts" 
             :key="toast.id" 
             class="toast show" 
             :class="toast.type"
             role="alert" 
             aria-live="assertive" 
             aria-atomic="true">
            <div class="toast-header">
                <strong class="me-auto">{{ getTitle(toast.type) }}</strong>
                <button type="button" 
                        class="btn-close" 
                        @click="remove(toast.id)" 
                        aria-label="Close"></button>
            </div>
            <div class="toast-body">
                {{ toast.message }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { useToast } from '@/composables/useToast';

const { toasts, remove } = useToast();

const getTitle = (type) => {
    switch (type) {
        case 'success':
            return 'Success';
        case 'error':
            return 'Error';
        case 'warning':
            return 'Warning';
        default:
            return 'Info';
    }
};
</script>

<style scoped>
.toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
}

.toast {
    min-width: 300px;
    margin-bottom: 10px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.toast.success {
    border-left: 4px solid #28a745;
}

.toast.error {
    border-left: 4px solid #dc3545;
}

.toast.warning {
    border-left: 4px solid #ffc107;
}

.toast.info {
    border-left: 4px solid #17a2b8;
}

.toast-header {
    padding: 0.5rem 0.75rem;
    background-color: rgba(255,255,255,0.85);
    border-bottom: 1px solid rgba(0,0,0,0.05);
}

.toast-body {
    padding: 0.75rem;
}
</style> 