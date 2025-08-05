import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '.';
import { LocalStockTrade, FirestoreStockTrade } from '../types/StockTrade';
import { TradeSummaryItem } from '../types/TradeSummaryItem';
import { calculateTradeSummary } from '../utils/summary';
import * as tradeService from '../services/tradeService';
import { TradeState } from '../types/Interfaces';

// FETCH TRADES
export const fetchTradesThunk = createAsyncThunk<LocalStockTrade[], string>(
    'trade/fetchTrades',
    async (uid) => {
        return await tradeService.fetchTrades(uid);
    }
);

// CALCULATE SUMMARY
export const fetchTradeSummary = createAsyncThunk<TradeSummaryItem[], void, { state: RootState }>(
    'trade/fetchTradeSummary',
    async (_, { getState, rejectWithValue }) => {
        const trades = getState().trade.trades;
        if (!trades.length) return rejectWithValue('No trades found');
        return calculateTradeSummary(trades);
    }
);

// ADD TRADE
export const addTrade = createAsyncThunk<void, Omit<FirestoreStockTrade, 'id'>, { state: RootState }>(
    'trade/addTrade',
    async (trade, { getState, dispatch }) => {
        const uid = getState().user.userInfo?.uid;
        if (!uid) throw new Error('User not authenticated');

        await tradeService.addTradeToFirestore(uid, trade);
        await dispatch(fetchTradesThunk(uid)).unwrap();
        await dispatch(fetchTradeSummary()).unwrap();

        return;
    }
);

// REMOVE TRADE
export const removeTrade = createAsyncThunk<void, string, { state: RootState }>(
    'trade/removeTrade',
    async (id, { getState, dispatch }) => {
        const uid = getState().user.userInfo?.uid;
        if (!uid) throw new Error('User not authenticated');

        await tradeService.removeTradeFromFirestore(id);
        await dispatch(fetchTradesThunk(uid)).unwrap();
        await dispatch(fetchTradeSummary()).unwrap();

        return;
    }
);

const initialState: TradeState = {
    trades: [],
    summary: [],
    loading: false,
    error: null,
};

const tradeSlice = createSlice({
    name: 'trade',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTradesThunk.pending, (state) => {
                console.log("fetchTradesThunk load")
                state.loading = true;
            })
            .addCase(fetchTradesThunk.fulfilled, (state, action) => {
                console.log("fetchTradesThunk fulfilled")
                console.log(action.payload)
                state.trades = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchTradesThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message ?? 'Failed to fetch trades';
            })
            .addCase(fetchTradeSummary.fulfilled, (state, action) => {
                console.log("fetchTradeSummary")
                console.log(action.payload)
                state.summary = action.payload;
            });
    },
});

export default tradeSlice.reducer;