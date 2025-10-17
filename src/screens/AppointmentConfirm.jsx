// File: src/screens/BookingConfirmation.jsx
import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image,
    ScrollView,
    Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components';

const BG_WATERMARK = require('../../assets/background.png');

export default function AppointmentConfirmation() {
    const navigation = useNavigation();
    const route = useRoute();

    const {
        patient = {
            name: 'James Collins',
            gender: 'Male',
            dob: '5 May 1998',
            email: 'jamesc@gmail.com',
            weight: '57 kg',
            height: '154 cm',
        },
        doctor = {
            name: 'Dr. Michael Chen',
            title: 'General Physician',
            qual: 'MBChB, MSc, FRCS Urol',
        },
        schedule = {
            date: 'Wednesday, 28 July 2025',
            time: '07:00 PM',
        },
    } = route.params || {};

    const onBack = () => navigation.goBack();
    const BackToHome = () => {
        navigation.navigate('Home');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Image source={BG_WATERMARK} style={styles.watermark} resizeMode="contain" />

            {/* Header */}
            <ScrollView
                contentContainerStyle={styles.scroll}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headerRow}>
                    <Pressable onPress={onBack} hitSlop={10} style={styles.backBtn}>
                        <Text style={styles.backIcon}>‹</Text>
                    </Pressable>
                    <View style={styles.headerTextWrap}>
                        <Text style={styles.headerTitle}>
                            Your booking has{'\n'}
                            <Text style={styles.headerTitleBold}>confirmed!</Text>
                        </Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.infoCard}>
                    <Text style={styles.blurb}>
                        Below are your booking tickets. You can directly consultation with specialists online
                    </Text>

                    {/* Glass card */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Patient Information</Text>

                        {/* Grid */}
                        <View style={styles.grid}>
                            <InfoItem label="Patient Name" value={patient.name} />
                            <InfoItem label="Gender" value={patient.gender} />
                            <InfoItem label="Date of Birth" value={patient.dob} />
                            <InfoItem label="Email" value={patient.email} />
                            <InfoItem label="Weight" value={patient.weight} />
                            <InfoItem label="Height" value={patient.height} />
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Doctor section */}
                        <View style={styles.docSection}>
                            <View style={styles.docRow}>
                                <View style={styles.docLeft}>
                                    <Text style={styles.docName}>{doctor.name}</Text>
                                    <Text style={styles.docQual}>{doctor.qual}</Text>
                                </View>
                                <View style={styles.docRight}>
                                    <Text style={styles.docTitle}>{doctor.title}</Text>
                                </View>
                            </View>

                            {/* Date & Time */}
                            <View style={styles.scheduleSection}>
                                <Text style={styles.whenDate}>{schedule.date}</Text>
                                <Text style={styles.whenTime}>{schedule.time}</Text>
                            </View>
                        </View>
                    </View>
                    <Button title="Back to home" onPress={BackToHome} />
                </View>
            </ScrollView>

            {/* Sticky CTA */}

        </SafeAreaView>
    );
}

function InfoItem({ label, value }) {
    return (
        <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
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
        // right: -50,
        // top: 0,
        // width: 400,
        // height: 400,
        // opacity: 0.15,
        // pointerEvents: 'none',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.screen?.horizontal || 20,
        paddingTop: spacing.md || 12,
        paddingBottom: spacing.lg || 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.04)',
    },
    backIcon: {
        fontSize: 28,
        lineHeight: 28,
        color: colors.text,
        marginTop: -2,
    },
    headerTextWrap: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    headerTitle: {
        fontFamily: typography.fontFamily?.regular || 'System',
        fontSize: 22,
        lineHeight: 30,
        textAlign: 'center',
        color: colors.text || '#000',
    },
    infoCard: {
        borderRadius: 20,
        padding: 15,
        marginBottom: 16,
        backgroundColor: colors.glassMorphism || '#FFFFFF',
        borderColor: colors.borderGradient || '#E5E5E5',
        borderWidth: 1,
        borderRadius: spacing.borderRadius?.xl || 20,
        padding: spacing.lg || 20,
        shadowColor: colors.shadowGlass || '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        height: '100vh'
    },
    infoCardText: {
        fontFamily: typography.fontFamily?.regular || 'System',
        fontSize: 13,
        lineHeight: 19,
        color: '#666',
        textAlign: 'center',
    },
    headerTitleBold: {
        fontFamily: typography.fontFamily?.bold || 'System',
        fontSize: 22,
        fontWeight: '700',
    },

    scroll: {
        // paddingHorizontal: spacing.screen?.horizontal || 20,
        paddingBottom: 120,
    },
    blurb: {
        fontFamily: typography.fontFamily?.regular || 'System',
        fontSize: 14,
        lineHeight: 20,
        color: colors.textLight || '#666',
        marginBottom: spacing.lg || 16,
        marginTop: spacing.sm || 8,
    },

    card: {
        backgroundColor: colors.glassMorphism || '#FFFFFF',
        borderColor: colors.borderGradient || '#E5E5E5',
        borderWidth: 1,
        borderRadius: spacing.borderRadius?.xl || 20,
        padding: spacing.lg || 20,
        shadowColor: colors.shadowGlass || '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        marginBottom: spacing['2xl']
    },
    sectionTitle: {
        fontFamily: typography.fontFamily?.bold || 'System',
        fontSize: 18,
        fontWeight: '700',
        color: colors.text || '#000',
        marginBottom: spacing.md || 16,
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    infoItem: {
        width: '50%',
        paddingHorizontal: 8,
        marginBottom: spacing.md || 16,
    },
    infoLabel: {
        fontFamily: typography.fontFamily?.semibold || 'System',
        fontSize: 14,
        fontWeight: '600',
        color: colors.text || '#000',
        marginBottom: 4,
    },
    infoValue: {
        fontFamily: typography.fontFamily?.regular || 'System',
        fontSize: 14,
        color: colors.textLight || '#666',
        lineHeight: 20,
    },

    divider: {
        height: 1,
        backgroundColor: colors.border || '#E5E5E5',
        marginVertical: spacing.lg || 20,
        opacity: 0.5,
    },

    docSection: {
        gap: spacing.md || 16,
    },
    docRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    docLeft: {
        flex: 1,
        paddingRight: 12,
    },
    docName: {
        fontFamily: typography.fontFamily?.bold || 'System',
        fontSize: 16,
        fontWeight: '700',
        color: colors.text || '#000',
        marginBottom: 4,
    },
    docQual: {
        fontFamily: typography.fontFamily?.regular || 'System',
        fontSize: 13,
        color: colors.textLight || '#666',
        lineHeight: 18,
    },
    docRight: {
        alignItems: 'flex-end',
    },
    docTitle: {
        fontFamily: typography.fontFamily?.regular || 'System',
        fontSize: 14,
        color: colors.textLight || '#666',
        textAlign: 'right',
    },

    scheduleSection: {
        marginTop: 4,
    },
    whenDate: {
        fontFamily: typography.fontFamily?.bold || 'System',
        fontSize: 16,
        fontWeight: '700',
        color: colors.text || '#000',
        marginBottom: 4,
    },
    whenTime: {
        fontFamily: typography.fontFamily?.regular || 'System',
        fontSize: 14,
        color: colors.text || '#000',
    },

    ctaWrap: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.background || '#FFF',
        paddingHorizontal: spacing.screen?.horizontal || 20,
        paddingVertical: spacing.lg || 16,
        paddingBottom: spacing.xl || 24,
        borderTopWidth: 1,
        borderTopColor: colors.border || '#E5E5E5',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 8,
    },
});