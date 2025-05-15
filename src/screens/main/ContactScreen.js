import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    Dimensions,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useAuthStore from '../../store/authStore';
import { supabase } from '../../services/supabase';

const { width } = Dimensions.get('window');

const PROFILE = [
    { id: 1, title: "Email", value: "user@example.com", icon: "email-outline" },
    { id: 2, title: "Username", value: "john_doe", icon: "account-circle-outline" },
    { id: 3, title: "Phone Number", value: "+91 9876543210", icon: "phone-outline" },
    { id: 4, title: "Status", value: "Available", icon: "message-text-outline" },
];

const ContactScreen = ({ navigation }) => {
    const [profileData, setProfileData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState('');
    const [avatar, setAvatar] = useState('https://via.placeholder.com/120');

    const { user } = useAuthStore();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const { data: { user }, error } = await supabase.auth.getUser();
                console.log("using===>", user);
                if (error) {
                    console.error('Error fetching user:', error);
                } else {
                    const metadata = user?.user_metadata || {};
                    console.log("User metadata:", metadata);
                    console.log("User email:", user.email);
                    console.log("User full name:", metadata.full_name);
                    const profileItems = [
                        {
                            id: 1,
                            title: 'Email',
                            value: user.email || 'N/A',
                            icon: 'email-outline',
                        },
                        {
                            id: 2,
                            title: 'Username',
                            value: metadata.full_name || 'N/A',
                            icon: 'account-circle-outline',
                        },
                        {
                            id: 3,
                            title: 'Phone Number',
                            value: metadata.phone || 'N/A',
                            icon: 'phone-outline',
                        },
                        {
                            id: 4,
                            title: 'Status',
                            value: 'Available',
                            icon: 'message-text-outline',
                        },
                    ];

                    setProfileData(profileItems);
                    setUserName(metadata.full_name || 'User');
                    setLoading(false);
                }
            } catch (err) {
                console.error('Unexpected error:', err);
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    console.log('Current user:', JSON.stringify(user, null, 2));
    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Icon name={item.icon} size={22} color="#4CAF50" style={styles.cardIcon} />
            <View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardValue}>{item.value}</Text>
            </View>
        </View>
  );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#075E54" barStyle="light-content" />
            <View style={styles.customHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Contact Info</Text>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 40 }} />
            ) : (
                <>
          <View style={styles.header}>
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                            <Text style={styles.name}>{userName}</Text>
                            <Text style={styles.subtitle}>Active now</Text>
                        </View>
          <FlatList
                            data={profileData}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
          />
                </>
            )}
      </View>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FC',
    },
    customHeader: {
        backgroundColor: '#075E54',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 40,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 12,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 110,
        height: 110,
        borderRadius: 55,
        borderWidth: 3,
        borderColor: '#4CAF50',
        marginBottom: 12,
    },
    name: {
        fontSize: 22,
        fontWeight: '600',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    listContent: {
        paddingHorizontal: 15,
        marginTop: 20
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        alignItems: 'flex-start',
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    cardIcon: {
        marginRight: 16,
        marginTop: 4,
    },
    cardTitle: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    cardValue: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
});
