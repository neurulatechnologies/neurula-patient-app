import React from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    Text,
    ScrollView,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme';
import { Button, Icon } from '../components';

// Same asset pattern as Login.js
const LOGO_IMAGE = require('../../assets/logo.png');
const BG_WATERMARK = require('../../assets/background.png');

export default function CreateAccount() {
    const navigation = useNavigation();

    // TODO: replace route names with your actual screens
    const handleEmirates = () => navigation.navigate('ScanEmiratesID');
    const handlePassport = () => navigation.navigate('ScanPassport');
    const handleManual = () => navigation.navigate('ManualEntry');
    const handleBack = () => navigation.goBack();
    const handleSkip = () => navigation.navigate('Home');

    return (
        <SafeAreaView style={styles.container}>
            {/* Background watermark */}
            <Image source={BG_WATERMARK} style={styles.watermark} resizeMode="contain" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Brand header */}
                <View style={styles.brandRow}>
                    <Image source={LOGO_IMAGE} style={styles.brandLogo} resizeMode="contain" />
                </View>

                {/* Card wrapper */}
                <View style={styles.card}>
                    <Text style={styles.title}>Create your account</Text>
                    <Text style={styles.subtitle}>
                        Please select how you’d like to provide{'\n'}your details
                    </Text>

                    {/* Option 1 */}
                    <Pressable
                        style={styles.optionRow}
                        onPress={handleEmirates}
                        android_ripple={{ color: colors.shadowGlass }}
                        accessibilityRole="button"
                        accessibilityLabel="Scan Emirates ID (For UAE Residents)"
                        testID="opt-emirates"
                    >
                        <View style={styles.iconBubble}>
                            <Icon name="id-card" size="small" color={colors.primary} />
                        </View>
                        <View style={styles.optionTextWrap}>
                            <Text style={styles.optionTitle}>Scan Emirates ID</Text>
                            <Text style={styles.optionCaption}>For UAE Residents</Text>
                        </View>
                        <Icon name="chevron-right" size="small" color={colors.textLight} />
                    </Pressable>

                    {/* Option 2 */}
                    <Pressable
                        style={styles.optionRow}
                        onPress={handlePassport}
                        android_ripple={{ color: colors.shadowGlass }}
                        accessibilityRole="button"
                        accessibilityLabel="Scan Passport (For Non-Residents)"
                        testID="opt-passport"
                    >
                        <View style={styles.iconBubble}>
                            <Icon name="passport" size="small" color={colors.primary} />
                        </View>
                        <View style={styles.optionTextWrap}>
                            <Text style={styles.optionTitle}>Scan Passport</Text>
                            <Text style={styles.optionCaption}>For Non-Residents</Text>
                        </View>
                        <Icon name="chevron-right" size="small" color={colors.textLight} />
                    </Pressable>

                    {/* Option 3 */}
                    <Pressable
                        style={styles.optionRow}
                        onPress={handleManual}
                        android_ripple={{ color: colors.shadowGlass }}
                        accessibilityRole="button"
                        accessibilityLabel="Manual Entry (Fill your details manually)"
                        testID="opt-manual"
                    >
                        <View style={styles.iconBubble}>
                            <Icon name="edit" size="small" color={colors.primary} />
                        </View>
                        <View style={styles.optionTextWrap}>
                            <Text style={styles.optionTitle}>Manual Entry</Text>
                            <Text style={styles.optionCaption}>Fill your details manually</Text>
                        </View>
                        <Icon name="chevron-right" size="small" color={colors.textLight} />
                    </Pressable>

                    {/* Back CTA */}
                    <Button
                        title="Back"
                        onPress={handleBack}
                        variant="primary"
                        leftIcon="back-arrow"
                        style={styles.backButton}
                        accessibilityLabel="Back"
                        testID="btn-back"
                    />

                    {/* Skip link */}
                    <Button
                        title="Skip and Complete Later"
                        onPress={handleSkip}
                        variant="outline"
                        style={styles.skipButton}
                        accessibilityLabel="Skip and Complete Later"
                        testID="link-skip"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    watermark: {
        position: 'absolute',
        pointerEvents: 'none',
        // Optional artwork placement tweaks:
        // right: -80, top: spacing.xl, width: 520, height: 520, opacity: 0.18,
    },
    scrollContent: { flexGrow: 1 },

    brandRow: {
        marginTop: '10%',
        marginBottom: '10%',
        alignItems: 'center',
    },
    brandLogo: { width: 170, height: 48 },

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
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: spacing.xl,
    },

    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: spacing.borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.borderGradient,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.md,
        shadowColor: colors.shadowGlass,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 3,
        marginBottom: spacing.md,
    },
    iconBubble: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: colors.glassMorphism,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
        borderWidth: 1,
        borderColor: colors.borderGradient,
    },
    optionTextWrap: { flex: 1 },
    optionTitle: {
        ...typography.styles.subtitle,
        color: colors.text,
        marginBottom: spacing.xs / 2,
    },
    optionCaption: {
        ...typography.styles.caption,
        color: colors.textLight,
    },

    backButton: {
        marginTop: spacing.lg,
        marginBottom: spacing.md,
    },
    skipButton: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        shadowOpacity: 0,
        elevation: 0,
    },
});
