// File: src/screens/ChatConsultation.jsx
import React, { useMemo, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    ChevronLeft,
    Phone,
    Video,
    MoreVertical,
    Paperclip,
    Mic,
    Send,
    Play,
    Pause
} from 'lucide-react-native';
import { colors, spacing, typography } from '../theme';
import Button from '../components/Button';
import FloatingVideoCall from '../components/FloatingVideoCall';

// assets
const BG_WATERMARK = require('../../assets/background.png');
const AVATAR_DOCTOR = require('../../assets/logo2.png');
const AVATAR_PATIENT = require('../../assets/logo3.png');

export default function ChatConsultation() {
    const navigation = useNavigation();
    const route = useRoute();

    const doctor = route.params?.doctor ?? {
        name: 'Dr Michael Chen',
        title: 'General Physician',
    };

    const [messages, setMessages] = useState([
        { id: 'm1', from: 'patient', type: 'text', text: 'Good Morning, Doctor.', time: '09:30 am' },
        { id: 'm2', from: 'doctor', type: 'text', text: 'Good Morning, How can I help you?', time: '09:30 am' },
        { id: 'm3', from: 'patient', type: 'text', text: 'I am feeling severe pain in the middle of my abdomen since last night.', time: '09:31 am' },
        { id: 'm4', from: 'doctor', type: 'text', text: 'Is there any other symptom with abdomen pain like fever, chills or shortness of breath.', time: '09:32 am' },
        { id: 'm5', from: 'patient', type: 'voice', duration: 38, time: '09:31 am' },
    ]);

    const [composer, setComposer] = useState('');
    const scrollRef = useRef(null);

    const typing = route.params?.typing ?? false;

    const onSend = () => {
        if (!composer.trim()) return;
        const payload = {
            id: String(Date.now()),
            from: 'patient',
            type: 'text',
            text: composer.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase(),
        };
        setMessages((prev) => [...prev, payload]);
        setComposer('');
        setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    };

    const renderBubble = (m) => {
        const isMe = m.from === 'patient';
        const wrapper = [
            styles.bubble,
            isMe ? styles.bubbleMe : styles.bubbleDoc,
        ];

        // Show avatar for: doctor (all messages) OR patient voice messages only
        const showAvatar = !isMe || m.type === 'voice';

        return (
            <View key={m.id} style={[styles.row, isMe ? styles.rowEnd : styles.rowStart]}>
                {!isMe && (
                    <Image source={AVATAR_DOCTOR} style={styles.avatar} />
                )}

                <View style={{ maxWidth: '75%' }}>
                    <View style={wrapper}>
                        {m.type === 'text' ? (
                            <Text style={[styles.bubbleText, isMe ? styles.bubbleTextMe : styles.bubbleTextDoc]}>
                                {m.text}
                            </Text>
                        ) : (
                            <VoiceMessage isMe={isMe} />
                        )}
                    </View>
                    <Text style={[styles.time, isMe ? styles.timeMe : styles.timeDoc]}>{m.time}</Text>
                </View>

                {/* Show patient avatar ONLY for voice messages */}
                {/* {isMe && m.type === 'voice' && (
                    <Image source={AVATAR_PATIENT} style={styles.avatar} />
                )} */}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Background */}
            <Image source={BG_WATERMARK} style={styles.watermark} resizeMode="contain" />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
                    <ChevronLeft size={24} color="#000" />
                </Pressable>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>{doctor.name}</Text>
                    <Text style={styles.headerSubtitle}>
                        {typing ? 'Typing...' : doctor.title}
                    </Text>
                </View>

                <View style={styles.headerRight}>
                    <Pressable style={styles.headerIcon} hitSlop={8}>
                        <Phone size={20} color="#000" />
                    </Pressable>
                    <Pressable
                        style={styles.headerIcon}
                        hitSlop={8}
                        onPress={() => navigation.navigate('VideoCallScreen', { doctor })}
                    >
                        <Video size={20} color="#000" />
                    </Pressable>
                    <Pressable style={styles.headerIcon} hitSlop={8}>
                        <MoreVertical size={20} color="#000" />
                    </Pressable>
                </View>
            </View>

            {/* Chat body */}
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
                >
                    {messages.map(renderBubble)}
                    {typing && (
                        <View style={[styles.row, styles.rowStart]}>
                            <Image source={AVATAR_DOCTOR} style={styles.avatar} />
                            <View style={[styles.bubble, styles.bubbleDoc, styles.typingBubble]}>
                                <TypingDots />
                            </View>
                        </View>
                    )}
                </ScrollView>

                {/* Composer */}
                <View style={styles.composerWrap}>
                    <TextInput
                        value={composer}
                        onChangeText={setComposer}
                        placeholder="Enter your text"
                        placeholderTextColor="#A8A8B8"
                        style={styles.composerInput}
                        multiline
                        maxLength={500}
                    />

                    <Pressable style={styles.composerIcon} hitSlop={8}>
                        <Paperclip size={20} color="#7A5AF8" />
                    </Pressable>

                    <Pressable style={styles.composerIcon} hitSlop={8}>
                        <Mic size={20} color="#7A5AF8" />
                    </Pressable>

                    <Pressable
                        onPress={onSend}
                        style={styles.sendBtn}
                        hitSlop={10}
                    >
                        <Send size={20} color="#FFFFFF" />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>

            {/* Floating video call overlay */}
            <FloatingVideoCall />
        </SafeAreaView>
    );
}

