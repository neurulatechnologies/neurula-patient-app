/**
 * Authentication Service
 *
 * Handles all authentication-related API calls including:
 * - User registration
 * - OTP verification
 * - Login/Logout
 * - Token management (access + refresh)
 * - Password management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: '@auth_access_token',
  REFRESH_TOKEN: '@auth_refresh_token',
  USER_DATA: '@auth_user_data',
};

// Auth endpoints
const AUTH_ENDPOINTS = {
  REGISTER: '/api/v1/auth/register',
  VERIFY_OTP: '/api/v1/auth/verify-otp',
  RESEND_OTP: '/api/v1/auth/resend-otp',
  LOGIN: '/api/v1/auth/login',
  REFRESH: '/api/v1/auth/refresh',
  LOGOUT: '/api/v1/auth/logout',
  ME: '/api/v1/auth/me',
  CHANGE_PASSWORD: '/api/v1/auth/change-password',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  RESET_PASSWORD: '/api/v1/auth/reset-password',
};

/**
 * Make API request with error handling
 */
const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  console.log('='.repeat(60));
  console.log('🌐 [AUTH SERVICE] Making API Request');
  console.log('='.repeat(60));
  console.log('📍 URL:', url);
  console.log('🔧 Method:', options.method || 'GET');
  console.log('📦 Body:', options.body ? JSON.parse(options.body) : 'None');
  console.log('-'.repeat(60));

  try {
    console.log('⏳ Sending request...');

    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
    });

    console.log('✅ Response received!');
    console.log('📊 Status:', response.status, response.statusText);

    const data = await response.json();
    console.log('📥 Response data:', data);

    if (!response.ok) {
      console.error('❌ Request failed with status:', response.status);
      console.error('❌ Error details:', data);

      // Return error with status code for better error handling
      return {
        success: false,
        error: data.detail || data.message || 'Request failed',
        status: response.status,
        data: data,
      };
    }

    console.log('✅ Request successful!');
    console.log('='.repeat(60));
    return { success: true, data };
  } catch (error) {
    console.error('='.repeat(60));
    console.error('❌ [AUTH SERVICE] API Request Failed');
    console.error('='.repeat(60));
    console.error('🔴 Error Type:', error.name);
    console.error('🔴 Error Message:', error.message);
    console.error('🔴 URL:', url);
    console.error('🔴 Endpoint:', endpoint);

    if (error.message === 'Network request failed') {
      console.error('');
      console.error('⚠️  NETWORK ERROR - Possible causes:');
      console.error('   1. Backend server is not running');
      console.error('   2. Wrong backend URL:', API_CONFIG.BASE_URL);
      console.error('   3. Network connectivity issues');
      console.error('   4. CORS/SSL certificate issues');
      console.error('');
      console.error('💡 Try running backend with:');
      console.error('   cd "../neurula-patient-backend"');
      console.error('   ./venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000');
    }
    console.error('='.repeat(60));

    return {
      success: false,
      error: error.message || 'Network request failed',
      status: null,
    };
  }
};

/**
 * Make authenticated request (with access token)
 */
