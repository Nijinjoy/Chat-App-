import { supabase } from "./supabase";

// Enhanced signUp function
export const signUp = async ({ fullName, email, password, phone }) => {
    try {
        // 1. Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                phone,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
        });

        if (authError) throw authError;


        // 2. Create profile in public.profiles table
        if (authData.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                    id: authData.user.id,
                    username: email.split('@')[0], // Default username
                    full_name: fullName,
                    email,
                    phone,
                    avatar_url: null
                }]);

            if (profileError) throw profileError;
        }

        return {
            user: authData.user,
            session: authData.session,
            requiresConfirmation: !authData.session // Email confirmation required
        };
    } catch (error) {
        console.error('Signup error:', error);
        throw {
            message: error.message || 'Signup failed',
            details: error.details || null,
            code: error.code || 'unknown'
        };
    }
};


// services/authService.js
export const login = async ({ email, password }) => {
    return await supabase.auth.signInWithPassword({
        email,
        password,
    });
};

// Helper function for user-friendly error messages
const getFriendlyAuthError = (errorMessage) => {
    const errors = {
        'Invalid login credentials': 'Invalid email or password',
        'Email not confirmed': 'Please verify your email first',
        'User already registered': 'Account already exists',
        'Too many requests': 'Too many attempts, please try later'
    };
    return errors[errorMessage] || errorMessage;
};

// Session management functions
export const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;

    if (data.user) {
        // Get profile data
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

        return {
            ...data.user,
            profile: profile || null
        };
    }
    return null;
};

// Session management functions
export const getCurrentSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
};

export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
};

// Password reset function
export const resetPassword = async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
};

// Update user profile
export const updateProfile = async (updates) => {
    const { data: { user } } = await supabase.auth.getUser();

    const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

    if (error) throw error;
    return data;
};

