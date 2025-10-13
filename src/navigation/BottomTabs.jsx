// File: src/navigation/BottomTabs.jsx
import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';

// Screens (swap placeholders with real ones)
import Home from '../screens/Home';
import ServicesList from '../screens/ServicesList';
import DoctorConsultation from '../screens/DoctorConsultation';
import BookingConfirmation from '../screens/BookingConfirmation';
import BookAppointment from '../screens/BookAppointment';
import AppointmentPatientDetails from '../screens/AppointmentPatientDetails';
import ConfirmBooking from '../screens/ConfirmBooking';
import PaymentMethod from '../screens/PaymentMethod';
const Inbox = () => <View style={{ flex: 1, backgroundColor: colors.background }} />;
const Profile = () => <View style={{ flex: 1, backgroundColor: colors.background }} />;
const QuickAction = () => <View style={{ flex: 1, backgroundColor: colors.background }} />;

// ---- Tab icons (using text icons as fallback) ----
const TAB_ICONS = {
    Home: {
        active: '🏠',
        inactive: '🏠',
        label: 'Home',
    },
    Booking: {
        active: '📅',
        inactive: '📅',
        label: 'Booking',
    },
    Inbox: {
        active: '💬',
        inactive: '💬',
        label: 'Inbox',
    },
    Profile: {
        active: '👤',
        inactive: '👤',
        label: 'Profile',
    },
};

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

function HomeStackNavigator() {
    return (
        <HomeStack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <HomeStack.Screen name="HomeMain" component={Home} />
            <HomeStack.Screen name="ServicesList" component={ServicesList} />
            <HomeStack.Screen name="DoctorConsultation" component={DoctorConsultation} />
            <HomeStack.Screen name="BookAppointment" component={BookAppointment} />
            <HomeStack.Screen name="AppointmentPatientDetails" component={AppointmentPatientDetails} />
            <HomeStack.Screen name="ConfirmBooking" component={ConfirmBooking} />
            <HomeStack.Screen name="PaymentMethod" component={PaymentMethod} />
        </HomeStack.Navigator>
    );
}

export default function BottomTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
            }}
            tabBar={(props) => <CurvedTabBar {...props} />}
        >
            <Tab.Screen name="Home" component={HomeStackNavigator} />
            <Tab.Screen name="Booking" component={BookingConfirmation} />
            {/* Hidden route for the center FAB */}
            <Tab.Screen name="QuickAction" component={QuickAction} options={{ tabBarButton: () => null }} />
            <Tab.Screen name="Inbox" component={Inbox} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}

function CurvedTabBar({ state, descriptors, navigation }) {
    const insets = useSafeAreaInsets();
    const TAB_BAR_HEIGHT = 65;

    // visible tabs (exclude hidden center one)
    const visibleRoutes = state.routes.filter((r) => r.name !== 'QuickAction');

    const handleCenterPress = () => navigation.navigate('QuickAction');

    return (
        <View style={styles.container}>
            {/* White background that extends to bottom of screen */}
            <View style={[styles.bottomFill, { height: Math.max(insets.bottom, 20) }]} />

            {/* Main tab bar with curved design */}
            <View style={[styles.tabBar, { height: TAB_BAR_HEIGHT }]}>
                {/* Left side of tabs (Home, Booking) */}
                <View style={styles.leftTabs}>
                    {visibleRoutes.slice(0, 2).map((route) => renderTabItem(route, state, navigation, descriptors))}
                </View>

                {/* Center space for the notch */}
                <View style={styles.centerSpace} />

                {/* Right side of tabs (Inbox, Profile) */}
                <View style={styles.rightTabs}>
                    {visibleRoutes.slice(2).map((route) => renderTabItem(route, state, navigation, descriptors))}
                </View>

                {/* Curved notch background */}
                {/* <View style={styles.notchBackground} /> */}
            </View>

            {/* Center floating action button */}
            <Pressable
                onPress={handleCenterPress}
                accessibilityRole="button"
                accessibilityLabel="Quick Action"
                style={styles.centerButtonContainer}
                android_ripple={{ color: 'rgba(255,255,255,0.3)', radius: 30, borderless: true }}
            >
                <View style={styles.centerButton}>
                    <Text style={styles.sparkle}>✨</Text>
                </View>
            </Pressable>
        </View>
    );
}

function renderTabItem(route, state, navigation, descriptors) {
    const indexInState = state.routes.findIndex((r) => r.key === route.key);
    const isFocused = state.index === indexInState;

    const onPress = () => {
        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
        if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
    };
    const onLongPress = () => navigation.emit({ type: 'tabLongPress', target: route.key });

    const iconSet = TAB_ICONS[route.name];

    return (
        <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            android_ripple={{ color: colors.primary + '15', radius: 25, borderless: true }}
        >
            <View style={styles.tabContent}>
                <Text style={[styles.iconText, { opacity: isFocused ? 1 : 0.5 }]}>
                    {isFocused ? iconSet.active : iconSet.inactive}
                </Text>
                <Text
                    style={[
                        styles.tabLabel,
                        { color: isFocused ? colors.primary : stylesVars.inactiveColor },
                    ]}
                >
                    {iconSet.label}
                </Text>
            </View>
        </Pressable>
    );
}

/* ---------- Constants ---------- */
const BUTTON_SIZE = 50;
const NOTCH_WIDTH = 80;
const NOTCH_HEIGHT = 30;

const stylesVars = {
    inactiveColor: '#A1A1AA', // Zinc-400 for inactive text
};

/* ---------- Styles ---------- */
const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },

    // White background that fills bottom safe area completely
    bottomFill: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: '#FFFFFF',
    },

    tabBar: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 8,
        paddingTop: 12,

        // Subtle shadow
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 5,

        position: 'relative',
        overflow: 'visible',
    },

    leftTabs: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    centerSpace: {
        width: NOTCH_WIDTH,
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    rightTabs: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },

    // Curved notch that creates the cutout effect
    notchBackground: {
        position: 'absolute',
        top: -NOTCH_HEIGHT + 5,
        left: '50%',
        marginLeft: -NOTCH_WIDTH / 2,
        width: NOTCH_WIDTH,
        height: NOTCH_HEIGHT,
        backgroundColor: 'transparent',
        borderBottomLeftRadius: NOTCH_WIDTH / 2,
        borderBottomRightRadius: NOTCH_WIDTH / 2,
        borderWidth: 0,
        borderTopWidth: NOTCH_HEIGHT,
        borderTopColor: '#FFFFFF',
    },

    tabItem: {
        flex: 1,
        minHeight: 45,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
    },

    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    iconText: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 2,
    },

    tabLabel: {
        fontSize: 10,
        fontWeight: '500',
        textAlign: 'center',
        lineHeight: 12,
    },

    // Center floating action button
    centerButtonContainer: {
        position: 'absolute',
        top: -BUTTON_SIZE / 2 + 5,
        left: '50%',
        marginLeft: -(BUTTON_SIZE + 12) / 2, // Account for larger touch area
        alignItems: 'center',
        justifyContent: 'center',
        width: BUTTON_SIZE + 12,
        height: BUTTON_SIZE + 12,
        zIndex: 10,
    },

    centerButton: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_SIZE / 2,
        backgroundColor: colors.primary || '#8B5CF6',
        alignItems: 'center',
        justifyContent: 'center',

        // Enhanced shadow for floating effect
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 8,

        // White border to separate from background
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },

    sparkle: {
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
    },
});