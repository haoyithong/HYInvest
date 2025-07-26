import firestore from '@react-native-firebase/firestore';
import { FirestoreStockTrade, LocalStockTrade, StockTrade } from '../types/StockTrade';

export const fetchTrades = async (uid: string): Promise<LocalStockTrade[]> => {
    const snapshot = await firestore()
        .collection('trades')
        .where('userId', '==', uid)
        .orderBy('tradeDate')
        .get();

    return snapshot.docs.map(doc => {
        const data = doc.data() as FirestoreStockTrade;
        return {
            id: doc.id,
            userId: data.userId,
            symbol: data.symbol,
            tradeType: data.tradeType,
            quantity: data.quantity,
            price: data.price,
            commission: data.commission,
            createdBy: data.createdBy,
            tradeDate: data.tradeDate.toDate().toISOString(),
            createdAt: data.createdAt.toDate().toISOString(),
        };
    });
};

export const addTradeToFirestore = async (uid: string, trade: Omit<FirestoreStockTrade, 'id'>) => {
    return await firestore().collection('trades').add({ ...trade, userId: uid });
};

export const removeTradeFromFirestore = async (id: string) => {
    return await firestore().collection('trades').doc(id).delete();
};