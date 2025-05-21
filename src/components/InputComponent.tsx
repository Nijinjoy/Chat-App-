import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInputProps,
    KeyboardTypeOptions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputComponentProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    secureTextEntry?: boolean;
    showPassword?: boolean;
    togglePasswordVisibility?: () => void;
    iconName?: keyof typeof Ionicons.glyphMap; // Ensures valid icon names
    error?: string;
    keyboardType?: KeyboardTypeOptions;
}

const InputComponent: React.FC<InputComponentProps> = ({
    value,
    onChangeText,
    placeholder,
    secureTextEntry = false,
    showPassword = false,
    togglePasswordVisibility,
    iconName,
    error,
    keyboardType = 'default',
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.inputContainer,
                    error && styles.inputError,
                    isFocused && styles.inputFocused,
                ]}
            >
                {iconName && (
                    <Ionicons
                        name={iconName}
                        size={20}
                        color={error ? '#ff6b6b' : isFocused ? '#007AFF' : '#999'}
                        style={styles.icon}
                    />
                )}
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#aaa"
                    secureTextEntry={secureTextEntry && !showPassword}
                    style={styles.input}
                    autoCapitalize="none"
                    keyboardType={keyboardType}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                {secureTextEntry && togglePasswordVisibility && (
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        <Ionicons
                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={isFocused ? '#007AFF' : '#999'}
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
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9F9F9',
        borderRadius: 14,
        paddingHorizontal: 15,
        paddingVertical: 14,
        borderWidth: 1.5,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    inputFocused: {
        borderColor: '#007AFF',
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#ff6b6b',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#333',
        fontSize: 16,
    },
    errorText: {
        color: '#ff6b6b',
        fontSize: 13,
        marginTop: 6,
        marginLeft: 6,
    },
});

export default InputComponent;
