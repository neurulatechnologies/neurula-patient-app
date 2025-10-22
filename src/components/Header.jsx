import React from 'react';
import { View, Text, Pressable, StyleSheet, StatusBar, Platform } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { colors, typography, spacing } from '../theme';
import Icon from './Icon';

// Get status bar height
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

export default function Header({
  variant = 'standard', // 'home', 'standard', 'simple'
  title,
  subtitle,
  greeting,
  userName,
  leftIcon,
  rightIcon,
  rightActions = [], // Array of action objects: [{icon, onPress, testID}]
  onLeftPress,
  onRightPress,
  onNotificationPress,
  onMenuPress,
  style,
  titleStyle,
  subtitleStyle,
  ...props
}) {

  // Home variant specific rendering
  if (variant === 'home') {
    return (
      <>
        <ExpoStatusBar style="dark" translucent backgroundColor="transparent" />
        <View style={[styles.container, styles.homeContainer, style]} {...props}>
          <View style={styles.homeLeft}>
            {greeting && (
              <Text style={styles.greeting}>{greeting}</Text>
            )}
            {userName && (
              <Text style={styles.userName}>{userName}</Text>
            )}
          </View>

          <View style={styles.homeActions}>
            {onNotificationPress && (
              <Pressable
                style={styles.actionButton}
                onPress={onNotificationPress}
                hitSlop={8}
              >
                <Text style={styles.actionIcon}>🔔</Text>
              </Pressable>
            )}
            {onMenuPress && (
              <Pressable
                style={styles.actionButton}
                onPress={onMenuPress}
                hitSlop={8}
              >
                <Text style={styles.actionIcon}>☰</Text>
              </Pressable>
            )}
          </View>
        </View>
      </>
    );
  }

  // Standard and simple variants
  return (
    <>
      <ExpoStatusBar style="dark" translucent backgroundColor="transparent" />
      <View style={[styles.container, style]} {...props}>
        {leftIcon && (
          <Pressable
            style={styles.iconButton}
            onPress={onLeftPress}
            hitSlop={8}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>
        )}

        <View style={[styles.textContainer, variant === 'simple' && styles.simpleTextContainer]}>
          {title && (
            <Text style={[styles.title, titleStyle]}>{title}</Text>
          )}
          {subtitle && (
            <Text style={[styles.subtitle, subtitleStyle]}>{subtitle}</Text>
          )}
        </View>

        {/* Right actions */}
        <View style={styles.rightActions}>
          {rightActions.map((action, index) => (
            <Pressable
              key={index}
              style={[styles.actionButton, index > 0 && styles.actionSpacing]}
              onPress={action.onPress}
              hitSlop={8}
              testID={action.testID}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
            </Pressable>
          ))}

          {/* Default notification and menu for standard variant */}
          {variant === 'standard' && rightActions.length === 0 && (
            <>
              {onNotificationPress && (
                <Pressable
                  style={styles.actionButton}
                  onPress={onNotificationPress}
                  hitSlop={8}
                >
                  <Text style={styles.actionIcon}>🔔</Text>
                </Pressable>
              )}
              {onMenuPress && (
                <Pressable
                  style={[styles.actionButton, styles.actionSpacing]}
                  onPress={onMenuPress}
                  hitSlop={8}
                >
                  <Text style={styles.actionIcon}>≡</Text>
                </Pressable>
              )}
            </>
          )}

          {rightIcon && (
            <Pressable
              style={styles.iconButton}
              onPress={onRightPress}
              hitSlop={8}
            >
              <Icon name={rightIcon} size="medium" color={colors.text} />
            </Pressable>
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: STATUSBAR_HEIGHT + spacing.md,
    paddingBottom: spacing.md,
    minHeight: STATUSBAR_HEIGHT + (spacing.component?.headerHeight || 56),
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.40)',
    // Note: backdrop-filter is not directly supported in React Native
    // Using shadow and blur simulation for glassmorphism effect
    shadowColor: 'rgba(255, 255, 255, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 8,
  },

  // Home variant styles
  homeContainer: {
    alignItems: 'flex-start',
    // Inherit glassmorphism from container
    // marginBottom: spacing.xl,
  },
  homeLeft: {
    flex: 1,
  },
  greeting: {
    fontFamily: 'Poppins_400Regular',
    color: colors.textLight,
    marginBottom: 4,
    fontSize: 16,
    lineHeight: 24,
  },
  userName: {
    fontFamily: 'Poppins_700Bold',
    color: colors.text,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    // Enhanced contrast for glassmorphism background
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  homeActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: 4,
    alignItems: 'center',
  },

  // Standard variant styles
  textContainer: {
    flex: 1,
    alignItems: 'center',
  },
  simpleTextContainer: {
    alignItems: 'flex-start',
  },
  title: {
    fontFamily: 'Poppins_700Bold',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    // Enhanced contrast for glassmorphism background
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    color: colors.textLight,
    textAlign: 'center',
    marginTop: spacing.xs / 2,
    fontSize: 14,
    lineHeight: 20,
  },

  // Button styles
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: colors.text,
    fontWeight: '300',
    lineHeight: 28,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 20,
    lineHeight: 20,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionSpacing: {
    marginLeft: spacing.sm,
  },
});