// TradeDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StockTrade } from '../../types/StockTrade';
import { PRICE_DECIMAL_PRECISION } from '../../config/constants';


import { RootState, AppDispatch } from '../../store';
import { useSelector, useDispatch } from 'react-redux';


// const TradeDetailScreen: React.FC = () => {
const TradeDetailScreen = ({ route }: any) => {
    // const route = useRoute<TradeDetailRouteProp>();
    const { symbol } = route.params;
    const trades = useSelector((state: RootState) => state.trade.trades);
    const filteredTrades = trades.filter(trade => trade.symbol === symbol);
    let decimalPrecision = PRICE_DECIMAL_PRECISION

    const renderItem = ({ item }: { item: StockTrade }) => {
        const isBuy = item.tradeType === 'buy';
        const tradeTypeColor = isBuy ? 'green' : 'red';

        return (
            <View style={[styles.tradeItem, { borderColor: tradeTypeColor }]}>
                <View style={styles.tradeRow}>

                    <View style={[styles.tradeLabel, { backgroundColor: tradeTypeColor }]}>
                        <Text style={[styles.tradeLabelText,]}>{item.tradeType.toUpperCase()}</Text>
                    </View>

                    <View style={styles.tradeContent}>
                        <Text>{item.quantity} @ {item.price.toFixed(decimalPrecision)}</Text>
                        <Text>Date: {item.tradeDate.toDate().toLocaleDateString()}</Text>
                        <Text>Commission: {item.commission}</Text>
                    </View>
                </View>
            </View>
        );
    };

    console.log("All trades:", trades);
    console.log("Filtered trades:", filteredTrades);
    console.log("Symbol from route:", symbol);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Trades for {symbol}</Text>
            <FlatList
                data={filteredTrades}
                keyExtractor={item => item.id}
                renderItem={renderItem}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    tradeItem: {
        // padding: 8,
        marginBottom: 15,
        borderWidth: 2,
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    tradeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tradeLabel: {
        width: 60,
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tradeLabelText: {
        color: 'white',
        fontWeight: 'bold',
    },
    tradeContent: {
        flex: 1,
        paddingLeft: 12,
    },
});

export default TradeDetailScreen;