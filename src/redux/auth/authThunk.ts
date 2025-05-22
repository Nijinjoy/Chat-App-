// Contains async functions. Should be authThunk.ts
// redux/auth/authThunk.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../services/supabase';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return rejectWithValue(error.message);
    return data.user;
  }
);
