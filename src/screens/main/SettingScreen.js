import {
    View,
    Text, 
    StyleSheet, 
    Switch, 
    TouchableOpacity,
    Image, 
    SafeAreaView,
    StatusBar,
    Platform,
    FlatList,
    Alert
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from '../../services/authService';
import useAuthStore from '../../store/authStore';

const SettingScreen = () => {
    const navigation = useNavigation();
    const { clearSessionData } = useAuthStore();
    const [darkMode, setDarkMode] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const handleNotificationToggle = async (value) => {
        setNotificationsEnabled(value);
        await updatePushToken(value);
    };

    const handleSignOut = async () => {
        Alert.alert(
            'Confirm Logout',
            'Are you sure you want to sign out?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const signOutResponse = await signOut(); // Call the sign-out service
                            if (!signOutResponse.success) {
                                throw new Error(signOutResponse.error);
                            }

                            // Clear session data from Zustand store
                            clearSessionData(); // Call Zustand method to clear session and user

                            // Redirect to login screen
                            navigation.replace('Auth', { screen: 'Login' });
                        } catch (error) {
                            console.error('Error signing out:', error.message);
                            Alert.alert(
                                'Error',
                                error.message || 'Failed to sign out'
                            );
                        }
                    },
                },
            ],
            { cancelable: true }
        );
    };




    const handleDeleteAccount = async () => {

    };

    const sections = [
        {
            id: 'preferences',
            title: 'Preferences',
            renderItem: () => (
                <View style={[
                    styles.section,
                    darkMode && styles.darkSection
                ]}>
                    <Text style={[
                        styles.sectionTitle,
                        darkMode && styles.darkSectionTitle
                    ]}>
                        Preferences
                    </Text>
                    <View style={styles.settingItem}>
                        <Text style={[
                            styles.settingText,
                            darkMode && styles.darkText
                        ]}>
                            Dark Mode
                        </Text>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={darkMode ? '#f5dd4b' : '#f4f3f4'}
                        />
                    </View>
                    <View style={styles.settingItem}>
                        <Text style={[
                            styles.settingText,
                            darkMode && styles.darkText
                        ]}>
                            Notifications
                        </Text>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={handleNotificationToggle}
                            trackColor={{ false: '#767577', true: '#81b0ff' }}
                            thumbColor={notificationsEnabled ? '#f5dd4b' : '#f4f3f4'}
                        />

                    </View>
                </View>
            )
        },
        {
            id: 'actions',
            renderItem: () => (
                <>
                    <TouchableOpacity
                        style={[
                            styles.signOutButton,
                            darkMode && styles.darkSignOutButton
                        ]}
                        onPress={handleSignOut}
                    >
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.deleteAccountButton,
                            darkMode && styles.darkDeleteAccountButton
                        ]}
                        onPress={handleDeleteAccount}
                    >
                        <Text style={[
                            styles.deleteAccountText,
                            darkMode && styles.darkDeleteAccountText
                        ]}>
                            Delete Account
                        </Text>
                    </TouchableOpacity>
                </>
            )
        }
    ];

    return (
        <>
            <StatusBar
                barStyle={darkMode ? 'light-content' : 'dark-content'}
                backgroundColor={darkMode ? '#075E54' : '#075E54'}
            />
            <SafeAreaView style={[
                styles.safeArea,
                darkMode && styles.darkSafeArea
            ]}>
                <View style={[
                    styles.header,
                    darkMode && styles.darkHeader
                ]}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={24}
                            color={darkMode ? '#fff' : 'white'}
                        />
                    </TouchableOpacity>
                    <Text style={[
                        styles.headerTitle,
                        darkMode && styles.darkHeaderTitle
                    ]}>
                        Settings
                    </Text>
                    <View style={styles.headerRight} />
                </View>

                <FlatList
                    data={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => item.renderItem()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff'
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    darkSafeArea: {
        backgroundColor: '#1a1a1a',
    },
    listContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 15,
    },
    avatarPlaceholder: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#4a90e2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    darkAvatarPlaceholder: {
        backgroundColor: '#6366f1',
    },
    avatarText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#000',
    },
    darkText: {
        color: '#fff',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    darkSecondaryText: {
        color: '#aaa',
    },
    section: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 20,
        paddingHorizontal: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    darkSection: {
        backgroundColor: '#1e1e1e',
        shadowColor: '#000',
        shadowOpacity: 0.3,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    darkSectionTitle: {
        color: '#aaa',
        borderBottomColor: '#333',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    darkSettingItem: {
        borderBottomColor: '#333',
    },
    settingText: {
        fontSize: 16,
        color: '#000',
    },
    arrow: {
        fontSize: 20,
        color: '#999',
    },
    signOutButton: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#ff3b30',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    darkSignOutButton: {
        backgroundColor: '#1e1e1e',
        borderColor: '#ff6b6b',
    },
    signOutText: {
        color: '#ff3b30',
        fontSize: 16,
        fontWeight: '600',
    },
    deleteAccountButton: {
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    darkDeleteAccountButton: {
        backgroundColor: '#1e1e1e',
    },
    deleteAccountText: {
        color: '#666',
        fontSize: 16,
    },
    darkDeleteAccountText: {
        color: '#999',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#075E54',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
    },
    darkHeader: {
        backgroundColor: '#1a1a1a',
        borderBottomColor: '#333',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
    },
    darkHeaderTitle: {
        color: '#fff',
    },
    headerRight: {
        width: 40,
    },
});

export default SettingScreen;
