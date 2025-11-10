/**
 * API Configuration
 *
 * This file contains all API-related configuration including
 * base URLs, endpoints, and timeout settings.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Backend API configuration
// NOTE: React Native doesn't read .env files automatically
// Using IP address instead of localhost for React Native compatibility
export const API_CONFIG = {
    BASE_URL: 'http://172.27.140.80:8080', // OCR backend URL (WSL2 IP)
    TIMEOUT: 30000, // 30 seconds
    ENDPOINTS: {
        // OCR endpoints
        OCR_SCAN: '/ocr/scan',
        EMIRATES_ID: '/ocr/emirates-id',
        PASSPORT: '/ocr/passport',

        // Registration endpoints
        REGISTER_EMIRATES_ID: '/registration/emirates-id/manual',
        REGISTER_PASSPORT: '/registration/passport/manual',
        GET_EMIRATES_ID: '/registration/emirates-id',
        GET_PASSPORT: '/registration/passport',

        // Auth endpoints
        AUTH_REGISTER: '/api/v1/auth/register',
        AUTH_VERIFY_OTP: '/api/v1/auth/verify-otp',
        AUTH_RESEND_OTP: '/api/v1/auth/resend-otp',
        AUTH_LOGIN: '/api/v1/auth/login',
        AUTH_REFRESH: '/api/v1/auth/refresh',
        AUTH_LOGOUT: '/api/v1/auth/logout',
        AUTH_ME: '/api/v1/auth/me',
        AUTH_CHANGE_PASSWORD: '/api/v1/auth/change-password',
    },
};

/**
 * API request configuration
 *
 * IMPORTANT: Do NOT set Content-Type header when using FormData!
 * React Native's fetch API must auto-generate the Content-Type with
 * the correct multipart boundary. Setting it manually will cause
 * "Network request failed" errors.
 */
export const getAPIHeaders = async (includeAuth = false) => {
    const headers = {
        'Accept': 'application/json',
    };

    // Add authentication header if requested
    if (includeAuth) {
        try {
            const accessToken = await AsyncStorage.getItem('@auth_access_token');
            if (accessToken) {
                headers['Authorization'] = `Bearer ${accessToken}`;
            }
        } catch (error) {
            console.error('Error getting access token:', error);
        }
    }

    return headers;
};

/**
 * Make authenticated API request with automatic token refresh
 *
 * @param {string} url - Full URL or endpoint path
 * @param {Object} options - Fetch options
 * @param {boolean} retry - Internal flag for retry logic
 * @returns {Promise<Response>}
 */
export const fetchWithAuth = async (url, options = {}, retry = true) => {
    try {
        // Get access token
        const accessToken = await AsyncStorage.getItem('@auth_access_token');

        if (!accessToken) {
            throw new Error('No access token available');
        }

        // Make request with token
        const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;
        const response = await fetch(fullUrl, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
                ...options.headers,
            },
        });

        // If unauthorized and we haven't retried yet, try refreshing token
        if (response.status === 401 && retry) {
            const refreshed = await refreshToken();

            if (refreshed) {
                // Retry request with new token
                return fetchWithAuth(url, options, false);
            } else {
                // Token refresh failed - redirect to login
                throw new Error('Session expired. Please login again.');
            }
        }

        return response;
    } catch (error) {
        console.error('Authenticated fetch error:', error);
        throw error;
    }
};

/**
 * Refresh access token using refresh token
 *
 * @returns {Promise<boolean>} - True if refresh successful
 */
const refreshToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem('@auth_refresh_token');

        if (!refreshToken) {
            return false;
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH_REFRESH}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${refreshToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();

            // Store new access token
            await AsyncStorage.setItem('@auth_access_token', data.access_token);
            return true;
        }

        return false;
    } catch (error) {
        console.error('Token refresh error:', error);
        return false;
    }
};
