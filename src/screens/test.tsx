import React, { useRef, useMemo, useCallback } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import PickerField from '../compoments/TextInput/PickerField';
import BottomSheetPicker from '../compoments/BottomSheet/BottomSheetPicker';

const TestScreen = () => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        bottomSheetModalRef.current?.present();
    }, []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);
    let symbols = [
        "123",
        "456",
        "789"

    ]
    // renders
    return (
        <View style={styles.container}>
            <BottomSheetModalProvider>
                <View style={styles.container}>
                    <PickerField
                        label="Symbol"
                        value={'Select...'}
                        onPress={() => bottomSheetModalRef.current?.present()}
                    />
                    <BottomSheetPicker
                        ref={bottomSheetModalRef}
                        items={symbols}
                        onSelect={(item) => {
                            // setSelectedSymbol(item);
                            bottomSheetModalRef.current?.dismiss();
                        }}
                    />
                </View>
            </BottomSheetModalProvider>
        </View>
    );

};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    content: { padding: 20 },
});

export default TestScreen;