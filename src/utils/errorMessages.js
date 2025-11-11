/**
 * Error Message Utilities
 *
 * Centralized error handling and message mapping for authentication flows
 */

import Toast from 'react-native-toast-message';

/**
 * Map backend error responses to user-friendly messages
 *
 * @param {Object} response - Response object from authService
 * @param {string} context - Context of the error (login, register, verify_otp, etc.)
 * @returns {Object} - { title, message }
 */
export const getAuthErrorMessage = (response, context = 'general') => {
    // Default error message
    let title = 'Error';
    let message = 'An unexpected error occurred. Please try again.';

    // Extract error from response
    const errorDetail = response.error || response.data?.detail || response.data?.message;
    const statusCode = response.status || response.data?.status_code;

    // Map status codes to specific messages
    if (statusCode === 401) {
        title = 'Authentication Failed';
        message = errorDetail || 'Invalid credentials. Please check your email/phone and password.';
    } else if (statusCode === 409) {
        title = 'Already Registered';
        message = errorDetail || 'This account already exists. Please try logging in.';
    } else if (statusCode === 422) {
        title = 'Invalid Input';
        message = errorDetail || 'Please check your input and try again.';
    } else if (statusCode === 500) {
        title = 'Server Error';
        message = 'Something went wrong on our end. Please try again later.';
    } else if (errorDetail) {
        // Use backend error message if available
        message = errorDetail;

        // Set appropriate title based on context
        if (context === 'login') {
            title = 'Login Failed';
        } else if (context === 'register') {
            title = 'Registration Failed';
        } else if (context === 'verify_otp') {
            title = 'Verification Failed';
        } else if (context === 'resend_otp') {
            title = 'Resend Failed';
        }
    }

    return { title, message };
};

/**
 * Show success toast notification
 *
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 * @param {number} duration - Duration in milliseconds (default 3000)
 */
export const showSuccessToast = (title, message, duration = 3000) => {
    Toast.show({
        type: 'success',
        text1: title,
        text2: message,
        visibilityTime: duration,
        position: 'top',
        topOffset: 60,
    });
};

/**
 * Show error toast notification
 *
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 * @param {number} duration - Duration in milliseconds (default 4000)
 */
export const showErrorToast = (title, message, duration = 4000) => {
    Toast.show({
        type: 'error',
        text1: title,
        text2: message,
        visibilityTime: duration,
        position: 'top',
        topOffset: 60,
    });
};

/**
 * Show info toast notification
 *
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 * @param {number} duration - Duration in milliseconds (default 3000)
 */
export const showInfoToast = (title, message, duration = 3000) => {
    Toast.show({
        type: 'info',
        text1: title,
        text2: message,
        visibilityTime: duration,
        position: 'top',
        topOffset: 60,
    });
};

/**
 * Handle authentication error and show appropriate toast
 *
 * @param {Object} response - Response object from authService
 * @param {string} context - Context of the error
 */
export const handleAuthError = (response, context = 'general') => {
    const { title, message } = getAuthErrorMessage(response, context);
    showErrorToast(title, message);
};

/**
 * Specific error message handlers for common scenarios
 */

export const showLoginSuccess = () => {
    showSuccessToast(
        'Welcome Back!',
        'Login successful',
        2500
    );
};

export const showRegistrationSuccess = (email) => {
    showSuccessToast(
        'Registration Successful',
        `OTP sent to ${email}. Please check your email or phone.`,
        4000
    );
};

export const showOtpVerificationSuccess = () => {
    showSuccessToast(
        'Account Verified',
        'Your account has been verified successfully!',
        3000
    );
};

export const showOtpResendSuccess = (identifier) => {
    showInfoToast(
        'OTP Resent',
        `A new OTP has been sent to ${identifier}`,
        3000
    );
};

export const showInvalidOtpError = () => {
    showErrorToast(
        'Invalid OTP',
        'The OTP you entered is incorrect. Please try again.',
        4000
    );
};

export const showOtpExpiredError = () => {
    showErrorToast(
        'OTP Expired',
        'Your OTP has expired. Please request a new one.',
        4000
    );
};

export const showAccountNotVerifiedError = () => {
    showErrorToast(
        'Account Not Verified',
        'Please verify your account with the OTP sent to your email/phone.',
        4000
    );
};

export const showInvalidCredentialsError = () => {
    showErrorToast(
        'Invalid Credentials',
        'The email/phone or password you entered is incorrect.',
        4000
    );
};

export const showDuplicateEmailError = () => {
    showErrorToast(
        'Email Already Registered',
        'This email is already registered. Please try logging in or use a different email.',
        4000
    );
};

export const showNetworkError = () => {
    showErrorToast(
        'Connection Error',
        'Unable to connect to the server. Please check your internet connection.',
        4000
    );
};
