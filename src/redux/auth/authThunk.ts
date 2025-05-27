// redux/auth/authThunk.ts Handles async Supabase + AsyncStorage
import { createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../services/supabase';
import { User } from '@supabase/supabase-js';

interface LoginPayload {
  email: string;
  password: string;
}

// Login Thunk
export const loginUser = createAsyncThunk<User, LoginPayload, { rejectValue: string }>(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error || !data.user) {
        return rejectWithValue(error?.message || 'Login failed');
      }

      // Save session and user info for persistence
      await AsyncStorage.setItem('auth_token', JSON.stringify(data.session));
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      return data.user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login error');
    }
  }
);

interface RegisterPayload {
  email: string;
  password: string;
  fullName?: string;
  phone: string;
}

// Register Thunk
export const registerUser = createAsyncThunk<
  User,
  RegisterPayload, 
  { rejectValue: string } 
>(
  'auth/registerUser',
  async ({ email, password, fullName, phone }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone,
          },
        },
      });

      if (error || !data.user) {
        return rejectWithValue(error?.message || 'Registration failed');
      }

      if (data?.user?.identities?.length === 0) {
        return rejectWithValue('User already exists. Please log in instead.');
      }

      // Save session and user info if session available
      if (data.session) {
        await AsyncStorage.setItem('auth_token', JSON.stringify(data.session));
      }
      await AsyncStorage.setItem('user', JSON.stringify(data.user));

      // Upsert user info in your 'users' table
      const { error: upsertError } = await supabase
        .from('users')
        .upsert([
          {
            id: data.user.id,
            full_name: fullName,
            email,
            phone,
          },
        ]);

      if (upsertError) {
        return rejectWithValue(upsertError.message);
      }

      return data.user;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Registration error');
    }
  }
);

// Sign Out Thunk
export const signOutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'auth/signOutUser',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return rejectWithValue(error.message);
      }

      // Clear stored session and user data
      await AsyncStorage.multiRemove(['auth_token', 'user']);

    } catch (err: any) {
      return rejectWithValue(err.message || 'Sign-out error');
    }
  }
);

// Fetch Current User from AsyncStorage
export const fetchCurrentUser = createAsyncThunk<User, void, { rejectValue: string }>(
  'auth/fetchCurrentUser',
  async (_, thunkAPI) => {
    try {
      const jsonValue = await AsyncStorage.getItem('user');
      if (!jsonValue) throw new Error('No user found in storage');
      return JSON.parse(jsonValue) as User;
    } catch (err) {
      return thunkAPI.rejectWithValue('User not found');
    }
  }
);
