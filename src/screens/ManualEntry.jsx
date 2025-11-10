import React, { useMemo, useState } from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    Text,
    ScrollView,
    Image,
    Alert,
    Platform,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { colors, typography, spacing } from '../theme';
import { TextField, FieldDropdown, Button } from '../components';
import { useAuth } from '../context/AuthContext';

// assets (same pattern as other screens)
const LOGO_IMAGE = require('../../assets/logo.png');          // brand
const BG_WATERMARK = require('../../assets/background.png'); // soft bg art

const EMIRATES = [
    'Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman',
    'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah',
];

const NATIONALITIES = [
    'United Arab Emirates', 'India', 'Pakistan', 'Bangladesh', 'Philippines',
    'Nepal', 'Sri Lanka', 'Egypt', 'Nigeria', 'United Kingdom',
];

export default function ManualEntry() {
    const navigation = useNavigation();
    const { register, loading } = useAuth();

    // form state
    const [fullName, setFullName] = useState('');
    const [dob, setDob] = useState(new Date());
    const [dobText, setDobText] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [nationality, setNationality] = useState('');
    const [emiratesId, setEmiratesId] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [medical, setMedical] = useState('');
    const [contact, setContact] = useState('');
    const [emirate, setEmirate] = useState('');
    const [address, setAddress] = useState('');
    const [locationPin, setLocationPin] = useState('');
    const [currentLocation, setCurrentLocation] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    // simple front-end validation
    const [errors, setErrors] = useState({});

    const required = useMemo(
        () => ({
            fullName, dob: dobText, nationality, contact, emirate, address, locationPin, email,
        }),
        [fullName, dobText, nationality, contact, emirate, address, locationPin, email]
    );

    const validate = () => {
        const e = {};
        if (!fullName.trim()) e.fullName = 'Full name is required';
        if (!dobText.trim()) e.dob = 'Date of birth is required';
        if (!nationality.trim()) e.nationality = 'Select nationality';
        // Emirates ID validation - must start with 784 and be 15 digits total
        if (emiratesId && !/^784\d{12}$/.test(emiratesId)) {
            e.emiratesId = 'Emirates ID must start with 784 and be 15 digits total';
        }
        if (!contact.trim()) e.contact = 'Contact is required';
        if (!emirate.trim()) e.emirate = 'Select emirate';
        if (!address.trim()) e.address = 'Address is required';
        if (!locationPin.trim()) e.locationPin = 'Location pin is required';
        if (!email.trim()) e.email = 'Email is required';
        // Enhanced email validation
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email';
        // phone numeric check
        if (contact && !/^[\d+\-\s()]{6,20}$/.test(contact)) e.contact = 'Enter a valid number';
        // Password validation - match backend requirements
        if (!password) {
            e.password = 'Password is required';
        } else if (password.length < 8) {
            e.password = 'Password must be at least 8 characters';
        } else if (!/[A-Z]/.test(password)) {
            e.password = 'Password must contain at least one uppercase letter';
        } else if (!/[a-z]/.test(password)) {
            e.password = 'Password must contain at least one lowercase letter';
        } else if (!/[0-9]/.test(password)) {
            e.password = 'Password must contain at least one digit';
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            e.password = 'Password must contain at least one special character';
        }
        if (!confirmPassword) e.confirmPassword = 'Confirm password is required';
        else if (password !== confirmPassword) e.confirmPassword = 'Passwords do not match';
        setErrors(e);
        return !Object.keys(e).length;
    };

    const onComplete = async () => {
        // Clear previous errors
        setErrors({});

        // Validate form
        if (!validate()) {
            Alert.alert('Validation Error', 'Please fix the errors in the form');
            return;
        }

        try {
            // Format phone number for UAE format (+971XXXXXXXXX)
            let formattedPhone = contact.trim();

            // Remove all non-digit characters except leading +
            formattedPhone = formattedPhone.replace(/[^\d+]/g, '');

            // Handle different input formats
            if (formattedPhone.startsWith('+971')) {
                // Already has +971, keep as is
            } else if (formattedPhone.startsWith('971')) {
                // Has 971 without +, add +
                formattedPhone = '+' + formattedPhone;
            } else if (formattedPhone.startsWith('0')) {
                // Starts with 0 (local format), replace with +971
                formattedPhone = '+971' + formattedPhone.substring(1);
            } else if (formattedPhone.startsWith('+')) {
                // Has + but not +971, keep as is (will fail validation)
                formattedPhone = formattedPhone;
            } else {
                // Just digits, add +971
                formattedPhone = '+971' + formattedPhone;
            }

            // Ensure exactly 9 digits after +971 (remove excess digits)
            if (formattedPhone.startsWith('+971') && formattedPhone.length > 13) {
                formattedPhone = formattedPhone.substring(0, 13); // +971 + 9 digits = 13 chars
                console.warn('⚠️ Phone number truncated to 9 digits after +971');
            }

            // Format date from yyyy/mm/dd to yyyy-mm-dd
            const formattedDate = dobText ? dobText.replace(/\//g, '-') : null;

            console.log('📝 Preparing registration data...');
            console.log('   Phone (original):', contact.trim());
            console.log('   Phone (formatted):', formattedPhone);
            console.log('   Date (original):', dobText);
            console.log('   Date (formatted):', formattedDate);

            // Prepare registration data
            const registrationData = {
                full_name: fullName.trim(),
                email: email.trim(),
                phone: formattedPhone,
                password: password,
                registration_method: 'manual', // REQUIRED field!
                date_of_birth: formattedDate,
                nationality: nationality || null,
            };

            // Add optional fields
            if (emiratesId) registrationData.emirates_id = emiratesId;
            if (height) registrationData.height = parseFloat(height);
            if (weight) registrationData.weight = parseFloat(weight);
            if (medical) registrationData.medical_conditions = medical;
            if (emirate) registrationData.emirate = emirate;
            if (address) registrationData.address = address;
            if (locationPin) registrationData.location_pin = locationPin;

            console.log('📤 Sending registration data:', registrationData);

            // Call registration API
            const response = await register(registrationData);

            if (response.success) {
                // Navigate to OTP verification screen
                Alert.alert(
                    'Registration Successful',
                    'Please check your email or phone for the OTP code.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.navigate('OtpVerification', {
                                identifier: email.trim(), // Use email as identifier
                                phone: contact.trim(),
                            }),
                        },
                    ]
                );
            } else {
                // Show error
                Alert.alert(
                    'Registration Failed',
                    response.error || 'Unable to register. Please try again.',
                    [{ text: 'OK' }]
                );
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert(
                'Error',
                'An unexpected error occurred. Please try again.',
                [{ text: 'OK' }]
            );
        }
    };

    const onCancel = () => navigation.goBack();
    const onSkip = () => navigation.navigate('Home');

    // Date picker handler
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const onDateSelect = (selectedDate) => {
        setDob(selectedDate);
        setDobText(formatDate(selectedDate));
        setShowDatePicker(false);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    // Generate date options for picker
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

    const { years, months, days } = generateDateOptions();
    const [selectedYear, setSelectedYear] = useState(dob.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(dob.getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState(dob.getDate());

    const confirmDateSelection = () => {
        const newDate = new Date(selectedYear, selectedMonth - 1, selectedDay);
        onDateSelect(newDate);
    };

    // Location handler
    const getCurrentLocation = async () => {
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;

            // Get address from coordinates
            let address = await Location.reverseGeocodeAsync({ latitude, longitude });

            if (address.length > 0) {
                const addr = address[0];
                const locationString = `${addr.street || ''} ${addr.city || ''} ${addr.region || ''}`;
                setLocationPin(locationString.trim());
                setCurrentLocation({ latitude, longitude });
            } else {
                setLocationPin(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                setCurrentLocation({ latitude, longitude });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to get current location');
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            {/* background watermark */}
            <Image source={BG_WATERMARK} style={styles.watermark} resizeMode="contain" />



            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* header with back + logo */}
                <View style={styles.header}>
                    <Pressable onPress={navigation.goBack} hitSlop={10} style={styles.backBtn}>
                        <Text style={styles.backIcon}>‹</Text>
                    </Pressable>
                    <Image source={LOGO_IMAGE} style={styles.brandLogo} resizeMode="contain" />
                </View>
                {/* card wrapper */}
                <View style={styles.card}>
                    <Text style={styles.title}>Complete Registration</Text>
                    <Text style={styles.subtitle}>Please fill in your personal details</Text>

                    {/* Full Name */}
                    <TextField
                        label="Full Name"
                        required={true}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Enter your full name"
                        error={errors.fullName}
                        returnKeyType="next"
                    />

                    {/* Date of Birth */}
                    <View>
                        <TextField
                            label="Date of Birth"
                            required={true}
                            value={dobText}
                            onChangeText={setDobText}
                            placeholder="yyyy / mm / dd"
                            error={errors.dob}
                            rightIcon="calendar"
                            onRightIconPress={showDatepicker}
                        />

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
                    </View>

                    {/* Nationality (dropdown) */}
                    <FieldDropdown
                        label="Nationality"
                        required={true}
                        value={nationality}
                        onValueChange={setNationality}
                        placeholder="-- Select --"
                        options={NATIONALITIES}
                        error={errors.nationality}
                    />

                    {/* Emirates ID Number */}
                    <TextField
                        label="Emirates ID Number"
                        value={emiratesId}
                        onChangeText={setEmiratesId}
                        placeholder="784-XXX-XXXXXX-X"
                        rightIcon="search"
                        onRightIconPress={() => {/* TODO: Add search functionality */ }}
                        keyboardType="numeric"
                        helperText="Must start with 784 and be 15 digits total"
                        error={errors.emiratesId}
                    />

                    {/* Height / Weight */}
                    <View style={styles.row2}>
                        <View style={[styles.col, { marginRight: spacing.sm }]}>
                            <TextField
                                label="Height (cm)"
                                value={height}
                                onChangeText={(t) => setHeight(t.replace(/[^\d.]/g, ''))}
                                placeholder="00"
                                keyboardType="numeric"
                                style={{ marginBottom: 0 }}
                            />
                        </View>
                        <View style={[styles.col, { marginLeft: spacing.sm }]}>
                            <TextField
                                label="Weight (kg)"
                                value={weight}
                                onChangeText={(t) => setWeight(t.replace(/[^\d.]/g, ''))}
                                placeholder="00"
                                keyboardType="numeric"
                                style={{ marginBottom: 0 }}
                            />
                        </View>
                    </View>

                    {/* Medical Conditions */}
                    <TextField
                        label="Medical Conditions"
                        value={medical}
                        onChangeText={setMedical}
                        placeholder="List any medical conditions..."
                        multiline={true}
                        style={{ height: 120 }}
                    />

                    {/* Contact */}
                    <TextField
                        label="Contact"
                        required={true}
                        value={contact}
                        onChangeText={setContact}
                        placeholder="Enter your contact number"
                        keyboardType="phone-pad"
                        error={errors.contact}
                    />

                    {/* Emirates (dropdown) */}
                    <FieldDropdown
                        label="Emirates"
                        required={true}
                        value={emirate}
                        onValueChange={setEmirate}
                        placeholder="-- Select --"
                        options={EMIRATES}
                        error={errors.emirate}
                    />

                    {/* Address */}
                    <TextField
                        label="Address"
                        required={true}
                        value={address}
                        onChangeText={setAddress}
                        placeholder="Enter your full address"
                        error={errors.address}
                    />

                    {/* Location Pin */}
                    <TextField
                        label="Location Pin"
                        required={true}
                        value={locationPin}
                        onChangeText={setLocationPin}
                        placeholder="Add location pin"
                        rightIcon="map-pin"
                        onRightIconPress={getCurrentLocation}
                        error={errors.locationPin}
                        helperText="Tap pin icon to get current location"
                    />

                    {/* Map preview placeholder */}
                    <View style={styles.mapPreview}>
                        {/* TODO: replace with <MapView> or a static map snapshot */}
                        <Text style={styles.mapGhost}>Map preview</Text>
                    </View>

                    {/* Email Address */}
                    <TextField
                        label="Email Address"
                        required={true}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Enter your email address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={errors.email}
                    />

                    {/* Password */}
                    <TextField
                        label="Password"
                        required={true}
                        value={password}
                        onChangeText={setPassword}
                        placeholder="Enter your password"
                        leftIcon="lock"
                        secure={true}
                        error={errors.password}
                        helperText="Min 8 chars: uppercase, lowercase, digit, special character"
                    />

                    {/* Confirm Password */}
                    <TextField
                        label="Confirm Password"
                        required={true}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm your password"
                        leftIcon="lock"
                        secure={true}
                        error={errors.confirmPassword}
                    />

                    {/* Actions */}
                    <View style={styles.bottomSection}>
                        <Button
                            title={loading ? "Registering..." : "Complete Registration"}
                            onPress={onComplete}
                            variant="primary"
                            size="large"
                            disabled={loading}
                        />
                        {loading && (
                            <ActivityIndicator
                                size="small"
                                color={colors.primary}
                                style={{ marginTop: spacing.sm }}
                            />
                        )}

                        <Button
                            title="Cancel"
                            onPress={onCancel}
                            variant="outline"
                            size="large"
                            style={{ marginTop: spacing.lg }}
                        />

                        <Pressable onPress={onSkip} hitSlop={8} accessibilityRole="link">
                            <Text style={styles.skipLink}>Skip and Complete Later</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1 },
    watermark: {
        position: 'absolute',
        pointerEvents: 'none',
    },

    /* header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        // paddingTop: spacing.lg,
        // paddingBottom: spacing.md,
    },
    backBtn: { paddingRight: spacing.md, paddingVertical: spacing.xs },
    backIcon: {
        fontSize: 28,
        fontFamily: 'Poppins_400Regular',
        color: colors.text,
        opacity: 0.9
    },
    brandLogo: { width: 150, height: 40, marginLeft: 'auto', marginRight: 'auto', marginTop: '15%', marginBottom: '15%' },

    /* scroll + card */
    scrollContent: { flexGrow: 1 },
    card: {
        backgroundColor: colors.glassMorphism,
        borderColor: colors.borderGradient,
        borderWidth: 1,
        borderTopLeftRadius: spacing.borderRadius['2xl'],
        borderTopEndRadius: spacing.borderRadius['2xl'],
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
        shadowColor: colors.shadowGlass,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 6,
    },

    title: {
        fontFamily: 'Poppins_700Bold',
        fontSize: 28,
        lineHeight: 36,
        textAlign: 'center',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    subtitle: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        color: colors.textLight,
        marginBottom: spacing.lg,
    },



    row2: { flexDirection: 'row' },
    col: { flex: 1 },


    /* map preview placeholder */
    mapPreview: {
        height: 130,
        borderRadius: spacing.borderRadius.lg,
        overflow: 'hidden',
        backgroundColor: colors.background,
        borderWidth: 1,
        borderColor: colors.borderGradient,
        shadowColor: colors.shadowGlass,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 2,
        marginTop: spacing.sm,
        marginBottom: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mapGhost: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: colors.textLight,
    },

    /* actions */
    bottomSection: {
        paddingTop: spacing['2xl'],
        paddingBottom: spacing.screen?.bottom ?? spacing.lg,
    },
    skipLink: {
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        lineHeight: 24,
        color: '#A855F7',
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginTop: spacing.lg,
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
        fontFamily: 'Poppins_600SemiBold',
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
        fontFamily: 'Poppins_500Medium',
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
        fontFamily: 'Poppins_400Regular',
        fontSize: 14,
        color: colors.text,
    },
    selectedPickerItemText: {
        color: 'white',
        fontFamily: 'Poppins_600SemiBold',
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
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: colors.text,
    },
    confirmButtonText: {
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: 'white',
    },

});
