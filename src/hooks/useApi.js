import { useState, useCallback } from 'react';
import api from '../utils/api';
import { toast } from 'react-toastify';

export const useApi = (initialLoading = false) => {
    const [loading, setLoading] = useState(initialLoading);
    const [error, setError] = useState(null);

    const execute = useCallback(async (apiCall, successMessage) => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiCall();
            
            if (successMessage) {
                toast.success(successMessage);
            }
            
            return response.data;
        } catch (err) {
            setError(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, execute };
};

export const useApiGet = (url, options = {}) => {
    const { initialData = null, dependencies = [] } = options;
    const [data, setData] = useState(initialData);
    const { loading, error, execute } = useApi();

    const fetchData = useCallback(async () => {
        const result = await execute(() => api.get(url));
        if (result) {
            setData(result.data);
        }
    }, [url, execute]);

    return { data, loading, error, refetch: fetchData };
};

export const useApiMutation = () => {
    const { loading, error, execute } = useApi();

    const mutate = useCallback(async (method, url, data, successMessage) => {
        return execute(() => api[method](url, data), successMessage);
    }, [execute]);

    return { loading, error, mutate };
};
