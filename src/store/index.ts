// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';

import userReducer from './userSlice';
import tradeReducer from './trade.slice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        trade: tradeReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;