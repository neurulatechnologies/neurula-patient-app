import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme';

export default function Card({ 
  children, 
  style, 
  variant = 'default',
  ...props 
}) {
  const getCardStyle = () => {
    const baseStyle = [styles.card];
    
    switch (variant) {
      case 'glassmorphism':
        baseStyle.push(styles.cardGlassmorphism);
        break;
      case 'elevated':
        baseStyle.push(styles.cardElevated);
        break;
      default:
        baseStyle.push(styles.cardDefault);
    }
    
    return baseStyle;
  };

  return (
    <View style={[getCardStyle(), style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.lg,
  },
  cardDefault: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardGlassmorphism: {
    backgroundColor: colors.glassMorphism,
    borderColor: colors.borderGradient,
    borderWidth: 1,
    shadowColor: colors.shadowGlass,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 6,
  },
  cardElevated: {
    backgroundColor: colors.background,
    shadowColor: colors.shadowMedium,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
});