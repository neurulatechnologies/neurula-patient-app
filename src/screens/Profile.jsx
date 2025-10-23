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

const BG_WATERMARK = require('../../assets/background.png');
const AVATAR = require('../../assets/logo1.png'); // replace with real user avatar when available

export default function Profile() {
    const navigation = useNavigation();

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

    const onLogout = () => {
        // TODO: hook into your auth sign-out
        // navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
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
                {/* Profile card (glass) */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarWrap}>
                        <View style={styles.avatarRing}>
                            <Image source={AVATAR} style={styles.avatar} />
                        </View>
                    </View>
                    <Text style={styles.userName}>James Collins</Text>
                    <Text style={styles.userEmail}>jamesc@gmail.com</Text>
                </View>

                {/* Menu list */}
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
                            <Text style={styles.chev}>›</Text>
                        </Pressable>
                    ))}
                </View>

                {/* Logout button */}
                <Button
                    title="Logout"
                    onPress={onLogout}
                    variant="primary"
                    style={styles.logoutBtn}
                    textStyle={styles.logoutText}
                />
            </ScrollView>
        </View>
    );
}

const CARD_BG = 'rgba(255,255,255,0.40)';

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
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing['3xl'] + 80, // Extra padding for tab bar
    },

    // Profile card
    profileCard: {
        backgroundColor: CARD_BG,
        borderRadius: 30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.shadowGlass,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        borderWidth: 1,
        borderColor: colors.borderGradient,
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
        marginTop: spacing.lg,
        gap: spacing.md,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: CARD_BG,
        borderRadius: 20,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        borderWidth: 1,
        borderColor: colors.borderGradient,
        shadowColor: colors.shadowGlass,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 18,
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
    itemEmoji: { fontSize: 18 },
    itemLabel: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        lineHeight: 22,
    },
    chev: {
        fontSize: 22,
        color: colors.textLight,
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
