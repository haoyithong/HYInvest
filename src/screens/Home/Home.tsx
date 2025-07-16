import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { spacing, typography, ColorTheme, useTheme } from '../../theme';
import WelcomeText from '../../compoments/Text/WelcomeText';
import { useUser } from '../../contexts/UserContext';

type Props = NativeStackScreenProps<any, any>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const { colors } = useTheme();
    // const [user, setUser] = useState<any>(null);
    // const [userInfo, setUserInfo] = useState<any>(null);

    // useEffect(() => {
    //     const unsubscribe = firestore()
    //         .collection('users')
    //         .doc(auth().currentUser?.uid)
    //         .onSnapshot(doc => {
    //             if (doc.exists()) {
    //                 setUserInfo(doc.data());
    //             }
    //         });
    //     return unsubscribe; // cleanup
    // }, []);
    const { userInfo } = useUser();
    return (


        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {userInfo ? (
                <WelcomeText user={userInfo?.name ?? 'User'} />
            ) : null}
            <Text>Home!</Text>
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

export default HomeScreen