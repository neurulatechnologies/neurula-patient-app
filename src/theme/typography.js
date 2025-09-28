export const fontFamily = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  bold: 'Poppins_700Bold',
};

export const typography = {
  // Font families using Poppins
  fontFamily,

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Font weights
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  // Text styles (commonly used combinations) with Poppins
  styles: {
    h1: {
      fontFamily: fontFamily.bold,
      fontSize: 28,
      lineHeight: 34,
    },
    h2: {
      fontFamily: fontFamily.bold,
      fontSize: 22,
      lineHeight: 28,
    },
    h3: {
      fontFamily: fontFamily.medium,
      fontSize: 20,
      lineHeight: 26,
    },
    subtitle: {
      fontFamily: fontFamily.medium,
      fontSize: 16,
      lineHeight: 22,
    },
    body: {
      fontFamily: fontFamily.regular,
      fontSize: 14,
      lineHeight: 20,
    },
    bodySmall: {
      fontFamily: fontFamily.regular,
      fontSize: 12,
      lineHeight: 16,
    },
    button: {
      fontFamily: fontFamily.medium,
      fontSize: 16,
      lineHeight: 20,
    },
    caption: {
      fontFamily: fontFamily.regular,
      fontSize: 12,
      lineHeight: 16,
    },
  },
};