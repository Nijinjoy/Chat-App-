// import { supabase } from "./supabase";
import { supabase } from "./supabase";

// services/authService.js
export const signUp = async ({ fullName, email, password, phone }) => {
    return await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                phone,
            },
        }
    });
};


// services/authService.js
export const login = async ({ email, password }) => {
    return await supabase.auth.signInWithPassword({
        email,
        password,
    });
};
