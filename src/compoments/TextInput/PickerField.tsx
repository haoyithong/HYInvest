// components/PickerField.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PickerFieldProps {
    label: string;
    value: string;
    placeholder?: string;
    onPress: () => void;
}

const PickerField = ({ label, value, placeholder, onPress }: PickerFieldProps) => (
    <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity onPress={onPress} style={styles.inputBox}>
            <Text style={[styles.value, !value && styles.placeholder]}>
                {value || placeholder}
            </Text>
        </TouchableOpacity>
    </View>

);

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
    value: {
        fontSize: 16,
        color: '#000',
        textAlign: 'right'
    },
    placeholder: {
        color: '#aaa',
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

export default PickerField;