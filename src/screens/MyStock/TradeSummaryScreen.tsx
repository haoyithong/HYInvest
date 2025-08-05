import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Button, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { StockTrade } from '../../types/StockTrade';
import FillButton from '../../compoments/Button/FillButton';
import { round4 } from '../../utils/numberUtils';


import { RootState, AppDispatch } from '../../store';

import { useSelector, useDispatch } from 'react-redux';
import { TradeSummaryItem } from '../../types/TradeSummaryItem';
import { fetchTradeSummary } from '../../store/tradeSlice';


const TradeSummaryScreen = ({ navigation }: any) => {
    const dispatch = useDispatch<AppDispatch>();
    const summary = useSelector((state: RootState) => state.trade.summary);
    const uid = useSelector((state: RootState) => state.user.userInfo?.uid);

    let decimalLength = 2

    useEffect(() => {
        if (uid) {
            dispatch(fetchTradeSummary());
        }
    }, [uid]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <Button title="Refresh" onPress={() => {
                    if (uid) {
                        dispatch(fetchTradeSummary());
                    }
                }} />
            ),
        });
    }, [navigation]);

    const addTradeHandler = () => {
        navigation.navigate("AddTradeScreen")
    }


    const renderItem = ({ item }: { item: TradeSummaryItem }) => {
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