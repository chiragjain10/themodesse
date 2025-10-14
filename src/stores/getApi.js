import axios from 'axios';
import { useLoadingStore } from './loading';

export const getData = async (url, config = {}) => {
    const loadingStore = useLoadingStore();
    loadingStore.startLoading();
    
    try {
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        console.error(`GET ${url} failed:`, error.response || error);
        if (error.response) {
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
        throw error;
    } finally {
        loadingStore.stopLoading();
    }
};