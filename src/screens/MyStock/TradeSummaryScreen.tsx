import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Button, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../contexts/UserContext';
import { StockTrade } from '../../types/StockTrade';
import BottomButton from '../../compoments/Button/BottomButton';
import FillButton from '../../compoments/Button/FillButton';
import { round4 } from '../../utils/numberUtils';

type SummaryItem = {
    symbol: string;
    realized: number;
    realizedCommission: number;
    quantity: number;
    avgBuyPrice: number;
};

const TradeSummaryScreen = ({ navigation }: any) => {
    const { userInfo } = useUser();
    const [summary, setSummary] = useState<SummaryItem[]>([]);
    const [calculateCommission, setCalculateCommission] = useState(false);

    let decimalLength = 2

    useEffect(() => {
        if (userInfo?.uid) {
            fetchTradeSummary(userInfo.uid);
        } else {
            return
        }
    }, [userInfo]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title="Refresh" onPress={() => {
                    if (userInfo?.uid) {
                        fetchTradeSummary(userInfo.uid);
                    }
                }} />
            ),
        });
    }, [navigation]);

    const addTradeHandler = () => {
        navigation.navigate("AddTradeScreen")
    }

    const fetchTradeSummary = async (uid: string) => {
        const snapshot = await firestore()
            .collection('trades')
            .where('userId', '==', uid)
            .orderBy('tradeDate')
            .get();

        const trades = snapshot.docs.map(doc => doc.data() as StockTrade);

        const grouped = trades.reduce((acc, trade) => {
            if (!acc[trade.symbol]) acc[trade.symbol] = [];
            acc[trade.symbol].push(trade);
            return acc;
        }, {} as Record<string, StockTrade[]>);

        const results: SummaryItem[] = Object.entries(grouped).map(([symbol, trades]) => {
            let positionQty = 0;
            let positionCost = 0;
            let realized = 0;
            let realizedCommission = 0;

            trades.forEach(t => {
                const rawCommission = t.commission || 0;
                const commission = calculateCommission ? rawCommission : 0;
                if (t.tradeType === 'buy') {
                    const totalCost = t.price * t.quantity + commission;
                    positionCost += totalCost;
                    positionQty += t.quantity;
                    realizedCommission += rawCommission;
                } else if (t.tradeType === 'sell') {
                    if (positionQty <= 0) return;

                    const avgCost = round4(positionCost / positionQty);
                    const sellRevenue = round4(t.price * t.quantity);
                    const sellCost = round4(avgCost * t.quantity);

                    realized += round4(sellRevenue - sellCost - commission);
                    realizedCommission += rawCommission;

                    // Update remaining position
                    positionQty -= t.quantity;
                    positionCost -= sellCost;
                }
            });

            const avgBuyPrice = round4(positionQty > 0 ? positionCost / positionQty : 0);

            return {
                symbol,
                realized: parseFloat(realized.toFixed(2)),
                realizedCommission: parseFloat(realizedCommission.toFixed(2)),
                quantity: round4(positionQty),
                avgBuyPrice: parseFloat(avgBuyPrice.toFixed(4)),
            };
        });

        setSummary(results);
    };

    const renderItem = ({ item }: { item: SummaryItem }) => {
        const { symbol, realized, quantity, avgBuyPrice, realizedCommission } = item;
        const remainingCost = quantity * avgBuyPrice;
        const isProfit = realized >= 0;

        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('TradeDetailScreen', { symbol })}
                style={styles.item}
            >
                <Text style={styles.symbol}>{symbol}</Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Realized P/L: </Text>
                    <Text style={[styles.value, { color: isProfit ? 'green' : 'red' }]}>
                        {realized.toFixed(decimalLength)} (Fee: {realizedCommission.toFixed(decimalLength)})
                    </Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Position: </Text>
                    <View style={styles.label}>
                        <Text style={styles.value}>{quantity}</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Avg Buy Price: </Text>
                    <Text style={styles.value}>{avgBuyPrice.toFixed(decimalLength)}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.label}>Remaining Cost: </Text>
                    <Text style={styles.value}>{remainingCost.toFixed(decimalLength)}</Text>
                </View>
            </TouchableOpacity>
        );
    };
    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* 列表区域 */}
                <FlatList
                    style={styles.list}
                    // contentContainerStyle={{ paddingBottom: 100 }}
                    data={summary}
                    keyExtractor={(item) => item.symbol}
                    renderItem={renderItem}
                />

                {/* 固定底部按钮 */}
                <View style={styles.bottomBar}>
                    <FillButton title="Add Trade" onPress={addTradeHandler} style={{ width: '100%' }} />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    item: {
        padding: 16,
        backgroundColor: '#f2f2f2',
        marginBottom: 12,
        borderRadius: 8,
    },
    bottomBar: {
        backgroundColor: '#eee',
        borderTopWidth: 1,
        borderColor: '#ddd',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    label: {
        width: 130,
        color: '#555',
    },
    value: {
        fontWeight: '600',
    },
    symbol: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 8,
    },

});

export default TradeSummaryScreen;