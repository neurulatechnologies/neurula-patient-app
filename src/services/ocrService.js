/**
 * OCR Service
 *
 * This service handles all OCR-related API calls for document scanning,
 * including Emirates ID and Passport scanning.
 *
 * Error Codes:
 * - OCR_001: Network/connectivity errors
 * - OCR_002: Invalid file/validation errors
 * - OCR_003: Processing/OCR extraction errors
 * - OCR_004: Low confidence/quality errors
 * - OCR_005: Server errors
 * - OCR_006: Timeout errors
 */

import { API_CONFIG, getAPIHeaders } from '../config/api';
import NetInfo from '@react-native-community/netinfo';

/**
 * Generates a unique request ID for tracking
 * @returns {string} - Unique request ID
 */
const generateRequestId = () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 11);
    return `OCR-${timestamp}-${random}`;
};

/**
 * Checks if device has internet connectivity
 * @returns {Promise<Object>} - Network status object
 */
const checkNetworkConnectivity = async () => {
    try {
        const netInfo = await NetInfo.fetch();
        const isConnected = netInfo.isConnected && netInfo.isInternetReachable !== false;

        console.log('[OCR] Network Status:', {
            connected: isConnected,
            type: netInfo.type,
            isInternetReachable: netInfo.isInternetReachable,
        });

        return {
            isConnected,
            type: netInfo.type,
            isInternetReachable: netInfo.isInternetReachable,
        };
    } catch (error) {
        console.warn('[OCR] Network check failed:', error);
        // If network check fails, allow the request to proceed
        // The fetch will handle the actual network error
        return {
            isConnected: true,
            type: 'unknown',
            error: error.message,
        };
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
    const requestId = generateRequestId();
    const startTime = Date.now();

    console.group(`[${requestId}] Emirates ID Scan Request`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📸 Starting Emirates ID scan process');
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('📱 Image URI:', imageUri);
    console.log('🌐 API Endpoint:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMIRATES_ID}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        // Step 1: Check network connectivity
        console.log('\n[Step 1/5] 🔍 Checking network connectivity...');
        const networkStatus = await checkNetworkConnectivity();

        if (!networkStatus.isConnected) {
            console.error('❌ Network connectivity failed');
            console.error('Network status:', networkStatus);
            console.groupEnd();
            const error = new Error('[OCR_001] No internet connection detected. Please check your network settings and try again.');
            error.code = 'OCR_001';
            error.userMessage = 'No Internet Connection';
            error.actionableSteps = [
                'Check if WiFi or mobile data is enabled',
                'Try toggling airplane mode',
                'Move to an area with better signal'
            ];
            throw error;
        }
        console.log('✅ Network connected:', networkStatus.type);

        // Step 2: Validate API configuration
        console.log('\n[Step 2/5] ⚙️  Validating API configuration...');
        if (!API_CONFIG.BASE_URL || API_CONFIG.BASE_URL.includes('your-api-domain')) {
            console.error('❌ API configuration invalid');
            console.error('BASE_URL:', API_CONFIG.BASE_URL);
            console.groupEnd();
            const error = new Error('[OCR_002] API not configured. Please contact support.');
            error.code = 'OCR_002';
            error.userMessage = 'Configuration Error';
            throw error;
        }
        console.log('✅ API configuration valid');

        // Step 3: Prepare image upload
        console.log('\n[Step 3/5] 📦 Preparing image for upload...');

        // Extract filename from URI
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // Normalize and validate file URI for React Native Android compatibility
        let normalizedUri = imageUri;
        console.log('Original URI:', imageUri);

        // Ensure proper file:// prefix for React Native Android
        if (!imageUri.startsWith('file://') &&
            !imageUri.startsWith('content://') &&
            !imageUri.startsWith('http://') &&
            !imageUri.startsWith('https://')) {
            normalizedUri = `file://${imageUri}`;
            console.log('Normalized URI to:', normalizedUri);
        }

        console.log('File details:', {
            filename: filename || 'emirates-id.jpg',
            type,
            originalUri: imageUri.substring(0, 50) + '...',
            normalizedUri: normalizedUri.substring(0, 50) + '...',
        });

        // Create FormData with normalized URI
        const formData = new FormData();
        formData.append('image', {
            uri: normalizedUri,
            name: filename || 'emirates-id.jpg',
            type,
        });
        // Note: Removed document_type and request_id fields - backend doesn't expect them
        // Request ID is sent via X-Request-ID header instead

        console.log('✅ FormData prepared');

        // Step 4: Upload to API using XMLHttpRequest (more reliable for FormData on React Native Android)
        console.log('\n[Step 4/5] 🚀 Uploading image to OCR service...');
        console.log('Request timeout:', `${API_CONFIG.TIMEOUT}ms`);
        console.log('Using XMLHttpRequest for better React Native compatibility');

        const uploadStartTime = Date.now();

        const response = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            // Setup timeout
            xhr.timeout = API_CONFIG.TIMEOUT;

            xhr.onload = () => {
                const uploadTime = Date.now() - uploadStartTime;
                console.log(`✅ Upload completed in ${uploadTime}ms`);
                console.log('HTTP Status:', xhr.status, xhr.statusText);

                resolve({
                    ok: xhr.status >= 200 && xhr.status < 300,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: {
                        get: (name) => xhr.getResponseHeader(name),
                    },
                    json: async () => {
                        try {
                            return JSON.parse(xhr.responseText);
                        } catch (e) {
                            console.error('Failed to parse response:', xhr.responseText);
                            throw new Error('Invalid JSON response from server');
                        }
                    },
                });
            };

            xhr.onerror = (e) => {
                const uploadTime = Date.now() - uploadStartTime;
                console.error(`❌ XHR error after ${uploadTime}ms`);
                console.error('XHR error event:', e);
                reject(new Error('Network request failed'));
            };

            xhr.ontimeout = () => {
                const uploadTime = Date.now() - uploadStartTime;
                console.error(`❌ XHR timeout after ${uploadTime}ms`);
                reject(new Error('Request timeout - Server took too long to respond'));
            };

            xhr.onabort = () => {
                const uploadTime = Date.now() - uploadStartTime;
                console.error(`❌ XHR aborted after ${uploadTime}ms`);
                reject(new Error('Request aborted'));
            };

            // Open connection
            xhr.open('POST', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.EMIRATES_ID}`);

            // Set headers
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('X-Request-ID', requestId);
            // DO NOT set Content-Type - let XMLHttpRequest set it automatically with boundary

            console.log('Sending XHR request with FormData...');
            xhr.send(formData);
        });

        // Step 5: Process response
        console.log('\n[Step 5/5] 📋 Processing server response...');

        if (!response.ok) {
            console.error('❌ Server returned error status:', response.status);

            const errorData = await response.json().catch(() => ({}));
            console.error('Error details:', errorData);

            let errorCode = 'OCR_005';
            let userMessage = 'Server Error';
            let actionableSteps = ['Please try again', 'If problem persists, contact support'];

            if (response.status === 400) {
                errorCode = 'OCR_002';
                userMessage = 'Invalid Image';
                actionableSteps = [
                    'Ensure the image is clear and well-lit',
                    'Make sure the entire Emirates ID is visible',
                    'Try capturing the image again'
                ];
            } else if (response.status === 413) {
                errorCode = 'OCR_002';
                userMessage = 'File Too Large';
                actionableSteps = [
                    'Image file size exceeds 10MB',
                    'Try capturing a new image with lower quality settings'
                ];
            } else if (response.status >= 500) {
                errorCode = 'OCR_005';
                userMessage = 'Server Error';
            }

            const errorMessage = errorData.detail || errorData.message || `Server error: ${response.status}`;

            console.groupEnd();
            const error = new Error(`[${errorCode}] ${errorMessage}`);
            error.code = errorCode;
            error.userMessage = userMessage;
            error.actionableSteps = actionableSteps;
            error.httpStatus = response.status;
            throw error;
        }

        const data = await response.json();
        console.log('Server response received');

        // Validate response structure
        if (!data || !data.extracted) {
            console.error('❌ Invalid response format');
            console.error('Response data:', data);
            console.groupEnd();
            const error = new Error('[OCR_003] Invalid response from server. Please try again.');
            error.code = 'OCR_003';
            error.userMessage = 'Processing Error';
            throw error;
        }

        console.log('✅ Response validation passed');
        console.log('Extracted fields:', Object.keys(data.extracted));
        console.log('Confidence score:', data.confidence);

        // Check confidence threshold
        if (data.confidence < 0.5) {
            console.warn('⚠️  Low confidence score detected:', data.confidence);
            console.warn('This may indicate poor image quality or unclear document');
        }

        const totalTime = Date.now() - startTime;
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Emirates ID scan completed successfully');
        console.log(`⏱️  Total processing time: ${totalTime}ms`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.groupEnd();

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
            requestId,
            processingTime: totalTime,
        };
    } catch (error) {
        const totalTime = Date.now() - startTime;

        console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ Emirates ID scan failed');
        console.error(`⏱️  Failed after: ${totalTime}ms`);
        console.error('Error details:', {
            code: error.code || 'UNKNOWN',
            message: error.message,
            name: error.name,
        });
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.groupEnd();

        // If error already has our structure, throw as-is
        if (error.code && error.code.startsWith('OCR_')) {
            throw error;
        }

        // Categorize unknown errors
        if (error.message.includes('Network request failed') || error.name === 'TypeError') {
            const networkError = new Error('[OCR_001] Network request failed. Please check your connection.');
            networkError.code = 'OCR_001';
            networkError.userMessage = 'Network Error';
            networkError.actionableSteps = [
                'Check your internet connection',
                'Ensure the backend server is running',
                'Try again in a moment'
            ];
            throw networkError;
        }

        if (error.name === 'AbortError' || error.message.includes('timeout')) {
            const timeoutError = new Error('[OCR_006] Request timed out. The server took too long to respond.');
            timeoutError.code = 'OCR_006';
            timeoutError.userMessage = 'Request Timeout';
            timeoutError.actionableSteps = [
                'Check your internet connection speed',
                'Try again with better lighting for faster processing',
                'Contact support if issue persists'
            ];
            throw timeoutError;
        }

        // Generic processing error
        const genericError = new Error(`[OCR_003] ${error.message || 'Failed to process Emirates ID'}`);
        genericError.code = 'OCR_003';
        genericError.userMessage = 'Processing Error';
        genericError.actionableSteps = [
            'Ensure the document is clearly visible',
            'Try capturing the image again',
            'Contact support if problem persists'
        ];
        throw genericError;
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
    const requestId = generateRequestId();
    const startTime = Date.now();

    console.group(`[${requestId}] Passport Scan Request`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📸 Starting Passport scan process');
    console.log('⏰ Timestamp:', new Date().toISOString());
    console.log('📱 Image URI:', imageUri);
    console.log('🌐 API Endpoint:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PASSPORT}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
        // Step 1: Check network connectivity
        console.log('\n[Step 1/5] 🔍 Checking network connectivity...');
        const networkStatus = await checkNetworkConnectivity();

        if (!networkStatus.isConnected) {
            console.error('❌ Network connectivity failed');
            console.groupEnd();
            const error = new Error('[OCR_001] No internet connection detected. Please check your network settings and try again.');
            error.code = 'OCR_001';
            error.userMessage = 'No Internet Connection';
            error.actionableSteps = [
                'Check if WiFi or mobile data is enabled',
                'Try toggling airplane mode',
                'Move to an area with better signal'
            ];
            throw error;
        }
        console.log('✅ Network connected:', networkStatus.type);

        // Step 2: Validate API configuration
        console.log('\n[Step 2/5] ⚙️  Validating API configuration...');
        if (!API_CONFIG.BASE_URL || API_CONFIG.BASE_URL.includes('your-api-domain')) {
            console.error('❌ API configuration invalid');
            console.groupEnd();
            const error = new Error('[OCR_002] API not configured. Please contact support.');
            error.code = 'OCR_002';
            error.userMessage = 'Configuration Error';
            throw error;
        }
        console.log('✅ API configuration valid');

        // Step 3: Prepare image upload
        console.log('\n[Step 3/5] 📦 Preparing image for upload...');

        // Extract filename from URI
        const filename = imageUri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        // Normalize and validate file URI for React Native Android compatibility
        let normalizedUri = imageUri;
        console.log('Original URI:', imageUri);

        if (!imageUri.startsWith('file://') &&
            !imageUri.startsWith('content://') &&
            !imageUri.startsWith('http://') &&
            !imageUri.startsWith('https://')) {
            normalizedUri = `file://${imageUri}`;
            console.log('Normalized URI to:', normalizedUri);
        }

        console.log('File details:', {
            filename: filename || 'passport.jpg',
            type,
            normalizedUri: normalizedUri.substring(0, 50) + '...',
        });

        // Create FormData with normalized URI
        const formData = new FormData();
        formData.append('image', {
            uri: normalizedUri,
            name: filename || 'passport.jpg',
            type,
        });
        console.log('✅ FormData prepared');

        // Step 4: Upload to API using XMLHttpRequest
        console.log('\n[Step 4/5] 🚀 Uploading image to OCR service...');
        console.log('Using XMLHttpRequest for better React Native compatibility');

        const uploadStartTime = Date.now();

        const response = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.timeout = API_CONFIG.TIMEOUT;

            xhr.onload = () => {
                const uploadTime = Date.now() - uploadStartTime;
                console.log(`✅ Upload completed in ${uploadTime}ms`);
                console.log('HTTP Status:', xhr.status, xhr.statusText);

                resolve({
                    ok: xhr.status >= 200 && xhr.status < 300,
                    status: xhr.status,
                    statusText: xhr.statusText,
                    headers: {
                        get: (name) => xhr.getResponseHeader(name),
                    },
                    json: async () => {
                        try {
                            return JSON.parse(xhr.responseText);
                        } catch (e) {
                            console.error('Failed to parse response:', xhr.responseText);
                            throw new Error('Invalid JSON response from server');
                        }
                    },
                });
            };

            xhr.onerror = (e) => {
                console.error('❌ XHR error:', e);
                reject(new Error('Network request failed'));
            };

            xhr.ontimeout = () => {
                console.error('❌ XHR timeout');
                reject(new Error('Request timeout - Server took too long to respond'));
            };

            xhr.onabort = () => {
                console.error('❌ XHR aborted');
                reject(new Error('Request aborted'));
            };

            xhr.open('POST', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PASSPORT}`);
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('X-Request-ID', requestId);

            console.log('Sending XHR request with FormData...');
            xhr.send(formData);
        });

        // Step 5: Process response
        console.log('\n[Step 5/5] 📋 Processing server response...');

        if (!response.ok) {
            console.error('❌ Server returned error status:', response.status);
            const errorData = await response.json().catch(() => ({}));
            console.error('Error details:', errorData);

            let errorCode = 'OCR_005';
            let userMessage = 'Server Error';
            let actionableSteps = ['Please try again', 'If problem persists, contact support'];

            if (response.status === 400) {
                errorCode = 'OCR_002';
                userMessage = 'Invalid Image';
                actionableSteps = [
                    'Ensure the image is clear and well-lit',
                    'Make sure the entire passport is visible',
                    'Try capturing the image again'
                ];
            }

            const errorMessage = errorData.detail || errorData.message || `Server error: ${response.status}`;
            console.groupEnd();

            const error = new Error(`[${errorCode}] ${errorMessage}`);
            error.code = errorCode;
            error.userMessage = userMessage;
            error.actionableSteps = actionableSteps;
            error.httpStatus = response.status;
            throw error;
        }

        const data = await response.json();

        if (!data || !data.extracted) {
            console.error('❌ Invalid response format');
            console.groupEnd();
            const error = new Error('[OCR_003] Invalid response from server. Please try again.');
            error.code = 'OCR_003';
            error.userMessage = 'Processing Error';
            throw error;
        }

        console.log('✅ Response validation passed');
        console.log('Extracted fields:', Object.keys(data.extracted));
        console.log('Confidence score:', data.confidence);

        const totalTime = Date.now() - startTime;
        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Passport scan completed successfully');
        console.log(`⏱️  Total processing time: ${totalTime}ms`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.groupEnd();

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
            requestId,
            processingTime: totalTime,
        };
    } catch (error) {
        const totalTime = Date.now() - startTime;

        console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('❌ Passport scan failed');
        console.error(`⏱️  Failed after: ${totalTime}ms`);
        console.error('Error details:', {
            code: error.code || 'UNKNOWN',
            message: error.message,
        });
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.groupEnd();

        if (error.code && error.code.startsWith('OCR_')) {
            throw error;
        }

        if (error.message.includes('Network request failed') || error.name === 'TypeError') {
            const networkError = new Error('[OCR_001] Network request failed. Please check your connection.');
            networkError.code = 'OCR_001';
            networkError.userMessage = 'Network Error';
            networkError.actionableSteps = [
                'Check your internet connection',
                'Ensure the backend server is running',
                'Try again in a moment'
            ];
            throw networkError;
        }

        if (error.name === 'AbortError' || error.message.includes('timeout')) {
            const timeoutError = new Error('[OCR_006] Request timed out. The server took too long to respond.');
            timeoutError.code = 'OCR_006';
            timeoutError.userMessage = 'Request Timeout';
            timeoutError.actionableSteps = [
                'Check your internet connection speed',
                'Try again with better lighting for faster processing',
                'Contact support if issue persists'
            ];
            throw timeoutError;
        }

        const genericError = new Error(`[OCR_003] ${error.message || 'Failed to process Passport'}`);
        genericError.code = 'OCR_003';
        genericError.userMessage = 'Processing Error';
        genericError.actionableSteps = [
            'Ensure the document is clearly visible',
            'Try capturing the image again',
            'Contact support if problem persists'
        ];
        throw genericError;
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
