import React, { useEffect, useRef, useState } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";
import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { StockTrade } from "../../types/StockTrade";
import FillButton from "../../compoments/Button/FillButton";
import { radius } from "../../theme";
import HorizontalTitleTextInput from "../../compoments/TextInput/HorizontalTitleTextInput";
import DatePickerField from "../../compoments/DatePicker/DatePickerField";
import PickerField from "../../compoments/TextInput/PickerField";
import BottomSheetPicker from "../../compoments/BottomSheet/BottomSheetPicker";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const AddTradeScreen = ({ navigation }: any) => {
    const getDefaultTime = () => {
        const now = new Date()
        now.setHours(10, 0, 0, 0) // Set to 08:00:00.000
        return now
    }
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const [symbolQuery, setSymbolQuery] = useState("");
    const [symbolDetailsResults, setSymbolDetailsResults] = useState<FirebaseFirestoreTypes.DocumentSnapshot[]>([]);
    const [symbolResults, setSymbolResults] = useState<string[]>([]);
    const [selectedSymbol, setSelectedSymbol] = useState("");
    const [tradeType, setTradeType] = useState<"buy" | "sell" | null>("buy");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [commission, setCommission] = useState("");
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState<Date>(getDefaultTime())

    useEffect(() => {
        const fetchSymbols = async () => {
            const snapshot = await firestore().collection("stocks").get();
            const symbols = snapshot.docs.map(doc => doc.data().symbol);  // string[]

            setSymbolDetailsResults(snapshot.docs);
            setSymbolResults(symbols);
        };
        fetchSymbols();
    }, [symbolQuery]);

    const handleAddTrade = async () => {
        if (!userInfo?.uid) return Alert.alert("Error", "User not logged in.");
        if (!selectedSymbol || !tradeType || !quantity || !price) {
            return Alert.alert("Missing Fields", "Please fill in all required fields.");
        }

        function combineDateAndTime(date: Date, time: Date): Date {
            return new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
                time.getHours(),
                time.getMinutes(),
                time.getSeconds()
            )
        }

        const tradeDate = combineDateAndTime(date, time)

        const trade: StockTrade = {
            userId: userInfo.uid,
            symbol: selectedSymbol,
            tradeType,
            quantity: parseFloat(quantity),
            price: parseFloat(price),
            commission: commission ? parseFloat(commission) : 0,
            tradeDate: firestore.Timestamp.fromDate(tradeDate),
            createdBy: userInfo.uid,
            createdAt: firestore.Timestamp.now()
        };

        try {
            await firestore().collection("trades").add(trade);
            Alert.alert("Success", "Trade added successfully");
            navigation.goBack();
        } catch (e) {
            console.error("Error adding trade:", e);
            Alert.alert("Error", "Failed to add trade");
        }
    };

    return (
        <View style={styles.container}>
            <BottomSheetModalProvider>
                <View style={[styles.row]}>
                    <FillButton
                        title="Buy"
                        onPress={() => setTradeType("buy")}
                        style={{ backgroundColor: tradeType === "buy" ? "green" : "clear" }}
                        textStyle={{ color: tradeType === "buy" ? "white" : "#bbb" }}
                    />
                    <FillButton
                        title="Sell"
                        onPress={() => setTradeType("sell")}
                        style={{ backgroundColor: tradeType === "sell" ? "red" : "clear" }}
                        textStyle={{ color: tradeType === "sell" ? "white" : "#bbb" }}
                    />
                </View>
                <PickerField
                    label="Symbol"
                    value={selectedSymbol}
                    placeholder="Search Symbol (e.g., AAPL)"
                    onPress={() => bottomSheetRef.current?.present()}
                />
                <BottomSheetPicker
                    ref={bottomSheetRef}
                    items={symbolResults}
                    onSelect={(item) => {
                        setSelectedSymbol(item);
                        bottomSheetRef.current?.dismiss();
                    }}
                />
                <HorizontalTitleTextInput
                    label="Quantity"
                    placeholder="0"
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                />
                <HorizontalTitleTextInput
                    label="Price"
                    placeholder="0.0"
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="decimal-pad"
                />
                <HorizontalTitleTextInput
                    label="Commission (optional)"
                    placeholder="0.0"
                    value={commission}
                    onChangeText={setCommission}
                    keyboardType="decimal-pad"
                />

                <DatePickerField
                    label="Select Trade Date"
                    value={date}
                    onChange={setDate}
                    mode="date"
                />

                <DatePickerField
                    label="Select Trade Time"
                    value={time}
                    onChange={setTime}
                    mode="time"
                />

                <Button title="Add Trade" onPress={handleAddTrade} />
            </BottomSheetModalProvider>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginVertical: 5 },
    suggestion: { padding: 10, backgroundColor: "#f0f0f0", marginBottom: 2 },
    row: {
        flexDirection: 'row',
        gap: 8,
        height: 50,
        marginBottom: 16,
        borderWidth: 2,
        borderRadius: radius.xxl,
        overflow: 'hidden', // ✅ 關鍵：讓內容裁切在圓角內
    },
    dateButton: {
        padding: 10,
        backgroundColor: "#eee",
        marginVertical: 10,
        borderRadius: 5,
        alignItems: "center",
    },
});

export default AddTradeScreen;