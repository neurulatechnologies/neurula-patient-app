import { StatusBar } from 'expo-status-bar';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { View, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import AppNavigator from './src/navigation/AppNavigator';
import { VideoCallProvider } from './src/context/VideoCallContext';
import { toastConfig } from './src/config/toastConfig';

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9340C3" />
      </View>
    );
  }

  return (
    <VideoCallProvider>
      <StatusBar style="dark" translucent backgroundColor="transparent" />
      <AppNavigator />
      <Toast config={toastConfig} />
    </VideoCallProvider>
  );
}
