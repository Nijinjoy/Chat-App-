import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
    Image, Dimensions, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { AUTH_ROUTES } from '../../navigation/AuthStack';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import { login } from '../../assets/animations';
import InputComponent from '../../components/InputComponent';
import ButtonComponent from '../../components/ButtonComponent';
import { supabase } from '../../services/supabase';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
    const navigation = useNavigation();
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        let valid = true;
        const newErrors = {};

        if (!form.email.includes("@")) {
            newErrors.email = "Enter a valid email";
            valid = false;
        }
        if (form.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: form.email,
                password: form.password,
            });
            console.log('Login response:', data);

            if (error) {
                console.error('Login error:', {
                    error,
                    message: error.message,
                    formData: form,
                });
                Alert.alert('Login Failed', error.message || 'Invalid email or password');
                return;
            }

            if (!data?.session) {
                console.warn('Login succeeded, but session is null:', data);
                Alert.alert('Login Warning', 'Logged in but session not created.');
            return;
            }

            console.log('Login successful:', {
                user: data.user,
                session: data.session,
            });

            navigation.navigate('App');

        } catch (err) {
            console.error('Unexpected Login Error:', {
                error: err,
                message: err.message,
                formData: form,
            });
            Alert.alert('Login Error', err.message || 'Something went wrong');
        }
    };


    const fields = [
        { name: 'email', placeholder: 'Email', secure: false, icon: 'mail-outline' },
        { name: 'password', placeholder: 'Password', secure: true, icon: 'lock-closed-outline' },
    ];

    return (
        <LinearGradient
            colors={['#f8f9fa', '#e9ecef']}
            style={styles.gradient}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoid}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <LottieView
                            source={login}
                            autoPlay
                            loop={true}
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
                                onChangeText={(value) => handleChange(field.name, value)}
                                placeholder={field.placeholder}
                                iconName={field.icon}
                                error={errors[field.name]}
                                keyboardType={field.name === 'email' ? 'email-address' : 'default'}
                                secureTextEntry={field.secure}
                                showPassword={field.name === 'password' ? showPassword : undefined}
                                togglePasswordVisibility={field.name === 'password' ? () => setShowPassword(!showPassword) : undefined}
                            />
                        ))}
                    </View>
                    <ButtonComponent
                        title="Login"
                        onPress={handleLogin}
                    />
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
    gradient: {
        flex: 1,
        paddingHorizontal: 10,
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 30,
        paddingHorizontal: 20,
    },
    header: {
        alignItems: 'center',
        paddingTop: height * 0.05,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    animation: {
        width: width * 0.7,
        height: width * 0.7,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2d3436',
    },
    subtitle: {
        fontSize: 16,
        color: '#636e72',
        marginTop: 5,
    },
    formContainer: {
        marginTop: 10,
    },
    inputWrapper: {
        marginBottom: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#dfe6e9',
    },
    inputError: {
        borderColor: '#ff6b6b',
    },
    input: {
        flex: 1,
        color: '#2d3436',
        fontSize: 16,
        paddingVertical: 0,
    },
    icon: {
        marginRight: 10,
    },
    eyeIcon: {
        marginLeft: 10,
    },
    button: {
        backgroundColor: '#4A80F0',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 25,
        shadowColor: '#4A80F0',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    registerText: {
        color: '#636e72',
        fontSize: 14,
    },
    registerLink: {
        color: '#4A80F0',
        fontWeight: 'bold',
        fontSize: 14,
    },
    error: {
        color: '#ff6b6b',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    socialLoginContainer: {
        alignItems: 'center',
    },
    orText: {
        fontSize: 14,
        color: '#636e72',
    },
    socialButton: {
        width: '100%',  // Ensure it's the same width as the Login button
        marginTop: 10,
    }
});

export default LoginScreen;


const commonShadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
};
