import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EditProfileScreen from "../screens/Setting/EditProfileScreen";
import HomeNavigator from "./HomeNavigator";
import StockListNavigator from "./StockListNavigator";
import AddTradeScreen from "../screens/MyStock/AddTradeScreen";
import ImportCSVScreen from "../screens/Setting/ImportCSVScreen";
import TradeDetailScreen from "../screens/MyStock/TradeDetailScreen";
// import TradeDetailScreen from "../screens/MyStock/TradeDetailScreen";



const Stack = createNativeStackNavigator();

export default function AuthLoginNavigator() {
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