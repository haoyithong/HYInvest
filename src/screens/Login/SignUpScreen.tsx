import React, { useEffect, useState } from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { spacing, typography } from '../../theme';

import CustomTextInput from '../../compoments/TextInput/CustomTextInput';
import Button from '../../compoments/Button/CustomButton';


type RootStackParamList = {
    Register: { email?: string };
};

const SignUpScreen = ({ navigation }: any) => {
    const route = useRoute<RouteProp<RootStackParamList, 'Register'>>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const navigation = useNavigation();

    useEffect(() => {
        if (route.params?.email) {
            setEmail(route.params.email);
        }
    }, [route.params?.email]);

    const handleRegister = async () => {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            const uid = userCredential.user.uid;

            await firestore().collection('users').doc(uid).set({
                id: uid,
                email: email,
                createdAt: firestore.FieldValue.serverTimestamp(),
                role: 'user', // default role
                name: uid,     // optional field
            });

            // ✅ Don't navigate manually here.
            // App will detect auth state change and go to Home automatically.
        } catch (error: any) {
            Alert.alert('Registration Error', error.message);
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
            <Button title="Sign Up" onPress={handleRegister} />
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

export default SignUpScreen;