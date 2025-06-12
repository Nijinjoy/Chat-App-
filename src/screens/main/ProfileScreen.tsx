import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Buffer } from 'buffer';
import HeaderComponent from '../../components/HeaderComponent';
import { supabase } from '../../services/supabase';

const ProfileScreen: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
    if (userError) {
      Alert.alert('Error', 'Failed to get user');
      console.error('User fetch error:', userError);
      return;
    }
    console.log('Authenticated User:', user);
    const fullName = user.user_metadata?.full_name || '';
    const userEmail = user.email || '';
    const userId = user.id;
    setEmail(userEmail);
    setUsername(fullName);
    const { data: profile, error: profileError } = await supabase
      .from('users') 
      .select('full_name, phone, avatar_url')
      .eq('id', userId)
      .single();
    if (profileError) {
      Alert.alert('Error', 'Failed to fetch profile');
      console.error('Profile fetch error:', profileError);
      return;
    }
    console.log('User Profile:', profile);
    setPhone(profile.phone || '');
    setImageUri(profile.avatar_url || null);
  };

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission denied', 'We need permission to access photos');
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
        allowsEditing: true,
        aspect: [1, 1],
        base64: true,
      });
      console.log('Selected image result:', result);
      if (result.canceled || !result.assets?.[0]?.base64) {
        Alert.alert('No image selected or base64 data missing');
        return;
      }
      const base64Str = result.assets[0].base64;
      const localUri = result.assets[0].uri;
      const fileName = localUri.split('/').pop() || `image_${Date.now()}`;
      const fileExt = fileName.split('.').pop() || 'jpg';
      const uniqueFileName = `${Date.now()}.${fileExt}`;
      const mimeType = result.assets[0].mimeType || `image/${fileExt}`;
      const buffer = Buffer.from(base64Str, 'base64');
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(uniqueFileName, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: mimeType,
        });
  
      if (uploadError) {
        console.error('Upload error:', uploadError);
        Alert.alert('Error', 'Failed to upload image');
        return;
      }
      const { data: publicURLData } = supabase.storage
        .from('avatars')
        .getPublicUrl(uniqueFileName);
  
      const publicUrl = publicURLData?.publicUrl;
      if (!publicUrl) {
        Alert.alert('Error', 'Failed to retrieve image URL');
        return;
      }
      setImageUri(publicUrl);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
  
      if (userError) {
        console.error('User fetch error:', userError);
        return;
      }
      const { error: updateError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);
  
      if (updateError) {
        console.error('Update error:', updateError);
        Alert.alert('Error', 'Failed to update profile image');
      } else {
        Alert.alert('Success', 'Profile image updated successfully');
      }
    } catch (error) {
      console.error('Image picker or upload error:', error);
      Alert.alert('Error', 'Something went wrong while uploading the image');
    }
  };
  
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderComponent title="My Profile" showBack />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={handleChoosePhoto} style={styles.imageWrapper}>
          <Image
            source={{
              uri: imageUri || 'https://via.placeholder.com/100',
            }}
            style={styles.avatar}
          />
          <View style={styles.cameraIconWrapper}>
            <Ionicons name="camera" size={20} color="#fff" />
          </View>
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            keyboardType="email-address"
            style={styles.input}
            placeholderTextColor="#888"
          />
        </View>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save Changes</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity style={styles.logoutButton} onPress={() => {
  Alert.alert('Log Out', 'Are you sure you want to log out?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Log Out', style: 'destructive', onPress: () => console.log('Logged out') },
  ]);
}}>
  <Text style={styles.logoutText}>Log Out</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.deleteButton} onPress={() => {
  Alert.alert('Delete Account', 'This will permanently delete your account. Proceed?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') },
  ]);
}}>
  <Text style={styles.deleteText}>Delete Account</Text>
</TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  container: {
    padding: 20,
  },
  imageWrapper: {
    alignSelf: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
  },
  cameraIconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#075E54',
    borderRadius: 15,
    padding: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  inputWrapper: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: '#f9f9f9',
  },
  saveButton: {
    backgroundColor: '#075E54',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 15
  },
  logoutButton: {
    backgroundColor: '#e0f2f1',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#009688',
  },
  logoutText: {
    color: '#00796B',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteText: {
    color: '#c62828',
    fontSize: 16,
    fontWeight: '600',
  },
  
});
