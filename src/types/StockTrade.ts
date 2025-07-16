import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

export type StockTrade = {
    userId: string;
    symbol: string;
    tradeType: 'buy' | 'sell';
    quantity: number;
    price: number;
    commission: number;
    tradeDate: FirebaseFirestoreTypes.Timestamp;
    createdBy: string;
    createdAt: FirebaseFirestoreTypes.Timestamp;
};