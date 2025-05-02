import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import ChatListScreen from '../screens/main/ChatListScreen';
import ChatScreen from '../screens/main/ChatScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SettingsScreen from '../screens/main/SettingScreen';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

export const APP_ROUTES = {
    CHATS: 'Chats',
    PROFILE: 'Profile',
    SETTINGS: 'Settings',
    CHAT_DETAIL: 'ChatDetail',
};

const ChatStack = createStackNavigator();

const ChatStackScreen = () => (
    <ChatStack.Navigator
        screenOptions={{
            headerShown: false
        }}
    >
        <ChatStack.Screen
            name="ChatList"
            component={ChatListScreen}
            options={{ tabBarVisible: true }}
        />
        <ChatStack.Screen
            name={APP_ROUTES.CHAT_DETAIL}
            component={ChatScreen}
            options={{
                tabBarStyle: { display: 'none' },
                headerShown: false
            }}
        />
    </ChatStack.Navigator>
);

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ routeName, focused, color, size }) => {
    const iconMap = {
        [APP_ROUTES.CHATS]: focused ? 'chatbubbles' : 'chatbubbles-outline',
        [APP_ROUTES.PROFILE]: focused ? 'person' : 'person-outline',
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
                        routeName={route.name}
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
                    // Get the current nested route name
                    const routeName = getFocusedRouteNameFromRoute(route) ?? 'ChatList';

                    // Hide tab bar if not on ChatList
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
                name={APP_ROUTES.PROFILE}
                component={ProfileScreen}
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
