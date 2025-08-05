// src/store/slices/exchangeSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchExchangeRate } from '../services/exchangeService';


type ExchangeState = {
    rate: number | null;
    loading: boolean;
    error: string | null;
};

const initialState: ExchangeState = {
    rate: null,
    loading: false,
    error: null,
};

export const fetchMyrToUsd = createAsyncThunk<number>(
    'exchange/fetchMyrToUsd',
    async () => {
        return await fetchExchangeRate('MYR', 'USD');
    }
);

const exchangeSlice = createSlice({
    name: 'exchange',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyrToUsd.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyrToUsd.fulfilled, (state, action) => {
                state.loading = false;
                state.rate = action.payload;
            })
            .addCase(fetchMyrToUsd.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch rate';
            });
    },
});

export default exchangeSlice.reducer;