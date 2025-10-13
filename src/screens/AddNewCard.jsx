// File: AddNewCard.jsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TextInput,
    Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../theme';
import Button from '../components/Button';
import Header from '../components/Header';

const BG_WATERMARK = require('../../assets/background.png');
// You can add your card background image here
const CARD_BG = require('../../assets/icons/Neurula-Card.png');

export default function AddNewCard() {
    const navigation = useNavigation();

    const [cardHolder, setCardHolder] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const formatCardNumber = (text) => {
        // Remove all non-digits
        const cleaned = text.replace(/\D/g, '');
        // Add space every 4 digits
        const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
        return formatted.substring(0, 19); // Max 16 digits + 3 spaces
    };

    const formatExpiry = (text) => {
        // Remove all non-digits
        const cleaned = text.replace(/\D/g, '');
        // Add slash after 2 digits
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 6);
        }
        return cleaned;
    };

    const handleCardNumberChange = (text) => {
        const formatted = formatCardNumber(text);
        setCardNumber(formatted);
    };

    const handleExpiryChange = (text) => {
        const formatted = formatExpiry(text);
        setExpiry(formatted);
    };

    const handleSave = () => {
        // Validate and save card
        if (!cardHolder || !cardNumber || !expiry || !cvc) {
            alert('Please fill all fields');
            return;
        }

        // Navigate back to payment method
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Image source={BG_WATERMARK} style={styles.bg} resizeMode="contain" />
            <Header
                variant="standard"
                title="Add New Card"
                leftIcon="back"
                onLeftPress={() => navigation.goBack()}
                onNotificationPress={() => navigation.navigate('Notifications')}
                onMenuPress={() => navigation.toggleDrawer?.()}
            />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 120 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Virtual Card Display */}
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        {/* You can add background image here */}
                        <Image source={CARD_BG} style={styles.cardBg} resizeMode="cover" />

                        <View style={styles.cardContent}>
                            {/* Balance Section */}
                            <View style={styles.cardTop}>
                                <View>
                                    <Text style={styles.balanceLabel}>Balance (AED)</Text>
                                    <Text style={styles.balanceAmount}>0.00</Text>
                                </View>
                            </View>

                            {/* IBAN Section */}
                            <View style={styles.cardBottom}>
                                <Text style={styles.ibanLabel}>IBAN</Text>
                                <Text style={styles.ibanNumber}>
                                    AE 4903 5564 0011 4132 12837
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Card Details Form */}
                <View style={styles.formWrapper}>
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>Card Details</Text>

                        {/* Card Holder */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Card Holder</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter Holder"
                                placeholderTextColor="#C8C8D0"
                                value={cardHolder}
                                onChangeText={setCardHolder}
                            />
                        </View>

                        {/* Card Number */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Card Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0000 0000 0000 0000"
                                placeholderTextColor="#C8C8D0"
                                value={cardNumber}
                                onChangeText={handleCardNumberChange}
                                keyboardType="numeric"
                                maxLength={19}
                            />
                        </View>

                        {/* Expiry and CVC Row */}
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.inputLabel}>MM/YYYY</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="MM/YYYY"
                                    placeholderTextColor="#C8C8D0"
                                    value={expiry}
                                    onChangeText={handleExpiryChange}
                                    keyboardType="numeric"
                                    maxLength={7}
                                />
                            </View>

                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.inputLabel}>CVC</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="***"
                                    placeholderTextColor="#C8C8D0"
                                    value={cvc}
                                    onChangeText={setCvc}
                                    keyboardType="numeric"
                                    maxLength={4}
                                    secureTextEntry
                                />
                            </View>
                        </View>
                        <Button title="Save" onPress={handleSave} />
                    </View>
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

    /* Virtual Card */
    cardContainer: {
        paddingHorizontal: 16,
        marginTop: 16,
        marginBottom: 24,
    },
    card: {
        height: 200,
        borderRadius: 20,
        backgroundColor: '#E8E3FF',
        overflow: 'hidden',
    },
    cardBg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },

    /* Card Top - Balance */
    cardTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    balanceLabel: {
        fontSize: 13,
        color: '#5A5A6B',
        marginBottom: 4,
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1a1a1a',
    },

    /* Logo */
    logoContainer: {
        alignItems: 'flex-end',
    },
    logoCircle1: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#7A5AF8',
        opacity: 0.6,
        position: 'absolute',
        top: 0,
        right: 12,
    },
    logoCircle2: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#5DADE2',
        opacity: 0.6,
        position: 'absolute',
        top: 0,
        right: 0,
    },
    logoText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#5A5A6B',
        marginTop: 36,
    },

    /* Card Bottom - IBAN */
    cardBottom: {
        marginTop: 20,
    },
    ibanLabel: {
        fontSize: 12,
        color: '#5A5A6B',
        marginBottom: 4,
    },
    ibanNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        letterSpacing: 0.5,
    },

    /* Form */
    formWrapper: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.40)',
        paddingTop: 24,
        paddingBottom: 24,
        // Simulating backdrop blur with shadow effects
        shadowColor: 'rgba(255, 255, 255, 0.3)',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 1,
        shadowRadius: 30,
        elevation: 8,
    },
    formContainer: {
        paddingHorizontal: 16,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 20,
    },

    /* Input Group */
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        fontSize: 15,
        color: '#1a1a1a',
    },

    /* Row for Expiry and CVC */
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    halfWidth: {
        flex: 1,
    },

    /* Footer */
    footer: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 16,
    },
});