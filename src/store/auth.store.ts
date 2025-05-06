import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/supabase';

// Define proper types for your user and session
interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    phone?: string;
  };
  // Add other user properties you use
}

interface Session {
  access_token: string;
  refresh_token: string;
  // Add other session properties you use
}

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signUp: (email: string, password: string, userData: { full_name: string; phone: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ user: User; session: Session }>;
  signOut: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void; // New helper method
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      error: null,
      
      signUp: async (email, password, userData) => {
        try {
          set({ loading: true, error: null });
          
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: userData.full_name,
                phone: userData.phone,
              },
            },
          });

          if (error) throw error;
          if (!data.user) throw new Error('User creation failed');

          set({
            user: data.user,
            session: data.session,
            loading: false,
          });

          return data;
        } catch (err: any) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      signIn: async (email, password) => {
        try {
          set({ loading: true, error: null });
          
          const { data, error } = await supabase.auth.signInWithPassword({ 
            email, 
            password 
          });

          if (error) throw error;
          if (!data.user || !data.session) throw new Error('Authentication failed');

          set({
            user: data.user,
            session: data.session,
            loading: false,
          });

          return data;
        } catch (err: any) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      signOut: async () => {
        try {
          set({ loading: true });
          
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          // Clear local state
          set({
            user: null,
            session: null,
            loading: false,
            error: null,
          });

          // Clear persisted data
          await AsyncStorage.removeItem('auth-storage');
        } catch (err: any) {
          set({ error: err.message, loading: false });
          throw err;
        }
      },

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Optional: Only persist specific fields
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);
