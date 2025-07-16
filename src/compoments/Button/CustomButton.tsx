
import React from 'react';
import { Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { typography, useTheme } from '../../theme';
import styles from './styles';

type Props = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const CustomButton: React.FC<Props> = ({ title, onPress, style }) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: colors.primary }, style]}
      onPress={onPress}
    >
      <Text style={{ color: '#fff' }}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
