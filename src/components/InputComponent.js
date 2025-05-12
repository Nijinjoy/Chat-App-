import React from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InputComponent = ({
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    showPassword,
    togglePasswordVisibility,
    iconName,
    error,
    keyboardType = 'default',
}) => {
    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer, error && styles.inputError]}>
                <Ionicons name={iconName} size={20} color={error ? '#ff6b6b' : '#666'} style={styles.icon} />
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#999"
                    secureTextEntry={secureTextEntry && !showPassword}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType={keyboardType}
                />
                {secureTextEntry && (
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    inputError: {
        borderColor: '#ff6b6b',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#2d3436',
        fontSize: 16,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
});

export default InputComponent;