function VoiceMessage({ isMe }) {
    const [playing, setPlaying] = useState(false);

    return (
        <View style={styles.voiceRow}>
            <Image source={AVATAR_PATIENT} style={styles.avatar} />
            <Pressable
                onPress={() => setPlaying((v) => !v)}
                style={[styles.playBtn, isMe && styles.playBtnMe]}
                hitSlop={8}
            >
                {playing ? (
                    <Pause size={16} color="#FFFFFF" fill="#FFFFFF" />
                ) : (
                    <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
                )}
            </Pressable>

            <View style={styles.waveformContainer}>
                {/* Waveform bars */}
                {[...Array(25)].map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.waveBar,
                            {
                                height: Math.random() * 20 + 8,
                                backgroundColor: isMe ? '#9B7AB8' : '#7A5AF8',
                                opacity: playing && i < 20 ? 1 : 0.5,
                            }
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

function TypingDots() {
    return (
        <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={[styles.dot, { opacity: 0.7 }]} />
            <View style={[styles.dot, { opacity: 0.4 }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F7FB'
    },
    watermark: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        opacity: 0.4,
        pointerEvents: 'none',
    },

    /* Header */
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#F5F7FB',
    },
    headerCenter: {
        flex: 1,
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#7A8199',
        marginTop: 2,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
    },
    headerIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },

    /* Chat list */
    list: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start', // CHANGED: from flex-end to flex-start
        marginBottom: 16
    },
    rowStart: { justifyContent: 'flex-start' },
    rowEnd: { justifyContent: 'flex-end' },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 8
    },

    /* Bubbles */
    bubble: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    bubbleDoc: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    bubbleMe: {
        backgroundColor: '#E8DFF0',
        borderTopRightRadius: 4,
    },
    bubbleText: {
        fontSize: 14,
        lineHeight: 20,
    },
    bubbleTextDoc: { color: '#1a1a1a' },
    bubbleTextMe: { color: '#1a1a1a' },

    time: {
        fontSize: 11,
        color: '#A8A8B8',
        marginTop: 4,
        marginHorizontal: 4,
    },
    timeDoc: { textAlign: 'left' },
    timeMe: { textAlign: 'right' },

    /* Voice Message */
    voiceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        width: 300
    },
    playBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#7A5AF8',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    playBtnMe: {
        backgroundColor: '#9B7AB8',
    },
    waveformContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
        gap: 2,
    },
    waveBar: {
        width: 2,
        borderRadius: 1,
    },

    /* Typing */
    typingBubble: {
        paddingVertical: 12,
        paddingHorizontal: 16
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 6,
        alignItems: 'center'
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#7A5AF8'
    },

    /* Composer */
    composerWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: '#F5F7FB',
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
    },
    composerInput: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        minHeight: 48,
        maxHeight: 110,
        fontSize: 14,
        color: '#1a1a1a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    composerIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    sendBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#7A5AF8',
        marginLeft: 8,
        shadowColor: '#7A5AF8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
});