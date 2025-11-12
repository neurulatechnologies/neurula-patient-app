import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components';
import Login from '../screens/Login';
import ForgotPassword from '../screens/ForgotPassword';
import ForgotPasswordOTP from '../screens/ForgotPasswordOTP';
import ResetPassword from '../screens/ResetPassword';
import FirstScreen from '../screens/FirstScreen';
import CreateAccount from '../screens/createAccount';
import ScanEmiratesID from '../screens/ScanEmiratesID';
import ManualEntry from '../screens/ManualEntry';
import OtpVerification from '../screens/OtpVerification';
import ScanPassport from '../screens/ScanPassport';
import BottomTabs from './BottomTabs';
import BookingConfirmation from '../screens/BookingConfirmation';
import ChatConsultation from '../screens/ChatConsultation';
import ConsultationFeedback from '../screens/ConsultationFeedback';
import VideoCallScreen from '../screens/VideoCallScreen';

const Stack = createNativeStackNavigator();

// Wrapper for protected screens
const ProtectedBottomTabs = () => (
  <ProtectedRoute>
    <BottomTabs />
  </ProtectedRoute>
);

const ProtectedBookingConfirmation = () => (
  <ProtectedRoute>
    <BookingConfirmation />
  </ProtectedRoute>
);

const ProtectedChatConsultation = () => (
  <ProtectedRoute>
    <ChatConsultation />
  </ProtectedRoute>
);

const ProtectedConsultationFeedback = () => (
  <ProtectedRoute>
    <ConsultationFeedback />
  </ProtectedRoute>
);

const ProtectedVideoCallScreen = () => (
  <ProtectedRoute>
    <VideoCallScreen />
  </ProtectedRoute>
);

export default function AppNavigator() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="FirstScreen" component={FirstScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="ForgotPasswordOTP" component={ForgotPasswordOTP} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
          <Stack.Screen name="CreateAccount" component={CreateAccount} />
          <Stack.Screen name="ScanEmiratesID" component={ScanEmiratesID} />
          <Stack.Screen name="ScanPassport" component={ScanPassport} />
          <Stack.Screen name="ManualEntry" component={ManualEntry} />
          <Stack.Screen name="OtpVerification" component={OtpVerification} />

          {/* Protected Screens - Require Authentication */}
          <Stack.Screen name="BottomNav" component={ProtectedBottomTabs} options={{ headerShown: false }} />
          <Stack.Screen name="BookingConfirmation" component={ProtectedBookingConfirmation} />
          <Stack.Screen name="ChatConsultation" component={ProtectedChatConsultation} options={{ headerShown: false }} />
          <Stack.Screen name="ConsultationFeedback" component={ProtectedConsultationFeedback} options={{ headerShown: false }} />
          <Stack.Screen name="VideoCallScreen" component={ProtectedVideoCallScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}