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

const Tab = createMaterialTopTabNavigator();

const TabBarIcon = ({ routeName, focused, color, size }: any) => {
  const iconMap: Record<TabRoutes, string> = {
    Chats: focused ? 'chatbubbles' : 'chatbubbles-outline',
    Contacts: focused ? 'people' : 'people-outline',
    Settings: focused ? 'settings' : 'settings-outline',
    Profile: focused ? 'person' : 'person-outline',
    Calls: focused ? 'call' : 'call-outline',
  };  
  return <Ionicons name={iconMap[routeName]} size={size} color={color} />;
};

const BottomTabs = () => (
<Tab.Navigator
  initialRouteName={APP_ROUTES.CHATS}
  tabBarPosition="bottom"
  screenOptions={({ route }) => ({
    tabBarIcon: ({ focused, color }) => (
      <TabBarIcon
        routeName={route.name as TabRoutes}
        focused={focused}
        color={color}
        size={20}
      />
    ),
    swipeEnabled: true,
    tabBarShowIcon: true,
    tabBarActiveTintColor: 'blue',
    tabBarInactiveTintColor: 'gray',
    tabBarIndicatorStyle: { height: 0 },
    tabBarStyle: {
      height: 60,
      backgroundColor: '#ffffff',
      elevation: 10,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      textAlign: 'center',
    },
  })}
>
    <Tab.Screen
      name={APP_ROUTES.CHATS}
      component={ChatStackScreen}
      options={({ route }) => {
        const routeName = getFocusedRouteNameFromRoute(route) ?? 'ChatList';
        const isChatList = routeName === 'ChatList';
        return {
          tabBarLabel: 'Chats',
          tabBarStyle: isChatList
            ? {
                height: 60,
                backgroundColor: '#ffffff',
                borderTopWidth: 0,
                elevation: 10,
              }
            : { display: 'none' },
        };
      }}
    />
        <Tab.Screen name={APP_ROUTES.CALLS} component={CallScreen}   options={{ tabBarLabel: 'Calls' }}/>
    <Tab.Screen name={APP_ROUTES.CONTACTS} component={ContactScreen}   options={{ tabBarLabel: 'Contacts' }}/>
    <Tab.Screen name={APP_ROUTES.PROFILE} component={ProfileScreen}   options={{ tabBarLabel: 'Profile' }}/>
<Tab.Screen name={APP_ROUTES.SETTINGS} component={SettingsScreen}   options={{ tabBarLabel: 'Settings' }}/>
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
