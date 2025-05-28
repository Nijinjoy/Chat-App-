// navigation/AppStack.tsx

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ChatListScreen from '../screens/main/ChatListScreen';
import ChatScreen from '../screens/main/ChatScreen';
import SettingsScreen from '../screens/main/SettingScreen';
import ContactScreen from '../screens/main/ContactScreen';
import NotificationScreen from '../screens/main/NotificationScreen'; // Import your notification screen

export const APP_ROUTES = {
  CHATS: 'Chats',
  CONTACTS: 'Contacts',
  SETTINGS: 'Settings',
  CHAT_DETAIL: 'ChatDetail',
  NOTIFICATIONS: 'NotificationScreen',
  MAINTABS: 'MainTabs',
} as const;

type TabRoutes = 'Chats' | 'Contacts' | 'Settings';

type ChatStackParamList = {
  ChatList: undefined;
  ChatDetail: { chatId: string };
};

type AppRootStackParamList = {
  MainTabs: undefined;
  NotificationScreen: undefined;
};

const ChatStack = createStackNavigator<ChatStackParamList>();

const ChatStackScreen = () => (
  <ChatStack.Navigator screenOptions={{ headerShown: false }}>
    <ChatStack.Screen name="ChatList" component={ChatListScreen} />
    <ChatStack.Screen name="ChatDetail" component={ChatScreen} />
  </ChatStack.Navigator>
);

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ routeName, focused, color, size }: any) => {
  const iconMap: Record<TabRoutes, string> = {
    Chats: focused ? 'chatbubbles' : 'chatbubbles-outline',
    Contacts: focused ? 'people' : 'people-outline',
    Settings: focused ? 'settings' : 'settings-outline',
  };
  return <Ionicons name={iconMap[routeName]} size={size} color={color} />;
};

const BottomTabs = () => (
  <Tab.Navigator
    initialRouteName={APP_ROUTES.CHATS}
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => (
        <TabBarIcon routeName={route.name as TabRoutes} focused={focused} color={color} size={size} />
      ),
      tabBarActiveTintColor: 'blue',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        height: 60,
        paddingBottom: 0,
        paddingTop: 8,
        backgroundColor: '#ffffff',
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: -1 },
      },
      headerShown: false,
    })}
  >
    <Tab.Screen
      name={APP_ROUTES.CHATS}
      component={ChatStackScreen}
      options={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'ChatList';
        const isChatList = routeName === 'ChatList';

        return {
          tabBarStyle: isChatList
            ? {
                height: 60,
                paddingBottom: 0,
                paddingTop: 8,
                backgroundColor: '#ffffff',
                borderTopWidth: 0,
                elevation: 10,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: -1 },
              }
            : { display: 'none' },
        };
      }}
    />
    <Tab.Screen name={APP_ROUTES.CONTACTS} component={ContactScreen} />
    <Tab.Screen name={APP_ROUTES.SETTINGS} component={SettingsScreen} />
  </Tab.Navigator>
);

const AppRootStack = createStackNavigator<AppRootStackParamList>();

export default function AppStack() {
  return (
<AppRootStack.Navigator screenOptions={{ headerShown: false }}>
  <AppRootStack.Screen name={APP_ROUTES.NOTIFICATIONS} component={NotificationScreen} />
  <AppRootStack.Screen name={APP_ROUTES.MAINTABS} component={BottomTabs} />
</AppRootStack.Navigator>
  );
}
