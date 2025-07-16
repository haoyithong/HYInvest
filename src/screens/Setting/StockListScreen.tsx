import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { SectionList, Text, View, Button } from "react-native";
import firestore from "@react-native-firebase/firestore";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StockItem } from "../../types/StockItem";

type Section = {
    title: string;
    data: StockItem[];
};

const StockList = ({ navigation }: any) => {
    const [sections, setSections] = useState<Section[]>([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <Button title="Back" onPress={() => navigation.goBack()} />
            ),
            headerRight: () => (
                <Button title="Add" onPress={() => navigation.navigate("AddStockListScreen")} />
            ),
        });
    }, [navigation]);

    const fetchStocks = async () => {
        const snapshot = await firestore().collection("stocks").get();
        const rawData: StockItem[] = snapshot.docs.map((doc) => doc.data() as StockItem);
        const grouped: Record<string, StockItem[]> = {};
        rawData.forEach((item) => {
            if (!grouped[item.countryCode]) grouped[item.countryCode] = [];
            grouped[item.countryCode].push(item);
        });

        const sectionData: Section[] = Object.entries(grouped).map(([key, value]) => ({
            title: key,
            data: value,
        }));

        setSections(sectionData);
    };

    useEffect(() => {
        fetchStocks();
    }, []);

    useFocusEffect(
        useCallback(() => {
            // 页面每次重新 focus 时触发（比如从 AddStockList 返回）
            fetchStocks();
        }, [])
    );

    return (
        <SectionList
            sections={sections}
            keyExtractor={(item, index) => item.symbol + index}
            renderItem={({ item }) => (
                <View style={{ padding: 10 }}>
                    <Text>{item.stockName} ({item.symbol})</Text>
                </View>
            )}
            renderSectionHeader={({ section: { title } }) => (
                <View style={{ backgroundColor: "#888", padding: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>{title}</Text>
                </View>
            )}
        />
    );
};

export default StockList;