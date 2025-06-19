import React, { useEffect, useRef } from 'react';
import RootNavigator from './src/navigation';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, ViewStyle } from 'react-native';
import {Provider} from 'react-redux'
import store from './src/redux/store';
import 'react-native-url-polyfill/auto';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from './src/utils/notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});


export default function App(): JSX.Element {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listen when notification is received
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('📩 Notification received:', notification);
    });

    // Handle notification tap
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      console.log('👆 Notification clicked:', data);
      // You can navigate to chat screen here using a ref or global nav
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current!);
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  

  return (
    <GestureHandlerRootView style={styles.container}>
      <Provider store={store}>
      <RootNavigator />
      </Provider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E2D',
  } as ViewStyle,
});
