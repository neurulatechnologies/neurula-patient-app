/**
 * OCR Service
 *
 * This service handles all OCR-related API calls for document scanning,
 * including Emirates ID and Passport scanning.
 */

import { API_CONFIG, getAPIHeaders } from '../config/api';
import NetInfo from '@react-native-community/netinfo';

/**
 * Checks if device has internet connectivity
 * @returns {Promise<boolean>} - True if connected, false otherwise
 */
const checkNetworkConnectivity = async () => {
    try {
        const netInfo = await NetInfo.fetch();
        return netInfo.isConnected && netInfo.isInternetReachable !== false;
    } catch (error) {
        console.warn('[OCR] Network check failed:', error);
        // If network check fails, allow the request to proceed
        // The fetch will handle the actual network error
        return true;
    }
};

/**
 * Creates a fetch request with timeout using AbortController
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>} - Fetch response
 */
const fetchWithTimeout = async (url, options = {}, timeout = API_CONFIG.TIMEOUT) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout - Please check your internet connection and try again.');
        }
        throw error;
    }
};

/**
 * Uploads and processes an Emirates ID image for OCR extraction
 *
 * @param {string} imageUri - The local URI of the captured image
 * @returns {Promise<Object>} - Extracted Emirates ID data
 * @throws {Error} - If the API call fails
 */
export const scanEmiratesID = async (imageUri) => {
    try {
        // Check network connectivity first
        const isConnected = await checkNetworkConnectivity();
        if (!isConnected) {
            throw new Error('No internet connection. Please check your network and try again.');
        }

        // Validate API configuration
        if (!API_CONFIG.BASE_URL || API_CONFIG.BASE_URL.includes('your-api-domain')) {
            throw new Error('API URL not configured. Please set API_BASE_URL in your .env file.');
        }

        // Create FormData for multipart upload
        const formData = new FormData();

        // Extract filename from URI
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // Append the image file
        formData.append('image', {
            uri: imageUri,
            name: filename || 'emirates-id.jpg',
            type,
        });

        // Add document type
        formData.append('document_type', 'emirates_id');

        console.log('[OCR] Uploading Emirates ID to:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMIRATES_ID}`);

        // Make API request with timeout
        const response = await fetchWithTimeout(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMIRATES_ID}`,
            {
                method: 'POST',
                headers: getAPIHeaders(),
                body: formData,
            }
        );

        console.log('[OCR] Response status:', response.status);

        // Handle response
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Server returned status ${response.status}`;
            console.error('[OCR] API Error:', errorMessage, errorData);
            throw new Error(errorMessage);
        }

        const data = await response.json();

        // Validate response data
        if (!data || !data.extracted) {
            console.error('[OCR] Invalid response format:', data);
            throw new Error('Invalid response format from OCR API');
        }

        console.log('[OCR] Successfully extracted Emirates ID data');

        // Return extracted data in expected format
        return {
            success: true,
            extracted: {
                full_name: data.extracted.full_name || '',
                emirates_id: data.extracted.emirates_id || '',
                nationality: data.extracted.nationality || '',
                date_of_birth: data.extracted.date_of_birth || '',
                sex: data.extracted.sex || '',
                expiry: data.extracted.expiry || '',
            },
            confidence: data.confidence || 0,
            raw_data: data.raw_data || null,
        };
    } catch (error) {
        console.error('[OCR] Emirates ID OCR Error:', error);

        // Provide detailed error messages based on error type
        if (error.message.includes('API URL not configured')) {
            throw error;
        }

        if (error.message.includes('Network request failed')) {
            throw new Error('Network error - Please check your internet connection and try again.');
        }

        if (error.message.includes('timeout')) {
            throw error; // Already has a good message from fetchWithTimeout
        }

        // Re-throw with more context
        throw new Error(
            error.message || 'Failed to process Emirates ID. Please try again.'
        );
    }
};

/**
 * Uploads and processes a Passport image for OCR extraction
 *
 * @param {string} imageUri - The local URI of the captured image
 * @returns {Promise<Object>} - Extracted Passport data
 * @throws {Error} - If the API call fails
 */
export const scanPassport = async (imageUri) => {
    try {
        // Check network connectivity first
        const isConnected = await checkNetworkConnectivity();
        if (!isConnected) {
            throw new Error('No internet connection. Please check your network and try again.');
        }

        // Validate API configuration
        if (!API_CONFIG.BASE_URL || API_CONFIG.BASE_URL.includes('your-api-domain')) {
            throw new Error('API URL not configured. Please set API_BASE_URL in your .env file.');
        }

        // Create FormData for multipart upload
        const formData = new FormData();

        // Extract filename from URI
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // Append the image file
        formData.append('image', {
            uri: imageUri,
            name: filename || 'passport.jpg',
            type,
        });

        // Add document type
        formData.append('document_type', 'passport');

        console.log('[OCR] Uploading Passport to:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PASSPORT}`);

        // Make API request with timeout
        const response = await fetchWithTimeout(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PASSPORT}`,
            {
                method: 'POST',
                headers: getAPIHeaders(),
                body: formData,
            }
        );

        console.log('[OCR] Response status:', response.status);

        // Handle response
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.message || `Server returned status ${response.status}`;
            console.error('[OCR] API Error:', errorMessage, errorData);
            throw new Error(errorMessage);
        }

        const data = await response.json();

        // Validate response data
        if (!data || !data.extracted) {
            console.error('[OCR] Invalid response format:', data);
            throw new Error('Invalid response format from OCR API');
        }

        console.log('[OCR] Successfully extracted Passport data');

        // Return extracted data in expected format
        return {
            success: true,
            extracted: {
                full_name: data.extracted.full_name || '',
                passport_number: data.extracted.passport_number || '',
                nationality: data.extracted.nationality || '',
                date_of_birth: data.extracted.date_of_birth || '',
                sex: data.extracted.sex || '',
                expiry: data.extracted.expiry || '',
                issue_date: data.extracted.issue_date || '',
                place_of_birth: data.extracted.place_of_birth || '',
            },
            confidence: data.confidence || 0,
            raw_data: data.raw_data || null,
        };
    } catch (error) {
        console.error('[OCR] Passport OCR Error:', error);

        // Provide detailed error messages based on error type
        if (error.message.includes('API URL not configured')) {
            throw error;
        }

        if (error.message.includes('Network request failed')) {
            throw new Error('Network error - Please check your internet connection and try again.');
        }

        if (error.message.includes('timeout')) {
            throw error; // Already has a good message from fetchWithTimeout
        }

        // Re-throw with more context
        throw new Error(
            error.message || 'Failed to process Passport. Please try again.'
        );
    }
};

/**
 * Generic document scan function that routes to the appropriate scanner
 *
 * @param {string} imageUri - The local URI of the captured image
 * @param {string} documentType - Type of document ('emirates_id' or 'passport')
 * @returns {Promise<Object>} - Extracted document data
 */
export const scanDocument = async (imageUri, documentType) => {
    switch (documentType) {
        case 'emirates_id':
            return await scanEmiratesID(imageUri);
        case 'passport':
            return await scanPassport(imageUri);
        default:
            throw new Error(`Unsupported document type: ${documentType}`);
    }
};
