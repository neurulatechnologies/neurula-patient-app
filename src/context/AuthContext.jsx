/**
 * Authentication Context
 *
 * Provides global authentication state and functions to all components
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';

// Create Auth Context
const AuthContext = createContext({});

/**
 * Auth Provider Component
 *
 * Wraps the app and provides authentication state and functions
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Initialize auth state on app load
   * Checks for stored tokens and loads user data
   */
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);

      // Check if tokens exist
      const accessToken = await authService.getAccessToken();

      if (accessToken) {
        // Load stored user data
        const userData = await authService.getUserData();

        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          // Token exists but no user data - try fetching from server
          const response = await authService.getCurrentUser();

          if (response.success) {
            setUser(response.data);
            setIsAuthenticated(true);
            await authService.storeUserData(response.data);
          } else {
            // Invalid token - clear auth data
            await authService.clearAuthData();
            setIsAuthenticated(false);
          }
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Auth initialization error:', err);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.register(userData);

      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verify OTP
   */
  const verifyOtp = async (identifier, otp) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.verifyOtp(identifier, otp);

      if (response.success) {
        // OTP verified successfully - user account is now active
        return { success: true, data: response.data };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'OTP verification failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Resend OTP
   */
  const resendOtp = async (identifier) => {
    try {
      setError(null);

      const response = await authService.resendOtp(identifier);

      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Failed to resend OTP';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  /**
   * Login user
   */
  const login = async (identifier, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.login(identifier, password);

      if (response.success) {
        // Update context state
        setUser(response.data.user);
        setIsAuthenticated(true);
        return { success: true, data: response.data };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setLoading(true);
      await authService.logout();

      // Clear context state
      setUser(null);
      setIsAuthenticated(false);
      setError(null);

      return { success: true };
    } catch (err) {
      console.error('Logout error:', err);
      // Clear state even if server request fails
      setUser(null);
      setIsAuthenticated(false);
      return { success: true };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh authentication state
   * Useful after updating user profile
   */
  const refreshUser = async () => {
    try {
      const response = await authService.getCurrentUser();

      if (response.success) {
        setUser(response.data);
        await authService.storeUserData(response.data);
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      console.error('Refresh user error:', err);
      return { success: false, error: err.message };
    }
  };

  /**
   * Change password
   */
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authService.changePassword(currentPassword, newPassword);

      if (response.success) {
        return { success: true, data: response.data };
      } else {
        setError(response.error);
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMsg = err.message || 'Password change failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Clear error state
   */
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    // State
    user,
    loading,
    error,
    isAuthenticated,

    // Functions
    register,
    verifyOtp,
    resendOtp,
    login,
    logout,
    refreshUser,
    changePassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use Auth Context
 * Usage: const { user, login, logout } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
