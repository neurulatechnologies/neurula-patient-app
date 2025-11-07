/**
 * Registration Service
 *
 * Handles manual registration of Emirates ID and Passport documents
 */

import { API_CONFIG } from '../config/api';

/**
 * Generate unique request ID for tracking
 */
const generateRequestId = () => {
    return `MOBILE-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Register Emirates ID manually
 *
 * @param {Object} data - Emirates ID data
 * @param {string} data.full_name - Full name as on Emirates ID
 * @param {string} data.emirates_id - Emirates ID number (784-YYYY-NNNNNNN-C)
 * @param {string} data.nationality - Nationality
 * @param {string} data.date_of_birth - Date of birth (YYYY-MM-DD)
 * @param {string} data.sex - Gender (M/F)
 * @param {string} [data.expiry] - Expiry date (YYYY-MM-DD)
 * @param {string} [data.full_name_arabic] - Full name in Arabic
 * @param {string} data.contact - Contact phone number
 * @param {string} data.email - Email address
 * @param {string} data.address - Residential address
 * @param {string} data.emirate - Emirate of residence
 * @param {number} [data.height] - Height in cm
 * @param {number} [data.weight] - Weight in kg
 * @param {string} [data.medical_conditions] - Medical conditions
 * @returns {Promise<Object>} Registration response
 */
export async function registerEmiratesID(data) {
    const requestId = generateRequestId();

    console.log('\n═══════════════════════════════════════');
    console.log('📝 [Registration] Starting Emirates ID manual registration');
    console.log('═══════════════════════════════════════');
    console.log('[Registration] Request ID:', requestId);
    console.log('[Registration] Emirates ID:', data.emirates_id);
    console.log('[Registration] Full Name:', data.full_name);

    try {
        // Step 1: Validate data
        console.log('[Step 1/3] ✔️  Validating data...');
        if (!data.full_name || !data.emirates_id || !data.contact || !data.email || !data.address || !data.emirate) {
            throw new Error('Missing required fields');
        }
        console.log('✅ Data validation passed');

        // Step 2: Send to backend
        console.log('[Step 2/3] 🚀 Sending registration to backend...');
        console.log('URL:', `${API_CONFIG.BASE_URL}/registration/emirates-id/manual`);

        const startTime = Date.now();

        const response = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.timeout = API_CONFIG.TIMEOUT;

            xhr.onload = () => {
                resolve({
                    ok: xhr.status >= 200 && xhr.status < 300,
                    status: xhr.status,
                    json: async () => JSON.parse(xhr.responseText),
                    text: async () => xhr.responseText,
                });
            };

            xhr.onerror = () => {
                reject(new Error('Network request failed'));
            };

            xhr.ontimeout = () => {
                reject(new Error('Request timeout'));
            };

            xhr.open('POST', `${API_CONFIG.BASE_URL}/registration/emirates-id/manual`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-Request-ID', requestId);
            xhr.send(JSON.stringify(data));
        });

        const requestTime = Date.now() - startTime;
        console.log(`✅ Request completed in ${requestTime}ms`);

        // Step 3: Process response
        console.log('[Step 3/3] 📦 Processing response...');
        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Registration failed');
            console.error('Status:', response.status);
            console.error('Error:', errorData);

            // Handle duplicate error
            if (response.status === 409) {
                throw {
                    code: 'DUPLICATE_EMIRATES_ID',
                    userMessage: 'Emirates ID Already Registered',
                    message: errorData.detail?.message || 'This Emirates ID is already registered',
                    existingRecord: errorData.detail?.existing_record,
                    requestId,
                };
            }

            throw {
                code: 'REGISTRATION_FAILED',
                userMessage: 'Registration Failed',
                message: errorData.detail || 'Failed to register Emirates ID',
                requestId,
            };
        }

        const result = await response.json();
        console.log('✅ Registration successful');
        console.log('Document ID:', result.document_id);

        console.log('═══════════════════════════════════════');
        console.log('✅ Emirates ID registered successfully');
        console.log('═══════════════════════════════════════\n');

        return {
            success: true,
            ...result,
        };

    } catch (error) {
        console.error('\n═══════════════════════════════════════');
        console.error('❌ [Registration] Emirates ID registration failed');
        console.error('Error:', error);
        console.error('═══════════════════════════════════════\n');

        // Re-throw structured errors
        if (error.code) {
            throw error;
        }

        // Wrap unknown errors
        throw {
            code: 'UNKNOWN_ERROR',
            userMessage: 'Registration Failed',
            message: error.message || 'An unexpected error occurred',
            requestId,
        };
    }
}

/**
 * Register Passport manually
 *
 * @param {Object} data - Passport data
 * @param {string} data.full_name - Full name as on passport
 * @param {string} data.passport_number - Passport number
 * @param {string} data.nationality - Nationality
 * @param {string} data.date_of_birth - Date of birth (YYYY-MM-DD)
 * @param {string} data.sex - Gender (M/F)
 * @param {string} data.expiry - Expiry date (YYYY-MM-DD)
 * @param {string} [data.issue_date] - Issue date (YYYY-MM-DD)
 * @param {string} [data.place_of_birth] - Place of birth
 * @param {string} [data.issuing_country] - Issuing country
 * @param {string} data.contact - Contact phone number
 * @param {string} data.email - Email address
 * @param {string} data.address - Residential address
 * @param {number} [data.height] - Height in cm
 * @param {number} [data.weight] - Weight in kg
 * @param {string} [data.medical_conditions] - Medical conditions
 * @returns {Promise<Object>} Registration response
 */
export async function registerPassport(data) {
    const requestId = generateRequestId();

    console.log('\n═══════════════════════════════════════');
    console.log('📝 [Registration] Starting Passport manual registration');
    console.log('═══════════════════════════════════════');
    console.log('[Registration] Request ID:', requestId);
    console.log('[Registration] Passport Number:', data.passport_number);
    console.log('[Registration] Full Name:', data.full_name);

    try {
        // Step 1: Validate data
        console.log('[Step 1/3] ✔️  Validating data...');
        if (!data.full_name || !data.passport_number || !data.contact || !data.email || !data.address) {
            throw new Error('Missing required fields');
        }
        console.log('✅ Data validation passed');

        // Step 2: Send to backend
        console.log('[Step 2/3] 🚀 Sending registration to backend...');
        console.log('URL:', `${API_CONFIG.BASE_URL}/registration/passport/manual`);

        const startTime = Date.now();

        const response = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.timeout = API_CONFIG.TIMEOUT;

            xhr.onload = () => {
                resolve({
                    ok: xhr.status >= 200 && xhr.status < 300,
                    status: xhr.status,
                    json: async () => JSON.parse(xhr.responseText),
                    text: async () => xhr.responseText,
                });
            };

            xhr.onerror = () => {
                reject(new Error('Network request failed'));
            };

            xhr.ontimeout = () => {
                reject(new Error('Request timeout'));
            };

            xhr.open('POST', `${API_CONFIG.BASE_URL}/registration/passport/manual`);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('X-Request-ID', requestId);
            xhr.send(JSON.stringify(data));
        });

        const requestTime = Date.now() - startTime;
        console.log(`✅ Request completed in ${requestTime}ms`);

        // Step 3: Process response
        console.log('[Step 3/3] 📦 Processing response...');
        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorData = await response.json();
            console.error('❌ Registration failed');
            console.error('Status:', response.status);
            console.error('Error:', errorData);

            // Handle duplicate error
            if (response.status === 409) {
                throw {
                    code: 'DUPLICATE_PASSPORT',
                    userMessage: 'Passport Already Registered',
                    message: errorData.detail?.message || 'This Passport is already registered',
                    existingRecord: errorData.detail?.existing_record,
                    requestId,
                };
            }

            throw {
                code: 'REGISTRATION_FAILED',
                userMessage: 'Registration Failed',
                message: errorData.detail || 'Failed to register Passport',
                requestId,
            };
        }

        const result = await response.json();
        console.log('✅ Registration successful');
        console.log('Document ID:', result.document_id);

        console.log('═══════════════════════════════════════');
        console.log('✅ Passport registered successfully');
        console.log('═══════════════════════════════════════\n');

        return {
            success: true,
            ...result,
        };

    } catch (error) {
        console.error('\n═══════════════════════════════════════');
        console.error('❌ [Registration] Passport registration failed');
        console.error('Error:', error);
        console.error('═══════════════════════════════════════\n');

        // Re-throw structured errors
        if (error.code) {
            throw error;
        }

        // Wrap unknown errors
        throw {
            code: 'UNKNOWN_ERROR',
            userMessage: 'Registration Failed',
            message: error.message || 'An unexpected error occurred',
            requestId,
        };
    }
}

/**
 * Retrieve Emirates ID document
 *
 * @param {string} emiratesId - Emirates ID number
 * @returns {Promise<Object>} Document data
 */
export async function getEmiratesID(emiratesId) {
    console.log('[Registration] Retrieving Emirates ID:', emiratesId);

    try {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/registration/emirates-id/${encodeURIComponent(emiratesId)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const result = await response.json();

        if (result.success && result.document) {
            console.log('✅ Emirates ID found');
            return result.document;
        } else {
            console.log('❌ Emirates ID not found');
            return null;
        }
    } catch (error) {
        console.error('❌ Error retrieving Emirates ID:', error);
        throw error;
    }
}

/**
 * Retrieve Passport document
 *
 * @param {string} passportNumber - Passport number
 * @returns {Promise<Object>} Document data
 */
export async function getPassport(passportNumber) {
    console.log('[Registration] Retrieving Passport:', passportNumber);

    try {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}/registration/passport/${encodeURIComponent(passportNumber)}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        const result = await response.json();

        if (result.success && result.document) {
            console.log('✅ Passport found');
            return result.document;
        } else {
            console.log('❌ Passport not found');
            return null;
        }
    } catch (error) {
        console.error('❌ Error retrieving Passport:', error);
        throw error;
    }
}
