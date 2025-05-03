import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import VerificationScreen from '../screens/auth/VerficationScreen';
import SplashScreen from '../screens/auth/SplashScreen';

// export const AUTH_ROUTES = {
//     WELCOME: 'Welcome',
//     LOGIN: 'Login',
//     REGISTER: 'Register',
//     VERIFY_EMAIL: 'VerifyEmail',
//     VERIFY_PHONE: 'VerifyPhone',
// };

export const AUTH_ROUTES = {
    SPLASH: 'Splash',
    WELCOME: 'Welcome',
    LOGIN: 'Login',
    REGISTER: 'Register',
    VERIFY_EMAIL: 'VerifyEmail',
    VERIFY_PHONE: 'VerifyPhone',
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
            <Stack.Screen
                name={AUTH_ROUTES.VERIFY_EMAIL}
                component={VerificationScreen}
                initialParams={{ type: 'email' }}
            />
            <Stack.Screen
                name={AUTH_ROUTES.VERIFY_PHONE}
                component={VerificationScreen}
                initialParams={{ type: 'phone' }}
            />
        </Stack.Navigator>
    );
}

