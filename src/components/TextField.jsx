import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Platform, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Icon from './Icon';

export default function TextField({
  label,
  required = false,
  value,
  onChangeText,
  placeholder,
  secure = false,
  error,
  helperText,
  leftIcon, // string icon name for our Icon component
  rightIcon, // string icon name for custom right icon (when not using secure)
  onRightIconPress, // handler for right icon press
  keyboardType,
  autoCapitalize = 'none',
  autoCorrect = false,
  multiline = false,
  style,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const [reveal, setReveal] = useState(false);

  const showError = Boolean(error);
  const showSecureToggle = secure;
  const showCustomRightIcon = rightIcon && !secure;

  return (
    <View style={[styles.wrapper, style]}>
      {label ? (
        <Text style={styles.label}>
          {label} {required ? <Text style={styles.required}>*</Text> : null}
        </Text>
      ) : null}

      <View
        style={[
          styles.fieldContainer,
          focused && styles.fieldFocused,
          showError && styles.fieldError,
        ]}
      >
        {leftIcon ? (
          <View style={styles.leftIcon}>
            <Icon name={leftIcon} size="small" color="#6B7280" />
          </View>
        ) : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          secureTextEntry={secure && !reveal}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          // onFocus={() => setFocused(true)}
          // onBlur={() => setFocused(false)}
          style={[
            styles.input,
            leftIcon && { paddingLeft: 40 },
            (showSecureToggle || showCustomRightIcon) && { paddingRight: 40 },
            multiline && { minHeight: 100, paddingTop: 12 },
            Platform.OS === 'web' ? { outlineStyle: 'none', appearance: 'none' } : null,
          ]}
          {...rest}
        />

        {showSecureToggle && (
          <Pressable
            onPress={() => setReveal((v) => !v)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={reveal ? 'Hide password' : 'Show password'}
            style={styles.rightIcon}
          >
            <Feather name={reveal ? 'eye-off' : 'eye'} size={20} color="#6B7280" />
          </Pressable>
        )}

        {showCustomRightIcon && (
          <Pressable
            onPress={onRightIconPress}
            hitSlop={10}
            accessibilityRole="button"
            style={styles.rightIcon}
          >
            <Icon name={rightIcon} size="small" color="#6B7280" />
          </Pressable>
        )}
      </View>

      {showError ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 12,
    color: '#374151',
  },
  required: {
    color: '#A855F7'
  },
  fieldContainer: {
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#C084FC',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  fieldFocused: {
    borderColor: '#A855F7',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  fieldError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  input: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    // lineHeight: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
    color: '#111827',
  },
  leftIcon: {
    position: 'absolute',
    left: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    zIndex: 1,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  helperText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  errorText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  },
});