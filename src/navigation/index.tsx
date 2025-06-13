import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import AuthStack from './AuthStack';
import AppStack from './AppStack';
import SplashScreen from '../screens/auth/SplashScreen';
import { supabase } from '../services/supabase';

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
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsLoading(false);
    };

    getSession();

    // Listen for login/logout
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <SplashScreen/>;
  }


  return (
    <NavigationContainer>
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {session ? (
        <RootStack.Screen name="App" component={AppStack} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthStack} />
      )}
    </RootStack.Navigator>
  </NavigationContainer>
  );
}
