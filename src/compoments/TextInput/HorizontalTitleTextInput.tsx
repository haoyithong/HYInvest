import React from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, KeyboardType } from 'react-native';

type Props = {
    label: string;
    value: string;
    placeholder?: string;
    keyboardType?: KeyboardType
    onChangeText: (text: string) => void;
    inputProps?: TextInputProps;
};

const HorizontalTitleTextInput: React.FC<Props> = ({
    label,
    value,
    placeholder,
    keyboardType = "default", // 設定預設 keyboardType
    onChangeText,
    inputProps
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.inputBox]}
                placeholder={placeholder}
                value={value}
                keyboardType={keyboardType}
                onChangeText={onChangeText}
                {...inputProps}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    label: {
        width: 120,
        fontSize: 16,
        color: '#333',
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        textAlign: 'right'
    },
    inputBox: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fff',
        textAlign: 'right'
    },
});

export default HorizontalTitleTextInput;