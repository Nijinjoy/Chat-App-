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
                  animation: 'none' // Disable default animations for root transitions
              }}
              initialRouteName="Splash"
          >
              {/* Splash Screen - Always loads first */}
              <RootStack.Screen
                  name="Splash"
                  component={SplashScreen}
                  options={{ animation: 'none' }} // No animation for splash
              />

              {/* Auth Stack - Shown when user is not logged in */}
              <RootStack.Screen
                  name="Auth"
                  component={AuthStack}
                  options={{
                      animation: 'fade', // Smooth fade transition from splash
                      gestureEnabled: false // Disable back gesture to splash
                  }}
              />

              {/* App Stack - Shown when user is logged in */}
              <RootStack.Screen
                  name="App"
                  component={AppStack}
                  options={{
                      animation: 'fade', // Smooth fade transition from splash
                      gestureEnabled: false // Disable back gesture to splash
                  }}
              />
          </RootStack.Navigator>
      </NavigationContainer>
  );
}
