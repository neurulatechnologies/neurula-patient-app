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
import { useNavigation } from '@react-navigation/native';
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

export default function ForgotPassword() {
  const navigation = useNavigation();
  const { forgotPassword, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  // Validate email input
  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
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

    try {
      // Call forgotPassword function from AuthContext
      const response = await forgotPassword(email.trim());

      if (response.success) {
        // Show success toast
        showSuccessToast(
          'OTP Sent',
          'Please check your email for the verification code'
        );

        // Navigate to OTP verification or reset password screen
        // For now, navigate back to login (you can change this to navigate to ResetPassword screen)
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000);
      } else {
        // Show error toast
        handleAuthError(response, 'forgot-password');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      // Network or unexpected error
      showNetworkError();
    }
  };

  const handleBackToLogin = () => navigation.navigate('Login');

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
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your registered email address and we'll send you a verification code to reset your password
          </Text>

          {/* Email */}
          <TextField
            label="Email"
            required={true}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors({ ...errors, email: null });
              }
            }}
            placeholder="Enter your registered email"
            leftIcon="email"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="done"
            error={errors.email}
            onSubmitEditing={handleSubmit}
          />

          {/* Bottom sticky section */}
          <View style={styles.bottomSection}>
            <Button
              title={loading ? "Sending OTP..." : "Send Verification Code"}
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
  bottomSection: {
    paddingHorizontal: spacing.screen.horizontal,
    paddingBottom: spacing.screen.bottom,
    paddingTop: spacing['3xl'],
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
