// components/BottomSheetPicker.tsx
import React, { useMemo, useRef, useState, useEffect, forwardRef } from 'react';
import {
    View,
    TextInput,
    FlatList,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface BottomSheetPickerProps {
    items: string[];
    onSelect: (item: string) => void;
}

const BottomSheetPicker = forwardRef<BottomSheetModal, BottomSheetPickerProps>(
    ({ items, onSelect }, ref) => {
        const [query, setQuery] = useState('');
        const snapPoints = useMemo(() => ['60%'], []);
        const [filtered, setFiltered] = useState(items);
        const insets = useSafeAreaInsets();

        useEffect(() => {
            const q = query.toLowerCase();
            setFiltered(items.filter(item => item.toLowerCase().includes(q)));
        }, [query, items]);

        return (
            <BottomSheetModal
                ref={ref}
                index={0}
                snapPoints={snapPoints}
                onDismiss={() => {
                    console.log('BottomSheet was dismissed');
                    setQuery("")
                }}
                backdropComponent={(props) => (
                    <BottomSheetBackdrop
                        {...props}
                        appearsOnIndex={0}
                        disappearsOnIndex={-1}
                        opacity={0.5} // adjust for grey transparency
                    />
                )}
            >
                <BottomSheetView style={[styles.container]}>

                    <TextInput
                        placeholder="Search..."
                        style={styles.input}
                        value={query}
                        onChangeText={setQuery}
                    />
                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => onSelect(item)} style={styles.item}>
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                    <View style={{ height: 300 }} />
                </BottomSheetView>
            </BottomSheetModal>
        );
    }
);

const styles = StyleSheet.create({
    container: { padding: 36 },
    input: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginBottom: 12,
    },
    item: { paddingVertical: 12 },
});

export default BottomSheetPicker;