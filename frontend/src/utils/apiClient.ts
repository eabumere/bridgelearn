import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { config } from '../config/env';

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add JWT token and ensure /api prefix
apiClient.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && requestConfig.headers) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }

    const url = requestConfig.url || '';
    const needsApiPrefix =
      url &&
      !url.startsWith('http') &&
      !url.startsWith('/api');

    if (needsApiPrefix) {
      requestConfig.url = url.startsWith('/')
        ? `/api${url}`
        : `/api/${url}`;
    }

    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

