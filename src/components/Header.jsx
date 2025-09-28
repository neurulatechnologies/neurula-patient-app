import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../theme';
import Icon from './Icon';

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
    );
  }

  // Standard and simple variants
  return (
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
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: spacing.component?.headerHeight || 56,
  },

  // Home variant styles
  homeContainer: {
    alignItems: 'flex-start',
    paddingTop: spacing.sm,
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
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.borderGradient,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadowGlass,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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