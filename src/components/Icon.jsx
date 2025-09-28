import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme';

// Import existing SVG icons
import BackArrowIcon from '../../assets/svg/icons/back-arrow.svg';
import EmailIcon from '../../assets/svg/icons/email-icon.svg';
import LockIcon from '../../assets/svg/icons/lock-icon.svg';
import EyeIcon from '../../assets/svg/icons/eye.svg';
import EyeOffIcon from '../../assets/svg/icons/eye-off.svg';
import CheckIcon from '../../assets/svg/icons/check.svg';
import IdCardIcon from '../../assets/svg/icons/id-card.svg';
import PassportIcon from '../../assets/svg/icons/passport.svg';
import EditIcon from '../../assets/svg/icons/edit.svg';
import ChevronRightIcon from '../../assets/svg/icons/chevron-right.svg';
import CalendarIcon from '../../assets/svg/icons/calendar.svg';
import XIcon from '../../assets/svg/icons/x.svg';
import SearchIcon from '../../assets/svg/icons/search.svg';
import MapPinIcon from '../../assets/svg/icons/map-pin.svg';

// Icon mapping object
const iconMap = {
  'back-arrow': BackArrowIcon,
  'email': EmailIcon,
  'lock': LockIcon,
  'eye': EyeIcon,
  'eye-off': EyeOffIcon,
  'check': CheckIcon,
  'id-card': IdCardIcon,
  'passport': PassportIcon,
  'edit': EditIcon,
  'chevron-right': ChevronRightIcon,
  'calendar': CalendarIcon,
  'x': XIcon,
  'search': SearchIcon,
  'map-pin': MapPinIcon,
};

export default function Icon({ 
  name, 
  size = 'medium', 
  color = colors.text,
  style,
  ...props 
}) {
  // Size mappings
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 32,
    xl: 40,
  };

  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found. Available icons: ${Object.keys(iconMap).join(', ')}`);
    return null;
  }

  const iconSize = typeof size === 'number' ? size : sizeMap[size] || sizeMap.medium;

  return (
    <View style={[styles.container, style]} {...props}>
      <IconComponent 
        width={iconSize} 
        height={iconSize} 
        color={color}
        fill={color}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});