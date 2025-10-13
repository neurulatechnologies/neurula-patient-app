// File: PaymentMethod.jsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing } from '../theme';
import Button from '../components/Button';
import Header from '../components/Header';

const BG_WATERMARK = require('../../assets/background.png');

const PAYMENT_METHODS = [
    { id: 'cash', label: 'Cash on Delivery', disabled: true },
    { id: 'desk', label: 'Pay On- Desk', disabled: true },
    { id: 'bank', label: 'Bank Card', disabled: false, hasAction: true },
    { id: 'neurula', label: 'Neurula Health', disabled: false },
    { id: 'apple', label: 'Apple Pay', disabled: false },
    { id: 'google', label: 'Google Pay', disabled: false },
    { id: 'tamara', label: 'Tamara', disabled: true },
    { id: 'tabby', label: 'Tabby', disabled: true },
];

export default function PaymentMethod() {
    const navigation = useNavigation();
    const { params } = useRoute();
    const [selectedMethod, setSelectedMethod] = useState('bank');

    const handleBookAppointment = () => {
        // Navigate to success/confirmation screen
        navigation.navigate('BookingSuccess', {
            ...params,
            paymentMethod: selectedMethod,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={BG_WATERMARK} style={styles.bg} resizeMode="contain" />
            <Header
                variant="standard"
                title="Booking Confirmation"
                leftIcon="back"
                onLeftPress={() => navigation.goBack()}
                onNotificationPress={() => navigation.navigate('Notifications')}
                onMenuPress={() => navigation.toggleDrawer?.()}
            />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Title */}
                <Text style={styles.title}>Select Payment Method</Text>

                {/* Payment Options */}
                <View style={styles.optionsContainer}>
                    {PAYMENT_METHODS.map((method) => (
                        <Pressable
                            key={method.id}
                            style={[
                                styles.optionCard,
                                method.disabled && styles.optionCardDisabled,
                                selectedMethod === method.id && !method.disabled && styles.optionCardSelected,
                            ]}
                            onPress={() => !method.disabled && setSelectedMethod(method.id)}
                            disabled={method.disabled}
                        >
                            {/* Radio Button */}
                            <View style={styles.radioOuter}>
                                {selectedMethod === method.id && !method.disabled && (
                                    <View style={styles.radioInner} />
                                )}
                            </View>

                            {/* Label */}
                            <Text
                                style={[
                                    styles.optionLabel,
                                    method.disabled && styles.optionLabelDisabled,
                                ]}
                            >
                                {method.label}
                            </Text>

                            {/* Add New Button for Bank Card */}
                            {method.hasAction && selectedMethod === method.id && (
                                <Pressable
                                    style={styles.addButton}
                                    onPress={() => navigation.navigate('AddNewCard')}
                                >
                                    <Text style={styles.addButtonText}>+Add New</Text>
                                </Pressable>
                            )}
                        </Pressable>
                    ))}
                    <Button title="Book Appointment" onPress={handleBookAppointment} style={{ marginTop: spacing['3xl'] }} />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB',
    },
    bg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        // width: '100%',
        opacity: 0.5,
    },

    /* Title */
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 24,
    },

    /* Options Container */
    optionsContainer: {
        paddingHorizontal: 16,
        gap: 12,
    },

    /* Option Card */
    optionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionCardDisabled: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
    },
    optionCardSelected: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: colors.accent,
    },

    /* Radio Button */
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.accent,
    },

    /* Label */
    optionLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    optionLabelDisabled: {
        color: '#C8C8D0',
    },

    /* Add New Button */
    addButton: {
        backgroundColor: colors.accent,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
});