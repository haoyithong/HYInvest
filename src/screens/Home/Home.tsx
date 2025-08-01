import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { spacing, typography, ColorTheme, useTheme } from '../../theme';
import WelcomeText from '../../compoments/Text/WelcomeText';

import { RootState, AppDispatch } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { TradeSummaryItem } from '../../types/TradeSummaryItem';
import { fetchTradesThunk, fetchTradeSummary } from '../../store/trade.slice';



type Props = NativeStackScreenProps<any, any>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();
    const user = useSelector((state: RootState) => state.user.userInfo);

    const dispatch = useDispatch<AppDispatch>();
    const uid = useSelector((state: RootState) => state.user.userInfo?.uid);
    const trade = useSelector((state: RootState) => state.trade.trades);
    const summary = useSelector((state: RootState) => state.trade.summary);

    const totalRealized = summary.reduce((acc, item) => acc + item.realized, 0);
    const totalRemainingCost = summary.reduce((acc, item) => acc + item.quantity * item.avgBuyPrice, 0);

    useEffect(() => {
        if (!uid) return;
        const fetchData = async () => {
            try {
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

    return (


        <View style={[styles.container, { backgroundColor: colors.background }]}>

            <View style={{ padding: 16, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Total Summary</Text>
                <Text>Total Realized P/L: {totalRealized.toFixed(2)}</Text>
                <Text>Total Remaining Cost: {totalRemainingCost.toFixed(2)}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...typography.title,
        marginBottom: spacing.lg,
    },
});

export default HomeScreen