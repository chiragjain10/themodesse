import { ref } from 'vue';

export function useToast() {
    const toasts = ref([]);

    const show = (message, type = 'info', duration = 3000) => {
        const id = Date.now();
        toasts.value.push({
            id,
            message,
            type,
            duration
        });

        setTimeout(() => {
            remove(id);
        }, duration);
    };

    const remove = (id) => {
        const index = toasts.value.findIndex(t => t.id === id);
        if (index !== -1) {
            toasts.value.splice(index, 1);
        }
    };

    const success = (message, duration) => show(message, 'success', duration);
    const error = (message, duration) => show(message, 'error', duration);
    const info = (message, duration) => show(message, 'info', duration);
    const warning = (message, duration) => show(message, 'warning', duration);

    return {
        toasts,
        show,
        success,
        error,
        info,
        warning,
        remove
    };
}