import { useEffect, useState } from "react";
import { View, Text, Button, Alert, TextInput, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet } from "react-native";
// import { TWELVE_API_KEY } from '@env';
import firestore from '@react-native-firebase/firestore';

import { StockItem } from "../../types/StockItem";
import { getEnv } from "../../utils/env";
import { ConfirmDialog } from "../../compoments/Dialog/ConfirmDialog";


const AddStockListScreen = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<StockItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [existingSymbols, setExistingSymbols] = useState<string[]>([]);
    const allowedCountries = ['Malaysia', 'United States'];

    function mapTwelveDataToStockItem(entry: any): StockItem {
        let countryCode = '';
        if (entry.country === 'Malaysia') countryCode = '.KL';
        else if (entry.country === 'United States') countryCode = '.US';
        let suffix = "." + countryCode
        // Ensure symbol has correct suffix
        const symbol = entry.symbol.endsWith(suffix) ? entry.symbol : `${entry.symbol}${suffix}`;

        return {
            countryCode: entry.country,
            symbol: entry.symbol,
            countryName: entry.country,
            stockName: entry.instrument_name,
            isETF: entry.type?.toLowerCase().includes('etf') ?? false,
            currency: entry.currency,
            exchange: entry.exchange
        };
    }

    const addStockToFirestore = async (item: StockItem) => {
        try {
            await firestore().collection('stocks').add(item);
            setExistingSymbols(prev => [...prev, item.symbol]);
            console.log('✅ Stock added to Firestore');
        } catch (error) {
            console.error('❌ Error adding stock:', error);
        }
    };

    const handleSelect = (stockItem: StockItem) => {
        const alreadyAdded = existingSymbols.includes(stockItem.symbol);
        if (alreadyAdded) {
            Alert.alert(
                'Already Added',
                `"${stockItem.stockName}" (${stockItem.symbol}) 已经添加过了。`,
                [{ text: 'OK' }]
            );
            return;
        } else {
            ConfirmDialog({
                title: 'Add Stock',
                message: `Do you want to add "${stockItem.stockName}" (${stockItem.symbol})?`,
                onConfirm: () => addStockToFirestore(stockItem),
            });
        }
    };

    const searchSymbol = async (text: string) => {
        const { TWELVE_API_KEY } = getEnv();

        if (!TWELVE_API_KEY) {
            console.error("TWELVE_API_KEY is undefined");
            return;
        }
        setQuery(text);
        if (text.length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `https://api.twelvedata.com/symbol_search?symbol=${text}&apikey=${TWELVE_API_KEY}`
            );
            const data = await response.json();
            console.log(data);
            if (data?.data) {
                // ✅ Filter for only Malaysia and US stocks
                const filtered = data.data.filter((d: any) => {
                    const countryMatch = allowedCountries.includes(d.country);
                    return countryMatch;
                });

                // ✅ Map to StockItem[]
                const mappedResults: StockItem[] = filtered.map(mapTwelveDataToStockItem);
                setResults(mappedResults);
            } else {
                setResults([]);
            }
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchExistingSymbols = async () => {
            try {
                const snapshot = await firestore().collection('stocks').get();
                const symbols = snapshot.docs.map(doc => doc.data().symbol);
                setExistingSymbols(symbols);
            } catch (error) {
                console.error("Failed to fetch existing stocks:", error);
            }
        };

        fetchExistingSymbols();
    }, []);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search Symbol (e.g., AAPL)"
                value={query}
                onChangeText={searchSymbol}
                style={styles.input}
            />

            {loading ? (
                <ActivityIndicator style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={results}
                    keyExtractor={(item, index) => item.symbol + index}
                    renderItem={({ item }) => {
                        const alreadyAdded = existingSymbols.includes(item.symbol);

                        return (
                            <TouchableOpacity onPress={() => handleSelect(item)} style={styles.item}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <View>
                                        <Text style={styles.symbol}>{item.symbol}</Text>
                                        <Text>{item.stockName}</Text>
                                        <Text style={styles.exchange}>{item.exchange}</Text>
                                    </View>
                                    {alreadyAdded && <Text style={{ color: 'green', fontSize: 18 }}>✅</Text>}
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </View>
    );
};

export default AddStockListScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 12,
        backgroundColor: "#fff",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 8,
    },
    item: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
    symbol: {
        fontWeight: "bold",
    },
    exchange: {
        fontSize: 12,
        color: "#888",
    },
});