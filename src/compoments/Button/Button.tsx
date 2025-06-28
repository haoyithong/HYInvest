
import React from 'react';
import { Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from '../../theme';
import styles from './styles';

type Props = {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

const Button: React.FC<Props> = ({ title, onPress, style }) => {
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

export default Button;
