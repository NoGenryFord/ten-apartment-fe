import axios from 'axios';

import {IPConfigurator} from "./utils";

const configurator = new IPConfigurator('', '');

const BASE_URL = await configurator.getFirstWorkingUrl(import.meta.env.VITE_API_URL_HOSTS_DEV) || '/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    const hasAuthorizationHeader = Boolean(config.headers?.Authorization || config.headers?.authorization);
    if (token && !hasAuthorizationHeader) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// On 401 — try to refresh the access token once, then retry
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: unknown) => void; reject: (reason?: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const { data } = await axios.post(`${BASE_URL}/token/refresh/`, { refresh: refreshToken });
            localStorage.setItem('accessToken', data.access);
            api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
            processQueue(null, data.access);
            originalRequest.headers.Authorization = `Bearer ${data.access}`;
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            // Refresh token is expired — clear session
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('authUser');
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    },
);

export default api;