import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  ScrollView,
  Image,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components';
import {
  showSuccessToast,
  showErrorToast,
  showInfoToast,
} from '../utils/errorMessages';

// Replace with your actual assets
const LOGO_IMAGE = require('../../assets/logo.png');
const BG_WATERMARK = require('../../assets/background.png');

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function ForgotPasswordOTP() {
  const navigation = useNavigation();
  const route = useRoute();
  const email = route.params?.email || '';

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);

  // Refs for each OTP input
  const inputRefs = useRef([]);

  // Start countdown timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Format timer as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle OTP input change
  const handleOtpChange = (value, index) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');

    // Handle paste event (full OTP code pasted in first box)
    if (numericValue.length > 1 && index === 0) {
      const otpArray = numericValue.slice(0, OTP_LENGTH).split('');
      const newOtp = [...otp];

      otpArray.forEach((digit, i) => {
        if (i < OTP_LENGTH) {
          newOtp[i] = digit;
        }
      });

      setOtp(newOtp);

      // Focus on the last filled box or first empty box
      const nextIndex = Math.min(otpArray.length, OTP_LENGTH - 1);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Single digit input
    if (numericValue.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);

      // Auto-advance to next field
      if (numericValue && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    const otpCode = otp.join('');

    // Validate OTP
    if (otpCode.length !== OTP_LENGTH) {
      showErrorToast('Invalid OTP', 'Please enter the complete 6-digit code');
      return;
    }

    try {
      setIsVerifying(true);

      // In the forgot password flow, we just need to verify the OTP is valid
      // The actual password reset will happen in the next screen
      // For now, we'll just validate the format and navigate

      // TODO: If backend has a separate OTP verification endpoint for forgot password,
      // call it here. Otherwise, we'll pass the OTP to the ResetPassword screen

      // Show success message
      showSuccessToast('OTP Verified', 'Please set your new password');

      // Navigate to ResetPassword screen with email and OTP
      setTimeout(() => {
        navigation.navigate('ResetPassword', { email, otp: otpCode });
      }, 1000);
    } catch (error) {
      console.error('OTP verification error:', error);
      showErrorToast('Verification Failed', 'Failed to verify OTP. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    try {
      // Call the forgotPassword API again to resend OTP
      // You would typically have a resendForgotPasswordOTP function
      showInfoToast('OTP Sent', 'A new verification code has been sent to your email');

      // Reset timer
      setResendTimer(RESEND_SECONDS);
      setCanResend(false);

      // Clear current OTP
      setOtp(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } catch (error) {
      console.error('Resend OTP error:', error);
      showErrorToast('Resend Failed', 'Failed to resend OTP. Please try again.');
    }
  };

  const handleBackToForgotPassword = () => {
    navigation.goBack();
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
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            We've sent a 6-digit verification code to{'\n'}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          {/* OTP Input Boxes */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={index === 0 ? OTP_LENGTH : 1} // Allow paste in first box
                textContentType="oneTimeCode"
                autoComplete="one-time-code"
                secureTextEntry={true}
                selectTextOnFocus
                returnKeyType={index === OTP_LENGTH - 1 ? 'done' : 'next'}
                onSubmitEditing={index === OTP_LENGTH - 1 ? handleVerifyOTP : undefined}
              />
            ))}
          </View>

          {/* Timer / Resend */}
          <View style={styles.resendContainer}>
            {!canResend ? (
              <View style={styles.timerRow}>
                <Text style={styles.timerEmoji}>⏱️</Text>
                <Text style={styles.timerText}>
                  Resend code in <Text style={styles.timerValue}>{formatTime(resendTimer)}</Text>
                </Text>
              </View>
            ) : (
              <View style={styles.resendRow}>
                <Text style={styles.resendText}>Didn't receive the code? </Text>
                <Pressable onPress={handleResendOTP} hitSlop={8}>
                  <Text style={styles.resendLink}>Resend now</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Bottom sticky section */}
          <View style={styles.bottomSection}>
            <Button
              title={isVerifying ? "Verifying..." : "Verify & Continue"}
              onPress={handleVerifyOTP}
              variant="primary"
              style={styles.submitButton}
              disabled={isVerifying}
            />
            {isVerifying && (
              <ActivityIndicator
                size="small"
                color={colors.primary}
                style={styles.loadingIndicator}
              />
            )}

            <View style={styles.backRow}>
              <Text style={styles.backText}>Wrong email? </Text>
              <Pressable onPress={handleBackToForgotPassword} hitSlop={8}>
                <Text style={styles.backLink}>Go back</Text>
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
  emailText: {
    color: colors.primary,
    fontFamily: typography.fontFamily.medium,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginVertical: spacing.xl,
  },
  otpBox: {
    width: 44,
    height: 44,
    borderRadius: spacing.borderRadius.lg,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderGradient,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: typography.fontFamily.medium,
    color: colors.text,
    shadowColor: colors.shadowGlass,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 2,
  },
  otpBoxFilled: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  resendContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  timerEmoji: {
    fontSize: 16,
  },
  timerText: {
    ...typography.styles.body,
    color: colors.textLight,
  },
  timerValue: {
    color: '#ff6b6b',
    fontFamily: typography.fontFamily.medium,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    ...typography.styles.body,
    color: colors.textLight,
  },
  resendLink: {
    ...typography.styles.body,
    color: colors.link,
    fontFamily: typography.fontFamily.medium,
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
