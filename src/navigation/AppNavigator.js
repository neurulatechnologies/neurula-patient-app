import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
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

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* <Stack.Screen name="FirstScreen" component={FirstScreen} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="CreateAccount" component={CreateAccount} />
        <Stack.Screen name="ScanEmiratesID" component={ScanEmiratesID} />
        <Stack.Screen name="ScanPassport" component={ScanPassport} />
        <Stack.Screen name="ManualEntry" component={ManualEntry} />
        <Stack.Screen name="OtpVerification" component={OtpVerification} />
        <Stack.Screen name="BookingConfirmation" component={BookingConfirmation} /> */}
        {/* <Stack.Screen name="BottomNav" component={BottomTabs} options={{ headerShown: false }} /> */}
        <Stack.Screen name="ChatConsultation" component={ChatConsultation} options={{ headerShown: false }} />
        {/* <Stack.Screen name="ConsultationFeedback" component={ConsultationFeedback} options={{ headerShown: false }} /> */}
        <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}