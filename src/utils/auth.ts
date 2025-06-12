// utils/auth.ts
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { supabase } from '../services/supabase';

// Required for Expo AuthSession
WebBrowser.maybeCompleteAuthSession();

export const signInWithGoogle = async () => {
  try {
    // Generate deep link for OAuth redirect
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'your.app.scheme', // Match your app.json scheme
      path: 'auth/callback',
    });

    // Trigger Google OAuth via Supabase
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUri,
      },
    });

    if (error) throw error;

    // Open the OAuth URL in a browser
    const result = await WebBrowser.openAuthSessionAsync(
      data.url, // Supabase OAuth URL
      redirectUri // Redirect back to app
    );

    if (result.type !== 'success') {
      throw new Error('Authentication cancelled');
    }

    // Extract tokens from the redirect URL
    const { access_token, refresh_token } = AuthSession.parseRedirectResult(result);

    // Set the session in Supabase
    const { data: session, error: sessionError } = 
      await supabase.auth.setSession({
        access_token,
        refresh_token,
      });

    if (sessionError) throw sessionError;
    return session;

  } catch (error) {
    console.error('Google OAuth error:', error);
    throw error;
  }
};
