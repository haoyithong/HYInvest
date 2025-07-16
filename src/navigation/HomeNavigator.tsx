import React from 'react';
import { Alert, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Ionicons from 'react-native-vector-icons/Ionicons';
import auth from '@react-native-firebase/auth';

import HomeScreen from '../screens/Home/Home';
import SettingScreen from '../screens/Home/Setting';
import TradeSummaryScreen from '../screens/MyStock/TradeSummaryScreen';


export default function HomeNavigator() {

    const Tab = createBottomTabNavigator();

    function logoutFunction() {
        auth().signOut()
            .then(() => Alert.alert('Logged out'));
    }

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size }) => {
                    let iconName: string;
                    if (route.name === 'Home') {
                        iconName = 'home-outline';
                    } else if (route.name === 'TradeSummary') {
                        iconName = 'bar-chart-outline';
                    } else if (route.name === 'Setting') {
                        iconName = 'settings-outline';
                    } else {
                        iconName = 'home-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#007aff',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen} />
            <Tab.Screen
                name="TradeSummary"
                component={TradeSummaryScreen} />
            <Tab.Screen
                name="Setting"
                component={SettingScreen} />
        </Tab.Navigator>
    );
}