import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Papa from 'papaparse';
import firestore from '@react-native-firebase/firestore';
import { useUser } from '../../contexts/UserContext';

const ImportCSVScreen = () => {
    const { userInfo } = useUser();
    const [csvData, setCsvData] = useState<any[]>([]);

    const handleImportCSV = async () => {
        try {
            const res = await DocumentPicker.pickSingle({
                type: [DocumentPicker.types.plainText],
            });

            const fileUri = res.uri;

            const response = await fetch(fileUri);
            const fileText = await response.text();
            console.log(fileText)
            Papa.parse(fileText, {
                header: true,
                skipEmptyLines: true,
                complete: async (results) => {
                    const parsedData = results.data as any[];

                    const trades = parsedData.map(row => ({
                        userId: userInfo?.uid,
                        symbol: row.symbol,
                        tradeType: row.tradeType.toLowerCase() === 'buy' ? 'buy' : 'sell',
                        quantity: parseFloat(row.quantity),
                        price: parseFloat(row.price),
                        commission: row.commission ? parseFloat(row.commission) : 0,
                        tradeDate: firestore.Timestamp.fromDate(new Date(row.tradeDate)),
                        createdAt: firestore.Timestamp.now(),
                        createdBy: userInfo?.uid,
                    }));

                    setCsvData(trades);
                    Alert.alert('Success', `${trades.length} trades parsed`);
                },
            });

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled file picker');
            } else {
                console.error('Error reading CSV:', err);
                Alert.alert('Error', 'Failed to read CSV file.');
            }
        }
    };

    const uploadToFirestore = async () => {
        if (!userInfo?.uid || csvData.length === 0) return;

        try {
            const batch = firestore().batch();
            const tradesRef = firestore().collection('trades');

            csvData.forEach((trade) => {
                const docRef = tradesRef.doc();
                batch.set(docRef, trade);
            });

            await batch.commit();
            Alert.alert('Success', 'Trades uploaded successfully');
            setCsvData([]);
        } catch (err) {
            console.error('Firestore upload failed:', err);
            Alert.alert('Error', 'Upload failed');
        }
    };

    return (
        // <ScrollView contentContainerStyle={styles.container}>
        //     <Text style={styles.title}>Import Trades from CSV</Text>
        //     <Button title="Choose CSV File" onPress={handleImportCSV} />
        //     {csvData.length > 0 && (
        //         <>
        //             <Text style={styles.preview}>{csvData.length} trades ready to upload.</Text>
        //             <Button title="Upload to Firestore" onPress={uploadToFirestore} color="green" />
        //         </>
        //     )}
        // </ScrollView>
        <View>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Import Trades from CSV</Text>
                <Text style={styles.title}>Sample</Text>
                <Text>symbol,tradeType,quantity,price,commission,tradeDate</Text>
                <Text>INTC,buy,50.000,23.0000,2.31,2024-10-10T00:00:00</Text>
                <Button title="Choose CSV File" onPress={handleImportCSV} />
                {csvData.length > 0 && (
                    <>
                        <Text style={styles.preview}>{csvData.length} trades ready to upload.</Text>
                        <Button title="Upload to Firestore" onPress={uploadToFirestore} color="green" />
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    preview: {
        marginVertical: 16,
        fontSize: 16,
    },
});

export default ImportCSVScreen;