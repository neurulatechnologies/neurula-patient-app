import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    Text,
    Alert,
    ActivityIndicator,
    Platform,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { CameraView, Camera } from 'expo-camera';
import { colors, typography, spacing } from '../theme';
import { Button, Icon } from '../components';

export default function ScanPassport() {
    const navigation = useNavigation();
    const [hasPermission, setHasPermission] = useState(null);
    const [capturing, setCapturing] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [cameraReady, setCameraReady] = useState(false);
    const cameraRef = useRef(null);

    // Request camera permissions
    useEffect(() => {
        (async () => {
            try {
                const { status } = await Camera.requestCameraPermissionsAsync();
                setHasPermission(status === 'granted');
            } catch (error) {
                console.error('Error requesting camera permissions:', error);
                Alert.alert('Error', 'Failed to request camera permissions');
                setHasPermission(false);
            }
        })();
    }, []);

    // Handle camera ready
    const onCameraReady = () => {
        setCameraReady(true);
    };

    // Handle camera capture
    const handleCapture = async () => {
        if (!cameraReady || capturing || processing || !cameraRef.current) {
            return;
        }

        try {
            // Phase 1: Capturing
            setCapturing(true);

            // Take picture
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.8,
                base64: false,
                skipProcessing: false,
            });

            if (photo && photo.uri) {
                // Phase 2: Processing
                setCapturing(false);
                setProcessing(true);

                // Simulate OCR processing delay
                await new Promise(resolve => setTimeout(resolve, 2500));

                // Navigate to OCR Review with the captured passport image
                navigation.navigate('OCRReview', {
                    source: 'passport',
                    // Passport-specific extracted data structure
                    extracted: {
                        full_name: 'John Smith',
                        passport_number: 'A12345678',
                        nationality: 'United States',
                        date_of_birth: '1990-05-15',
                        place_of_birth: 'New York, USA',
                        gender: 'M',
                        issue_date: '2020-03-10',
                        expiry_date: '2030-03-10',
                        issuing_country: 'United States',
                        issuing_authority: 'U.S. Department of State',
                    },
                    imageUri: photo.uri,
                });
            }
        } catch (error) {
            console.error('Error capturing photo:', error);
            Alert.alert('Error', 'Failed to capture passport photo. Please try again.');
        } finally {
            setCapturing(false);
            setProcessing(false);
        }
    };

    // Handle manual entry
    const handleManual = () => navigation.navigate('ManualEntry');

    // Handle close
    const handleClose = () => navigation.goBack();

    // Handle permission denied
    const handlePermissionRequest = async () => {
        try {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        } catch (error) {
            console.error('Error requesting permissions:', error);
            Alert.alert('Error', 'Failed to request camera permissions');
        }
    };

    // Permission denied view
    if (hasPermission === false) {
        return (
            <SafeAreaView style={styles.container}>
                <Pressable
                    onPress={handleClose}
                    hitSlop={10}
                    style={styles.closeBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Close"
                >
                    <Icon name="x" size="large" color="#FFFFFF" />
                </Pressable>

                <View style={styles.permissionContainer}>
                    <Icon name="x" size="large" color="#FFFFFF" />
                    <Text style={styles.permissionTitle}>Camera Access Required</Text>
                    <Text style={styles.permissionText}>
                        We need access to your camera to scan your passport.
                        Please grant camera permissions to continue.
                    </Text>

                    <Button
                        title="Grant Permission"
                        onPress={handlePermissionRequest}
                        variant="primary"
                        style={styles.permissionButton}
                    />

                    <Button
                        title="Enter Manually Instead"
                        onPress={handleManual}
                        variant="outline"
                        style={styles.manualButton}
                    />
                </View>
            </SafeAreaView>
        );
    }

    // Loading view while checking permissions
    if (hasPermission === null) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={styles.loadingText}>Initializing camera...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Main camera view
    return (
        <SafeAreaView style={styles.container}>
            {/* Close button */}
            <Pressable
                onPress={handleClose}
                hitSlop={10}
                style={styles.closeBtn}
                accessibilityRole="button"
                accessibilityLabel="Close"
            >
                <Icon name="x" size="large" color="#FFFFFF" />
            </Pressable>

            {/* Camera view */}
            <View style={styles.cameraContainer}>
                <CameraView
                    style={styles.camera}
                    facing="back"
                    onCameraReady={onCameraReady}
                    ref={cameraRef}
                >
                    {/* Camera overlay */}
                    <View style={styles.overlay}>
                        {/* Floating Logo */}
                        <View style={styles.logoSection}>
                            <Image
                                source={require('../../assets/white-logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Middle section with frame */}
                        <View style={styles.middleSection}>
                            <View style={styles.scanFrame}>
                                {/* Passport-optimized corner indicators */}
                                <View style={[styles.frameCorner, styles.topLeft]} />
                                <View style={[styles.frameCorner, styles.topRight]} />
                                <View style={[styles.frameCorner, styles.bottomLeft]} />
                                <View style={[styles.frameCorner, styles.bottomRight]} />

                                {/* Passport icon in center */}
                                <View style={styles.frameCenter}>
                                    <Icon name="passport" size="large" color="rgba(255,255,255,0.5)" />
                                    <Text style={styles.frameCenterText}>Photo Page</Text>
                                </View>

                                {/* Scan line animation effect */}
                                <View style={styles.scanLine} />
                            </View>
                        </View>

                        {/* Bottom section with controls */}
                        <View style={styles.bottomSection}>
                            <Text style={styles.helperText}>
                                {processing
                                    ? "Processing passport data..."
                                    : capturing
                                        ? "Capturing passport..."
                                        : "Make sure the passport photo page is clearly visible,\nwell-lit, and flat against a dark surface"
                                }
                            </Text>

                            <View style={styles.controls}>
                                <Pressable
                                    onPress={handleCapture}
                                    disabled={capturing || processing || !cameraReady}
                                    style={[styles.captureBtn, (capturing || processing || !cameraReady) && styles.captureBtnDisabled]}
                                    android_ripple={{ color: colors.shadowGlass }}
                                    accessibilityRole="button"
                                    accessibilityLabel={processing ? "Processing passport" : "Capture passport photo page"}
                                >
                                    {(capturing || processing) ? (
                                        <ActivityIndicator size="small" color={colors.background} />
                                    ) : (
                                        <Text style={[styles.captureText, (capturing || processing || !cameraReady) && { opacity: 0.7 }]}>
                                            Capture Passport
                                        </Text>
                                    )}
                                </Pressable>

                                <Button
                                    title="Enter Manually"
                                    onPress={handleManual}
                                    variant="outline"
                                    style={styles.manualButton}
                                    accessibilityLabel="Enter passport details manually instead"
                                />
                            </View>
                        </View>
                    </View>
                </CameraView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    closeBtn: {
        position: 'absolute',
        right: spacing.sm,
        top: spacing.xl,
        zIndex: 20,
        // backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: spacing.borderRadius.full,
        padding: spacing.sm,
        minWidth: 44,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Permission views
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        gap: spacing.lg,
    },
    permissionTitle: {
        ...typography.styles.h2,
        color: '#FFFFFF',
        textAlign: 'center',
        marginTop: spacing.lg,
    },
    permissionText: {
        ...typography.styles.body,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 24,
    },
    permissionButton: {
        marginTop: spacing.xl,
        minWidth: 200,
    },

    // Loading view
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.lg,
    },
    loadingText: {
        ...typography.styles.body,
        color: '#FFFFFF',
    },

    // Camera view
    cameraContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },

    // Camera overlay
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        // paddingTop: spacing['6xl'],
        margingTop: '10%',
        paddingBottom: spacing.xl,
    },

    // Logo section
    logoSection: {
        alignItems: 'center',
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.lg,
        marginTop: '10%'
    },
    logo: {
        width: 250,
        height: 100,
        tintColor: '#FFFFFF',
    },

    // Middle section with scan frame - passport optimized
    middleSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scanFrame: {
        width: '90%',
        aspectRatio: 1.4, // Passport page aspect ratio (more square than Emirates ID)
        position: 'relative',
        borderRadius: 12,
    },
    frameCorner: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderColor: '#00D4AA', // Passport-themed green color
        borderWidth: 4,
        borderRadius: 4,
    },
    topLeft: {
        top: 0,
        left: 0,
        borderBottomWidth: 0,
        borderRightWidth: 0,
    },
    topRight: {
        top: 0,
        right: 0,
        borderBottomWidth: 0,
        borderLeftWidth: 0,
    },
    bottomLeft: {
        bottom: 0,
        left: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    bottomRight: {
        bottom: 0,
        right: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
    },
    frameCenter: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -30 }, { translateY: -25 }],
        alignItems: 'center',
    },
    frameCenterText: {
        ...typography.styles.caption,
        color: 'rgba(255,255,255,0.5)',
        marginTop: spacing.xs,
        fontWeight: '500',
    },

    // Scanning line effect
    scanLine: {
        position: 'absolute',
        top: '30%',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#00D4AA',
        opacity: 0.8,
        shadowColor: '#00D4AA',
        shadowOpacity: 0.6,
        shadowRadius: 4,
        elevation: 4,
    },

    // Bottom section
    bottomSection: {
        alignItems: 'center',
        paddingTop: spacing.lg,
    },
    helperText: {
        ...typography.styles.caption,
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: spacing.xl,
        lineHeight: 18,
    },
    controls: {
        width: '100%',
        gap: spacing.lg,
    },
    captureBtn: {
        height: 56,
        borderRadius: spacing.borderRadius['3xl'],
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00D4AA', // Passport-themed color
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 5,
        width: '100%',
    },
    captureBtnDisabled: {
        backgroundColor: '#00D4AA',
        opacity: 0.6,
    },
    captureText: {
        ...typography.styles.button,
        color: colors.background,
    },
    manualButton: {
        backgroundColor: 'transparent',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        height: 48,
    },
});