const makeAuthenticatedRequest = async (endpoint, options = {}) => {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return {
      success: false,
      error: 'No access token found',
    };
  }

  return makeRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`,
    },
  });
};

// ============================================================================
// Token Management
// ============================================================================

/**
 * Store authentication tokens
 */
export const storeTokens = async (accessToken, refreshToken) => {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.ACCESS_TOKEN, accessToken],
      [STORAGE_KEYS.REFRESH_TOKEN, refreshToken],
    ]);
    return true;
  } catch (error) {
    console.error('Error storing tokens:', error);
    return false;
  }
};

/**
 * Get access token
 */
export const getAccessToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
};

/**
 * Get refresh token
 */
export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  } catch (error) {
    console.error('Error getting refresh token:', error);
    return null;
  }
};

/**
 * Clear all auth data
 */
export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
    return true;
  } catch (error) {
    console.error('Error clearing auth data:', error);
    return false;
  }
};

/**
 * Store user data
 */
export const storeUserData = async (userData) => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_DATA,
      JSON.stringify(userData)
    );
    return true;
  } catch (error) {
    console.error('Error storing user data:', error);
    return false;
  }
};

/**
 * Get user data
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

// ============================================================================
// Authentication API Calls
// ============================================================================

/**
 * Register new user
 *
 * @param {Object} userData - User registration data
 * @param {string} userData.email - User email
 * @param {string} userData.phone - Phone number (e.g., "+971501234567")
 * @param {string} userData.password - Password
 * @param {string} userData.full_name - Full name
 * @param {string} [userData.date_of_birth] - Date of birth (YYYY-MM-DD)
 * @param {string} [userData.gender] - Gender (MALE/FEMALE/OTHER)
 * @param {string} [userData.nationality] - Nationality
 * @param {string} [userData.emirates_id] - Emirates ID
 * @param {string} [userData.passport_number] - Passport number
 */
export const register = async (userData) => {
  return await makeRequest(AUTH_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * Verify OTP after registration
 *
 * @param {string} identifier - Email or phone number
 * @param {string} otp - OTP code
 */
export const verifyOtp = async (identifier, otp) => {
  return await makeRequest(AUTH_ENDPOINTS.VERIFY_OTP, {
    method: 'POST',
    body: JSON.stringify({ identifier, otp }),
  });
};

/**
 * Resend OTP
 *
 * @param {string} identifier - Email or phone number
 */
export const resendOtp = async (identifier) => {
  return await makeRequest(AUTH_ENDPOINTS.RESEND_OTP, {
    method: 'POST',
    body: JSON.stringify({ identifier }),
  });
};

/**
 * Login user
 *
 * @param {string} identifier - Email or phone number
 * @param {string} password - Password
 * @param {boolean} rememberMe - Remember me option (default: false)
 */
export const login = async (identifier, password, rememberMe = false) => {
  const response = await makeRequest(AUTH_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify({
      username: identifier,      // Backend expects 'username' field
      password: password,
      remember_me: rememberMe    // Send remember_me to backend
    }),
  });

  // Store tokens if login successful
  if (response.success && response.data) {
    const { access_token, refresh_token, user } = response.data;
    await storeTokens(access_token, refresh_token);
    await storeUserData(user);
  }

  return response;
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async () => {
  const refreshToken = await getRefreshToken();

  if (!refreshToken) {
    return {
      success: false,
      error: 'No refresh token found',
    };
  }

  const response = await makeRequest(AUTH_ENDPOINTS.REFRESH, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${refreshToken}`,
    },
  });

  // Store new access token if refresh successful
  if (response.success && response.data) {
    const { access_token } = response.data;
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
  }

  return response;
};

/**
 * Logout user
 */
export const logout = async () => {
  // Call logout endpoint to invalidate tokens on server
  await makeAuthenticatedRequest(AUTH_ENDPOINTS.LOGOUT, {
    method: 'POST',
  });

  // Clear local auth data regardless of server response
  await clearAuthData();

  return { success: true };
};

/**
 * Get current user info
 */
export const getCurrentUser = async () => {
  return await makeAuthenticatedRequest(AUTH_ENDPOINTS.ME, {
    method: 'GET',
  });
};

/**
 * Change password
 *
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 */
export const changePassword = async (currentPassword, newPassword) => {
  return await makeAuthenticatedRequest(AUTH_ENDPOINTS.CHANGE_PASSWORD, {
    method: 'POST',
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
};

/**
 * Forgot Password - Send OTP to email
 *
 * @param {string} email - User's registered email address
 */
export const forgotPassword = async (email) => {
  return await makeRequest(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

/**
 * Reset Password - Verify OTP and set new password
 *
 * @param {string} email - User's email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} newPassword - New password (minimum 8 characters)
 */
export const resetPassword = async (email, otp, newPassword) => {
  return await makeRequest(AUTH_ENDPOINTS.RESET_PASSWORD, {
    method: 'POST',
    body: JSON.stringify({
      email,
      otp,
      new_password: newPassword,
    }),
  });
};

/**
 * Check if user is authenticated (has valid tokens)
 */
export const isAuthenticated = async () => {
  const accessToken = await getAccessToken();
  return !!accessToken;
};

// Export all functions
export default {
  // Token management
  storeTokens,
  getAccessToken,
  getRefreshToken,
  clearAuthData,
  storeUserData,
  getUserData,

  // Auth operations
  register,
  verifyOtp,
  resendOtp,
  login,
  refreshAccessToken,
  logout,
  getCurrentUser,
  changePassword,
  forgotPassword,
  resetPassword,
  isAuthenticated,
};
