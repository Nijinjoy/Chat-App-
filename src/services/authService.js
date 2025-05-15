import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from "./supabase";
import { useAuthStore } from '../store/authStore';

export const registerUser = async (form, phoneNumber, setUser) => {
    const { email, password, fullName } = form;
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    phone: phoneNumber,
                },
            },
        });
        if (error) {
            return { error: error.message };
        }
        if (data?.user?.identities?.length === 0) {
            return {
                warning: 'User already exists. Please login instead.',
            };
        }
        const insertResponse = await supabase.from('users').upsert([
            {
                id: data.user.id,
                full_name: fullName,
                email,
            },
        ]);
        if (insertResponse.error) {
            return { error: insertResponse.error.message };
        }
        setUser(data.user);
        return { data, insertData: insertResponse.data };
    } catch (err) {
        console.error('Registration Error: ', err);
        return { error: err.message || 'An unexpected error occurred.' };
    }
};

// authService.js
const signOut = async () => {
    try {
        console.log('[AuthService] Starting sign-out process');

        // Sign out from Supabase
        const { error: supabaseError } = await supabase.auth.signOut();
        if (supabaseError) {
            console.error('[AuthService] Supabase sign-out error:', supabaseError);
            throw supabaseError;
        }

        // Clear local storage
        await AsyncStorage.multiRemove([
            'auth_token',
            'user_profile',
            'session_data'
        ]);

        console.log('[AuthService] Sign-out completed successfully');
        return { success: true };

    } catch (error) {
        console.error('[AuthService] Sign-out failed:', error);
        return {
            success: false,
            error: error.message || 'Failed to sign out'
        };
    }
};

export { signOut };

