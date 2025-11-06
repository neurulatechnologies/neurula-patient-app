/**
 * API Configuration
 *
 * This file contains all API-related configuration including
 * base URLs, endpoints, and timeout settings.
 */

// In production, these should come from environment variables
export const API_CONFIG = {
    BASE_URL: process.env.API_BASE_URL || 'https://your-api-domain.com/api',
    TIMEOUT: 30000, // 30 seconds
    ENDPOINTS: {
        OCR_SCAN: '/ocr/scan',
        EMIRATES_ID: '/ocr/emirates-id',
        PASSPORT: '/ocr/passport',
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
