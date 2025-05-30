import React, { useState } from 'react';
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
import HeaderComponent from '../../components/HeaderComponent';

const ProfileScreen: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission denied', 'We need permission to access photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: () => console.log('User logged out') },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is irreversible. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') },
      ]
    );
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

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
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
    backgroundColor: '#ffebee',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#c62828',
  },
  deleteText: {
    color: '#c62828',
    fontSize: 16,
    fontWeight: '600',
  },
  
});
