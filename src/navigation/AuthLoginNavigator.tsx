import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfileScreen from "../screens/Setting/EditProfileScreen";
import HomeNavigator from "./HomeNavigator";
import StockListNavigator from "./StockListNavigator";
import AddTradeScreen from "../screens/MyStock/AddTradeScreen";
import ImportCSVScreen from "../screens/Setting/ImportCSVScreen";
import TradeDetailScreen from "../screens/MyStock/TradeDetailScreen";
// import TradeDetailScreen from "../screens/MyStock/TradeDetailScreen";



import { Provider, useDispatch } from 'react-redux';
import { AppDispatch, store } from '../store';
import { useEffect } from "react";
import { fetchUserInfo, clearUser } from '../store/userSlice';
import auth from '@react-native-firebase/auth';

const Stack = createNativeStackNavigator();

function AuthListener() {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            if (user) {
                dispatch(fetchUserInfo());
            } else {
                dispatch(clearUser());
            }
        });
        return unsubscribe;
    }, [dispatch]);

    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={HomeNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ImportCSVScreen" component={ImportCSVScreen} />
            <Stack.Screen name="StockList" component={StockListNavigator} options={{ headerShown: false }} />
            <Stack.Screen name="AddTradeScreen" component={AddTradeScreen} />
            <Stack.Screen name="TradeDetailScreen" component={TradeDetailScreen} />
        </Stack.Navigator>
    );
}

export default function AuthLoginNavigator() {
    return (
        <Provider store={store}>
            <AuthListener />
        </Provider >
    );
}