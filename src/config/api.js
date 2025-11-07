/**
 * API Configuration
 *
 * This file contains all API-related configuration including
 * base URLs, endpoints, and timeout settings.
 */

// Backend API configuration
// NOTE: React Native doesn't read .env files automatically
// Using IP address instead of localhost for React Native compatibility
export const API_CONFIG = {
    BASE_URL: 'http://172.27.140.80:8000', // OCR backend URL (WSL2 IP)
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
export const getAPIHeaders = () => ({
    'Accept': 'application/json',
    // Add authentication headers here if needed
    // 'Authorization': `Bearer ${token}`,
});
