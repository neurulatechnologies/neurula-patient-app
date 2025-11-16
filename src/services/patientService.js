/**
 * Patient Service
 *
 * Handles all patient-related API calls including:
 * - Get patient profile
 * - Update patient profile
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../config/api';

// Patient endpoints
const PATIENT_ENDPOINTS = {
  ME: '/api/v1/patients/me',
  UPDATE_PROFILE: '/api/v1/patients/me',
};

// User endpoints
const USER_ENDPOINTS = {
  UPDATE_PROFILE: '/api/v1/users/me',
};

/**
 * Get authorization header with access token
 */
const getAuthHeader = async () => {
  const accessToken = await AsyncStorage.getItem('@auth_access_token');
  if (!accessToken) {
    throw new Error('No access token found. Please login again.');
  }
  return {
    'Authorization': `Bearer ${accessToken}`,
  };
};

/**
 * Make API request with error handling
 */
const makeRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;

  console.log('='.repeat(60));
  console.log('🌐 [PATIENT SERVICE] Making API Request');
  console.log('='.repeat(60));
  console.log('📍 URL:', url);
  console.log('🔧 Method:', options.method || 'GET');
  if (options.body && typeof options.body === 'string') {
    console.log('📦 Body:', JSON.parse(options.body));
  }
  console.log('-'.repeat(60));

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    });

    console.log('📥 Response Status:', response.status);

    const data = await response.json();

    if (!response.ok) {
      console.log('❌ Request Failed:', data);
      throw new Error(data.error || data.detail || 'Request failed');
    }

    console.log('✅ Request Successful');
    console.log('='.repeat(60));

    return data;
  } catch (error) {
    console.error('❌ [PATIENT SERVICE] Request Error:', error);
    console.log('='.repeat(60));
    throw error;
  }
};

/**
 * Get patient profile
 */
export const getPatientProfile = async () => {
  try {
    const authHeaders = await getAuthHeader();
    const response = await makeRequest(PATIENT_ENDPOINTS.ME, {
      method: 'GET',
      headers: {
        ...authHeaders,
      },
    });

    return response;
  } catch (error) {
    console.error('Failed to get patient profile:', error);
    throw error;
  }
};

/**
 * Update patient profile
 */
export const updatePatientProfile = async (patientData) => {
  try {
    const authHeaders = await getAuthHeader();
    const response = await makeRequest(PATIENT_ENDPOINTS.UPDATE_PROFILE, {
      method: 'PUT',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(patientData),
    });

    return response;
  } catch (error) {
    console.error('Failed to update patient profile:', error);
    throw error;
  }
};

/**
 * Update user profile (name, phone)
 */
export const updateUserProfile = async (userData) => {
  try {
    const authHeaders = await getAuthHeader();
    const response = await makeRequest(USER_ENDPOINTS.UPDATE_PROFILE, {
      method: 'PUT',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    return response;
  } catch (error) {
    console.error('Failed to update user profile:', error);
    throw error;
  }
};

export default {
  getPatientProfile,
  updatePatientProfile,
  updateUserProfile,
};
