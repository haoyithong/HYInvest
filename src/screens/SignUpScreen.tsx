import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { spacing, typography } from '../theme';

import CustomTextInput from '../compoments/TextInput/TextInput';
import Button from '../compoments/Button/Button';

export default function SignUpScreen({ navigation }: any) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        try {
            await auth().createUserWithEmailAndPassword(email, password);
        } catch (err) {
            const error = err as Error;
            Alert.alert('Signup Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <CustomTextInput
                label='Username'
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <CustomTextInput
                placeholder="Password"
                value={password}
                secureTextEntry
                onChangeText={setPassword}
            />
            <Button title="Sign Up" onPress={handleSignUp} />
            <Button title="Back to Login" onPress={() => navigation.navigate('Login')} />
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