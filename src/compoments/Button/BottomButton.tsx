import React from 'react';
import { Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { typography, useTheme } from '../../theme';
import styles from './styles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
    title: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
};

const BottomButton: React.FC<Props> = ({ title, onPress, style }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <TouchableOpacity
            style={[styles.bottomButton, { backgroundColor: colors.primary, paddingBottom: insets.bottom }, style]}
            onPress={onPress}
        >
            <Text style={{ color: '#fff', ...typography.title, }}>{title}</Text>
        </TouchableOpacity>
    );
};

export default BottomButton;