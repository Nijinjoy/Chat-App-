import React, { useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, Dimensions } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { Ionicons } from '@expo/vector-icons';
import { email } from '../../assets/images';
import { signUp } from '../../services/authService';
import { supabase } from '../../services/supabase';
import { AUTH_ROUTES } from '../../navigation/AuthStack';
import LottieView from 'lottie-react-native';
import { register } from '../../assets/animations';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
    const [form, setForm] = useState({ fullName: '', email: '', password: '', phone: '' });
    const [phoneNumber, setPhoneNumber] = useState('');
    const phoneInput = useRef(null);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { width } = Dimensions.get('window');

    const handleChange = (name, value) => {
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
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

        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email: form.email,
                password: form.password,
                options: {
                    data: {
                        full_name: form.fullName,
                        phone: phoneNumber,
                    },
                }
            });
            console.log("data====>", data);
            if (error) {
                Alert.alert("Signup Error", error.message);
            } else {
                Alert.alert("Verify Email", "A confirmation email has been sent. Please check your inbox.");
                navigation.navigate(AUTH_ROUTES.LOGIN);
            }
        } catch (err) {
            Alert.alert("Unexpected Error", err.message);
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: 'fullName', label: 'Full Name', placeholder: 'Enter your full name', secure: false, icon: 'person-outline' },
        { name: 'email', label: 'Email', placeholder: 'Enter your email', secure: false, icon: 'mail-outline' },
        { name: 'password', label: 'Password', placeholder: 'Enter your password', secure: true, icon: 'lock-closed-outline' },
    ];

    return (
        <View style={styles.container}>
            <LottieView
                source={register}
                autoPlay
                loop={false}
                style={styles.animation}
                resizeMode="contain"
            />
            <View style={styles.inputWrapper}>
                <PhoneInput
                    ref={phoneInput}
                    defaultValue={phoneNumber}
                    defaultCode="IN"
                    layout="first"
                    onChangeFormattedText={(text) => {
                        setPhoneNumber(text);
                        handleChange('phone', text);
                    }}
                    containerStyle={styles.phoneContainer}
                    textContainerStyle={styles.phoneTextContainer}
                />
                {errors.phone && <Text style={styles.error}>{errors.phone}</Text>}
            </View>
            {fields.map((field) => (
                <View key={field.name} style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                        <Ionicons name={field.icon} size={20} color="#666" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            placeholder={field.placeholder}
                            placeholderTextColor="#999"
                            secureTextEntry={field.secure && !showPassword}
                            value={form[field.name]}
                            onChangeText={(value) => handleChange(field.name, value)}
                        />
                        {field.secure && (
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={22} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>
                    {errors[field.name] && <Text style={styles.error}>{errors[field.name]}</Text>}
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
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: 150,
        height: 150,
        alignSelf: 'center',
        marginBottom: 30,
    },
    animation: {
        width: width * 0.7,
        height: width * 0.7,
    },
    inputWrapper: {
        marginTop: 15,
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
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
    phoneContainer: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
    },
    phoneTextContainer: {
        backgroundColor: '#fff',
        borderRadius: 5,
        paddingVertical: 10,
    },
});

export default RegisterScreen;
