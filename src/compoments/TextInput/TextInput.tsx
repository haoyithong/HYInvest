
import { View, StyleProp, ViewStyle, TextInputProps, TextInput, Text } from 'react-native';
import { spacing, useTheme } from '../../theme';
import styles from './styles';


type CustomTextInputProps = TextInputProps & {
    label?: string;
    containerStyle?: StyleProp<ViewStyle>;
    error?: string;
};

const CustomTextInput: React.FC<CustomTextInputProps> = ({
    label,
    error,
    containerStyle,
    ...textInputProps
}) => {
    return (
        <View style={[styles.container, containerStyle]}>
            {label && <View style={styles.innerBox}><Text style={styles.title}>{label}</Text></View>}
            <TextInput
                style={[styles.textInput, error && styles.inputError]}
                {...textInputProps}
                placeholderTextColor="#999"
            />
            {error && <Text style={styles.error}>{error}</Text>}
        </View>
    );
};


export default CustomTextInput;