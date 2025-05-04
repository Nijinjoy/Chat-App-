import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import SplashScreen from '../screens/auth/SplashScreen';

const RootStack = createNativeStackNavigator();

export default function RootNavigator({ user }) {
    return (
        <NavigationContainer>
          <RootStack.Navigator
              screenOptions={{
                  headerShown: false,
                    animation: 'none' 
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
                      gestureEnabled: false 
                  }}
                />
              <RootStack.Screen
                  name="App"
                  component={AppStack}
                  options={{
                      animation: 'fade',
                      gestureEnabled: false
                  }}
              />
          </RootStack.Navigator>
      </NavigationContainer>
  );
}
