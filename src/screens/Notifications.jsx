// File: src/screens/Notifications.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme';

export default function Notifications() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Notifications</Text>
                <Text style={styles.subtitle}>Your notifications will appear here</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.screen.horizontal,
    },
    title: {
        ...typography.styles.h2,
        color: colors.text,
        marginBottom: spacing.md,
    },
    subtitle: {
        ...typography.styles.body,
        color: colors.textLight,
        textAlign: 'center',
    },
});
