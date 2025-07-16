import React, { useEffect, useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

import CustomButton from '../../compoments/Button/CustomButton';
import CustomTextInput from '../../compoments/TextInput/CustomTextInput';

import { spacing, typography } from '../../theme';
import DeviceInfo from 'react-native-device-info';


export default function LoginScreen({ navigation }: any) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    useEffect(() => {
        const checkEmulator = async () => {
            const isSimulator = await DeviceInfo.isEmulator();
            if (isSimulator) {
                setEmail("thonghaoyi@gmail.com")
                setPassword("haoyi5649")
            }
        };

        checkEmulator();
    }, []);

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
            <View style={styles.signInForm}>
                <CustomTextInput label='Username' placeholder="Email" value={email} onChangeText={setEmail} />
                <CustomTextInput
                    label='Password'
                    placeholder="Password"
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                />
            </View>
            <CustomButton title="Login" onPress={handleLogin} />
            <CustomButton title="Sign Up" onPress={() => navigation.navigate('SignUp', { email })} />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInForm: {
        width: '80%'
    },
    title: {
        ...typography.title,
        marginBottom: spacing.lg,
    },
});