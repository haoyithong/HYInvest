import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs'

type Props = {
    label?: string;
    value: Date;
    onChange: (date: Date) => void;
    mode?: 'date' | 'time' | 'datetime';
    minimumDate?: Date;
    maximumDate?: Date;
};

const DatePickerField: React.FC<Props> = ({
    label,
    value,
    onChange,
    mode = 'date',
    minimumDate,
    maximumDate,
}) => {
    const [open, setOpen] = useState(false);
    const getDisplayValue = (value: Date, mode: 'date' | 'time' | 'datetime') => {
        switch (mode) {
            case 'date':
                return dayjs(value).format('DD MMM YYYY');
            case 'time':
                return dayjs(value).format('HH:mm:ss a');
            case 'datetime':
            default:
                return dayjs(value).format('YYYY-MM-DD HH:mm');
        }
    }

    const displayValue = getDisplayValue(value, mode);
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity onPress={() => setOpen(true)} style={styles.inputBox}>
                <Text style={styles.dateText}>{displayValue}</Text>
            </TouchableOpacity>

            <DatePicker
                modal
                open={open}
                date={value}
                mode={mode}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                onConfirm={(selectedDate) => {
                    setOpen(false);
                    onChange(selectedDate);
                }}
                onCancel={() => setOpen(false)}
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
    inputBox: {
        flex: 1,
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    dateText: {
        fontSize: 16,
        textAlign: 'right',
        color: '#333',
    },
});

export default DatePickerField;