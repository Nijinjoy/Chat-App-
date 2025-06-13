import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ChatListScreen from '../screens/main/ChatListScreen';
import ChatScreen from '../screens/main/ChatScreen';
import SettingsScreen from '../screens/main/SettingScreen';
import ContactScreen from '../screens/main/ContactScreen';
import NotificationScreen from '../screens/main/NotificationScreen'; 
import ProfileScreen from '../screens/main/ProfileScreen';
import CallScreen from '../screens/main/CallScreen';

export const APP_ROUTES = {
  CHATS: 'Chats',
  CONTACTS: 'Contacts',
  SETTINGS: 'Settings',
  PROFILE: 'Profile',
  CALLS: 'Calls',
  CHAT_DETAIL: 'ChatDetail',
  NOTIFICATIONS: 'NotificationScreen',
  MAINTABS: 'MainTabs',
} as const;

type TabRoutes = 'Chats' | 'Contacts' | 'Settings' | 'Profile' | 'Calls';

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

// const Tab = createMaterialTopTabNavigator();

// Tab Icon Renderer
const TabBarIcon = ({ routeName, focused, color, size }: any) => {
  const iconMap: Record<TabRoutes, string> = {
    Chats: focused ? 'chatbubbles' : 'chatbubbles-outline',
    Contacts: focused ? 'people' : 'people-outline',
    Settings: focused ? 'settings' : 'settings-outline',
    Profile: focused ? 'person' : 'person-outline',
  };

  return <Ionicons name={iconMap[routeName]} size={size} color={color} />;
};

// Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const BottomTabs = ({ navigation, route }) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? '';
  const isChatDetail = routeName === 'ChatDetail';

  return (
<Tab.Navigator
      initialRouteName={APP_ROUTES.CHATS}
      screenOptions={({ route }) => {
        const isCurrentChatDetail = getFocusedRouteNameFromRoute(route) === 'ChatDetail';

        return {
          tabBarIcon: ({ focused, color, size }) => (
            <TabBarIcon
              routeName={route.name as TabRoutes}
              focused={focused}
              color={color}
              size={size}
            />
          ),
          tabBarActiveTintColor: 'blue',
          tabBarInactiveTintColor: 'gray',
          tabBarShowLabel: true,
          tabBarStyle: (isChatDetail || isCurrentChatDetail)
            ? { display: 'none' }
            : {
                height: 60,
                backgroundColor: '#ffffff',
                elevation: 10,
              },
          tabBarLabelStyle: {
            fontSize: 12,
            textAlign: 'center',
          },
          headerShown: false,
        };
      }}
    >
      <Tab.Screen
        name={APP_ROUTES.CHATS}
        component={ChatStackScreen}
        options={{ tabBarLabel: 'Chats' }}
      />
      <Tab.Screen
        name={APP_ROUTES.PROFILE}
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
      <Tab.Screen
        name={APP_ROUTES.CONTACTS}
        component={ContactScreen}
        options={{ tabBarLabel: 'Contacts' }}
      />
      <Tab.Screen
        name={APP_ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

// Root App Stack
const AppRootStack = createStackNavigator<AppRootStackParamList>();

export default function AppStack() {
  return (
    <AppRootStack.Navigator screenOptions={{ headerShown: false }}>
    <AppRootStack.Screen name={APP_ROUTES.NOTIFICATIONS} component={NotificationScreen} />
    <AppRootStack.Screen
      name={APP_ROUTES.MAINTABS}
      component={BottomTabs}
    />
  </AppRootStack.Navigator>
  );
}
