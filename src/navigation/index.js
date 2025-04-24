import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack, { AUTH_ROUTES } from './AuthStack';
import AppStack from './AppStack';
import SplashScreen from '../screens/auth/SplashScreen';

const RootStack = createNativeStackNavigator();

export default function RootNavigator({ user }) {
    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
                <RootStack.Screen name="Splash" component={SplashScreen} />
                {!user ? (
                    <RootStack.Screen
                        name="Auth"
                        component={AuthStack}
                        initialParams={{ initialRoute: AUTH_ROUTES.WELCOME }}
                    />
                ) : (
                        <RootStack.Screen name="App" component={AppStack} />
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );
}
