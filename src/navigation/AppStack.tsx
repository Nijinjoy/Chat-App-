import React from 'react';
import { createBottomTabNavigator, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import ChatListScreen from '../screens/main/ChatListScreen';
import ChatScreen from '../screens/main/ChatScreen';
import SettingsScreen from '../screens/main/SettingScreen';
import { getFocusedRouteNameFromRoute, RouteProp } from '@react-navigation/native';
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
  <ChatStack.Navigator screenOptions={{ headerShown: false }}>
    <ChatStack.Screen
      name="ChatList"
      component={ChatListScreen}
      options={{ tabBarVisible: true }}
    />
    <ChatStack.Screen
      name="ChatDetail"
      component={ChatScreen}
      options={{
        tabBarStyle: { display: 'none' },
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
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 2,
        },
        tabBarStyle: {
          height: 60,
          paddingBottom: 0,
          paddingTop: 8,
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
            title: 'Chats',
            tabBarStyle: {
              display: isChatList ? 'flex' : 'none',
              height: 60,
              paddingTop: 8,
              paddingBottom: 0,
              backgroundColor: '#ffffff',
              borderTopWidth: 0,
              elevation: 10,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowOffset: { width: 0, height: -1 },
            },
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
