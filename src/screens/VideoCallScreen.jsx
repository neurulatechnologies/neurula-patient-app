// File: src/screens/VideoCallScreen.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    Animated,
    Platform,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { CameraView, Camera } from 'expo-camera';
import { useVideoCall } from '../context/VideoCallContext';
import {
    ArrowLeft,
    Maximize2,
    Mic,
    MicOff,
    VideoOff,
    Video,
    PhoneOff,
    Volume2,
    VolumeX,
    MessageSquare,
} from 'lucide-react-native';

// placeholder assets for doctor background
const DOCTOR_BG = require('../../assets/Doctor/doctor-bg.jpg'); // replace with remote video stream when integrated

export default function VideoCallScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { startVideoCall, endVideoCall, minimizeVideoCall } = useVideoCall();

    // UI states
    const [muted, setMuted] = useState(false);
    const [cameraOn, setCameraOn] = useState(true);
    const [speakerOn, setSpeakerOn] = useState(true);
    const [callActive, setCallActive] = useState(true);
    const [expanded, setExpanded] = useState(false);

    // Camera permission state
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);

    // Request camera permissions
    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // Start video call on mount
    useEffect(() => {
        const doctor = route.params?.doctor || { name: 'Dr Michael Chen', title: 'General Physician' };
        startVideoCall({ doctor });
    }, []);

    // timer state
    const [seconds, setSeconds] = useState(0);
    useEffect(() => {
        let t;
        if (callActive) {
            t = setInterval(() => setSeconds((s) => s + 1), 1000);
        }
        return () => clearInterval(t);
    }, [callActive]);

    // formatted mm:ss
    const timerLabel = useMemo(() => {
        const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
        const ss = String(seconds % 60).padStart(2, '0');
        return `${mm}:${ss}`;
    }, [seconds]);

    // animations for controls (subtle fade-in/out)
    const controlsOpacity = useRef(new Animated.Value(1)).current;
    const toggleControls = (toVisible) => {
        Animated.timing(controlsOpacity, {
            toValue: toVisible ? 1 : 0,
            duration: 220,
            useNativeDriver: true,
        }).start();
    };

    // toggle fullscreen expand (UI only)
    const onToggleExpand = () => {
        setExpanded((v) => !v);
    };

    // Hang up handler
    const hangup = () => {
        setCallActive(false);
        endVideoCall();

        // Get doctor info to pass to feedback screen
        const doctor = route.params?.doctor || { name: 'Dr Michael Chen', title: 'General Physician' };

        // Navigate to feedback screen
        navigation.navigate('ConsultationFeedback', {
            doctor,
            consultationId: route.params?.consultationId || null,
        });
    };

    // TODO: Replace the Image background with your remote video view when wiring real video:
    // e.g., <RTCView streamURL={remoteStream.toURL()} style={styles.remote} />
    // and replace local preview Image with local camera view.

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

            {/* Remote / background video */}
            <Image source={DOCTOR_BG} style={styles.remote} resizeMode="cover" />

            {/* Top controls container */}
            <View style={styles.topControlsContainer}>
                {/* Top left back */}
                <View style={styles.topLeft}>
                    <Pressable style={styles.topBtn} onPress={() => navigation.goBack()} hitSlop={10}>
                        <ArrowLeft size={18} color="#111827" />
                    </Pressable>
                </View>

                {/* Top center: timer pill */}
                <View style={styles.topCenter}>
                    <View style={styles.timerPill}>
                        <View style={styles.timerDot} />
                        <Text style={styles.timerText}>{timerLabel}</Text>
                    </View>
                </View>

                {/* Top right: expand */}
                <View style={styles.topRight}>
                    <Pressable style={styles.topBtn} onPress={onToggleExpand} hitSlop={10}>
                        <Maximize2 size={18} color="#111827" />
                    </Pressable>
                </View>
            </View>

            {/* Local preview (small floating window) */}
            <View style={[styles.localWrap, expanded ? styles.localWrapExpanded : null]}>
                {/* Local video camera */}
                {hasPermission && cameraOn ? (
                    <CameraView
                        style={styles.localVideo}
                        facing="front"
                        onCameraReady={() => setCameraReady(true)}
                    />
                ) : (
                    <View style={[styles.localVideo, styles.cameraOffView]}>
                        <VideoOff size={32} color="#FFFFFF" />
                    </View>
                )}
            </View>

            {/* Controls bar (bottom) */}
            <Animated.View style={[styles.controlsWrap, { opacity: controlsOpacity }]}>
                <View style={styles.controlsInner}>
                    <Pressable
                        onPress={() => setMuted((v) => !v)}
                        style={styles.controlBtn}
                        hitSlop={10}
                        accessibilityLabel="Toggle microphone"
                    >
                        {muted ? <MicOff size={18} color="#1F104A" /> : <Mic size={18} color="#1F104A" />}
                    </Pressable>

                    <Pressable
                        onPress={() => setCameraOn((v) => !v)}
                        style={styles.controlBtn}
                        hitSlop={10}
                        accessibilityLabel="Toggle camera"
                    >
                        {cameraOn ? <Video size={18} color="#1F104A" /> : <VideoOff size={18} color="#1F104A" />}
                    </Pressable>

                    <Pressable
                        onPress={hangup}
                        style={styles.hangupBtn}
                        hitSlop={10}
                        accessibilityLabel="Hang up"
                    >
                        <PhoneOff size={20} color="#fff" />
                    </Pressable>

                    <Pressable
                        onPress={() => setSpeakerOn((v) => !v)}
                        style={styles.controlBtn}
                        hitSlop={10}
                        accessibilityLabel="Toggle speaker"
                    >
                        {speakerOn ? <Volume2 size={18} color="#1F104A" /> : <VolumeX size={18} color="#1F104A" />}
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            // Minimize video call and navigate to chat
                            const doctor = route.params?.doctor || { name: 'Dr Michael Chen', title: 'General Physician' };
                            minimizeVideoCall();
                            navigation.navigate('ChatConsultation', {
                                doctor,
                                videoCallActive: true
                            });
                        }}
                        style={styles.controlBtn}
                        hitSlop={10}
                        accessibilityLabel="Open chat"
                    >
                        <MessageSquare size={18} color="#1F104A" />
                    </Pressable>
                </View>
            </Animated.View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },

    /* remote video (fills the screen) */
    remote: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },

    /* top controls container */
    topControlsContainer: {
        position: 'absolute',
        top: 90,
        left: 0,
        right: 0,
        height: 60,
    },

    /* top controls */
    topLeft: {
        position: 'absolute',
        left: 16,
        top: 0,
    },
    topCenter: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        alignItems: 'center',
    },
    topRight: {
        position: 'absolute',
        right: 16,
        top: 0,
    },
    topBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },

    /* timer pill */
    timerPill: {
        backgroundColor: 'rgba(255,255,255,0.95)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.04)',
    },
    timerDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FF5A5F',
        marginRight: 8,
    },
    timerText: {
        fontSize: 13,
        color: '#1F104A',
        fontWeight: '600',
    },

    /* local preview */
    localWrap: {
        position: 'absolute',
        right: 18,
        bottom: 150,
        width: 120,
        height: 170,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 18,
        elevation: 10,
    },
    localWrapExpanded: {
        width: 160,
        height: 220,
    },
    localVideo: {
        width: '100%',
        height: '100%',
    },
    cameraOffView: {
        backgroundColor: '#1F104A',
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* controls at bottom */
    controlsWrap: {
        position: 'absolute',
        left: 16,
        right: 16,
        bottom: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    controlsInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(250,250,250,0.9)',
        borderRadius: 40,
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 6 },
        shadowRadius: 12,
        elevation: 6,
    },

    /* icon buttons */
    controlBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.95)',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 3,
    },

    /* hangup button */
    hangupBtn: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: '#F43F5E', // red
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 4,
        shadowColor: '#F43F5E',
        shadowOpacity: 0.36,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
});
