// File: src/screens/ProfileSettings.jsx
import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing } from '../theme';
import { Button, TextField, FieldDropdown } from '../components';
import Header from '../components/Header';

const BG_WATERMARK = require('../../assets/background.png');
const AVATAR = require('../../assets/logo1.png');

export default function ProfileSettings() {
    const navigation = useNavigation();

    const [formData, setFormData] = useState({
        fullName: 'James Collins',
        emiratesId: '000-0000-000000-0',
        email: 'jamesc@gmail.com',
        gender: 'Male',
        dateOfBirth: '1998 / 05 / 05',
        height: '154',
        weight: '57',
    });

    const [errors, setErrors] = useState({});
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedYear, setSelectedYear] = useState(parseInt(formData.dateOfBirth.split(' / ')[0]) || new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(parseInt(formData.dateOfBirth.split(' / ')[1]) || new Date().getMonth() + 1);
    const [selectedDay, setSelectedDay] = useState(parseInt(formData.dateOfBirth.split(' / ')[2]) || new Date().getDate());
    const [avatarUri, setAvatarUri] = useState(null);

    const genderOptions = ['Male', 'Female', 'Other'];

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
            const emiratesIdRegex = /^784\d{12}$/;
            if (!emiratesIdRegex.test(id)) {
                return 'Emirates ID must start with 784 and be 15 digits total';
            }
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
            return 'Height is required';
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
            return 'Weight is required';
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

    const onUpdate = () => {
        if (validateForm()) {
            // All validations passed
            console.log('Update profile:', formData);
            // TODO: Implement actual update profile logic
        } else {
            console.log('Validation failed:', errors);
        }
    };

    // Image picker functions
    const requestCameraPermission = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Denied',
                'Camera permission is required to take photos. Please enable it in your device settings.',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    const requestGalleryPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Denied',
                'Gallery permission is required to select photos. Please enable it in your device settings.',
                [{ text: 'OK' }]
            );
            return false;
        }
        return true;
    };

    const handleTakePhoto = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setAvatarUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    const handleChooseFromGallery = async () => {
        const hasPermission = await requestGalleryPermission();
        if (!hasPermission) return;

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                setAvatarUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error selecting photo:', error);
            Alert.alert('Error', 'Failed to select photo. Please try again.');
        }
    };

    const onEditAvatar = () => {
        Alert.alert(
            'Change Profile Picture',
            'Choose an option',
            [
                {
                    text: 'Take Photo',
                    onPress: handleTakePhoto,
                },
                {
                    text: 'Choose from Gallery',
                    onPress: handleChooseFromGallery,
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

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
                    {/* Profile Avatar with Edit Button */}
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarWrap}>
                            <View style={styles.avatarRing}>
                                <Image
                                    source={avatarUri ? { uri: avatarUri } : AVATAR}
                                    style={styles.avatar}
                                />
                            </View>
                            <Pressable style={styles.editIconButton} onPress={onEditAvatar}>
                                <Text style={styles.editIcon}>✏️</Text>
                            </Pressable>
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

                        {/* Emirates ID/Passport Number */}
                        <TextField
                            label="Emirates ID/Passport Number"
                            value={formData.emiratesId}
                            onChangeText={(text) => updateField('emiratesId', text)}
                            placeholder="784XXXXXXXXXXXX"
                            keyboardType="numeric"
                            helperText="Must start with 784 and be 15 digits total"
                            error={errors.emiratesId}
                        />

                        {/* Email */}
                        <TextField
                            label="Email"
                            value={formData.email}
                            onChangeText={(text) => updateField('email', text)}
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            leftIcon="email"
                            error={errors.email}
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
                    </View>

                    {/* Update Button */}
                    <Button
                        title="Update"
                        onPress={onUpdate}
                        variant="primary"
                        style={styles.updateBtn}
                        textStyle={styles.updateText}
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