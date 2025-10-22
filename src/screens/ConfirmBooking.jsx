// File: ConfirmBooking.jsx
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { spacing } from '../theme';
import Button from '../components/Button';
import Header from '../components/Header';

const BG_WATERMARK = require('../../assets/background.png');
const DOCTOR_IMAGE = require('../../assets/Doctor/doctor.png');

export default function ConfirmBooking() {
    const navigation = useNavigation();
    // const { params } = useRoute();

    // TODO: Uncomment when implementing navigation params
    // const doctor = params?.doctor ?? {
    const doctor = {
        name: 'Dr. Michael Chen',
        specialty: 'General Physician',
        avatar: DOCTOR_IMAGE,
    };

    // const schedule = params?.schedule ?? {
    const schedule = {
        dateLabel: 'Tue, July 28th 2025',
        timeLabel: '07:00 PM',
        locationLabel: 'Jumeirah Medical Center',
    };

    // const patient = params?.patient ?? {
    const patient = {
        name: 'James Collins',
        gender: 'Male',
        dob: '5 May 1998',
        email: 'jamesc@gmail.com',
        weight: '57 kg',
        height: '154 cm',
        emiratesId: '784–2002–4984975–3',
        followupDate: 'Wednesday, 28 July 2025',
        followupTime: '07:00 PM',
    };

    const infoPairs = useMemo(
        () => [
            [{ label: 'Patient Name', value: patient.name }, { label: 'Gender', value: patient.gender }],
            [{ label: 'Date of Birth', value: patient.dob }, { label: 'Email', value: patient.email }],
            [{ label: 'Weight', value: patient.weight }, { label: 'Height', value: patient.height }],
            [{ label: 'Emirates ID/Passport Number', value: patient.emiratesId }, null],
        ],
        [patient]
    );

    const handleNext = () => {
        navigation.navigate('PaymentMethod');
    };

    return (
        <View style={styles.container}>
            <Image source={BG_WATERMARK} style={styles.bg} resizeMode="contain" />

            <ScrollView
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Header
                    variant="standard"
                    title="Booking Confirmation"
                    leftIcon="back"
                    onLeftPress={() => navigation.goBack()}
                    onNotificationPress={() => navigation.navigate('Notifications')}
                    onMenuPress={() => navigation.toggleDrawer?.()}
                />
                {/* Hero Card */}
                <View style={styles.hero}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.heroTitle}>You're almost done!</Text>
                        <Text style={styles.heroSub}>
                            Please take a moment to{'\n'}review your appointment{'\n'}details below.
                        </Text>
                        <Text style={styles.docName}>{doctor.name}</Text>
                        <Text style={styles.docRole}>{doctor.specialty}</Text>
                    </View>
                    <Image source={doctor.avatar} style={styles.docImg} resizeMode="cover" />
                </View>

                {/* Schedule Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.chipsScrollView}
                    contentContainerStyle={styles.chipsRow}
                >
                    <View style={styles.chip}>
                        <Text style={styles.chipTxt}>📅 {schedule.dateLabel}</Text>
                    </View>
                    <View style={styles.chip}>
                        <Text style={styles.chipTxt}>🕖 {schedule.timeLabel}</Text>
                    </View>
                    <View style={styles.chip}>
                        <Text style={styles.chipTxt}>📍 {schedule.locationLabel}</Text>
                    </View>
                </ScrollView>

                {/* Patient Information Section */}
                <View style={styles.patientSection}>
                    <Text style={styles.sectionTitle}>Patient Information</Text>

                    {/* Details Card with lavender background */}
                    <View style={styles.detailsCard}>
                        {infoPairs.map((row, i) => (
                            <View key={i} style={styles.row}>
                                <View style={styles.col}>
                                    <Text style={styles.label}>{row[0].label}</Text>
                                    <Text style={styles.value}>{row[0].value}</Text>
                                </View>
                                {row[1] && (
                                    <View style={styles.col}>
                                        <Text style={styles.label}>{row[1].label}</Text>
                                        <Text style={styles.value}>{row[1].value}</Text>
                                    </View>
                                )}
                            </View>
                        ))}

                        <View style={styles.divider} />

                        <View style={styles.followRow}>
                            <Text style={styles.followDate}>{patient.followupDate}</Text>
                            <Text style={styles.followTime}>{patient.followupTime}</Text>
                        </View>
                    </View>

                    <Button
                        title="Next"
                        onPress={handleNext}
                        variant="primary"
                        size="large"
                        style={{ marginTop: spacing['3xl'] }}
                    />
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F5F7FB'
    },
    bg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        // width: '100%',
        opacity: 0.5
    },

    /* Hero Card - Glass effect */
    hero: {
        backgroundColor: 'rgba(255, 255, 255, 0.40)',
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 24,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 8,
    },
    heroSub: {
        fontSize: 14,
        color: '#626B7F',
        lineHeight: 20,
        marginBottom: 16,
    },
    docName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    docRole: {
        fontSize: 13,
        color: '#7A5AF8',
    },
    docImg: {
        width: 110,
        height: 150,
        borderRadius: 12,
    },

    /* Schedule Chips */
    chipsScrollView: {
        marginTop: 16,
    },
    chipsRow: {
        paddingHorizontal: 16,
        flexDirection: 'row',
        gap: 8,
    },
    chip: {
        backgroundColor: 'rgba(255, 255, 255, 0.40)',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    chipTxt: {
        fontSize: 12,
        color: '#2D3142',
        fontWeight: '500',
    },

    /* Patient Section - Glass background, rounded bottom */
    patientSection: {
        backgroundColor: 'rgba(255, 255, 255, 0.40)',
        marginTop: 16,
        paddingTop: 24,
        paddingHorizontal: 20,
        paddingBottom: 24,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '900',
        color: '#3D3D3D',
        fontFamily: 'Poppins_600SemiBold',
        lineHeight: 24,
        marginBottom: 16
    },

    /* Details Card - Glass background */
    detailsCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.40)',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },

    row: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16
    },
    col: {
        flex: 1
    },
    label: {
        fontSize: 16,
        color: '#3C2D4A',
        fontFamily: 'Poppins_500Medium',
        fontWeight: '500',
        marginBottom: 4,
    },
    value: {
        fontSize: 14,
        color: '#7F8B96',
        fontFamily: 'Poppins_400Regular',
        fontWeight: '400',
    },

    divider: {
        height: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.08)',
        marginVertical: 16
    },

    followRow: {
        paddingTop: 8
    },
    followDate: {
        fontSize: 14,
        color: '#1a1a1a',
        fontWeight: '600',
        marginBottom: 4,
    },
    followTime: {
        fontSize: 13,
        color: '#7A8199'
    },
});