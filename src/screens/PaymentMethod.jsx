// File: PaymentMethod.jsx
import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, typography } from '../theme';
import Button from '../components/Button';
import Header from '../components/Header';

const BG_WATERMARK = require('../../assets/background.png');

const BASE_METHODS = [
    { id: 'cash', label: 'Cash on Delivery', disabled: true },
    { id: 'desk', label: 'Pay On- Desk', disabled: true },
    { id: 'bank', label: 'Online Payment', disabled: false, hasAction: true },
    { id: 'neurula', label: 'Neurula Health', disabled: false },
    { id: 'apple', label: 'Apple Pay', disabled: false },
    { id: 'google', label: 'Google Pay', disabled: false },
    { id: 'tamara', label: 'Tamara', disabled: true },
    { id: 'tabby', label: 'Tabby', disabled: true },
];

export default function PaymentMethod() {
    const navigation = useNavigation();
    const route = useRoute();

    // Cards live in screen state; we accept injections via route params when returning from AddNewCard
    const [cards, setCards] = useState(route.params?.cards ?? []);
    const [selectedMethod, setSelectedMethod] = useState('bank'); // default focus
    const [selectedCardId, setSelectedCardId] = useState(null);

    // When we come back from AddNewCard, pick up the new card
    useFocusEffect(
        useCallback(() => {
            const newCard = route.params?.newCard;
            if (newCard && !cards.some(c => c.id === newCard.id)) {
                setCards(prev => [newCard, ...prev]);
                setSelectedMethod('bank');
                setSelectedCardId(newCard.id);
                // clear one-shot param so it doesn’t re-add on next focus
                navigation.setParams({ ...route.params, newCard: undefined });
            }
        }, [route.params, cards, navigation])
    );

    const methods = useMemo(() => BASE_METHODS, []);

    const handleAddNew = () => {
        // Navigate to your add card screen; return with params: { newCard: { id, brand, last4 } }
        navigation.navigate('AddNewCard', { returnTo: 'PaymentMethod' });
    };

    const handleDeleteCard = (id) => {
        setCards(prev => prev.filter(c => c.id !== id));
        if (selectedCardId === id) setSelectedCardId(null);
    };

    const handleBookAppointment = () => {
        // Block if bank selected but no card chosen
        if (selectedMethod === 'bank' && cards.length > 0 && !selectedCardId) return;

        navigation.navigate('BookingSuccess', {
            ...route.params,
            paymentMethod: selectedMethod,
            cardId: selectedMethod === 'bank' ? selectedCardId : null,
        });
    };

    const canProceed = useMemo(() => {
        if (selectedMethod !== 'bank') return true;
        // If there are no cards yet (fresh flow), still allow proceeding (you may want to force add-card instead)
        if (cards.length === 0) return true;
        return Boolean(selectedCardId);
    }, [selectedMethod, cards.length, selectedCardId]);

    return (
        <SafeAreaView style={styles.container}>
            <Image source={BG_WATERMARK} style={styles.bg} resizeMode="contain" />
            <Header
                title="Book Appointment"
                leftIcon="chevron-left"
                onLeftPress={() => navigation.goBack()}
                style={{ paddingHorizontal: spacing.lg }}
            />

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                <Text style={styles.title}>Select Payment Method</Text>

                <View style={styles.optionsContainer}>
                    {methods.map((method) => {
                        const isSelected = selectedMethod === method.id && !method.disabled;
                        const isBank = method.id === 'bank';

                        return (
                            <View key={method.id}>
                                <Pressable
                                    style={[
                                        styles.optionCard,
                                        method.disabled && styles.optionCardDisabled,
                                        isSelected && styles.optionCardSelected,
                                    ]}
                                    onPress={() => !method.disabled && setSelectedMethod(method.id)}
                                    disabled={method.disabled}
                                >
                                    {/* Radio */}
                                    <View style={[styles.radioOuter, method.disabled && styles.radioDisabled]}>
                                        {isSelected && !method.disabled ? <View style={styles.radioInner} /> : null}
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

                                    {/* + Add New (for Online Payment) */}
                                    {isBank && isSelected && (
                                        <Pressable style={styles.addButton} onPress={handleAddNew} hitSlop={8}>
                                            <Text style={styles.addButtonText}>+ Add New</Text>
                                        </Pressable>
                                    )}
                                </Pressable>

                                {/* Expanded saved-cards list under Online Payment — only when selected */}
                                {isBank && isSelected && (
                                    <View style={styles.savedCardsWrap}>
                                        {/* Case A: NO CARDS YET → show empty/help row (matches your “initials we don’t have any card” flow) */}
                                        {cards.length === 0 ? (
                                            <View style={styles.emptyCardRow}>
                                                <Text style={styles.emptyText}>
                                                    No saved cards yet. Tap <Text style={{ fontWeight: '700' }}>+ Add New</Text> to add a card.
                                                </Text>
                                            </View>
                                        ) : (
                                            // Case B: Show selectable saved card rows
                                            cards.map((card) => (
                                                <View key={card.id} style={styles.savedCardRow}>
                                                    {/* card radio */}
                                                    <Pressable
                                                        onPress={() => setSelectedCardId(card.id)}
                                                        hitSlop={8}
                                                        style={styles.savedRadio}
                                                    >
                                                        <View style={[styles.radioOuterSmall, selectedCardId === card.id && styles.radioActive]}>
                                                            {selectedCardId === card.id ? <View style={styles.radioInnerSmall} /> : null}
                                                        </View>
                                                    </Pressable>

                                                    {/* brand + last4 */}
                                                    <View style={styles.cardInfo}>
                                                        <View style={styles.brandBadge}>
                                                            {/* You can replace with brand icons/images if you have assets */}
                                                            <Text style={styles.brandText}>{(card.brand || 'VISA').toUpperCase()}</Text>
                                                        </View>
                                                        <Text style={styles.cardDigits}>•••• {card.last4 || '0000'}</Text>
                                                    </View>

                                                    {/* delete */}
                                                    <Pressable
                                                        onPress={() => handleDeleteCard(card.id)}
                                                        hitSlop={8}
                                                        accessibilityLabel="Delete card"
                                                    >
                                                        <Text style={styles.trashIcon}>🗑️</Text>
                                                    </Pressable>
                                                </View>
                                            ))
                                        )}
                                    </View>
                                )}
                            </View>
                        );
                    })}

                    <Button
                        title="Book Appointment"
                        onPress={handleBookAppointment}
                        disabled={!canProceed}
                        style={{ marginTop: spacing['3xl'] }}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FB' },
    bg: { position: 'absolute', top: 0, left: 0, right: 0, opacity: 0.5 },

    title: {
        ...typography.styles.h3,
        color: colors.text,
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
        marginBottom: spacing.lg,
        fontWeight: '700',
    },

    optionsContainer: { paddingHorizontal: spacing.md, gap: 12 },

    optionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 18,
        paddingHorizontal: 16,
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
    radioDisabled: {
        borderColor: '#DADDE3',
    },

    optionLabel: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
    },
    optionLabelDisabled: {
        color: '#C8C8D0',
    },

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

    // Saved cards
    savedCardsWrap: {
        backgroundColor: 'rgba(255,255,255,0.40)',
        borderRadius: 16,
        paddingVertical: 8,
        marginTop: 8,
        marginBottom: 4,
        borderWidth: 1,
        borderColor: colors.borderLight,
    },
    emptyCardRow: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    emptyText: {
        ...typography.styles.body,
        color: colors.textLight,
    },
    savedCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    savedRadio: { marginRight: 10 },
    radioOuterSmall: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInnerSmall: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: colors.accent,
    },
    radioActive: { borderColor: colors.accent },

    cardInfo: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 },
    brandBadge: {
        minWidth: 44,
        height: 24,
        borderRadius: 6,
        backgroundColor: colors.backgroundLight,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    brandText: {
        ...typography.styles.caption,
        fontWeight: '700',
        color: colors.text,
    },
    cardDigits: {
        ...typography.styles.body,
        color: colors.text,
    },
    trashIcon: { fontSize: 16, opacity: 0.8 },
});
