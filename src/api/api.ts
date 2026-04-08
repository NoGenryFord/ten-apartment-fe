import axios from 'axios';

import {IPConfigurator} from "./utils";

const configurator = new IPConfigurator();

const BASE_URL = await configurator.getFirstWorkingUrl(import.meta.env.VITE_API_URL_HOSTS_DEV) || '/api';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

//Перехватчик для JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;