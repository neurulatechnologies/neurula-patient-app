// File: src/screens/ProfileSettings.jsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing } from '../theme';
import { Button, TextField, FieldDropdown } from '../components';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';
import { getPatientProfile, updatePatientProfile, updateUserProfile } from '../services/patientService';
import { showSuccessToast, showErrorToast } from '../utils/errorMessages';

const BG_WATERMARK = require('../../assets/background.png');
const AVATAR = require('../../assets/logo1.png');

export default function ProfileSettings() {
    const navigation = useNavigation();
    const { user, refreshUser, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        emiratesId: '',
        passportNumber: '',
        email: '',
        gender: '',
        dateOfBirth: '',
        nationality: '',
        height: '',
        weight: '',
        bloodGroup: '',
        emirate: '',
        city: '',
        address: '',
        emergencyContactName: '',
        emergencyContactPhone: '',
        medicalConditions: '',
        allergies: '',
        currentMedications: '',
    });

    const [errors, setErrors] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState(new Date().getDate());
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const genderOptions = ['Male', 'Female', 'Other'];
    const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const emirateOptions = [
        'Abu Dhabi',
        'Dubai',
        'Sharjah',
        'Ajman',
        'Umm Al Quwain',
        'Ras Al Khaimah',
        'Fujairah'
    ];

    // Fetch user and patient data on mount
    useEffect(() => {
        if (isAuthenticated) {
            loadUserData();
        }
    }, [isAuthenticated]);

    const loadUserData = async () => {
        // Defensive check: Should not happen due to ProtectedRoute, but verify authentication
        if (!isAuthenticated) {
            console.warn('ProfileSettings accessed without authentication');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            // First, pre-populate form with cached user data for instant UI
            if (user) {
                setFormData(prev => ({
                    ...prev,
                    fullName: user.full_name || '',
                    phone: user.phone || '',
                    email: user.email || '',
                }));
            }

            // Then fetch fresh patient profile data
            const patientData = await getPatientProfile();

            // Format date of birth
            let formattedDob = '';
            if (patientData.date_of_birth) {
                const dobParts = patientData.date_of_birth.split('-');
                if (dobParts.length === 3) {
                    formattedDob = `${dobParts[0]} / ${dobParts[1]} / ${dobParts[2]}`;
                    setSelectedYear(parseInt(dobParts[0]));
                    setSelectedMonth(parseInt(dobParts[1]));
                    setSelectedDay(parseInt(dobParts[2]));
                } else {
                    formattedDob = patientData.date_of_birth;
                }
            }

            // Populate form with complete patient data
            setFormData({
                fullName: user?.full_name || '',
                phone: user?.phone || '',
                emiratesId: patientData.emirates_id || '',
                passportNumber: patientData.passport_number || '',
                email: user?.email || '',
                gender: patientData.gender || '',
                dateOfBirth: formattedDob,
                nationality: patientData.nationality || '',
                height: patientData.height?.toString() || '',
                weight: patientData.weight?.toString() || '',
                bloodGroup: patientData.blood_group || '',
                emirate: patientData.emirate || '',
                city: patientData.city || '',
                address: patientData.address || '',
                emergencyContactName: patientData.emergency_contact_name || '',
                emergencyContactPhone: patientData.emergency_contact_phone || '',
                medicalConditions: patientData.medical_conditions || '',
                allergies: patientData.allergies || '',
                currentMedications: patientData.current_medications || '',
            });

        } catch (error) {
            console.error('Failed to load user data:', error);

            // Check if error is authentication-related
            if (error.message && error.message.includes('No access token')) {
                Alert.alert(
                    'Session Expired',
                    'Please log in again to continue.',
                    [{ text: 'OK' }]
                );
            } else {
                Alert.alert('Error', 'Failed to load profile data. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Validation helper functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || email.trim() === '') {
            return 'Email is required';
        }
        if (!emailRegex.test(email)) {
            return 'Please enter a valid email address';
        }
        return null;
    };

    const validateEmiratesId = (id) => {
        // Emirates ID is optional, but if provided must be valid
        if (id && id.trim() !== '') {
            const cleanId = id.replace(/-/g, '');
            if (!cleanId.startsWith('784') || cleanId.length !== 15 || !/^\d+$/.test(cleanId)) {
                return 'Emirates ID must start with 784 and be 15 digits total';
            }
        }
        return null;
    };

    const validatePhone = (phone) => {
        if (!phone || phone.trim() === '') {
            return 'Phone number is required';
        }
        const phoneRegex = /^\+971\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return 'Phone must be in format +971XXXXXXXXX';
        }
        return null;
    };

    const validateFullName = (name) => {
        if (!name || name.trim() === '') {
            return 'Full name is required';
        }
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters';
        }
        return null;
    };

    const validateDateOfBirth = (date) => {
        if (!date || date.trim() === '') {
            return 'Date of birth is required';
        }
        const dateRegex = /^\d{4}\s*\/\s*\d{2}\s*\/\s*\d{2}$/;
        if (!dateRegex.test(date)) {
            return 'Format should be YYYY / MM / DD';
        }
        return null;
    };

    const validateHeight = (height) => {
        if (!height || height.trim() === '') {
            return null; // Optional
        }
        const heightNum = parseFloat(height);
        if (isNaN(heightNum)) {
            return 'Height must be a number';
        }
        if (heightNum < 50 || heightNum > 300) {
            return 'Height must be between 50-300 cm';
        }
        return null;
    };

    const validateWeight = (weight) => {
        if (!weight || weight.trim() === '') {
            return null; // Optional
        }
        const weightNum = parseFloat(weight);
        if (isNaN(weightNum)) {
            return 'Weight must be a number';
        }
        if (weightNum < 20 || weightNum > 300) {
            return 'Weight must be between 20-300 kg';
        }
        return null;
    };

    const validateGender = (gender) => {
        if (!gender || gender.trim() === '') {
            return 'Gender is required';
        }
        return null;
    };

    const validateForm = () => {
        const newErrors = {};

        const fullNameError = validateFullName(formData.fullName);
        if (fullNameError) newErrors.fullName = fullNameError;

        const phoneError = validatePhone(formData.phone);
        if (phoneError) newErrors.phone = phoneError;

        const emiratesIdError = validateEmiratesId(formData.emiratesId);
        if (emiratesIdError) newErrors.emiratesId = emiratesIdError;

        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;

        const genderError = validateGender(formData.gender);
        if (genderError) newErrors.gender = genderError;

        const dobError = validateDateOfBirth(formData.dateOfBirth);
        if (dobError) newErrors.dateOfBirth = dobError;

        const heightError = validateHeight(formData.height);
        if (heightError) newErrors.height = heightError;

        const weightError = validateWeight(formData.weight);
        if (weightError) newErrors.weight = weightError;

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user types
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    // DatePicker helper functions
    const formatDate = (year, month, day) => {
        const monthStr = String(month).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${year} / ${monthStr} / ${dayStr}`;
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

    const { years, months, days } = generateDateOptions();

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const confirmDateSelection = () => {
        const formattedDate = formatDate(selectedYear, selectedMonth, selectedDay);
        updateField('dateOfBirth', formattedDate);
        setShowDatePicker(false);
    };

    const onUpdate = async () => {
        if (!validateForm()) {
            console.log('Validation failed:', errors);
            Alert.alert('Validation Error', 'Please fix the errors in the form');
            return;
        }

        try {
            setUpdating(true);

            // Convert date format from YYYY / MM / DD to YYYY-MM-DD
            const dobParts = formData.dateOfBirth.split('/').map(p => p.trim());
            const formattedDob = `${dobParts[0]}-${dobParts[1]}-${dobParts[2]}`;

            // Prepare user data (name, phone)
            const userData = {
                full_name: formData.fullName,
                phone: formData.phone,
            };

            // Prepare patient data
            const patientData = {
                date_of_birth: formattedDob,
                gender: formData.gender,
                nationality: formData.nationality || null,
                emirates_id: formData.emiratesId || null,
                passport_number: formData.passportNumber || null,
                height: formData.height ? parseFloat(formData.height) : null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                blood_group: formData.bloodGroup || null,
                emirate: formData.emirate || null,
                city: formData.city || null,
                address: formData.address || null,
                emergency_contact_name: formData.emergencyContactName || null,
                emergency_contact_phone: formData.emergencyContactPhone || null,
                medical_conditions: formData.medicalConditions || null,
                allergies: formData.allergies || null,
                current_medications: formData.currentMedications || null,
            };

            console.log('Updating user profile with data:', userData);
            console.log('Updating patient profile with data:', patientData);

            // Update both User and Patient profiles
            await updateUserProfile(userData);
            await updatePatientProfile(patientData);

            // Refresh user context
            await refreshUser();

            // Show success toast and navigate back
            showSuccessToast('Success', 'Profile updated successfully!');
            setTimeout(() => {
                navigation.goBack();
            }, 1500);

        } catch (error) {
            console.error('Update profile error:', error);
            Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
        } finally {
            setUpdating(false);
        }
    };


    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Background watermark */}
            <Image source={BG_WATERMARK} style={styles.watermark} resizeMode="contain" />

            {/* Header */}
            <Header
                variant="standard"
                title="Profile Settings"
                leftIcon="back"
                onLeftPress={() => navigation.goBack()}
                onNotificationPress={() => navigation.navigate('Notifications')}
                onMenuPress={() => navigation.toggleDrawer?.()}
            />

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Main Parent Card */}
                <View style={styles.mainCard}>
                    {/* Profile Avatar */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarWrap}>
                            <View style={styles.avatarRing}>
                                <Image
                                    source={AVATAR}
                                    style={styles.avatar}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Form Fields */}
                    <View style={styles.formSection}>
                        {/* Full Name */}
                        <TextField
                            label="Full Name"
                            value={formData.fullName}
                            onChangeText={(text) => updateField('fullName', text)}
                            placeholder="Enter your full name"
                            error={errors.fullName}
                        />

                        {/* Phone */}
                        <TextField
                            label="Phone"
                            value={formData.phone}
                            onChangeText={(text) => updateField('phone', text)}
                            placeholder="+971XXXXXXXXX"
                            keyboardType="phone-pad"
                            helperText="Format: +971XXXXXXXXX"
                            error={errors.phone}
                        />

                        {/* Email (Read-only) */}
                        <TextField
                            label="Email"
                            value={formData.email}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            leftIcon="email"
                            error={errors.email}
                            editable={false}
                            style={styles.readOnlyField}
                        />

                        {/* Emirates ID/Passport Number (Read-only) */}
                        <TextField
                            label="Emirates ID"
                            value={formData.emiratesId}
                            placeholder="784XXXXXXXXXXXX"
                            keyboardType="numeric"
                            helperText="Must start with 784 and be 15 digits total"
                            error={errors.emiratesId}
                            editable={false}
                            style={styles.readOnlyField}
                        />

                        {/* Passport Number */}
                        <TextField
                            label="Passport Number"
                            value={formData.passportNumber}
                            onChangeText={(text) => updateField('passportNumber', text)}
                            placeholder="Enter passport number"
                            autoCapitalize="characters"
                        />

                        {/* Gender Dropdown */}
                        <FieldDropdown
                            label="Gender"
                            value={formData.gender}
                            onValueChange={(value) => updateField('gender', value)}
                            options={genderOptions}
                            placeholder="Select gender"
                            error={errors.gender}
                        />

                        {/* Date of Birth */}
                        <View>
                            <TextField
                                label="Date of Birth"
                                required={true}
                                value={formData.dateOfBirth}
                                onChangeText={(text) => updateField('dateOfBirth', text)}
                                placeholder="YYYY / MM / DD"
                                rightIcon="calendar"
                                onRightIconPress={showDatepicker}
                                error={errors.dateOfBirth}
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

                        {/* Nationality */}
                        <TextField
                            label="Nationality"
                            value={formData.nationality}
                            onChangeText={(text) => updateField('nationality', text)}
                            placeholder="Enter nationality"
                        />

                        {/* Height and Weight - Side by Side */}
                        <View style={styles.rowInputs}>
                            <View style={styles.halfWidth}>
                                <TextField
                                    label="Height (cm)"
                                    value={formData.height}
                                    onChangeText={(text) => updateField('height', text)}
                                    placeholder="154"
                                    keyboardType="numeric"
                                    error={errors.height}
                                />
                            </View>

                            <View style={styles.halfWidth}>
                                <TextField
                                    label="Weight (kg)"
                                    value={formData.weight}
                                    onChangeText={(text) => updateField('weight', text)}
                                    placeholder="57"
                                    keyboardType="numeric"
                                    error={errors.weight}
                                />
                            </View>
                        </View>

                        {/* Blood Group */}
                        <FieldDropdown
                            label="Blood Group"
                            value={formData.bloodGroup}
                            onValueChange={(value) => updateField('bloodGroup', value)}
                            options={bloodGroupOptions}
                            placeholder="Select blood group"
                        />

                        {/* Emirates and City - Side by Side */}
                        <View style={styles.rowInputs}>
                            <View style={styles.halfWidth}>
                                <FieldDropdown
                                    label="Emirate"
                                    value={formData.emirate}
                                    onValueChange={(value) => updateField('emirate', value)}
                                    options={emirateOptions}
                                    placeholder="Select emirate"
                                />
                            </View>

                            <View style={styles.halfWidth}>
                                <TextField
                                    label="City"
                                    value={formData.city}
                                    onChangeText={(text) => updateField('city', text)}
                                    placeholder="Enter city"
                                />
                            </View>
                        </View>

                        {/* Address */}
                        <TextField
                            label="Address"
                            value={formData.address}
                            onChangeText={(text) => updateField('address', text)}
                            placeholder="Enter full address"
                            multiline
                        />

                        {/* Emergency Contact */}
                        <Text style={styles.sectionTitle}>Emergency Contact</Text>

                        <TextField
                            label="Emergency Contact Name"
                            value={formData.emergencyContactName}
                            onChangeText={(text) => updateField('emergencyContactName', text)}
                            placeholder="Enter contact name"
                        />

                        <TextField
                            label="Emergency Contact Phone"
                            value={formData.emergencyContactPhone}
                            onChangeText={(text) => updateField('emergencyContactPhone', text)}
                            placeholder="+971XXXXXXXXX"
                            keyboardType="phone-pad"
                        />

                        {/* Medical Information */}
                        <Text style={styles.sectionTitle}>Medical Information</Text>

                        <TextField
                            label="Medical Conditions"
                            value={formData.medicalConditions}
                            onChangeText={(text) => updateField('medicalConditions', text)}
                            placeholder="Enter any medical conditions"
                            multiline
                        />

                        <TextField
                            label="Allergies"
                            value={formData.allergies}
                            onChangeText={(text) => updateField('allergies', text)}
                            placeholder="Enter any allergies"
                            multiline
                        />

                        <TextField
                            label="Current Medications"
                            value={formData.currentMedications}
                            onChangeText={(text) => updateField('currentMedications', text)}
                            placeholder="Enter current medications"
                            multiline
                        />
                    </View>

                    {/* Update Button */}
                    <Button
                        title={updating ? "Updating..." : "Update"}
                        onPress={onUpdate}
                        variant="primary"
                        style={styles.updateBtn}
                        textStyle={styles.updateText}
                        disabled={updating}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: spacing.md,
        fontFamily: 'Poppins_400Regular',
        fontSize: 16,
        color: colors.text,
    },
    watermark: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        opacity: 0.3,
    },
    content: {
        paddingTop: spacing.lg,
        paddingBottom: spacing['3xl'] + 80,
    },

    // Main Parent Card
    mainCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.40)',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingVertical: spacing.xl,
        paddingHorizontal: spacing.lg,
        shadowColor: colors.shadowGlass,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },

    // Avatar Section
    avatarSection: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    avatarWrap: {
        position: 'relative',
    },
    avatarRing: {
        width: 116,
        height: 116,
        borderRadius: 58,
        padding: 3,
        backgroundColor: 'transparent',
        borderWidth: 3,
        borderColor: colors.accentLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 104,
        height: 104,
        borderRadius: 52,
        backgroundColor: '#fff',
    },
    uploadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    editIconButton: {
        position: 'absolute',
        right: 0,
        top: 0,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#A855F7',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    editIcon: {
        fontSize: 16,
    },

    // Form Section
    formSection: {
        gap: spacing.sm,
    },

    sectionTitle: {
        fontFamily: 'Poppins_600SemiBold',
        fontSize: 16,
        color: colors.text,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },

    readOnlyField: {
        backgroundColor: '#F3F4F6',
        opacity: 0.7,
    },

    // Row Inputs (Height & Weight)
    rowInputs: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    halfWidth: {
        flex: 1,
    },

    // Update Button
    updateBtn: {
        marginTop: spacing['2xl'],
        borderRadius: spacing.borderRadius['3xl'],
        height: spacing.component.buttonHeight + 4,
    },
    updateText: {
        // keep default white text; center already handled by Button
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
