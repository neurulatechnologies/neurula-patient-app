// File: src/screens/OtpVerification.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    Text,
    ScrollView,
    TextInput,
    Image,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme';

// assets
const LOGO_IMAGE = require('../../assets/logo.png');          // brand
const BG_WATERMARK = require('../../assets/background.png'); // soft bg art

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OtpVerification() {
    const navigation = useNavigation();
    const route = useRoute();
    const phone =
        route.params?.phone ||
        '+1 717 513 1010'; // fallback if param not passed from previous screen

    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
    const [timer, setTimer] = useState(RESEND_SECONDS);
    const [isLoading, setIsLoading] = useState(false);

    // refs for each input to auto-advance / backspace
    const refs = useRef([...Array(OTP_LENGTH)].map(() => React.createRef()));

    useEffect(() => {
        if (timer <= 0) return;
        const id = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
        return () => clearInterval(id);
    }, [timer]);

    const code = useMemo(() => otp.join(''), [otp]);
    const isComplete = otp.every(digit => digit !== '' && digit.trim().length === 1);
    const isButtonDisabled = !isComplete || isLoading;

    const handleChange = (index, value) => {
        // allow only digits
        const sanitized = value.replace(/\D/g, '');
        // paste support (full code in first box)
        if (sanitized.length > 1) {
            const next = sanitized.slice(0, OTP_LENGTH).split('');
            setOtp((prev) => {
                const merged = [...prev];
                for (let i = 0; i < OTP_LENGTH; i++) merged[i] = next[i] || '';
                return merged;
            });
            refs.current[Math.min(OTP_LENGTH - 1, sanitized.length - 1)]?.current?.focus();
            return;
        }

        setOtp((prev) => {
            const next = [...prev];
            next[index] = sanitized;
            return next;
        });

        if (sanitized && index < OTP_LENGTH - 1) {
            refs.current[index + 1]?.current?.focus();
        }
    };

    const handleKeyPress = (index, { nativeEvent }) => {
        if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            refs.current[index - 1]?.current?.focus();
        }
    };

    const handleResend = () => {
        if (timer > 0) return;
        // TODO: call your resend API here
        setOtp(Array(OTP_LENGTH).fill(''));
        refs.current[0]?.current?.focus();
        setTimer(RESEND_SECONDS);
    };

    const handleVerify = async () => {
        if (!isComplete || isLoading) return;

        setIsLoading(true);

        try {
            // TODO: call your verify API here
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // On success:
            navigation.navigate('BottomNav');
        } catch (error) {
            // Handle error (you can add error state/alert here if needed)
            console.error('Verification failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Background watermark */}
            <Image source={BG_WATERMARK} style={styles.watermark} resizeMode="contain" />

            {/* Header: back + logo (same as ManualEntry) */}
            <View style={styles.header}>
                <Pressable onPress={navigation.goBack} hitSlop={10} style={styles.backBtn}>
                    <Text style={styles.backIcon}>‹</Text>
                </Pressable>
                <Image source={LOGO_IMAGE} style={styles.brandLogo} resizeMode="contain" />
            </View>

            {/* Main Content Container */}
            <View style={styles.mainContainer}>
                {/* Top Section - Title and Subtitle */}
                <View style={styles.topSection}>
                    <Text style={styles.title}>OTP Verification</Text>
                    <Text style={styles.subtitle}>
                        Enter the OTP sent to{' '}
                        <Text style={styles.phoneStrong}>{phone}</Text>
                    </Text>
                </View>

                {/* Middle Section - OTP Input */}
                <View style={styles.middleSection}>
                    <View style={styles.otpContainer}>
                        {/* OTP boxes */}
                        <View style={styles.otpRow}>
                            {otp.map((ch, i) => (
                                <View key={i} style={styles.otpBox}>
                                    <TextInput
                                        ref={refs.current[i]}
                                        value={ch}
                                        onChangeText={(t) => handleChange(i, t)}
                                        onKeyPress={(e) => handleKeyPress(i, e)}
                                        style={styles.otpInput}
                                        keyboardType="number-pad"
                                        returnKeyType={i === OTP_LENGTH - 1 ? 'done' : 'next'}
                                        secureTextEntry // masks digits → matches your "after receive" variation
                                        maxLength={1}
                                        textContentType="oneTimeCode"
                                        autoComplete="one-time-code"
                                    />
                                </View>
                            ))}
                        </View>

                        {/* Resend timer / status line */}
                        <View style={styles.resendRow}>
                            <Text style={styles.resendClock}>⏱</Text>
                            {timer > 0 ? (
                                <Text style={styles.resendText}>
                                    Resend in <Text style={styles.resendTime}>00:{String(timer).padStart(2, '0')}</Text>
                                </Text>
                            ) : (
                                <Pressable onPress={handleResend} hitSlop={8}>
                                    <Text style={styles.resendNow}>Resend now</Text>
                                </Pressable>
                            )}
                        </View>
                    </View>
                </View>

                {/* Bottom Section - Button and Footer */}
                <View style={styles.bottomSection}>
                    {/* Verify button */}
                    <Pressable
                        style={[styles.verifyBtn, isButtonDisabled && styles.verifyBtnDisabled]}
                        onPress={handleVerify}
                        disabled={isButtonDisabled}
                        android_ripple={{ color: colors.shadowGlass }}
                        accessibilityRole="button"
                        accessibilityLabel={isLoading ? "Verifying" : "Verify"}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color={colors.background} />
                        ) : (
                            <Text style={[styles.verifyText, isButtonDisabled && { opacity: 0.7 }]}>
                                Verify
                            </Text>
                        )}
                    </Pressable>

                    {/* Bottom link */}
                    <View style={styles.bottomNote}>
                        <Text style={styles.noteText}>Didn't receive a code? </Text>
                        <Pressable onPress={timer === 0 ? handleResend : undefined} hitSlop={6}>
                            <Text
                                style={[
                                    styles.resendBottom,
                                    timer > 0 && styles.resendBottomDisabled,
                                ]}
                            >
                                Resend
                            </Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

/* ---------------- styles ---------------- */
const styles = StyleSheet.create({
    container: { flex: 1 },
    watermark: {
        position: 'absolute',
        pointerEvents: 'none',
    },

    /* header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.md,
    },
    backBtn: { paddingRight: spacing.md, paddingVertical: spacing.xs },
    backIcon: { fontSize: 28, color: colors.text, opacity: 0.9 },
    brandLogo: { width: 150, height: 40, marginLeft: 'auto', marginRight: 'auto' },

    /* Main layout sections */
    mainContainer: {
        flex: 1,
        backgroundColor: colors.glassMorphism,
        borderColor: colors.borderGradient,
        borderWidth: 1,
        borderTopLeftRadius: spacing.borderRadius['2xl'],
        borderTopEndRadius: spacing.borderRadius['2xl'],
        shadowColor: colors.shadowGlass,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 6,
    },

    topSection: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.xl,
        paddingBottom: spacing.lg,
        alignItems: 'center',
    },

    middleSection: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
    },

    bottomSection: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
        paddingTop: spacing.lg,
    },

    otpContainer: {
        alignItems: 'center',
    },

    title: {
        ...typography.styles.h1,
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    subtitle: {
        ...typography.styles.body,
        color: colors.textLight,
        textAlign: 'center',
        marginBottom: 0,
    },
    phoneStrong: {
        ...typography.styles.bodyStrong,
        color: colors.text,
    },

    /* OTP */
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: spacing.sm,
        paddingHorizontal: spacing.sm,
        gap: spacing.md,
        width: '100%'
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
        shadowColor: colors.shadowGlass,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 2,
    },
    otpInput: {
        width: '100%',
        height: '100%',
        textAlign: 'center',
        fontSize: 18,
        color: colors.text,
    },

    /* resend strip */
    resendRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.lg,
    },
    resendClock: { marginRight: spacing.xs, color: '#ff6b6b' },
    resendText: { ...typography.styles.body, color: colors.textLight },
    resendTime: { color: '#ff6b6b' },
    resendNow: { ...typography.styles.body, color: colors.link, textDecorationLine: 'underline' },

    /* button */
    verifyBtn: {
        height: spacing.component.buttonHeight,
        borderRadius: spacing.borderRadius['3xl'],
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary, // swap to gradient if you use LinearGradient
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
        marginBottom: spacing.lg,
        width: '100%',
    },
    verifyBtnDisabled: {
        backgroundColor: colors.primary,
        opacity: 0.6,
    },
    verifyText: {
        ...typography.styles.button,
        color: colors.background,
    },

    /* bottom note */
    bottomNote: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.sm,
    },
    noteText: { ...typography.styles.body, color: colors.textLight },
    resendBottom: {
        ...typography.styles.body,
        color: colors.link,
        textDecorationLine: 'underline',
    },
    resendBottomDisabled: {
        color: colors.textLight,
        opacity: 0.6,
        textDecorationLine: 'none',
    },
});
