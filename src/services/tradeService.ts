import {
    collection,
    getDocs,
    getFirestore,
    orderBy,
    query,
    where,
    addDoc,
    doc,
    deleteDoc,
    FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

import { getApp } from '@react-native-firebase/app';

import {
    FirestoreStockTrade,
    LocalStockTrade,
    StockTrade,
} from '../types/StockTrade';

export const fetchTrades = async (uid: string): Promise<LocalStockTrade[]> => {

    const app = getApp();
    const db = getFirestore(app);

    const tradesRef = collection(db, 'trades');

    const tradesQuery = query(
        tradesRef,
        where('userId', '==', uid),
        orderBy('tradeDate')
    );

    const snapshot = await getDocs(tradesQuery);

    const trades = snapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot<FirestoreStockTrade>) => {
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

    return trades
};



export const addTradeToFirestore = async (
    uid: string,
    trade: Omit<FirestoreStockTrade, 'id'>
) => {
    const db = getFirestore(getApp());

    return await addDoc(collection(db, 'trades'), {
        ...trade,
        userId: uid,
    });
};

export const removeTradeFromFirestore = async (id: string) => {
    const db = getFirestore(getApp());
    const docRef = doc(db, 'trades', id);
    return await deleteDoc(docRef);
};