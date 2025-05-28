import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { supabase } from '../../services/supabase';
import { notificatioon } from '../../assets/animations';
import type { RootStackParamList } from '../../types/navigation';
import { APP_ROUTES } from '../../navigation/AppStack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Notification'>;

const NotificationScreen: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<NavigationProp>();

  const registerForPushNotificationsAsync = async (): Promise<void> => {
    navigation.navigate(APP_ROUTES.MAINTABS);
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
          onPress={registerForPushNotificationsAsync}
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
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: 250,
    height: 250,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 10,
    color: '#666',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingHorizontal: 30,
    paddingBottom: 20,
    paddingTop: 10,
  },
  actionButton: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 10,
  },
  denyButton: {
    backgroundColor: '#ccc',
  },
  enableButton: {
    backgroundColor: '#32a852',
  },
  denyText: {
    color: '#333',
    fontSize: 16,
  },
  enableText: {
    color: '#fff',
    fontSize: 16,
  },
});
