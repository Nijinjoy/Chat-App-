import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, Dimensions, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { Ionicons } from '@expo/vector-icons';
import { AUTH_ROUTES } from '../../navigation/AuthStack';
import LottieView from 'lottie-react-native';
import { register } from '../../assets/animations';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../services/supabase';
import { registerUser } from '../../services/authService';
import useAuthStore from '../../store/authStore';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
    const { setUser } = useAuthStore();
    const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
    const [phoneNumber, setPhoneNumber] = useState('');
    const phoneInput = useRef(null);    
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false)


    const handleChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        // if (error) setError(null); 
    };

    const validate = () => {
        let valid = true;
        const newErrors = {};

        if (!form.fullName.trim()) {
            newErrors.fullName = "Full name is required";
            valid = false;
        }
        if (!form.email.includes("@")) {
            newErrors.email = "Enter a valid email";
            valid = false;
        }
        if (form.password.length < 3) {
            newErrors.password = "Password must be at least 3 characters";
            valid = false;
        }
        if (!phoneNumber || phoneNumber.length < 6) {
            newErrors.phone = "Enter a valid phone number";
            valid = false;
        }        
        setErrors(newErrors);
        return valid;
    }

    const handleRegister = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
            const result = await registerUser(form, phoneNumber, setUser);
            console.log("result====>", result);

            if (result?.warning) {
                setLoading(false);
                Alert.alert('Email Exists', result.warning);
                navigation.navigate(AUTH_ROUTES.LOGIN);
                return;
            }

            if (result?.error) {
                setLoading(false);
                console.log('Registration error:', result.error.message);
                Alert.alert('Registration Error', result.error.message);
                return;
            }

            setLoading(false);
            Alert.alert(
                'Verify Email',
                'A confirmation email has been sent. Please check your inbox.'
            );
            navigation.navigate(AUTH_ROUTES.LOGIN);
        } catch (err) {
            setLoading(false);
            console.error('Registration error:', err);
            Alert.alert('Registration Error', err.message || 'Something went wrong');
        }
    };


    const fields = [
        { name: 'fullName', placeholder: 'Full name', secure: false, icon: 'person-outline' },
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
                            source={register}
                            autoPlay
                            loop={false}
                            style={styles.animation}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Join our community today</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputWrapper}>
                            <PhoneInput
                                ref={phoneInput}
                                defaultValue={phoneNumber}
                                defaultCode="US"
                                layout="first"
                                onChangeFormattedText={(text) => {
                                    setPhoneNumber(text);
                                    handleChange('phone', text);
                                }}
                                containerStyle={styles.phoneContainer}
                                textContainerStyle={styles.phoneTextContainer}
                                textInputStyle={styles.phoneInput}
                                codeTextStyle={styles.phoneCode}
                                flagButtonStyle={styles.flagButton}
                            />
                            {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
                        </View>

                        {fields.map((field) => (
                            <View key={field.name} style={styles.inputWrapper}>
                                <Text style={styles.label}>{field.label}</Text>
                                <View style={[
                                    styles.inputContainer,
                                    errors[field.name] && styles.inputError
                                ]}>
                                    <Ionicons
                                        name={field.icon}
                                        size={20}
                                        color={errors[field.name] ? '#ff6b6b' : '#666'}
                                        style={styles.icon}
                                    />
                                    <TextInput
                                        style={styles.input}
                                        placeholder={field.placeholder}
                                        placeholderTextColor="#999"
                                        secureTextEntry={field.secure &&
                                            (field.name === 'password' ? !showPassword : !showConfirmPassword)}
                                        value={form[field.name]}
                                        onChangeText={(value) => handleChange(field.name, value)}
                                        autoCapitalize={field.name === 'fullName' ? 'words' : 'none'}
                                        keyboardType={field.name === 'email' ? 'email-address' : 'default'}
                                    />
                                    {field.secure && (
                                        <TouchableOpacity
                                            onPress={() =>
                                                field.name === 'password'
                                                    ? setShowPassword(!showPassword)
                                                    : setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            style={styles.eyeIcon}
                                        >
                                            <Ionicons
                                                name={
                                                    (field.name === 'password' ? showPassword : showConfirmPassword)
                                                        ? "eye-off-outline"
                                                        : "eye-outline"
                                                }
                                                size={22}
                                                color="#666"
                                            />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {errors[field.name] && <Text style={styles.error}>{errors[field.name]}</Text>}
                            </View>
                        ))}

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleRegister}
                            disabled={loading}
                            activeOpacity={0.8}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Register</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate(AUTH_ROUTES.LOGIN)}>
                                <Text style={styles.loginLink}>Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    keyboardAvoid: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    header: {
        alignItems: 'center',
        paddingTop: height * 0.05,
        paddingBottom: 20,
    },
    animation: {
        width: width * 0.7,
        height: width * 0.5,
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
        paddingHorizontal: 18,
        marginTop: 10,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        color: '#636e72',
        fontSize: 14,
    },
    loginLink: {
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
    phoneContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dfe6e9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    phoneTextContainer: {
        backgroundColor: 'transparent',
        borderRadius: 12,
        paddingVertical: 0,
    },
    phoneInput: {
        height: 50,
        color: '#2d3436',
        fontSize: 16,
    },
    phoneCode: {
        color: '#2d3436',
    },
    flagButton: {
        width: 60,
    },
});

export default RegisterScreen;
