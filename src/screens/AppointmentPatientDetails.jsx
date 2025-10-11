// File: AppointmentPatientDetails.jsx
import React, { useMemo, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ScrollView,
    Modal,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Header from '../components/Header';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { TextField, FieldDropdown } from '../components';
import { colors, spacing, typography } from '../theme';

const BG_WATERMARK = require('../../assets/background.png');

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

// Date picker helper functions
const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
};

const generateDateOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i >= currentYear - 100; i--) {
        years.push(i);
    }
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return { years, months, days };
};

export default function AppointmentPatientDetails() {
    const navigation = useNavigation();
    const route = useRoute();

    // from BookAppointment screen
    const doctor = route.params?.doctor;
    const schedule = route.params?.schedule;
    const basePatient = route.params?.patient || {};

    // radio: Myself / Other
    const [bookingFor, setBookingFor] = useState('Other'); // design shows "Other" selected
    const [form, setForm] = useState({
        fullName: bookingFor === 'Myself' ? basePatient.name || '' : '',
        emiratesOrPassport: '',
        email: bookingFor === 'Myself' ? basePatient.email || '' : '',
        gender: '',
        dob: '', // yyyy/mm/dd
        height: '',
        weight: '',
    });

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [dob, setDob] = useState(new Date(2000, 0, 1));

    // Date picker state
    const { years, months, days } = generateDateOptions();
    const [selectedYear, setSelectedYear] = useState(dob.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(dob.getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState(dob.getDate());

    // Handle radio toggle
    const setBooking = (who) => {
        setBookingFor(who);
        if (who === 'Myself') {
            setForm((f) => ({
                ...f,
                fullName: basePatient.name || f.fullName,
                email: basePatient.email || f.email,
            }));
        }
    };

    // Helpers
    const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    // Date picker handlers
    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const onDateSelect = (selectedDate) => {
        setDob(selectedDate);
        onChange('dob', formatDate(selectedDate));
        setShowDatePicker(false);
    };

    const confirmDateSelection = () => {
        const newDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
        onDateSelect(newDate);
    };

    const onPickDOB = (event, selDate) => {
        if (Platform.OS === 'android') setDobPickerOpen(false);
        if (selDate) {
            setDobDate(selDate);
            onChange('dob', formatDate(selDate));
        }
    };

    const validate = () => {
        const errs = {};
        if (!form.fullName.trim()) errs.fullName = 'Full name is required';
        if (!form.dob.trim()) errs.dob = 'Date of birth is required';
        // Emirates ID validation - must start with 784 and be 15 digits total
        if (form.emiratesOrPassport && !/^784\d{12}$/.test(form.emiratesOrPassport)) {
            errs.emiratesOrPassport = 'Emirates ID must start with 784 and be 15 digits total';
        }
        if (!form.email.trim()) errs.email = 'Email is required';
        // Enhanced email validation
        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email';
        if (!form.gender.trim()) errs.gender = 'Select gender';
        // Height and weight validation
        if (form.height && (isNaN(form.height) || form.height <= 0)) errs.height = 'Enter valid height';
        if (form.weight && (isNaN(form.weight) || form.weight <= 0)) errs.weight = 'Enter valid weight';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const [errors, setErrors] = useState({});

    const onNext = () => {
        if (!validate()) return;
        navigation.navigate('ConfirmBooking', {
            patient: {
                name: form.fullName,
                email: form.email,
                gender: form.gender,
                dob: form.dob,
                height: form.height ? `${form.height} cm` : '',
                weight: form.weight ? `${form.weight} kg` : '',
                idOrPassport: form.emiratesOrPassport,
            },
            doctor,
            schedule,
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Background watermark */}
            <Image source={BG_WATERMARK} style={styles.watermark} resizeMode="contain" />

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing['3xl'] }}>
                <Header
                    variant="standard"
                    title="Book Appointment"
                    leftIcon="back"
                    onLeftPress={() => navigation.goBack()}
                    onNotificationPress={() => navigation.navigate('Notifications')}
                    onMenuPress={() => navigation.toggleDrawer?.()}
                />

                <View style={styles.bodyPad}>
                    {/* Booking for - No Card */}
                    <View style={styles.appointmentWrapper}>
                        <Text style={styles.h3}>Booking Appointment for</Text>

                        <View style={styles.radioRow}>
                            <Radio
                                label="Myself"
                                checked={bookingFor === 'Myself'}
                                onPress={() => setBooking('Myself')}
                            />
                            <Radio
                                label="Other"
                                checked={bookingFor === 'Other'}
                                onPress={() => setBooking('Other')}
                            />
                        </View>
                    </View>

                    {/* Patient Details Card */}
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Patient Details</Text>

                        {/* Form fields using standard components */}
                        <TextField
                            label="Full Name"
                            required={true}
                            placeholder="Enter Full Name"
                            value={form.fullName}
                            onChangeText={(t) => onChange('fullName', t)}
                            error={errors.fullName}
                            returnKeyType="next"
                        />

                        <TextField
                            label="Emirates ID/Passport Number"
                            placeholder="Enter Full Name"
                            value={form.emiratesOrPassport}
                            onChangeText={(t) => onChange('emiratesOrPassport', t)}
                            error={errors.emiratesOrPassport}
                            keyboardType="numeric"
                            helperText="Must start with 784 and be 15 digits total"
                        />

                        <TextField
                            label="Email"
                            required={true}
                            placeholder="youremail@email.com"
                            autoCapitalize="none"
                            keyboardType="email-address"
                            value={form.email}
                            onChangeText={(t) => onChange('email', t)}
                            error={errors.email}
                        />

                        {/* Gender */}
                        <FieldDropdown
                            label="Gender"
                            required={true}
                            value={form.gender}
                            onValueChange={(value) => onChange('gender', value)}
                            placeholder="-- Select --"
                            options={GENDER_OPTIONS}
                            error={errors.gender}
                        />

                        {/* Date of Birth */}
                        <TextField
                            label="Date of Birth"
                            required={true}
                            value={form.dob}
                            onChangeText={(t) => onChange('dob', t)}
                            placeholder="yyyy / mm / dd"
                            error={errors.dob}
                            rightIcon="calendar"
                            onRightIconPress={showDatepicker}
                        />

                        {/* Height & Weight */}
                        <View style={styles.hwRow}>
                            <View style={{ flex: 1, marginRight: spacing.sm }}>
                                <TextField
                                    label="Height (cm)"
                                    placeholder="00"
                                    keyboardType="numeric"
                                    value={form.height}
                                    onChangeText={(t) => onChange('height', t.replace(/[^\d.]/g, ''))}
                                    error={errors.height}
                                    style={{ marginBottom: 0 }}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: spacing.sm }}>
                                <TextField
                                    label="Weight (kg)"
                                    placeholder="00"
                                    keyboardType="numeric"
                                    value={form.weight}
                                    onChangeText={(t) => onChange('weight', t.replace(/[^\d.]/g, ''))}
                                    error={errors.weight}
                                    style={{ marginBottom: 0 }}
                                />
                            </View>
                        </View>
                        <Button
                            title="Next"
                            onPress={onNext}
                            variant="primary"
                            size="large"
                            style={{ marginTop: spacing['3xl'] }}
                        />
                    </View>

                    {/* Next Button */}

                </View>
            </ScrollView>

            {/* Custom Date Picker Modal */}
            <Modal
                visible={showDatePicker}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDatePicker(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Date of Birth</Text>

                        <View style={styles.datePickerContainer}>
                            {/* Year Picker */}
                            <View style={styles.pickerColumn}>
                                <Text style={styles.pickerLabel}>Year</Text>
                                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                                    {years.map(year => (
                                        <TouchableOpacity
                                            key={year}
                                            style={[
                                                styles.pickerItem,
                                                selectedYear === year && styles.selectedPickerItem
                                            ]}
                                            onPress={() => setSelectedYear(year)}
                                        >
                                            <Text style={[
                                                styles.pickerItemText,
                                                selectedYear === year && styles.selectedPickerItemText
                                            ]}>{year}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Month Picker */}
                            <View style={styles.pickerColumn}>
                                <Text style={styles.pickerLabel}>Month</Text>
                                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                                    {months.map(month => (
                                        <TouchableOpacity
                                            key={month}
                                            style={[
                                                styles.pickerItem,
                                                selectedMonth === month && styles.selectedPickerItem
                                            ]}
                                            onPress={() => setSelectedMonth(month)}
                                        >
                                            <Text style={[
                                                styles.pickerItemText,
                                                selectedMonth === month && styles.selectedPickerItemText
                                            ]}>{month.toString().padStart(2, '0')}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>

                            {/* Day Picker */}
                            <View style={styles.pickerColumn}>
                                <Text style={styles.pickerLabel}>Day</Text>
                                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                                    {days.map(day => {
                                        const maxDays = new Date(selectedYear, selectedMonth, 0).getDate();
                                        if (day > maxDays) return null;
                                        return (
                                            <TouchableOpacity
                                                key={day}
                                                style={[
                                                    styles.pickerItem,
                                                    selectedDay === day && styles.selectedPickerItem
                                                ]}
                                                onPress={() => setSelectedDay(day)}
                                            >
                                                <Text style={[
                                                    styles.pickerItemText,
                                                    selectedDay === day && styles.selectedPickerItemText
                                                ]}>{day.toString().padStart(2, '0')}</Text>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setShowDatePicker(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={confirmDateSelection}
                            >
                                <Text style={styles.confirmButtonText}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

/* ---------- Reusable subcomponents ---------- */

function Radio({ label, checked, onPress }) {
    return (
        <Pressable onPress={onPress} style={styles.radioItem}>
            <View style={[styles.radioOuter, checked && styles.radioOuterActive]}>
                {checked ? <View style={styles.radioInner} /> : null}
            </View>
            <Text style={styles.radioLabel}>{label}</Text>
        </Pressable>
    );
}

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },

    watermark: {
        position: 'absolute',
        // top: '50%',
        // left: '50%',
        // width: 600,
        // height: 600,
        // marginLeft: -300,
        // marginTop: -300,
        opacity: 0.50,
        // pointerEvents: 'none',
    },
    appointmentWrapper: {
        padding: 20
    },
    bodyPad: {
        // paddingHorizontal: spacing.screen?.horizontal ?? spacing.md,
        paddingTop: spacing.sm
    },

    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.40)',
        borderRadius: 30,
        // borderTopLeftRadius: 0,
        // borderTopRightRadius: 0,
        padding: spacing.lg || 20,
        marginBottom: spacing.md || 16,
        overflow: 'hidden',
    },

    h3: {
        fontSize: 18,
        fontFamily: typography.fontFamily?.bold || 'Poppins_600SemiBold',
        color: colors.text || '#1F2937',
        marginBottom: spacing.sm || 12,
    },

    radioRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        marginTop: spacing.xs || 8,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    radioOuter: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        backgroundColor: '#FFFFFF',
    },
    radioOuterActive: {
        borderColor: '#A855F7',
        backgroundColor: '#FFFFFF',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#A855F7'
    },
    radioLabel: {
        color: colors.text || '#1F2937',
        fontSize: 16,
        fontFamily: typography.fontFamily?.medium || 'Poppins_500Medium',
    },

    sectionTitle: {
        fontSize: 18,
        fontFamily: typography.fontFamily?.bold || 'Poppins_600SemiBold',
        color: colors.text || '#1F2937',
        marginBottom: spacing.md || 16,
    },

    hwRow: {
        flexDirection: 'row',
        marginBottom: 0,
    },

    // Date picker modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        maxHeight: '80%',
    },
    modalTitle: {
        fontFamily: typography.fontFamily?.bold || 'Poppins_600SemiBold',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: colors.text,
    },
    datePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    pickerColumn: {
        flex: 1,
        marginHorizontal: 5,
    },
    pickerLabel: {
        fontFamily: typography.fontFamily?.medium || 'Poppins_500Medium',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
        color: colors.text,
    },
    pickerScroll: {
        maxHeight: 200,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
    },
    pickerItem: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        alignItems: 'center',
    },
    selectedPickerItem: {
        backgroundColor: '#A855F7',
    },
    pickerItemText: {
        fontFamily: typography.fontFamily?.regular || 'Poppins_400Regular',
        fontSize: 14,
        color: colors.text,
    },
    selectedPickerItemText: {
        color: 'white',
        fontFamily: typography.fontFamily?.bold || 'Poppins_600SemiBold',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    confirmButton: {
        backgroundColor: '#A855F7',
    },
    cancelButtonText: {
        fontFamily: typography.fontFamily?.medium || 'Poppins_500Medium',
        fontSize: 14,
        color: colors.text,
    },
    confirmButtonText: {
        fontFamily: typography.fontFamily?.medium || 'Poppins_500Medium',
        fontSize: 14,
        color: 'white',
    },
});