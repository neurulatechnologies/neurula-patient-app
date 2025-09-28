import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../theme';

export default function Screen({ 
  children, 
  style, 
  contentContainerStyle,
  scrollable = true,
  keyboardAware = true,
  safeAreaEdges = ['top', 'bottom'],
  backgroundColor = colors.background,
  ...props 
}) {
  const screenStyle = [
    styles.screen,
    { backgroundColor },
    style
  ];

  const contentStyle = [
    styles.content,
    contentContainerStyle
  ];

  const renderContent = () => {
    if (scrollable) {
      return (
        <ScrollView
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          {...props}
        >
          {children}
        </ScrollView>
      );
    }

    return (
      <View style={contentStyle}>
        {children}
      </View>
    );
  };

  const content = keyboardAware ? (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardView}
    >
      {renderContent()}
    </KeyboardAvoidingView>
  ) : (
    renderContent()
  );

  return (
    <SafeAreaView 
      style={screenStyle} 
      edges={safeAreaEdges}
    >
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.screen.horizontal,
    paddingVertical: spacing.screen.vertical,
  },
  keyboardView: {
    flex: 1,
  },
});