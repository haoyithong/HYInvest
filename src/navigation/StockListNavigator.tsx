import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StockListScreen from "../screens/Setting/StockListScreen";
import AddStockListScreen from "../screens/Setting/AddStockListScreen";

const Stack = createNativeStackNavigator();

export default function StockListNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="StockList" component={StockListScreen} />
            <Stack.Screen name="AddStockListScreen" component={AddStockListScreen} />
        </Stack.Navigator>
    );
}