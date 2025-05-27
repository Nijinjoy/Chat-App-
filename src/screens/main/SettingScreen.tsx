import React, { useState,useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    FlatList,
    ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../services/supabase';
import { signOut } from '../../services/authService';
import {useDispatch,useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { fetchCurrentUser } from '../../redux/auth/authThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser } from '../../redux/auth/authSlice';

type SectionItem = {
    id: string;
    title?: string;
    renderItem: () => React.ReactElement;
};

const SettingScreen: React.FC = () => {
    const navigation = useNavigation();
    const [darkMode, setDarkMode] = useState<boolean>(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
    const dispatch = useDispatch();
// const user = useSelector((state: RootState) => state.auth.user);
const [user, setUser] = useState<any>(null);


useEffect(() => {
    const getUser = async () => {
        const json = await AsyncStorage.getItem('user');
        if (json) setUser(JSON.parse(json));
    };
    getUser();
}, []);


    const handleNotificationToggle = async (value: boolean) => {
        setNotificationsEnabled(value);
        await updatePushToken(value);
    };

    const handleSignOut = async () => {
        try {
            await signOut();
            navigation.navigate('Login' as never);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleDeleteAccount = async () => {
        console.warn('Delete account clicked');
    };

    const updatePushToken = async (enabled: boolean) => {
        console.log('Notifications toggled:', enabled);
    };

    const sections: SectionItem[] = [
        {
            id: 'preferences',
            title: 'Preferences',
            renderItem: () => (
                <View style={[styles.section, darkMode && styles.darkSection]}>
                    <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>
                        Preferences
                    </Text>
                    <View style={styles.settingItem}>
                        <Text style={[styles.settingText, darkMode && styles.darkText]}>
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
                        <Text style={[styles.settingText, darkMode && styles.darkText]}>
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
            id: 'user-info',
            renderItem: () => (
                <View style={[styles.section, darkMode && styles.darkSection]}>
                    <Text style={[styles.sectionTitle, darkMode && styles.darkSectionTitle]}>
                        Account Info
                    </Text>
                    <View style={styles.settingItem}>
                        <Text style={[styles.settingText, darkMode && styles.darkText]}>
                            Email: {user?.email || 'N/A'}
                        </Text>
                    </View>
                    <View style={styles.settingItem}>
                        <Text style={[styles.settingText, darkMode && styles.darkText]}>
                            User ID: {user?.id || 'N/A'}
                        </Text>
                    </View>
                </View>
            )
        }
,        
        {
            id: 'actions',
            renderItem: () => (
                <>
                    <TouchableOpacity
                        style={[styles.signOutButton, darkMode && styles.darkSignOutButton]}
                        onPress={handleSignOut}
                    >
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.deleteAccountButton, darkMode && styles.darkDeleteAccountButton]}
                        onPress={handleDeleteAccount}
                    >
                        <Text style={[styles.deleteAccountText, darkMode && styles.darkDeleteAccountText]}>
                            Delete Account
                        </Text>
                    </TouchableOpacity>
                </>
            )
        }
    ];

    const renderItem: ListRenderItem<SectionItem> = ({ item }) => item.renderItem();

    return (
        <>
            <StatusBar
                barStyle={darkMode ? 'light-content' : 'dark-content'}
                backgroundColor={darkMode ? '#075E54' : '#075E54'}
            />
            <SafeAreaView style={[styles.safeArea, darkMode && styles.darkSafeArea]}>
                <View style={[styles.header, darkMode && styles.darkHeader]}>
                    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={darkMode ? '#fff' : 'white'} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, darkMode && styles.darkHeaderTitle]}>
                        Settings
                    </Text>
                    <View style={styles.headerRight} />
                </View>

                <FlatList
                    data={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                />
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
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
    settingText: {
        fontSize: 16,
        color: '#000',
    },
    darkText: {
        color: '#fff',
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
