// ✅ These must come before ANYTHING else
import 'react-native-gesture-handler';     // 👈 First
import 'react-native-reanimated';         // 👈 Second
import { Provider, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import PreloginNavigator from './navigation/PreloginNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';
import { AppDispatch, store } from './store';
import { fetchUserInfo, clearUser } from './store/userSlice';
import auth from '@react-native-firebase/auth';

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
    <SafeAreaProvider>
      <NavigationContainer>
        <PreloginNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AuthListener />
      </Provider>
    </GestureHandlerRootView>
  );
}