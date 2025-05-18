export function useStorageUrl(path) {
    return `${import.meta.env.VITE_APP_BASE_URL}/storage/${path}`;
}
