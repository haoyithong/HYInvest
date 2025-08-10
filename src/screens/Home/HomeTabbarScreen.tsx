import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { spacing, typography } from '../../theme';

import HomeNavigator from '../../navigation/HomeNavigator';
import React from 'react';


export default function HomeTabbarScreen() {

    return (
        <HomeNavigator />
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