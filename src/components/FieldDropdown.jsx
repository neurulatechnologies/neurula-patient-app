import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Animated, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function FieldDropdown({
  label,
  required = false,
  value,
  onValueChange,
  placeholder = "-- Select --",
  options = [],
  error,
  helperText,
  style,
  ...rest
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState('below'); // 'below' or 'above'
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const containerRef = useRef(null);
  const screenHeight = Dimensions.get('window').height;

  const showError = Boolean(error);

  // Calculate optimal dropdown height based on options
  const calculateDropdownHeight = () => {
    const itemHeight = 44; // paddingVertical (12*2) + fontSize line height (20)
    const maxHeight = 200; // Maximum scroll height
    const calculatedHeight = Math.min(options.length * itemHeight, maxHeight);
    return calculatedHeight + 8; // Add padding for borders
  };

  // Detect optimal dropdown position (above or below)
  const detectDropdownPosition = (callback) => {
    if (containerRef.current) {
      containerRef.current.measureInWindow((x, y, width, height) => {
        const dropdownHeight = calculateDropdownHeight();
        const spaceBelow = screenHeight - (y + height);
        const spaceAbove = y;
        
        // Use 'above' position if there's not enough space below but enough above
        const shouldShowAbove = spaceBelow < dropdownHeight + 50 && spaceAbove > dropdownHeight + 50;
        
        setDropdownPosition(shouldShowAbove ? 'above' : 'below');
        callback && callback();
      });
    } else {
      setDropdownPosition('below');
      callback && callback();
    }
  };

  // Animated open/close logic
  const toggleDropdown = () => {
    const newIsOpen = !isOpen;
    
    if (newIsOpen) {
      // Detect position first, then open
      detectDropdownPosition(() => {
        setIsOpen(true);
        const targetHeight = calculateDropdownHeight();
        setDropdownHeight(targetHeight);
        Animated.timing(animatedHeight, {
          toValue: targetHeight,
          duration: 200,
          useNativeDriver: false,
        }).start();
      });
    } else {
      // Close dropdown
      Animated.timing(animatedHeight, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start(() => {
        setIsOpen(false);
        setDropdownHeight(0);
      });
    }
  };

  const handleSelect = (selectedValue) => {
    onValueChange && onValueChange(selectedValue);
    // Close with animation
    closeDropdown();
  };

  // Close dropdown helper function
  const closeDropdown = () => {
    Animated.timing(animatedHeight, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start(() => {
      setIsOpen(false);
      setDropdownHeight(0);
    });
  };

  // Handle outside tap to close dropdown
  const handleOutsidePress = () => {
    if (isOpen) {
      closeDropdown();
    }
  };

  // Auto-close dropdown when component unmounts or loses focus
  useEffect(() => {
    return () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };
  }, [isOpen]);

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress} disabled={!isOpen}>
      <View style={[styles.wrapper, style]} ref={containerRef} {...rest}>
        {label ? (
          <Text style={styles.label}>
            {label} {required ? <Text style={styles.required}>*</Text> : null}
          </Text>
        ) : null}

      {/* Show dropdown above when position is 'above' */}
      {dropdownPosition === 'above' && (
        <Animated.View 
          style={[
            styles.dropdownContainer,
            {
              height: animatedHeight,
              opacity: animatedHeight.interpolate({
                inputRange: [0, dropdownHeight * 0.5, dropdownHeight],
                outputRange: [0, 0.5, 1],
                extrapolate: 'clamp',
              })
            }
          ]}
        >
          <View style={[styles.dropdown, styles.dropdownAbove]}>
            <ScrollView 
              style={{ maxHeight: 200 }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {options.map((option, index) => (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.optionItem,
                    index === options.length - 1 && styles.lastOptionItem,
                    value === option && styles.selectedOption,
                    pressed && styles.optionPressed,
                  ]}
                  onPress={() => handleSelect(option)}
                >
                  <Text style={[
                    styles.optionText,
                    value === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Animated.View>
      )}

      <Pressable
        style={[
          styles.fieldContainer,
          showError && styles.fieldError,
          isOpen && (dropdownPosition === 'above' ? styles.fieldOpenAbove : styles.fieldOpenBelow),
        ]}
        onPress={toggleDropdown}
      >
        <Text style={[
          styles.selectedText,
          !value && styles.placeholderText
        ]}>
          {value || placeholder}
        </Text>
        <Feather 
          name={isOpen ? 'chevron-up' : 'chevron-down'} 
          size={20} 
          color="#6B7280" 
        />
      </Pressable>

      {/* Show dropdown below when position is 'below' */}
      {dropdownPosition === 'below' && (
        <Animated.View 
          style={[
            styles.dropdownContainer,
            {
              height: animatedHeight,
              opacity: animatedHeight.interpolate({
                inputRange: [0, dropdownHeight * 0.5, dropdownHeight],
                outputRange: [0, 0.5, 1],
                extrapolate: 'clamp',
              })
            }
          ]}
        >
          <View style={[styles.dropdown, styles.dropdownBelow]}>
            <ScrollView 
              style={{ maxHeight: 200 }}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              {options.map((option, index) => (
                <Pressable
                  key={option}
                  style={({ pressed }) => [
                    styles.optionItem,
                    index === options.length - 1 && styles.lastOptionItem,
                    value === option && styles.selectedOption,
                    pressed && styles.optionPressed,
                  ]}
                  onPress={() => handleSelect(option)}
                >
                  <Text style={[
                    styles.optionText,
                    value === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </Animated.View>
      )}

        {showError ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : helperText ? (
          <Text style={styles.helperText}>{helperText}</Text>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: '#C084FC',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  fieldError: { 
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  fieldOpenBelow: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderColor: '#A855F7',
    borderWidth: 2,
  },
  fieldOpenAbove: {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderColor: '#A855F7',
    borderWidth: 2,
  },
  selectedText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: '#111827',
    flex: 1,
  },
  placeholderText: {
    color: '#6B7280',
  },
  dropdownContainer: {
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  dropdown: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#A855F7',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  dropdownBelow: {
    borderTopWidth: 0,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  dropdownAbove: {
    borderBottomWidth: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: 'transparent',
  },
  lastOptionItem: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#111827',
  },
  selectedOption: {
    backgroundColor: '#F3F0FF',
  },
  selectedOptionText: {
    color: '#A855F7',
    fontFamily: 'Poppins_500Medium',
  },
  optionPressed: {
    backgroundColor: '#F8FAFC',
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