import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import SplashScreen from '../screens/auth/SplashScreen';

export type RootStackParamList = {
  Splash: undefined;
  Auth: undefined;
  App: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  user?: any;
}

export default function RootNavigator({ user }: RootNavigatorProps): JSX.Element {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
        initialRouteName="Splash"
      >
        <RootStack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ animation: 'none' }}
        />
        <RootStack.Screen
          name="Auth"
          component={AuthStack}
          options={{
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
        <RootStack.Screen
          name="App"
          component={AppStack}
          options={{
            animation: 'fade',
            gestureEnabled: false,
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
