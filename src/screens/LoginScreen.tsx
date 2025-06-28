import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

import Button from '../compoments/Button/Button';
import CustomTextInput from '../compoments/TextInput/TextInput';

import { spacing, typography } from '../theme';



export default function LoginScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await auth().signInWithEmailAndPassword(email, password);
        } catch (err) {
            const error = err as Error;
            Alert.alert('Login Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <CustomTextInput placeholder="Email" value={email} onChangeText={setEmail} />
            <CustomTextInput
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Go to Sign Up" onPress={() => navigation.navigate('SignUp')} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        ...typography.title,
        marginBottom: spacing.lg,
    },
});