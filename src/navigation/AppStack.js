import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ChatListScreen from '../screens/main/ChatListScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import SettingsScreen from '../screens/main/SettingScreen';

export const APP_ROUTES = {
    CHATS: 'Chats',
    CALLS: 'Calls',
    PROFILE: 'Profile',
    SETTINGS: 'Settings',
};

const Tab = createBottomTabNavigator();

const TabBarIcon = ({ routeName, focused, color, size }) => {
    const iconMap = {
        [APP_ROUTES.CHATS]: focused ? 'chatbubbles' : 'chatbubbles-outline',
        // [APP_ROUTES.CALLS]: focused ? 'call' : 'call-outline',
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
                tabBarActiveTintColor: '#007AFF',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: {
                    fontSize: 12,
                    paddingBottom: 2,
                },
                tabBarStyle: {
                    height: 60,
                    paddingTop: 8,
                    backgroundColor: '#ffffff',
                    borderTopWidth: 0,
                    elevation: 10,
                    shadowOpacity: 0.1,
                },
                headerShown: false,
            })}
        >
            <Tab.Screen
                name={APP_ROUTES.CHATS}
                component={ChatListScreen}
                options={{ title: 'Chats' }}
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
