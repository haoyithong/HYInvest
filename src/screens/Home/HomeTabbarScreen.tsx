import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { spacing, typography } from '../../theme';

import HomeNavigator from '../../navigation/HomeNavigator';
import React from 'react';
import { store } from '../../store';
import { Provider, useDispatch } from 'react-redux';

export default function HomeTabbarScreen() {

    return (
        <Provider store={store}>
            <HomeNavigator />
        </Provider >
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