import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,
    Image,
    ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { email } from '../../assets/images';
import { login } from '../../services/authService';
import { useAuthStore } from '../../store/auth.store';
import { AUTH_ROUTES } from '../../navigation/AuthStack';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const navigation = useNavigation()
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const { signIn, loading, error, setError } = useAuthStore();

    const handleChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (error) setError(null); // Clear previous auth errors
    }

    const handleLogin = async () => {
        let hasError = false;
        const newErrors = { email: '', password: '' };

        if (!form.email) {
            newErrors.email = 'Email is required';
            hasError = true;
        } else if (!form.email.includes('@')) {
            newErrors.email = 'Please enter a valid email';
            hasError = true;
        }
        if (!form.password) {
            newErrors.password = 'Password is required';
            hasError = true;
        } else if (form.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            hasError = true;
        }
        if (hasError) {
            setErrors(newErrors);
            return;
        }
        try {
            const response = await signIn(form.email, form.password);
            console.log('Login successful:', {
                user: response.user,
                session: response.session
            });
            navigation.navigate('App');
        } catch (err) {
            console.error('Login error:', {
                error: err,
                message: err.message,
                formData: form
            });
            Alert.alert(
                'Login Failed',
                err.message || 'Invalid email or password'
            );
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.imageContainer}>
                    <Image source={email} style={styles.emailImage} resizeMode="contain" />
                </View>
                <Text style={styles.title}>Sign in to Continue</Text>

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#999"
                        value={form.email}
                        onChangeText={(value) => handleChange("email", value)}
                    />
                </View>
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#999"
                        secureTextEntry={!showPassword}
                        value={form.password}
                        onChangeText={(value) => handleChange("password", value)}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#666" />
                    </TouchableOpacity>
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
                <View style={{ width: "100%", alignItems: "center" }}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Login</Text>
                        )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate(AUTH_ROUTES.REGISTER)}>
                    <Text style={styles.loginText}>
                        Don't have an account? <Text style={styles.loginLink}>Sign up</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E2D',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#FFFFFF",
        textAlign: "center",
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: "#333",
    },
    button: {
        width: "100%",
        padding: 15,
        backgroundColor: '#4A80F0',
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    loginText: {
        textAlign: "center",
        color: "#FFFFFF",
        marginTop: 15,
        fontSize: 14,
    },
    loginLink: {
        fontWeight: "bold",
        color: "#4A80F0",
    },
    imageContainer: {
        alignItems: "center",
        marginBottom: 20,
    },
    emailImage: {
        width: 200,
        height: 200,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginBottom: 10,
        marginLeft: 10,
    },
});

export default LoginScreen;
