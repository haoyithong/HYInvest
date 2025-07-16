// ✅ These must come before ANYTHING else
import 'react-native-gesture-handler';     // 👈 First
import 'react-native-reanimated';         // 👈 Second
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './contexts/UserContext';
import PreloginNavigator from './navigation/PreloginNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TestScreen from './screens/test';


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <PreloginNavigator />
            {/* <TestScreen /> */}
          </NavigationContainer>
        </SafeAreaProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
};