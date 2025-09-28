import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, typography, spacing } from '../theme';
import { Button } from '../components';

// assets (same pattern as Login.js)
const LOGO_IMAGE = require('../../assets/logo.png');
const BG_WATERMARK = require('../../assets/background.png');

export default function FirstScreen() {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate('Login');
  };
  const handleSignUp = () => {
    navigation.navigate('CreateAccount');
  };
  const handleSkip = () => {
    navigation.navigate('Home');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* background watermark */}
      <Image source={BG_WATERMARK} style={styles.watermark} resizeMode="contain" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* brand header */}
        <View style={styles.brandRow}>
          <Image source={LOGO_IMAGE} style={styles.brandLogo} resizeMode="contain" />
        </View>

        {/* content card */}
        <View style={styles.card}>
          <Text style={styles.title}>Welcome to Neurula</Text>
          <Text style={styles.subtitle}>
            Your comprehensive healthcare{'\n'}services platform
          </Text>

          {/* primary action */}
          <Button
            title="Login"
            onPress={handleLogin}
            variant="primary"
            style={styles.primaryBtn}
            accessibilityLabel="Login"
            testID="btn-login"
          />

          {/* secondary action */}
          <Button
            title="Sign Up"
            onPress={handleSignUp}
            variant="outline"
            style={styles.secondaryBtn}
            accessibilityLabel="Sign Up"
            testID="btn-signup"
          />

          {/* tertiary link */}
          <Button
            title="Skip and Complete Later"
            onPress={handleSkip}
            variant="outline"
            style={styles.skipButton}
            accessibilityLabel="Skip and Complete Later"
            testID="link-skip"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  watermark: {
    position: 'absolute',
    pointerEvents: 'none',
    // Optional: tweak for your artwork placement
    // right: -80,
    // top: spacing.xl,
    // width: 520,
    // height: 520,
    // opacity: 0.18,
  },
  scrollContent: { flexGrow: 1 },
  brandRow: {
    marginTop: '15%',
    marginBottom: '15%',
    alignItems: 'center',
  },
  brandLogo: { width: 170, height: 48 },

  card: {
    backgroundColor: colors.glassMorphism,
    borderColor: colors.borderGradient,
    borderWidth: 1,
    borderTopLeftRadius: spacing.borderRadius['2xl'],
    borderTopEndRadius: spacing.borderRadius['2xl'],
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.shadowGlass,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
    height: '80%'
  },

  title: {
    ...typography.styles.h1,
    textAlign: 'center',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.styles.body,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing['2xl'],
  },

  primaryBtn: {
    marginBottom: spacing.md,
  },

  secondaryBtn: {
    marginBottom: spacing.lg,
  },

  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
});
