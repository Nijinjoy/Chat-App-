import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import SplashScreen from '../screens/auth/SplashScreen';

export const AUTH_ROUTES = {
  SPLASH: 'Splash',
  WELCOME: 'Welcome',
  LOGIN: 'Login',
  REGISTER: 'Register',
  VERIFY_EMAIL: 'VerifyEmail',
  VERIFY_PHONE: 'VerifyPhone',
} as const;

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  VerifyEmail: undefined;
  VerifyPhone: undefined;
};

const defaultScreenOptions = {
  headerShown: false,
  animation: 'fade' as const,
  gestureEnabled: false,
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

type AuthStackProps = {
  route?: {
    params?: {
      initialRoute?: keyof AuthStackParamList;
    };
  };
};

export default function AuthStack({ route }: AuthStackProps) {
  const initialRoute = route?.params?.initialRoute || AUTH_ROUTES.WELCOME;

  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={defaultScreenOptions}>
      <Stack.Screen
        name={AUTH_ROUTES.SPLASH}
        component={SplashScreen}
        options={{ animation: 'none' }}
      />
      <Stack.Screen name={AUTH_ROUTES.WELCOME} component={WelcomeScreen} />
      <Stack.Group>
        <Stack.Screen
          name={AUTH_ROUTES.LOGIN}
          component={LoginScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name={AUTH_ROUTES.REGISTER}
          component={RegisterScreen}
          options={{ animation: 'slide_from_right' }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
