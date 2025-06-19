import React, { useState,useEffect, useMemo } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Linking
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { login } from '../../assets/animations';
import InputComponent from '../../components/InputComponent';
import ButtonComponent from '../../components/ButtonComponent';
import { supabase } from '../../services/supabase';
import { AUTH_ROUTES } from '../../navigation/AuthStack';
import {  useDispatch } from 'react-redux';
import { loginUser } from '../../redux/auth/authThunk';
import { AppDispatch } from '../../redux/store';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../validation/authSchema';
import { FontAwesome } from '@expo/vector-icons';
import {google} from '../../assets/images'

WebBrowser.maybeCompleteAuthSession();
  
const { width, height } = Dimensions.get('window');

type FormFields = {
    email: string;
    password: string;
};

type Errors = {
    email?: string;
    password?: string;
};

type AuthStackParamList = {
    [AUTH_ROUTES.REGISTER]: undefined;
    App: undefined;
};

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'App'>;

const LoginScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch<AppDispatch>();


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>({
    resolver: yupResolver(loginSchema),
  });

  const handleLogin = async (data: FormFields) => {
    try {
      const resultAction = await dispatch(loginUser({ email: data.email, password: data.password }));
      if (loginUser.fulfilled.match(resultAction)) {
        navigation.reset({ index: 0, routes: [{ name: 'App' }] });
      } else {
        Alert.alert('Login Failed', resultAction.payload || 'Invalid email or password');
      }
    } catch (err: any) {
      Alert.alert('Login Error', err.message || 'Something went wrong');
    }
  }; 

  useEffect(() => {
    const checkLoginStatus = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        navigation.reset({ index: 0, routes: [{ name: 'App' }] });
      }
      if (error) {
        console.error('Session Error:', error.message);
      }
    };
    checkLoginStatus();
  }, []);

const handleGoogleLogin = async () => {
  try {
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'wechat',
      path: 'auth-callback',
    });
    console.log('🔗 Redirect URI:', redirectUri);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
      },
    });
    if (error) throw new Error(error.message);
    if (data?.url) {
      console.log('🌐 Supabase Auth URL:', data.url);
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri);
      if (result.type === 'success' && result.url) {
        const accessTokenMatch = result.url.match(/access_token=([^&]+)/); 
        const refreshTokenMatch = result.url.match(/refresh_token=([^&]+)/);
        console.log("refreshTokenMatch====>",refreshTokenMatch);
        const access_token = accessTokenMatch?.[1];
        console.log("accessTokenMatch====>",accessTokenMatch);
        const refresh_token = refreshTokenMatch?.[1];
        console.log("refreshTokenMatch====>",refreshTokenMatch);
        if (access_token && refresh_token) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });
          if (sessionError) {
            console.error("Session Error:", sessionError.message);
            Alert.alert("Login Failed", sessionError.message);
            return;
          }
          navigation.reset({ index: 0, routes: [{ name: 'App' }] });
        } else {
          Alert.alert("Login Failed", "Missing tokens in the redirect URL.");
        }
      } else {
        Alert.alert("Login Cancelled", result.type);
      }
    }
  } catch (err: any) {
    console.error("Google Login Error:", err.message);
    Alert.alert("Google Login Failed", err.message);
  }
};


   
const fields = [
        { name: 'email', placeholder: 'Email', secure: false, icon: 'mail-outline' },
        { name: 'password', placeholder: 'Password', secure: true, icon: 'lock-closed-outline' },
    ] as const;

    return (
<View style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.header}>
                        <LottieView
                            source={login}
                            autoPlay
                            loop
                            style={styles.animation}
                            resizeMode="contain"
                        />
                     <Text style={styles.title}>Welcome Back 👋</Text>
<Text style={styles.subtitle}>Log in to connect and chat instantly</Text>
                    </View>    
          <View style={styles.formContainer}>
            {fields.map((field) => (
              <Controller
                key={field.name}
                control={control}
                name={field.name}
                render={({ field: { onChange, onBlur, value } }) => (
                  <InputComponent
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder={field.placeholder}
                    iconName={field.icon}
                    error={errors[field.name]?.message}
                    keyboardType={field.name === 'email' ? 'email-address' : 'default'}
                    secureTextEntry={field.secure && !showPassword}
                    showPassword={field.name === 'password' ? showPassword : undefined}
                    togglePasswordVisibility={
                      field.name === 'password' ? () => setShowPassword(!showPassword) : undefined
                    }
                  />
                )}
              />
            ))}
          </View>
          <ButtonComponent title="Login" onPress={handleSubmit(handleLogin)} />
                    <View style={styles.socialLoginContainer}>
                        <Text style={styles.orText}>Or sign in with</Text>
                        <ButtonComponent
                            title="Continue with Google"
                            backgroundColor="#fff"
                            textColor="#2d3436"
                            border
                            style={styles.socialButton}
                            onPress={handleGoogleLogin}
                      icon={google}
                        />
                    </View>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate(AUTH_ROUTES.REGISTER)}>
                            <Text style={styles.registerLink}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    gradient: { flex: 1, paddingHorizontal: 10 },
    keyboardAvoid: { flex: 1 },
    scrollContainer: { flexGrow: 1, paddingBottom: 30, paddingHorizontal: 20 },
    header: { alignItems: 'center', paddingTop: height * 0.05, paddingBottom: 20 },
    animation: { width: width * 0.6, height: width * 0.6 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#2d3436' },
    subtitle: { fontSize: 16, color: '#636e72', marginTop: 5 },
    formContainer: { marginTop: 10 },
    registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    registerText: { color: '#636e72', fontSize: 14 },
    registerLink: { color: '#4A80F0', fontWeight: 'bold', fontSize: 14 },
    socialLoginContainer: { alignItems: 'center' },
    orText: { fontSize: 14, color: '#636e72' },
    socialButton: { width: '100%', marginTop: 10 },
    container: {
      flex: 1,
      // justifyContent: 'center',
      // alignItems: 'center',
      backgroundColor: '#d1f0e1', 
    },
    
});

export default LoginScreen;
