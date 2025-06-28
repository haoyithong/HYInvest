import React from 'react';
import { View, Text, Button } from 'react-native';
import { StyleSheet } from 'react-native';

import auth from '@react-native-firebase/auth';

import { spacing, typography } from '../theme';

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text>Welcome!</Text>
            <Button title="Logout" onPress={() => auth().signOut()} />
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