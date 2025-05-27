import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

interface RegisterForm {
  email: string;
  password: string;
  fullName: string;
}

interface RegisterResult {
  data?: any;
  insertData?: any;
  warning?: string;
  error?: string;
}

interface SignOutResult {
  success: boolean;
  error?: string;
}

export const registerUser = async (
  form: RegisterForm,
  phoneNumber: string
): Promise<RegisterResult> => {
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
        warning: 'User already exists. Please log in instead.',
      };
    }

    const { error: insertError, data: insertData } = await supabase
      .from('users')
      .upsert([
        {
          id: data.user.id,
          full_name: fullName,
          email,
        },
      ]);

    if (insertError) {
      return { error: insertError.message };
    }
    return { data, insertData };
  } catch (err: any) {
    console.error('[AuthService] Registration Error:', err);
    return {
      error: err.message || 'An unexpected error occurred during registration.',
    };
  }
};

export const signOut = async (): Promise<SignOutResult> => {
  try {
    console.log('[AuthService] Starting sign-out process');
    const { error: supabaseError } = await supabase.auth.signOut();
    if (supabaseError) {
      console.error('[AuthService] Supabase sign-out error:', supabaseError);
      return { success: false, error: supabaseError.message };
    }

    await AsyncStorage.multiRemove([
      'auth_token',
      'user_profile',
      'session_data',
    ]);

    console.log('[AuthService] Sign-out completed successfully');
    return { success: true };
  } catch (error: any) {
    console.error('[AuthService] Sign-out failed:', error);
    return {
      success: false,
      error: error.message || 'Failed to sign out',
    };
  }
};
