import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { notificatioon } from '../../assets/animations';
import type { RootStackParamList } from '../../types/navigation';
import { APP_ROUTES } from '../../navigation/AppStack';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { supabase } from '../../services/supabase';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notification'>;

const NotificationScreen: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received in Foreground:', notification);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleEnableNotifications = async () => {
    try {
      setLoading(true);

      if (!Device.isDevice) {
        Alert.alert('Physical Device Required', 'Push notifications only work on real devices.');
        return;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        Alert.alert('Permission Denied', 'Notification permission was not granted.');
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;
      console.log('Expo Push Token:', token);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      const userId = userData?.user?.id;

      if (userError || !userId) {
        console.error('User fetch error:', userError?.message);
        Alert.alert('Error', 'Unable to retrieve user info.');
        return;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({ push_token: token })
        .eq('id', userId);

      if (updateError) {
        console.error('Supabase update error:', updateError.message);
        Alert.alert('Error', 'Failed to save push token.');
        return;
      }

      navigation.replace(APP_ROUTES.MAINTABS);
    } catch (error) {
      console.error('Notification setup error:', error);
      Alert.alert('Unexpected Error', 'Failed to enable notifications.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <LottieView source={notificatioon} autoPlay loop style={styles.lottie} />
        <Text style={styles.title}>Stay Updated!</Text>
        <Text style={styles.subtitle}>
          Enable push notifications to never miss a message.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.denyButton]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.denyText}>Deny</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.enableButton]}
          onPress={handleEnableNotifications}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.enableText}>Enable Notifications</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  lottie: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 20,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 140,
    alignItems: 'center',
  },
  denyButton: {
    backgroundColor: '#eee',
  },
  enableButton: {
    backgroundColor: '#007BFF',
  },
  denyText: {
    color: '#333',
    fontWeight: '500',
  },
  enableText: {
    color: '#fff',
    fontWeight: '600',
  },
});
