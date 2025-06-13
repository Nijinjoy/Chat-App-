import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';

const supabaseUrl: string = 'https://ovpqfvivvwdbvcopyhun.supabase.co';
const supabaseKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92cHFmdml2dndkYnZjb3B5aHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MTU3NTQsImV4cCI6MjA2MTk5MTc1NH0.7WGH_uVJbBtCVOPApxb1w7djC5_JPv_dafpDF-lelgs';

    export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: Platform.OS !== 'web',
        },
      })

      export const restoreSession = async (): Promise<Session | null> => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          return session;
        } catch (error) {
          console.error('Error restoring session:', error);
          return null;
        }
      }

      export const clearSession = async (): Promise<void> => {
        try {
          await supabase.auth.signOut();
          await AsyncStorage.removeItem('sb-ovpqfvivvwdbvcopyhun-auth-token');
        } catch (error) {
          console.error('Error clearing session:', error);
        }
      };
      
      supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event);
      });
