import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { email } from '../../assets/images';

const RegisterScreen = ({ navigation }) => {
    const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleRegister = () => {
        // Simple validation
        const newErrors = {};
        if (!form.fullName) newErrors.fullName = 'Name is required';
        if (!form.email.includes('@')) newErrors.email = 'Invalid email';
        if (form.password.length < 6) newErrors.password = 'Password too short';
        if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords must match';

        setErrors(newErrors);
        if (Object.keys(newErrors).length) return;

        setLoading(true);
        // Simulate registration
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Success', 'Registration successful');
            navigation.navigate('LoginScreen');
        }, 1500);
    };

    return (
        <View style={styles.container}>
            <Image source={email} style={styles.image} />

            {['fullName', 'email', 'password', 'confirmPassword'].map((field) => (
                <View key={field}>
                    <View style={styles.inputContainer}>
                        <Ionicons
                            name={
                                field === 'fullName' ? 'person-outline' :
                                    field.includes('password') ? 'lock-closed-outline' : 'mail-outline'
                            }
                            size={20}
                            color="#666"
                            style={styles.icon}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={
                                field === 'confirmPassword' ? 'Confirm Password' :
                                    field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')
                            }
                            placeholderTextColor="#999"
                            secureTextEntry={field.includes('password') && !showPassword}
                            value={form[field]}
                            onChangeText={(value) => handleChange(field, value)}
                        />
                        {field.includes('password') && (
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>
                    {errors[field] && <Text style={styles.error}>{errors[field]}</Text>}
                </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Register</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
                <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Login</Text></Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E2D',
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginVertical: 8,
    },
    input: {
        flex: 1,
        color: '#333',
    },
    icon: {
        marginRight: 10,
    },
    button: {
        backgroundColor: '#4A80F0',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    loginText: {
        color: 'white',
        textAlign: 'center',
        marginTop: 15,
    },
    loginLink: {
        color: '#4A80F0',
        fontWeight: 'bold',
    },
    error: {
        color: '#ff6b6b',
        fontSize: 12,
        marginBottom: 5,
    },
});

export default RegisterScreen;
