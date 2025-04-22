import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

export const AUTH_ROUTES = {
    WELCOME: 'Welcome',
    LOGIN: 'Login',
    REGISTER: 'Register',
};

const defaultScreenOptions = {
    headerShown: false,
    animation: 'fade',
    gestureEnabled: false,
};

const Stack = createNativeStackNavigator();

export default function AuthStack({ route }) {
    const initialRoute = route?.params?.initialRoute || AUTH_ROUTES.WELCOME;

    return (
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={defaultScreenOptions}>
            <Stack.Screen name={AUTH_ROUTES.WELCOME} component={WelcomeScreen} />
            <Stack.Screen name={AUTH_ROUTES.LOGIN} component={LoginScreen} />
            <Stack.Screen name={AUTH_ROUTES.REGISTER} component={RegisterScreen} />
        </Stack.Navigator>
    );
}

