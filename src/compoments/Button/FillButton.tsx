import React from 'react';
import { Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { typography, useTheme } from '../../theme';
import styles from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    title: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
};

const FillButton: React.FC<Props> = ({ title, onPress, style, textStyle }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        // Make style props come last, child can only override
        <TouchableOpacity
            style={[styles.fillButton, { backgroundColor: colors.primary }, style,]}
            onPress={onPress}
        >
            <Text style={[{ color: '#fff', ...typography.title }, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
};

export default FillButton;