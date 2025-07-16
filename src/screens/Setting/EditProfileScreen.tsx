import React, { useState, useEffect } from 'react';
import { View, Alert, StyleSheet, Button, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import CustomTextInput from '../../compoments/TextInput/CustomTextInput';
import CustomButton from '../../compoments/Button/CustomButton';
import BottomButton from '../../compoments/Button/BottomButton';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { setUserInfo } from '../../store/userSlice';

const EditProfileScreen = () => {
    const userInfo = useSelector((state: RootState) => state.user.userInfo);
    const dispatch = useDispatch<AppDispatch>();

    const [name, setName] = useState('');
    const navigation = useNavigation();
    const uid = auth().currentUser?.uid;

    // ✅ Pre-fill name from context
    useEffect(() => {
        if (userInfo?.name) {
            setName(userInfo.name);
        }
    }, [userInfo]);

    const handleSave = async () => {
        if (!uid) return;

        try {
            const trimmedName = name.trim();

            // 🔄 Update Firestore
            await firestore().collection('users').doc(uid).update({
                name: trimmedName,
                updatedAt: firestore.FieldValue.serverTimestamp(),
            });

            // ✅ Update global user context
            dispatch(setUserInfo({
                ...userInfo!,
                name: trimmedName,
            }));

            Alert.alert('Success', 'Name updated!');
            navigation.goBack(); // 👈 go back after save
        } catch (err) {
            console.error('Error updating profile:', err);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    if (!userInfo) {
        return <View style={styles.container}><Button title="Loading user..." disabled /></View>;
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined} >
            <ScrollView
                contentContainerStyle={styles.scrollContent}>
                <View style={styles.porfileForm}>
                    <CustomTextInput label='Display Name' placeholder="Display Name" value={name} onChangeText={setName} />
                </View>
            </ScrollView>
            <View style={styles.buttonContainer}>
                <BottomButton title="Save" onPress={handleSave} />
            </View>
        </KeyboardAvoidingView>
        // </SafeAreaView>
    );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    porfileForm: {
        top: 20,
        width: '90%',
    },
    welcomeWrapper: {
        position: 'absolute',
        top: 0,
        width: '100%'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
    },
    scrollContent: {
        flexGrow: 1,
        alignItems: 'center', // ✅ Add this
        width: '100%',
        paddingBottom: 100,
        backgroundColor: '#fff',
    },
    form: {
        width: '80%',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#fff',
    },
});