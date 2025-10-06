// File: BookAppointment.jsx
import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { colors, spacing, typography } from '../theme';

const DOC_IMG = require('../../assets/Doctor/doctor.png');
const BG_WATERMARK = require('../../assets/background.png');

const TYPE_OPTIONS = ['In-person', 'Online', 'Home Visit'];
const SLOT_BANDS = ['Morning', 'Afternoon', 'Evening', 'Night'];

export default function BookAppointment() {
    const navigation = useNavigation();
    const route = useRoute();

    // Map doctor data from DoctorConsultation to BookAppointment format
    const rawDoctor = route.params?.doctor;
    const doctor = rawDoctor ? {
        name: rawDoctor.name,
        specialty: rawDoctor.specialty,
        desc: rawDoctor.desc || "Experienced medical professional providing comprehensive healthcare services with a focus on patient care and treatment excellence.",
        fee: rawDoctor.price || rawDoctor.fee,
        exp: rawDoctor.experience || rawDoctor.exp,
        rating: rawDoctor.rating,
        facility: rawDoctor.location || rawDoctor.facility,
        photo: rawDoctor.avatar || rawDoctor.photo || DOC_IMG,
    } : {
        name: 'Dr. Michael Chen',
        specialty: 'General Physician',
        desc: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type",
        fee: 'AED 180',
        exp: '12 years experience',
        rating: '4.7',
        facility: 'Jumeirah Medical Center',
        photo: DOC_IMG,
    };

    const [visitType, setVisitType] = useState(TYPE_OPTIONS[0]);
    const [slotBand, setSlotBand] = useState(SLOT_BANDS[0]);

    // Calendar state management
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Generate calendar dates for current month
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const lastDay = new Date(year, month + 1, 0);
        const today = new Date();

        const days = [];
        const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

        // Generate all days in the month
        for (let date = 1; date <= lastDay.getDate(); date++) {
            const currentDay = new Date(year, month, date);
            const dayOfWeek = currentDay.getDay();
            const isPast = currentDay < today.setHours(0, 0, 0, 0);

            // Adjust day index (0=Sunday -> 6, 1=Monday -> 0, etc.)
            const adjustedDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

            days.push({
                date: date,
                day: dayNames[adjustedDayIndex],
                fullDate: currentDay,
                disabled: isPast,
                isToday: currentDay.toDateString() === today.toDateString()
            });
        }

        return days;
    }, [currentDate]);

    // Get month name
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonthName = monthNames[currentDate.getMonth()];


    const timeSlots = useMemo(
        () => ({
            Morning: [
                { label: '9:00 - 9:30' },
                { label: '9:30 - 10:00', selected: true },
                { label: '10:00 - 10:30', disabled: true },
                { label: '10:30 - 11:00', disabled: true },
                { label: '11:00 - 11:30' },
                { label: '11:30 - 12:00' },
            ],
            Afternoon: [
                { label: '12:00 - 12:30' },
                { label: '12:30 - 1:00' },
                { label: '1:00 - 1:30' },
                { label: '1:30 - 2:00' },
            ],
            Evening: [
                { label: '5:00 - 5:30' },
                { label: '5:30 - 6:00' },
                { label: '6:00 - 6:30' },
            ],
            Night: [
                { label: '8:00 - 8:30' },
                { label: '8:30 - 9:00' },
            ],
        }),
        []
    );
    const [selectedSlot, setSelectedSlot] = useState('9:30 - 10:00');

    // Month navigation functions
    const goToPreviousMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() - 1);
        setCurrentDate(newDate);
    };

    const goToNextMonth = () => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + 1);
        setCurrentDate(newDate);
    };

    const onNext = () =>
        navigation.navigate('BookingConfirmation', {
            patient: route.params?.patient,
            doctor,
            schedule: {
                date: `${currentMonthName} ${selectedDate.getDate()}`,
                time: selectedSlot,
                type: visitType,
            },
        });

    return (
        <SafeAreaView style={styles.container}>
            <Image source={BG_WATERMARK} style={styles.watermark} resizeMode="cover" />

            {/* Header */}


            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >

                <Header
                    variant="standard"
                    title="Book Appointment"
                    leftIcon="back"
                    onLeftPress={() => navigation.goBack()}
                    onNotificationPress={() => navigation.navigate('Notifications')}
                    onMenuPress={() => navigation.toggleDrawer?.()}
                />
                <View style={styles.MainWrapper}>
                    {/* Doctor card */}
                    <View style={styles.docCard}>
                        <View style={styles.docInfo}>
                            <Text style={styles.docName}>{doctor.name}</Text>
                            <Text style={styles.docSpec}>{doctor.specialty}</Text>
                            <Text style={styles.docDesc} numberOfLines={3}>{doctor.desc}</Text>
                            <Text style={styles.fee}>{doctor.fee}</Text>
                        </View>
                        <Image source={doctor.photo} style={styles.docImg} resizeMode="cover" />
                    </View>

                    {/* Badges */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={styles.badgeScrollView}
                        contentContainerStyle={styles.badgeScrollContent}
                    >
                        <Badge icon="💼" label={doctor.exp} />
                        <Badge icon="⭐" label={doctor.rating} />
                        <Badge
                            iconComponent={<Icon name="map-pin" size="small" color={colors.textLight} />}
                            label={doctor.facility}
                        />
                    </ScrollView>

                    {/* Parent White Card containing all three sections */}
                    <View style={styles.parentCard}>
                        {/* Select Type */}
                        <Text style={styles.sectionTitle}>Select Type</Text>
                        <View style={styles.typeCard}>
                            <Segmented
                                options={TYPE_OPTIONS}
                                value={visitType}
                                onChange={setVisitType}
                            />
                        </View>

                        {/* Select Date */}
                        <Text style={styles.sectionTitle}>Select Date</Text>
                        <View style={styles.dateCard}>
                            <View style={styles.monthRow}>
                                <Pressable style={styles.chevButton} onPress={goToPreviousMonth}>
                                    <Icon
                                        name="chevron-right"
                                        size="small"
                                        color={colors.text}
                                        style={{ transform: [{ rotate: '180deg' }] }}
                                    />
                                </Pressable>
                                <Text style={styles.monthText}>{currentMonthName}</Text>
                                <Pressable style={styles.chevButton} onPress={goToNextMonth}>
                                    <Icon name="chevron-right" size="small" color={colors.text} />
                                </Pressable>
                            </View>

                            {/* Date Scroll */}
                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.dateScroll}
                                contentContainerStyle={styles.dateScrollContent}
                            >
                                {calendarData.map(d => {
                                    const isSel = selectedDate.getDate() === d.date &&
                                        selectedDate.getMonth() === currentDate.getMonth();
                                    const isSelectedToday = isSel && d.isToday;
                                    return (
                                        <Pressable
                                            key={d.date}
                                            disabled={d.disabled}
                                            onPress={() => setSelectedDate(d.fullDate)}
                                            style={[
                                                styles.dayPill,
                                                isSel && styles.dayPillSelected,
                                                d.disabled && styles.dayPillDisabled,
                                            ]}
                                        >
                                            <Text style={[
                                                styles.dayKey,
                                                isSel && styles.dayKeySelected,
                                                d.disabled && styles.dayKeyDisabled
                                            ]}>
                                                {d.day}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.dayNum,
                                                    isSel && styles.dayNumSelected,
                                                    d.disabled && styles.dayNumDisabled,
                                                ]}
                                            >
                                                {d.date}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>

                            <View style={styles.expandDot}>
                                <Icon
                                    name="chevron-right"
                                    size="small"
                                    color={colors.textLight}
                                    style={{ transform: [{ rotate: '90deg' }], opacity: 0.3 }}
                                />
                            </View>
                        </View>

                        {/* Select Time Slot */}
                        <Text style={styles.sectionTitle}>Select Time Slot</Text>
                        <View style={styles.timeCard}>
                            <Segmented
                                options={SLOT_BANDS}
                                value={slotBand}
                                onChange={(v) => {
                                    setSlotBand(v);
                                    const firstEnabled = timeSlots[v].find(s => !s.disabled);
                                    setSelectedSlot(firstEnabled?.label || null);
                                }}
                                compact
                            />
                            <View style={styles.slotGrid}>
                                {timeSlots[slotBand].map(s => {
                                    const sel = s.label === selectedSlot;
                                    return (
                                        <Pressable
                                            key={s.label}
                                            disabled={s.disabled}
                                            onPress={() => setSelectedSlot(s.label)}
                                            style={[
                                                styles.slotChip,
                                                sel && styles.slotChipSelected,
                                                s.disabled && styles.slotChipDisabled,
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styles.slotText,
                                                    sel && styles.slotTextSelected,
                                                    s.disabled && styles.slotTextDisabled,
                                                ]}
                                            >
                                                {s.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    </View>

                    {/* Next Button */}
                    <Button
                        title="Next"
                        onPress={onNext}
                        variant="primary"
                        size="large"
                        style={styles.nextButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

/* -------- Small UI pieces -------- */

function Segmented({ options, value, onChange, compact }) {
    return (
        <View style={[styles.segment, compact && styles.segmentCompact]}>
            {options.map(opt => {
                const active = value === opt;
                return (
                    <Pressable
                        key={opt}
                        onPress={() => onChange(opt)}
                        style={[styles.segItem, active && styles.segItemActive]}
                    >
                        <Text style={[styles.segText, active && styles.segTextActive]}>
                            {opt}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

function Badge({ icon, iconComponent, label, grow }) {
    return (
        <View style={[styles.badge, grow && styles.badgeGrow]}>
            {iconComponent ? iconComponent : <Text style={styles.badgeIcon}>{icon}</Text>}
            <Text style={styles.badgeText} numberOfLines={1}>{label}</Text>
        </View>
    );
}

/* -------- Styles -------- */

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background
    },
    MainWrapper: {
        padding: spacing.md
    },
    watermark: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.3,
        pointerEvents: 'none',
    },

    scrollContent: {
        paddingTop: spacing.sm,
        paddingBottom: 100,
    },

    // Doctor Card
    docCard: {
        marginTop: spacing.md,
        paddingStart: spacing.md,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },

    docInfo: {
        flex: 1,
        paddingRight: spacing.sm,
        paddingTop: 10
    },

    docName: {
        fontFamily: typography.fontFamily?.bold,
        fontSize: 20,
        color: colors.text,
    },

    docSpec: {
        marginTop: 2,
        color: '#8B6AF0',
        fontFamily: typography.fontFamily?.medium,
        fontSize: 14,
    },

    docDesc: {
        marginTop: 6,
        fontSize: 12,
        color: colors.textLight,
        lineHeight: 16,
    },

    fee: {
        marginTop: spacing.sm,
        fontFamily: typography.fontFamily?.bold,
        fontSize: 16,
        color: colors.text,
    },

    docImg: {
        width: 155,
        height: 200,
        resizeMode: 'cover',
    },

    // Badges
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 36,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
    },

    badgeScrollView: {
        marginTop: spacing.sm,
    },

    badgeScrollContent: {
        paddingHorizontal: spacing.md,
        gap: 8,
    },

    badgeIcon: {
        marginRight: 6,
        opacity: 0.7,
    },

    badgeText: {
        color: colors.text,
        fontSize: 12,
    },

    // Parent Card - NEW
    parentCard: {
        marginTop: spacing.lg,
        padding: spacing.md,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
    },

    // Section Title
    sectionTitle: {
        marginTop: spacing.md,
        marginBottom: spacing.sm,
        fontSize: 16,
        fontFamily: typography.fontFamily?.bold,
        color: colors.text,
    },

    // Type Card (removed individual card styling)
    typeCard: {
        padding: 4,
    },

    // Segmented Control
    segment: {
        flexDirection: 'row',
        backgroundColor: '#F5F5F7',
        padding: 4,
        borderRadius: 12,
        justifyContent: 'space-between',
        gap: 6
    },

    segmentCompact: {
        padding: 4,
        borderRadius: 12,
    },

    segItem: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },

    segItemActive: {
        backgroundColor: '#7B4BEB',
        shadowColor: '#7B4BEB',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },

    segText: {
        fontFamily: typography.fontFamily?.medium,
        color: colors.textLight,
        fontSize: 12,
    },

    segTextActive: {
        color: '#FFFFFF',
    },

    // Date Card (removed individual card styling)
    dateCard: {
        paddingVertical: spacing.sm,
    },

    // Time Card (removed individual card styling)
    timeCard: {
        paddingTop: spacing.sm,
    },

    // Month Navigation
    monthRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.sm,
        marginBottom: spacing.md,
    },

    chevButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
    },

    monthText: {
        fontSize: 16,
        fontFamily: typography.fontFamily?.bold,
        color: colors.text,
    },

    // Date Scroll
    dateScroll: {
        marginTop: spacing.sm,
    },

    dateScrollContent: {
        paddingHorizontal: 4,
        gap: 12,
    },

    dayPill: {
        minWidth: 52,
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },

    dayPillSelected: {
        backgroundColor: '#7B4BEB',
        shadowColor: '#7B4BEB',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 4,
    },

    dayPillDisabled: {
        backgroundColor: 'transparent',
        opacity: 0.3,
    },

    dayKey: {
        fontSize: 13,
        color: '#666666',
        marginBottom: 6,
        fontFamily: typography.fontFamily?.regular,
        fontWeight: '400',
    },

    dayKeySelected: {
        color: '#FFFFFF',
        fontWeight: '500',
    },

    dayKeyDisabled: {
        color: '#666666',
    },

    dayNum: {
        fontSize: 18,
        color: '#1A1A1A',
        fontFamily: typography.fontFamily?.semibold,
        fontWeight: '600',
    },

    dayNumSelected: {
        color: '#FFFFFF',
        fontWeight: '700',
    },

    dayNumDisabled: {
        color: '#1A1A1A',
    },

    expandDot: {
        alignItems: 'center',
        marginTop: spacing.sm,
    },

    // Time Slots
    slotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: spacing.md,
        gap: 8,
    },

    slotChip: {
        width: '31%',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F5F5F7',
    },

    slotChipSelected: {
        backgroundColor: '#7B4BEB',
        shadowColor: '#7B4BEB',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },

    slotChipDisabled: {
        backgroundColor: '#F5F5F7',
        opacity: 0.4,
    },

    slotText: {
        fontFamily: typography.fontFamily?.medium,
        color: colors.text,
        fontSize: 11,
        textAlign: 'center',
    },

    slotTextSelected: {
        color: '#FFFFFF',
    },

    slotTextDisabled: {
        opacity: 0.5,
    },

    // Next Button
    nextButton: {
        marginTop: spacing.lg,
        marginHorizontal: 0,
        width: '100%',
    },
});