import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme';
import { TextField, Button } from '../components';
import { useAuth } from '../context/AuthContext';
import {
  showSuccessToast,
  showErrorToast,
  handleAuthError,
  showNetworkError
} from '../utils/errorMessages';

// Replace with your actual assets
const LOGO_IMAGE = require('../../assets/logo.png');
const BG_WATERMARK = require('../../assets/background.png');

export default function ResetPassword() {
  const navigation = useNavigation();
  const route = useRoute();
  const { resetPassword, loading } = useAuth();

  // Get email and OTP from route params
  const email = route.params?.email || '';
  const otp = route.params?.otp || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Clear previous errors
    setErrors({});

    // Validate inputs
    if (!validateForm()) {
      return;
    }

    // Validate email and OTP exist
    if (!email || !otp) {
      showErrorToast('Invalid Request', 'Email or OTP is missing. Please try again.');
      navigation.navigate('ForgotPassword');
      return;
    }

    try {
      // Call resetPassword function from AuthContext
      const response = await resetPassword(email, otp, password);

      if (response.success) {
        // Show success toast
        showSuccessToast(
          'Password Reset Successful',
          'Your password has been reset. Please login with your new password.'
        );

        // Navigate to Login screen
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
        }, 1500);
      } else {
        // Handle specific error cases
        const errorMsg = response.error || '';

        if (errorMsg.toLowerCase().includes('invalid') || errorMsg.toLowerCase().includes('expired')) {
          showErrorToast(
            'Invalid or Expired OTP',
            'The verification code is invalid or has expired. Please request a new one.'
          );
          // Navigate back to ForgotPassword to restart the flow
          setTimeout(() => {
            navigation.navigate('ForgotPassword');
          }, 2000);
        } else {
          // Show generic error with backend message
          handleAuthError(response, 'reset-password');
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      // Network or unexpected error
      showNetworkError();
    }
  };

  const handleBackToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Background watermark (behind everything) */}
      <Image source={BG_WATERMARK} style={styles.watermark} resizeMode="contain" />

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top brand area */}
        <View style={styles.brandRow}>
          <Image source={LOGO_IMAGE} style={styles.brandLogo} resizeMode="contain" />
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Please enter your new password below
          </Text>

          {/* New Password */}
          <TextField
            label="New Password"
            required={true}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors({ ...errors, password: null });
              }
            }}
            placeholder="Enter your new password"
            leftIcon="lock"
            secure={true}
            returnKeyType="next"
            error={errors.password}
          />

          {/* Confirm Password */}
          <TextField
            label="Confirm Password"
            required={true}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword) {
                setErrors({ ...errors, confirmPassword: null });
              }
            }}
            placeholder="Re-enter your new password"
            leftIcon="lock"
            secure={true}
            returnKeyType="done"
            error={errors.confirmPassword}
            onSubmitEditing={handleSubmit}
          />

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password must:</Text>
            <Text style={styles.requirementItem}>• Be at least 8 characters long</Text>
            <Text style={styles.requirementItem}>• Match in both fields</Text>
          </View>

          {/* Bottom sticky section */}
          <View style={styles.bottomSection}>
            <Button
              title={loading ? "Resetting Password..." : "Reset Password"}
              onPress={handleSubmit}
              variant="primary"
              style={styles.submitButton}
              disabled={loading}
            />
            {loading && (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.loadingIndicator}
              />
            )}

            <View style={styles.backRow}>
              <Text style={styles.backText}>Remember your password? </Text>
              <Pressable onPress={handleBackToLogin} hitSlop={8}>
                <Text style={styles.backLink}>Back to Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  watermark: {
    position: 'absolute',
    pointerEvents: 'none',
  },
  scrollContent: {
    flexGrow: 1,
  },
  brandRow: {
    marginTop: '15%',
    marginBottom: '15%',
    alignItems: 'center',
  },
  brandLogo: {
    width: 170,
    height: 48,
  },
  card: {
    backgroundColor: colors.glassMorphism,
    borderColor: colors.borderGradient,
    borderWidth: 1,
    borderTopLeftRadius: spacing.borderRadius['2xl'],
    borderTopEndRadius: spacing.borderRadius['2xl'],
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.shadowGlass,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
    height: '100%'
  },
  title: {
    ...typography.styles.h1,
    textAlign: 'center',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.textLight,
    marginBottom: spacing.xl,
    lineHeight: 20,
    textAlign: 'center',
  },
  requirementsContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  requirementsTitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: 13,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  requirementItem: {
    fontFamily: typography.fontFamily.regular,
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
    marginLeft: spacing.xs,
  },
  bottomSection: {
    paddingHorizontal: spacing.screen.horizontal,
    paddingBottom: spacing.screen.bottom,
    paddingTop: spacing['2xl'],
    backgroundColor: 'transparent',
  },
  submitButton: {
    marginBottom: spacing.lg,
  },
  backRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    ...typography.styles.body,
    color: colors.textLight,
  },
  backLink: {
    ...typography.styles.body,
    color: colors.link,
  },
  loadingIndicator: {
    marginTop: spacing.sm,
    alignSelf: 'center',
  },
});
