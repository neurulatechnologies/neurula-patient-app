// File: src/screens/ConsultationFeedback.jsx
import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    TextInput,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Check } from 'lucide-react-native';

// Theme & components (match your project structure)
import { colors, spacing, typography } from '../theme';
import Button from '../components/Button';

const BG_WATERMARK = require('../../assets/background.png');

const CHIP_OPTIONS = [
    'Communication',
    'Time',
    'Price',
    'Consultation Flow',
    'Call Quality',
];

export default function ConsultationFeedback() {
    const navigation = useNavigation();
    const route = useRoute();

    const [rating, setRating] = useState(null); // 'good' | 'bad'
    const [chips, setChips] = useState([]);
    const [notes, setNotes] = useState('');

    const toggleChip = (label) => {
        setChips((prev) =>
            prev.includes(label) ? prev.filter((c) => c !== label) : [...prev, label]
        );
    };

    const canSubmit = rating !== null || notes.trim().length > 0 || chips.length > 0;

    const handleSubmit = () => {
        const payload = {
            rating, // 'good' or 'bad'
            improvements: chips,
            notes: notes.trim(),
            consultationId: route.params?.consultationId ?? null,
            doctorId: route.params?.doctor?.id ?? null,
        };
        // TODO: send to API
        console.log('Feedback payload:', payload);
        navigation.goBack(); // or navigate to a “Success” toast/screen
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <Image source={BG_WATERMARK} style={styles.watermark} resizeMode="contain" />

            {/* Header back */}

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 56 : 0}
            >
                <ScrollView contentContainerStyle={styles.scroll}>
                    {/* Title */}
                    <View style={styles.wrapper}>
                        <View style={styles.topBar}>
                            <Pressable onPress={() => navigation.navigate('ChatConsultation')} hitSlop={10} style={styles.backBtn}>
                                <ChevronLeft size={24} color="#1a1a1a" />
                            </Pressable>
                        </View>

                        <Text style={styles.title}>Thank you</Text>
                    </View>
                    <Text style={styles.subtitle}>
                        Online consultation has ended. Thank you for having Neurula as your health partner.
                    </Text>

                    {/* Rounded glass panel */}
                    <View style={styles.panel}>
                        <Text style={styles.sectionTitle}>Feedback</Text>
                        <Text style={styles.sectionHint}>
                            A small feedback from you matters for our service improvement.
                        </Text>

                        {/* Online consultation feedback - Good/Bad */}
                        <View style={styles.block}>
                            <Text style={styles.label}>Online Consultation Feedback:</Text>

                            <View style={styles.pillsRow}>
                                <Pill
                                    label="Good"
                                    selected={rating === 'good'}
                                    onPress={() => setRating('good')}
                                />
                                <Pill
                                    label="Bad"
                                    selected={rating === 'bad'}
                                    onPress={() => setRating('bad')}
                                />
                            </View>
                        </View>

                        {/* Things need to be improved (chips) */}
                        <View style={styles.block}>
                            <Text style={styles.label}>Things need to be improved:</Text>

                            <View style={styles.chipsWrap}>
                                {CHIP_OPTIONS.map((opt) => (
                                    <Chip
                                        key={opt}
                                        label={opt}
                                        selected={chips.includes(opt)}
                                        onPress={() => toggleChip(opt)}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* Notes */}
                        <View style={styles.block}>
                            <Text style={styles.label}>Things need to be improved:</Text>
                            <TextInput
                                value={notes}
                                onChangeText={setNotes}
                                placeholder="Type here..."
                                placeholderTextColor="#B4B6C6"
                                multiline
                                textAlignVertical="top"
                                style={styles.textArea}
                                maxLength={600}
                            />
                        </View>
                    </View>

                    {/* Submit */}
                    <Pressable
                        onPress={handleSubmit}
                        style={[styles.submitBtn, !canSubmit && { opacity: 0.5 }]}
                        disabled={!canSubmit}
                    >
                        <Text style={styles.submitText}>Submit</Text>
                    </Pressable>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

/* --- Small UI atoms --- */

function Pill({ label, selected, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.pill,
                selected && styles.pillSelected,
            ]}
            hitSlop={8}
        >
            {selected ? (
                <View style={styles.pillIconWrap}>
                    <Check size={14} color="#fff" />
                </View>
            ) : (
                <View style={styles.pillIconWrapGhost} />
            )}
            <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{label}</Text>
        </Pressable>
    );
}

function Chip({ label, selected, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.chip,
                selected && styles.chipSelected,
            ]}
            hitSlop={6}
        >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
        </Pressable>
    );
}

/* --- Styles --- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    watermark: {
        position: 'absolute',
        top: -40,
        right: -20,
        opacity: 0.50,
        pointerEvents: 'none',
    },
    wrapper: {
        flexDirection: 'row',
        alignItems: "center",
        marginTop: 30
    },
    topBar: {
        paddingHorizontal: spacing.screen?.horizontal || 20,
        paddingTop: spacing.md || 12,
    },
    backBtn: {
        width: 40, height: 40, alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.04)',
        borderRadius: 20,
    },

    scroll: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1A1A1A',
        textAlign: 'center',
        marginTop: 15,
        paddingLeft: 15
    },
    subtitle: {
        fontSize: 13,
        color: '#7A8199',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 18,
    },

    panel: {
        marginTop: 18,
        backgroundColor: colors.glassMorphism,
        borderRadius: 28,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.borderGradient,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    sectionHint: {
        fontSize: 12,
        color: '#7A8199',
        marginTop: 6,
    },

    block: { marginTop: 16 },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1A1A1A',
        marginBottom: 10,
    },

    pillsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
    },
    pillSelected: {
        backgroundColor: 'rgba(173, 83, 191, 0.1)',
        borderColor: colors.primaryLight,
    },
    pillIconWrap: {
        width: 18, height: 18, borderRadius: 9, marginRight: 8,
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: colors.primary,
    },
    pillIconWrapGhost: {
        width: 18, height: 18, borderRadius: 9, marginRight: 8,
        backgroundColor: '#EEE',
    },
    pillText: { fontSize: 14, color: '#1A1A1A' },
    pillTextSelected: { color: '#1A1A1A', fontWeight: '600' },

    chipsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
    },
    chipSelected: {
        backgroundColor: 'rgba(173, 83, 191, 0.08)',
        borderColor: colors.primaryLight,
    },
    chipText: { fontSize: 13, color: '#1A1A1A' },
    chipTextSelected: { fontWeight: '600', color: colors.primaryDark },

    textArea: {
        minHeight: 120,
        borderRadius: 18,
        padding: 14,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.06)',
        color: '#1A1A1A',
    },

    submitBtn: {
        marginTop: 22,
        marginHorizontal: 8,
        height: 54,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
    },
    submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
