// File: src/screens/ServicesList.jsx
import React from 'react';
import {
    View,
    StyleSheet,
    Pressable,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme';
import Header from '../components/Header';

// placeholders — replace with your real assets
const BG_WATERMARK = require('../../assets/background.png');
const ICON_PLACEHOLDER = require('../../assets/icons/service-icon.png');
const CHEVRON = require('../../assets/icons/chevron-right.png');

const SERVICES = [
    { key: 'consult', title: 'Dr Consultation', subtitle: 'Book an appointment with specialist', icon: ICON_PLACEHOLDER, route: 'DoctorConsultation' },
    { key: 'lab', title: 'Lab Test', subtitle: 'Schedule medical tests and screenings', icon: ICON_PLACEHOLDER, route: 'LabTest' },
    { key: 'med-delivery', title: 'Medication Delivery', subtitle: 'Get prescriptions delivered to you', icon: ICON_PLACEHOLDER, route: 'MedicationDelivery' },
    { key: 'otc', title: 'Buy OTC Medications', subtitle: 'Purchase over-the-counter medicines', icon: ICON_PLACEHOLDER, route: 'BuyOTC' },
    { key: 'emergency', title: 'Emergency Service', subtitle: 'Ambulance & urgent care, anytime', icon: ICON_PLACEHOLDER, route: 'EmergencyService' },
    { key: 'wellness', title: 'Wellness & Nutrition', subtitle: 'Get personalized diet and lifestyle plans', icon: ICON_PLACEHOLDER, route: 'Wellness' },
    { key: 'maternity', title: 'Maternity & Childcare', subtitle: 'Support for moms and newborns', icon: ICON_PLACEHOLDER, route: 'Maternity' },
];

export default function ServicesList() {
    const navigation = useNavigation();

    const handleBack = () => navigation.goBack();
    const handleOpen = (route) => navigation.navigate(route);

    return (
        <View style={styles.container}>
            <Image source={BG_WATERMARK} style={styles.watermark} resizeMode="cover" />

            <Header
                variant="standard"
                title="Book a Service"
                leftIcon="back"
                onLeftPress={handleBack}
                onNotificationPress={() => navigation.navigate('Notifications')}
                onMenuPress={() => navigation.toggleDrawer?.()}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.listWrap}>
                    {SERVICES.map((s) => (
                        <Pressable
                            key={s.key}
                            style={styles.serviceCard}
                            onPress={() => handleOpen(s.route)}
                            android_ripple={{ color: colors.shadowGlass }}
                        >
                            <View style={styles.left}>
                                <View style={styles.iconBubble}>
                                    <Image source={s.icon} style={styles.iconImg} resizeMode="contain" />
                                </View>
                            </View>

                            <View style={styles.center}>
                                <Text style={styles.serviceTitle}>{s.title}</Text>
                                <Text style={styles.serviceSubtitle}>{s.subtitle}</Text>
                            </View>

                            <View style={styles.right}>
                                <Image source={CHEVRON} style={styles.chev} resizeMode="contain" />
                            </View>
                        </Pressable>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

/* ---------- styles ---------- */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F6FF', // Light purple background
    },
    watermark: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 0.3, // Reduced opacity to match the subtle background
        pointerEvents: 'none',
    },


    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },

    listWrap: {
        marginTop: 8,
        gap: 12, // Reduced gap between cards
        marginBottom: 40
    },

    serviceCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.85)', // Semi-transparent white
        borderWidth: 0,
        borderRadius: 16, // Slightly more rounded
        paddingVertical: 18,
        paddingHorizontal: 20,
        shadowColor: '#8B5CF6', // Purple shadow
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        // Add subtle border
        borderWidth: 0.5,
        borderColor: 'rgba(139, 92, 246, 0.1)',
    },

    left: {
        width: 52,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },

    iconBubble: {
        // width: 44,
        // height: 44,
        borderRadius: 12,
        // backgroundColor: 'rgba(139, 92, 246, 0.1)', // Light purple background
        borderWidth: 0.5,
        borderColor: 'rgba(139, 92, 246, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconImg: {
        width: 50,
        height: 50,
        // tintColor: '#8B5CF6', // Purple tint for icons
    },

    center: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D2D2D',
        lineHeight: 20,
    },
    serviceSubtitle: {
        fontSize: 13,
        fontWeight: '400',
        color: '#8E8E93',
        marginTop: 4,
        lineHeight: 18,
    },

    right: {
        marginLeft: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: 24,
        height: 24,
    },
    chev: {
        width: 16,
        height: 16,
        tintColor: '#C7C7CC',
        opacity: 0.8,
    },
});