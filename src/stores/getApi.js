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
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response data:', error.response.data);
            console.error('Error response status:', error.response.status);
            console.error('Error response headers:', error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
        }
        throw error;
    } finally {
        loadingStore.stopLoading();
    }
};