import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = process.env.REACT_APP_API_URL || 'https://dbms-back.herokuapp.com';

// Create axios instance with default config
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'An unexpected error occurred';
        
        switch (error.response?.status) {
            case 401:
                toast.error('Session expired. Please login again');
                localStorage.clear();
                window.location.href = '/login';
                break;
            case 403:
                toast.error('You do not have permission to perform this action');
                break;
            case 404:
                toast.error('Resource not found');
                break;
            case 422:
                toast.error('Invalid input data');
                break;
            case 500:
                toast.error('Server error. Please try again later');
                break;
            default:
                toast.error(message);
        }
        
        return Promise.reject(error);
    }
);

export const handleApiError = (error, customMessage) => {
    console.error('API Error:', error);
    toast.error(customMessage || error.message || 'An error occurred');
    return null;
};

export default api;
