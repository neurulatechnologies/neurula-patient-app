// File: src/screens/Appointments.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../theme';

export default function Appointments() {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Appointments</Text>
                <Text style={styles.subtitle}>Your upcoming and past appointments will appear here</Text>
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
