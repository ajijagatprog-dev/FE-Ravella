import axios from 'axios';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

const api = axios.create({
    baseURL: `${backendUrl}/api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

export const csrf = () => axios.get(`${backendUrl}/sanctum/csrf-cookie`, {
    withCredentials: true
});

api.interceptors.request.use(async (config) => {
    if (typeof window !== 'undefined') {
        const authData = localStorage.getItem('auth');
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                if (parsed.token) {
                    config.headers.Authorization = `Bearer ${parsed.token}`;
                }
            } catch (error) {
                console.error('Error parsing auth from local storage', error);
            }
        }
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('auth');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
