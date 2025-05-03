import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const VerificationScreen = ({ route, navigation }) => {
    const { email, verificationType, userData } = route.params;
    const [otp, setOtp] = useState('');

    const handleVerify = async () => {
        if (!otp || otp.length < 6) {
            Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP');
            return;
        }

        // Implement OTP verification logic here with Supabase if needed
        Alert.alert('Verified', `OTP for ${verificationType} verified.`);
        // Navigate to next screen if needed
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Verify {verificationType === 'signup' ? 'Email' : 'Phone'}</Text>
            <Text style={styles.subtitle}>
                Enter the 6-digit OTP sent to {email}
            </Text>

            <TextInput
                style={styles.otpInput}
                placeholder="Enter OTP"
                keyboardType="numeric"
                maxLength={6}
                value={otp}
                onChangeText={setOtp}
            />

            <TouchableOpacity style={styles.button} onPress={handleVerify}>
                <Text style={styles.buttonText}>Verify</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendButton}>
                <Text style={styles.resendText}>Resend OTP</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
        textAlign: 'center',
    },
    otpInput: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#28a745',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    resendButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    resendText: {
        color: '#007bff',
        textDecorationLine: 'underline',
    },
});

export default VerificationScreen;
