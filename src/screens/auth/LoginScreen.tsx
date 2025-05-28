import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { login } from '../../assets/animations';
import InputComponent from '../../components/InputComponent';
import ButtonComponent from '../../components/ButtonComponent';
import { supabase } from '../../services/supabase';
import { AUTH_ROUTES } from '../../navigation/AuthStack';
import {  useDispatch } from 'react-redux';
import { loginUser } from '../../redux/auth/authThunk';
import { AppDispatch } from '../../redux/store';
import { APP_ROUTES } from '../../navigation/AppStack';

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
    const [form, setForm] = useState<FormFields>({ email: '', password: '' });
    const [errors, setErrors] = useState<Errors>({});
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const handleChange = (name: keyof FormFields, value: string) => {
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        let valid = true;
        const newErrors: Errors = {};

        if (!form.email.includes('@')) {
            newErrors.email = 'Enter a valid email';
            valid = false;
        }

        if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = async () => {
        if (!validate()) return;
        try {
          const resultAction = await dispatch(loginUser({ email: form.email, password: form.password }));
          console.log("resultActionlogin====>",resultAction);
          
          if (loginUser.fulfilled.match(resultAction)) {
            // navigation.navigate('App');
            navigation.reset({
                index: 0,
                routes: [{ name: 'App' }], // Your RootStack has 'App' which loads this AppStack
              });
                           
          } else {
            // Login failed, show error message
            Alert.alert('Login Failed', resultAction.payload || 'Invalid email or password');
          }
        } catch (err: any) {
          Alert.alert('Login Error', err.message || 'Something went wrong');
        }
      };

    const fields = [
        { name: 'email', placeholder: 'Email', secure: false, icon: 'mail-outline' },
        { name: 'password', placeholder: 'Password', secure: true, icon: 'lock-closed-outline' },
    ] as const;

    return (
        <LinearGradient colors={['#f8f9fa', '#e9ecef']} style={styles.gradient}>
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
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {fields.map((field) => (
                            <InputComponent
                                key={field.name}
                                value={form[field.name]}
                                onChangeText={(value: string) => handleChange(field.name, value)}
                                placeholder={field.placeholder}
                                iconName={field.icon}
                                error={errors[field.name]}
                                keyboardType={field.name === 'email' ? 'email-address' : 'default'}
                                secureTextEntry={field.secure}
                                showPassword={field.name === 'password' ? showPassword : undefined}
                                togglePasswordVisibility={
                                    field.name === 'password' ? () => setShowPassword(!showPassword) : undefined
                                }
                            />
                        ))}
                    </View>

                    <ButtonComponent title="Login" onPress={handleLogin} />

                    <View style={styles.socialLoginContainer}>
                        <Text style={styles.orText}>Or sign in with</Text>
                        <ButtonComponent
                            title="Continue with Google"
                            backgroundColor="#fff"
                            textColor="#2d3436"
                            border
                            style={styles.socialButton}
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
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: { flex: 1, paddingHorizontal: 10 },
    keyboardAvoid: { flex: 1 },
    scrollContainer: { flexGrow: 1, paddingBottom: 30, paddingHorizontal: 20 },
    header: { alignItems: 'center', paddingTop: height * 0.05, paddingBottom: 20 },
    animation: { width: width * 0.7, height: width * 0.7 },
    title: { fontSize: 28, fontWeight: 'bold', color: '#2d3436' },
    subtitle: { fontSize: 16, color: '#636e72', marginTop: 5 },
    formContainer: { marginTop: 10 },
    registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
    registerText: { color: '#636e72', fontSize: 14 },
    registerLink: { color: '#4A80F0', fontWeight: 'bold', fontSize: 14 },
    socialLoginContainer: { alignItems: 'center' },
    orText: { fontSize: 14, color: '#636e72' },
    socialButton: { width: '100%', marginTop: 10 },
});

export default LoginScreen;
