/**
 * Custom Toast Configuration
 *
 * Professional glassmorphism toast notifications matching brand design system
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react-native';
import { colors, typography, spacing } from '../theme';

/**
 * Base Toast Component
 * Reusable component with glassmorphism effect
 */
const BaseToast = ({ icon: Icon, iconColor, accentColor, text1, text2 }) => {
    return (
        <View style={[styles.container, { borderLeftColor: accentColor }]}>
            {/* Icon */}
            <View style={styles.iconContainer}>
                <Icon size={24} color={iconColor} strokeWidth={2} />
            </View>

            {/* Text Content */}
            <View style={styles.textContainer}>
                {text1 ? (
                    <Text style={styles.title} numberOfLines={1}>
                        {text1}
                    </Text>
                ) : null}
                {text2 ? (
                    <Text style={styles.message} numberOfLines={2}>
                        {text2}
                    </Text>
                ) : null}
            </View>
        </View>
    );
};

/**
 * Success Toast (Green)
 */
const SuccessToast = (props) => (
    <BaseToast
        icon={CheckCircle}
        iconColor={colors.success}
        accentColor={colors.success}
        {...props}
    />
);

/**
 * Error Toast (Red)
 */
const ErrorToast = (props) => (
    <BaseToast
        icon={XCircle}
        iconColor={colors.error}
        accentColor={colors.error}
        {...props}
    />
);

/**
 * Info Toast (Blue)
 */
const InfoToast = (props) => (
    <BaseToast
        icon={Info}
        iconColor={colors.info}
        accentColor={colors.info}
        {...props}
    />
);

/**
 * Warning Toast (Orange)
 */
const WarningToast = (props) => (
    <BaseToast
        icon={AlertCircle}
        iconColor={colors.warning}
        accentColor={colors.warning}
        {...props}
    />
);

/**
 * Toast Configuration Object
 * Export this to App.js
 */
export const toastConfig = {
    success: SuccessToast,
    error: ErrorToast,
    info: InfoToast,
    warning: WarningToast,
};

/**
 * Styles with Glassmorphism Effect
 */
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 70,
        width: '90%',
        marginHorizontal: '5%',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.glassMorphism, // rgba(255, 255, 255, 0.6)
        borderRadius: spacing.borderRadius.xl, // 16px
        borderWidth: 1,
        borderColor: colors.borderGradient, // rgba(255, 255, 255, 0.8)
        borderLeftWidth: 4, // Accent border on left
        // Shadow for depth
        shadowColor: colors.shadowGlass, // rgba(0, 0, 0, 0.05)
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 6,
        // Blur effect (platform-specific, works on iOS)
        backdropFilter: 'blur(10px)',
    },
    iconContainer: {
        marginRight: spacing.md, // 16px gap
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontFamily: typography.fontFamily.medium, // Poppins_500Medium
        fontSize: 14,
        lineHeight: 20,
        color: colors.text, // #1A1A1A
        marginBottom: spacing.xs, // 4px
    },
    message: {
        fontFamily: typography.fontFamily.regular, // Poppins_400Regular
        fontSize: 12,
        lineHeight: 16,
        color: colors.textLight, // #7F8B96
    },
});
