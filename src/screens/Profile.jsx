// File: src/screens/Profile.jsx
import React from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../theme';
import { Button } from '../components';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { showSuccessToast, showErrorToast } from '../utils/errorMessages';

const BG_WATERMARK = require('../../assets/background.png');
const AVATAR = require('../../assets/logo1.png'); // replace with real user avatar when available
const CHEVRON_RIGHT = require('../../assets/icons/chevron-right.png');

export default function Profile() {
    const navigation = useNavigation();
    const { logout, loading } = useAuth();

    const items = [
        { key: 'medical', label: 'Medical History', icon: '🫀', route: 'MedicalHistory' },
        { key: 'settings', label: 'Settings', icon: '⚙️', route: 'Settings' },
        { key: 'appointments', label: 'Appointments', icon: '📅', route: 'Appointments' },
        { key: 'orders', label: 'Order History', icon: '🛒', route: 'Orders' },
        { key: 'support', label: 'Help & Support', icon: '☎️', route: 'Support' },
    ];

    const onItemPress = (route) => {
        if (!route) return;
        try {
            navigation.navigate(route);
        } catch {
            // Route not wired yet; ignore
        }
    };

    const onLogout = async () => {
        try {
            // Call logout from AuthContext
            const response = await logout();

            if (response.success) {
                // Show success toast
                showSuccessToast('Logged Out', 'You have been successfully logged out');

                // Reset navigation to Login screen
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                }, 500);
            } else {
                // Show error toast
                showErrorToast('Logout Failed', response.error || 'Failed to logout. Please try again.');
            }
        } catch (error) {
            console.error('Logout error:', error);
            // Show error toast
            showErrorToast('Logout Failed', 'An unexpected error occurred. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            {/* Background watermark */}
            <Image source={BG_WATERMARK} style={styles.watermark} resizeMode="contain" />

            {/* Header */}
            <Header
                variant="standard"
                title="Profile"
                leftIcon="back"
                onLeftPress={() => navigation.goBack()}
                onNotificationPress={() => navigation.navigate('Notifications')}
                onMenuPress={() => navigation.toggleDrawer?.()}
            />

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Main Parent Card - Contains Profile + Menu Items */}
                <View style={styles.mainCard}>
                    {/* Profile Section */}
                    <View style={styles.profileSection}>
                        <View style={styles.avatarWrap}>
                            <View style={styles.avatarRing}>
                                <Image source={AVATAR} style={styles.avatar} />
                            </View>
                        </View>
                        <Text style={styles.userName}>James Collins</Text>
                        <Text style={styles.userEmail}>jamesc@gmail.com</Text>
                    </View>

                    {/* Menu Items List */}
                    <View style={styles.listWrap}>
                        {items.map((it) => (
                            <Pressable
                                key={it.key}
                                style={styles.listItem}
                                onPress={() => onItemPress(it.route)}
                                android_ripple={{ color: colors.shadowGlass }}
                                accessibilityRole="button"
                                accessibilityLabel={it.label}
                            >
                                <View style={styles.itemLeft}>
                                    <View style={styles.itemIconBubble}>
                                        <Text style={styles.itemEmoji}>{it.icon}</Text>
                                    </View>
                                    <Text style={styles.itemLabel}>{it.label}</Text>
                                </View>
                                <Image source={CHEVRON_RIGHT} style={styles.chevronIcon} />
                            </Pressable>
                        ))}
                    </View>
                    <Button
                        title={loading ? "Logging out..." : "Logout"}
                        onPress={onLogout}
                        variant="primary"
                        style={styles.logoutBtn}
                        textStyle={styles.logoutText}
                        disabled={loading}
                    />
                </View>

                {/* Logout button */}

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    watermark: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        opacity: 0.3,
    },
    content: {
        // paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing['3xl'] + 80, // Extra padding for tab bar
    },

    // Main Parent Card - Contains everything
    mainCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.40)',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
        shadowColor: colors.shadowGlass,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },

    // Profile Section (inside main card)
    profileSection: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.lg,
    },
    avatarWrap: {
        marginBottom: spacing.md,
    },
    avatarRing: {
        width: 116,
        height: 116,
        borderRadius: 58,
        padding: 3,
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: colors.accentLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 104,
        height: 104,
        borderRadius: 52,
        backgroundColor: '#fff',
    },
    userName: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 20,
        fontWeight: '700',
        color: colors.text,
        marginTop: spacing.sm,
        marginBottom: spacing.xs,
        lineHeight: 28,
    },
    userEmail: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        fontWeight: '400',
        color: colors.textLight,
        lineHeight: 20,
    },

    // List
    listWrap: {
        marginTop: spacing.md,
        gap: spacing.md,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.60)',
        borderRadius: 10,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: spacing.md,
    },
    itemIconBubble: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.borderLight,
        borderWidth: 1,
    },
    itemEmoji: {
        fontSize: 22,
    },
    itemLabel: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        fontWeight: '600',
        color: '#3C2D4A',
        lineHeight: 34,
    },
    chevronIcon: {
        width: 8,
        height: 15,
        tintColor: '#3C2D4A',
    },

    // Logout
    logoutBtn: {
        marginTop: spacing['2xl'],
        borderRadius: spacing.borderRadius['3xl'],
        height: spacing.component.buttonHeight + 4,
    },
    logoutText: {
        // keep default white text; center already handled by Button
    },
});
