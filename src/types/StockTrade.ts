import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

// Base structure (no id or date info)
export type StockTradeBase = {
    userId: string;
    symbol: string;
    tradeType: 'buy' | 'sell';
    quantity: number;
    price: number;
    commission: number;
    createdBy: string;
};

// For creating trades (no id, raw data)
export type StockTrade = StockTradeBase;

// For Redux/local usage (serializable dates + id)
export type LocalStockTrade = StockTradeBase & {
    id: string;
    tradeDate: string;  // ISO string
    createdAt: string;
};

// For Firestore (with Firebase timestamps)
export type FirestoreStockTrade = StockTradeBase & {
    tradeDate: FirebaseFirestoreTypes.Timestamp;
    createdAt: FirebaseFirestoreTypes.Timestamp;
};