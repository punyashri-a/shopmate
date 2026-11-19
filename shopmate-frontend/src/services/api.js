import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const DEFAULT_CUSTOMER_ID = import.meta.env.VITE_CUSTOMER_ID || 'cust_101';

// Real backend integration: defaults to false so all requests hit Spring Boot
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 60000,
});

apiClient.interceptors.request.use(
  (config) => {
    // 1. Include Customer ID header for user/session identification
    const customerId =
      localStorage.getItem('shopmate_customer_id') || DEFAULT_CUSTOMER_ID;
    if (customerId) {
      config.headers['X-Customer-Id'] = customerId;
    }

    // 2. Include JWT auth token if present
    const token = localStorage.getItem('shopmate_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const isNetworkError =
      error.code === 'ERR_NETWORK' ||
      error.message?.includes('Network Error') ||
      !error.response;

    const customError = {
      message:
        error.response?.data?.message ||
        (isNetworkError
          ? 'Unable to connect to the store service. Please check your internet connection or try again later.'
          : error.message || 'An unexpected error occurred.'),
      status: error.response?.status,
      data: error.response?.data,
      isNetworkError,
      serverUrl: API_BASE_URL,
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
