import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getItem, removeItem } from "@/utils/asyncStorage";
import { AUTH_KEY, type LoginData } from "@/modules/auth/types/auth";
import env from "@/config/environment";

/**
 * API Client Configuration
 *
 * Configured Axios instance with:
 * - Base URL from .env using react-native-dotenv
 * - Authentication token handling
 * - Error handling with automatic logout
 * - Request/response debugging
 */

// Create API request configuration
const apiConfig: AxiosRequestConfig = {
  baseURL: `${env.apiUrl}/${env.apiVersion}`,
  timeout: env.apiTimeout,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// Create API instance
const apiClient: AxiosInstance = axios.create(apiConfig);

// Request interceptor - adds auth token to requests
apiClient.interceptors.request.use(async (config) => {
  // Add logging in debug mode
  if (env.apiDebug) {
    console.log(
      `API Request: ${config.method?.toUpperCase()} ${config.url}`,
      config.data || {}
    );
  }

  // Add authentication token if available
  const data = await getItem<LoginData>(AUTH_KEY);
  config.headers.Authorization = data ? `Bearer ${data.token}` : "";
  return config;
});

// Response interceptor - handles errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response in debug mode
    if (env.apiDebug) {
      console.log(`API Response: ${response.status}`, response.data);
    }
    return response;
  },
  async (error) => {
    const { status } = error.response || {};

    // Handle authentication errors
    if (status === 401 || status === 403) {
      // Remove token and redirect to login screen
      await removeItem(AUTH_KEY);

      return Promise.reject(
        status === 401
          ? "Phiên đăng nhập hết hạn"
          : "Bạn không có quyền truy cập"
      );
    }

    // Log errors in debug mode
    if (env.apiDebug) {
      console.error("API Error:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
