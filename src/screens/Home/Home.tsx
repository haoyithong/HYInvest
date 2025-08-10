import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, FlatList } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { spacing, typography, ColorTheme, useTheme } from '../../theme';
import WelcomeText from '../../compoments/Text/WelcomeText';

import { RootState, AppDispatch } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { TradeSummaryItem } from '../../types/TradeSummaryItem';
import { fetchTradesThunk, fetchTradeSummary } from '../../store/tradeSlice';
import { LocalStockTrade } from '../../types/StockTrade';
import { PRICE_DECIMAL_PRECISION } from '../../config/constants';
import { formatDateTime } from '../../utils/dateTimeUtils';
import { fetchExchangeRate } from '../../services/exchangeService';
import { fetchMyrToUsd } from '../../store/exchangeSlice';
import { convertCurrency } from '../../utils/exchangeRateUtils';



type Props = NativeStackScreenProps<any, any>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();
    const user = useSelector((state: RootState) => state.user.userInfo);
    let decimalPrecision = PRICE_DECIMAL_PRECISION

    const dispatch = useDispatch<AppDispatch>();
    const uid = useSelector((state: RootState) => state.user.userInfo?.uid);
    const trade = useSelector((state: RootState) => state.trade.trades);
    const summary = useSelector((state: RootState) => state.trade.summary);
    const exchangeRate = useSelector((state: RootState) => state.exchange.rate);
    const totalRealized = summary.reduce((acc, item) => acc + item.realized, 0);
    const totalRemainingCost = summary.reduce((acc, item) => acc + item.quantity * item.avgBuyPrice, 0);

    // get lastest three trade 
    const lastThreeTrades = [...trade]
        .sort((a, b) => new Date(b.tradeDate).getTime() - new Date(a.tradeDate).getTime())
        .slice(0, 5);

    useEffect(() => {
        if (!uid) return;
        const fetchData = async () => {
            try {
                await dispatch(fetchMyrToUsd()).unwrap();
                console.log('home fetchTrade');
                await dispatch(fetchTradesThunk(uid)).unwrap(); // ✅ wait here
                console.log('home fetchTradeSummary');
                dispatch(fetchTradeSummary()); // ✅ runs after fetchTradesThunk finishes
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData(); // ✅ call the async function
    }, [uid]);

    const renderItem = ({ item }: { item: LocalStockTrade }) => {
        const isBuy = item.tradeType === 'buy';
        const tradeTypeColor = isBuy ? 'green' : 'red';

        return (
            <View style={[styles.tradeItem, { borderColor: tradeTypeColor }]}>
                <View style={styles.tradeRow}>

                    <View style={[styles.tradeLabel, { backgroundColor: tradeTypeColor }]}>
                        <Text style={[styles.tradeLabelText,]}>{item.tradeType.toUpperCase()}</Text>
                    </View>

                    <View style={styles.tradeContent}>
                        <Text style={[styles.tradeSymbol]}>{item.symbol}</Text>
                        <Text>{item.quantity} @ {item.price.toFixed(decimalPrecision)}</Text>
                        <Text>Date: {formatDateTime(item.tradeDate, 'dd MMM yyyy')}</Text>
                        <Text>Commission: {item.commission}</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container]}>

            {/* Summary boxes in a row */}
            <View style={styles.summaryRow}>
                {/* Left summary (USD) */}
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryTitle}>Total Summary (USD)</Text>
                    <Text>Total Realized P/L: {totalRealized.toFixed(2)}</Text>
                    <Text>Total Remaining Cost: {totalRemainingCost.toFixed(2)}</Text>
                </View>

                {/* Right summary (MYR) */}
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryTitle}>Total Summary (MYR)</Text>
                    <Text>
                        Total Realized P/L: {convertCurrency(totalRealized, 'MYR', 'USD', exchangeRate ?? 1).toFixed(2)}
                    </Text>
                    <Text>
                        Total Remaining Cost: {convertCurrency(totalRemainingCost, 'MYR', 'USD', exchangeRate ?? 1).toFixed(2)}
                    </Text>
                </View>
            </View>

            <View style={[styles.recentViewContainer]}>
                <Text style={[styles.title,]}>Recent Trades</Text>
                {/* Trades list */}
                <View style={{ marginTop: 10 }}>
                    <FlatList
                        data={lastThreeTrades}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                    />
                </View>
            </View>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        // backgroundColor: '#fff',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 16,
        gap: 16, // for spacing between the boxes (React Native 0.71+)
    },

    summaryBox: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
    },

    summaryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },

    recentViewContainer: { paddingHorizontal: 16, width: '100%', marginTop: 20 },
    title: {
        ...typography.title,
        // marginBottom: spacing.lg,
    },
    tradeItem: {
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
    tradeSymbol: {
        ...typography.regularBold,
    }
});

export default HomeScreen