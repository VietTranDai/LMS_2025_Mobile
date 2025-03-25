/**
 * API Endpoints
 *
 * Centralized location for all API endpoints used in the application.
 * This makes it easier to maintain URLs and version them.
 */

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
  REFRESH_TOKEN: "/auth/refresh-token",
  LOGOUT: "/auth/logout",
};

// User endpoints
export const USER_ENDPOINTS = {
  PROFILE: "/user/profile",
  UPDATE_PROFILE: "/user/profile",
  CHANGE_PASSWORD: "/user/change-password",
};

// Course endpoints
export const COURSE_ENDPOINTS = {
  LIST: "/courses",
  DETAIL: (id: string | number) => `/courses/${id}`,
  ENROLL: (id: string | number) => `/courses/${id}/enroll`,
};

// Lesson endpoints
export const LESSON_ENDPOINTS = {
  LIST: (courseId: string | number) => `/courses/${courseId}/lessons`,
  DETAIL: (courseId: string | number, lessonId: string | number) =>
    `/courses/${courseId}/lessons/${lessonId}`,
  COMPLETE: (courseId: string | number, lessonId: string | number) =>
    `/courses/${courseId}/lessons/${lessonId}/complete`,
};

// Other endpoints can be added here

// Combine all endpoints for easier imports
export default {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  COURSE: COURSE_ENDPOINTS,
  LESSON: LESSON_ENDPOINTS,
};
