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
    Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import useAuthStore from '../../store/authStore';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../services/supabase';
import * as FileSystem from 'expo-file-system';

const { width } = Dimensions.get('window');

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

    const handlePickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission is required to access the gallery');
                return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const image = result.assets[0];
                console.log("image===>", image);
                uploadAvatar(image);
            }
        } catch (error) {
            console.error('Image picker error:', error);
            Alert.alert('Error', 'Something went wrong while picking the image.');
        }
    };

    const uriToBlob = async (uri) => {
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], {
            type: 'image/jpeg',
        });
    };


    const uploadAvatar = async (image) => {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError || !user) throw new Error('User not found');

            // ✅ FIXED Blob conversion
            const blob = await uriToBlob(image.uri);

            const fileExt = image.uri.split('.').pop() || 'jpg';
            const fileName = `${user.id}_${Date.now()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, blob, {
                    // contentType: image.mimeType || 'image/jpeg',
                    contentType: 'image/jpeg',
                    upsert: true,
                });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
            const publicUrl = urlData.publicUrl;

            // ✅ Update user table metadata with avatar_url
            const { error: updateError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl },
            });

            if (updateError) throw updateError;

            setAvatar(publicUrl);
            Alert.alert('Success', 'Profile picture updated!');
        } catch (err) {
            console.error('Upload failed:', err);
            Alert.alert('Upload Failed', err.message || 'An unexpected error occurred.');
        }
    };


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
                        <TouchableOpacity onPress={handlePickImage} style={styles.header}>
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                            <Text style={styles.name}>{userName}</Text>
                            <Text style={styles.subtitle}>Tap to change profile photo</Text>
                        </TouchableOpacity>
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
        marginTop: 24,
        marginBottom: 16,
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
