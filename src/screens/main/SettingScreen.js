import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    Switch,
    Pressable
} from 'react-native';
import React from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const SettingScreen = () => {
    const auth = getAuth();
    const navigation = useNavigation();
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

    const settingsItems = [
        {
            icon: <Ionicons name="key" size={24} color="#075E54" />,
            title: "Account",
            description: "Privacy, security, change number"
        },
        {
            icon: <Ionicons name="chatbubbles" size={24} color="#075E54" />,
            title: "Chats",
            description: "Theme, wallpapers, chat history"
        },
        {
            icon: <Ionicons name="notifications" size={24} color="#075E54" />,
            title: "Notifications",
            description: "Message, group & call tones",
            rightComponent: (
                <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    thumbColor={notificationsEnabled ? "#075E54" : "#f4f3f4"}
                    trackColor={{ false: "#767577", true: "#075E5490" }}
                />
            )
        },
        {
            icon: <Ionicons name="help-circle" size={24} color="#075E54" />,
            title: "Help",
            description: "Help center, contact us, privacy policy"
        },
        {
            icon: <MaterialIcons name="people" size={24} color="#075E54" />,
            title: "Invite a friend",
            description: ""
        },
        {
            icon: <Ionicons name="moon" size={24} color="#075E54" />,
            title: "Dark Mode",
            description: "",
            rightComponent: (
                <Switch
                    value={darkModeEnabled}
                    onValueChange={setDarkModeEnabled}
                    thumbColor={darkModeEnabled ? "#075E54" : "#f4f3f4"}
                    trackColor={{ false: "#767577", true: "#075E5490" }}
                />
            )
        },
    ];

    const onLogout = () => {
        const auth = getAuth();
        signOut(auth)
            .then(() => {
                if (navigation && navigation.reset) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'LoginScreen' }],
                    });
                } else {
                    navigation.navigate('LoginScreen');
                }
            })
            .catch((error) => {
                console.log('Logout error: ', error?.message || error);
            });
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.profileHeader}>
                <Image
                    source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                    style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>John Doe</Text>
                    <Text style={styles.profileStatus}>Hey there! I am using WhatsApp</Text>
                </View>
            </View>
            {settingsItems.map((item, index) => (
                <TouchableOpacity key={index} style={styles.settingItem}>
                    <View style={styles.itemIcon}>
                        {item.icon}
                    </View>
                    <View style={styles.itemTextContainer}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        {item.description ? (
                            <Text style={styles.itemDescription}>{item.description}</Text>
                        ) : null}
                    </View>
                    {item.rightComponent ? (
                        <View style={styles.rightComponent}>
                            {item.rightComponent}
                        </View>
                    ) : (
                        <Ionicons name="chevron-forward" size={20} color="#ccc" />
                    )}
                </TouchableOpacity>
            ))}

            <Pressable style={{ justifyContent: "center", alignItems: "center", borderWidth: 2, width: 100 }} onPress={onLogout}>
                <Text>Logout</Text>
            </Pressable>
            <View style={styles.footer}>
                <Text style={styles.versionText}>WhatsApp Clone v2.22.10.72</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6',
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: 'white',
        marginBottom: 10,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 3,
    },
    profileStatus: {
        fontSize: 14,
        color: '#777',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: 'white',
        borderBottomWidth: 0.5,
        borderBottomColor: '#f0f0f0',
    },
    itemIcon: {
        marginRight: 20,
    },
    itemTextContainer: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        marginBottom: 3,
    },
    itemDescription: {
        fontSize: 13,
        color: '#777',
    },
    rightComponent: {
        marginLeft: 10,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    versionText: {
        fontSize: 12,
        color: '#999',
    },
});

export default SettingScreen;
