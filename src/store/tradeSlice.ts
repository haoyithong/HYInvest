import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import firestore from '@react-native-firebase/firestore';
import { StockTrade } from '../types/StockTrade';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { TradeSummaryItem } from '../types/TradeSummaryItem';
import { round4 } from '../utils/numberUtils';
import { calculateTradeSummary } from '../utils/summary';


export const fetchTrades = async (uid: string): Promise<StockTrade[]> => {
    const snapshot = await firestore()
        .collection('trades')
        .where('userId', '==', uid)
        .orderBy('tradeDate')
        .get();

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as StockTrade),
    }));
};

export const fetchTradesThunk = createAsyncThunk<StockTrade[], string>(
    'trade/fetchTrades',
    async (uid: string) => {
        return await fetchTrades(uid);
    }
);

export const addTrade = createAsyncThunk(
    'trade/addTrade',
    async (trade: Omit<StockTrade, 'id'>, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const uid = state.user.userInfo?.uid;

        if (!uid) throw new Error('User not authenticated');

        await firestore().collection('trades').add({ ...trade, userId: uid });

        // Re-fetch updated trades
        return await thunkAPI.dispatch(fetchTradesThunk(uid)).unwrap();
    }
);

export const removeTrade = createAsyncThunk(
    'trade/removeTrade',
    async (id: string, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const uid = state.user.userInfo?.uid;

        if (!uid) throw new Error('User not authenticated');

        await firestore().collection('trades').doc(id).delete();

        // Re-fetch updated trades
        return await thunkAPI.dispatch(fetchTradesThunk(uid)).unwrap();
    }
);

export const fetchTradeSummary = createAsyncThunk<TradeSummaryItem[], string>(
    'trade/fetchTradeSummary',
    async (uid, { rejectWithValue }) => {
        try {
            const trades = await fetchTrades(uid); // ✅ reuse fetchTrades
            const result = calculateTradeSummary(trades);

            return result; // ✅ use utility
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

const tradeSlice = createSlice({
    name: 'trade',
    initialState: {
        trades: [] as StockTrade[],
        summary: [] as TradeSummaryItem[],
        loading: false,
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTradesThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTradesThunk.fulfilled, (state, action) => {
                state.trades = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchTradesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Fetch failed';
            })
            .addCase(fetchTradeSummary.fulfilled, (state, action) => {
                console.log('✅ Summary data set in reducer:', action.payload);
                state.summary = action.payload;
            });

    },
});

export default tradeSlice.reducer;