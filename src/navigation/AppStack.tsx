import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import ChatListScreen from '../screens/main/ChatListScreen';
import ChatScreen from '../screens/main/ChatScreen';
import SettingsScreen from '../screens/main/SettingScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ContactScreen from '../screens/main/ContactScreen';

export const APP_ROUTES = {
  CHATS: 'Chats',
  CONTACTS: 'Contacts',
  SETTINGS: 'Settings',
  CHAT_DETAIL: 'ChatDetail',
} as const;

type ChatStackParamList = {
  ChatList: undefined;
  ChatDetail: { chatId: string };
};

type TabParamList = {
  Chats: undefined;
  Contacts: undefined;
  Settings: undefined;
};

const ChatStack = createStackNavigator<ChatStackParamList>();

const ChatStackScreen = () => (
  <ChatStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#fff' }, // <-- Prevent flicker by setting stack background color
    }}
  >
    <ChatStack.Screen
      name="ChatList"
      component={ChatListScreen}
    />
    <ChatStack.Screen
      name="ChatDetail"
      component={ChatScreen}
      options={{
        headerShown: false,
      }}
    />
  </ChatStack.Navigator>
);

const Tab = createBottomTabNavigator<TabParamList>();

type TabBarIconProps = {
  routeName: keyof typeof APP_ROUTES;
  focused: boolean;
  color: string;
  size: number;
};

const TabBarIcon = ({ routeName, focused, color, size }: TabBarIconProps) => {
  const iconMap: Record<string, string> = {
    [APP_ROUTES.CHATS]: focused ? 'chatbubbles' : 'chatbubbles-outline',
    [APP_ROUTES.CONTACTS]: focused ? 'people' : 'people-outline',
    [APP_ROUTES.SETTINGS]: focused ? 'settings' : 'settings-outline',
  };

  return <Ionicons name={iconMap[routeName]} size={size} color={color} />;
};

export default function AppStack() {
  return (
    <Tab.Navigator
      initialRouteName={APP_ROUTES.CHATS}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => (
          <TabBarIcon
            routeName={route.name as keyof typeof APP_ROUTES}
            focused={focused}
            color={color}
            size={size}
          />
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
            // Keep tabBarStyle consistent to avoid layout flickering
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
      <Tab.Screen
        name={APP_ROUTES.CONTACTS}
        component={ContactScreen}
        options={{ title: 'Profile' }}
      />
      <Tab.Screen
        name={APP_ROUTES.SETTINGS}
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
