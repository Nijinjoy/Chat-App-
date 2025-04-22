import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack, { AUTH_ROUTES } from './AuthStack';
import AppStack from './AppStack';
import SplashScreen from '../screens/auth/SplashScreen';

const RootStack = createNativeStackNavigator();

export default function RootNavigator() {
    return (
        <NavigationContainer>
            <RootStack.Navigator
                initialRouteName="Splash"
                screenOptions={{
                    headerShown: false,
                    animation: 'none'
                }}
            >
                <RootStack.Screen name="Splash" component={SplashScreen} />
                <RootStack.Screen
                    name="Auth"
                    component={AuthStack}
                    initialParams={{ initialRoute: AUTH_ROUTES.WELCOME }} // 👈 pass this
                />
                <RootStack.Screen name="App" component={AppStack} />
            </RootStack.Navigator>
        </NavigationContainer>
    );
}
