import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { chatAnimation, loadingDots } from '../../assets/animations';
import { supabase } from '../../services/supabase';

// Define navigation prop type if you're using React Navigation
type RootStackParamList = {
  App: undefined;
  Auth: undefined;
};

type SplashScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'App' | 'Auth'>;
};

const { width, height } = Dimensions.get('window');

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        navigation.replace(user ? 'App' : 'Auth');
      } catch (error) {
        navigation.replace('Auth');
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#d1f0e1', '#ffffff']} style={styles.container}>
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <LottieView
          source={chatAnimation}
          autoPlay
          loop={false}
          style={styles.logo}
        />
      </Animated.View>

      <Animated.View style={[styles.textContainer, { transform: [{ translateY }] }]}>
        <Text style={styles.title}>WeChat</Text>
        <Text style={styles.subtitle}>Secure messaging for everyone</Text>
      </Animated.View>

      <View style={styles.loadingContainer}>
        <LottieView source={loadingDots} autoPlay loop style={styles.loadingAnimation} />
        <Text style={styles.loadingText}>Preparing your experience...</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: width * 0.45,
    height: width * 0.45,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1e272e',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: '#636e72',
    marginTop: 6,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: height * 0.1,
    alignItems: 'center',
  },
  loadingAnimation: {
    width: 60,
    height: 30,
  },
  loadingText: {
    fontSize: 14,
    color: '#8395a7',
    marginTop: 5,
  },
});

export default SplashScreen;
