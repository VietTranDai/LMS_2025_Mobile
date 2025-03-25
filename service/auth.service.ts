import apiClient from "./apiClient";
import { AUTH_ENDPOINTS } from "./endpoints";
import { setItem, removeItem } from "@/utils/asyncStorage";
import { AUTH_KEY, type LoginData } from "@/modules/auth/types/auth";

/**
 * Authentication Service
 *
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Login user
   * @param email User email
   * @param password User password
   * @returns Login response data
   */
  async login(email: string, password: string) {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, {
      email,
      password,
    });

    // Save auth data to storage
    if (response.data?.token) {
      await setItem(AUTH_KEY, response.data);
    }

    return response.data;
  }

  /**
   * Register new user
   * @param userData User registration data
   * @returns Registration response
   */
  async register(userData: any) {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
    return response.data;
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call logout endpoint if needed
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      // Ignore errors on logout
    } finally {
      // Always remove auth data
      await removeItem(AUTH_KEY);
    }
  }

  /**
   * Request password reset
   * @param email User email
   * @returns Response data
   */
  async forgotPassword(email: string) {
    const response = await apiClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
      email,
    });
    return response.data;
  }

  /**
   * Reset password with token
   * @param token Reset token
   * @param password New password
   * @returns Response data
   */
  async resetPassword(token: string, password: string) {
    const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, {
      token,
      password,
    });
    return response.data;
  }
}

export default new AuthService();
