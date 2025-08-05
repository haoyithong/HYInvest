// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';

import userReducer from './userSlice';
import tradeReducer from './tradeSlice';
import exchangeReducer from './exchangeSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        trade: tradeReducer,
        exchange: exchangeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;