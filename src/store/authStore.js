import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useAuthStore = create((set) => ({
    user: null,
    session: null,

    // Function to set session and user data
    setSessionData: async ({ session, user }) => {
        set({ session, user });
        await AsyncStorage.setItem('session', JSON.stringify(session));
        await AsyncStorage.setItem('user', JSON.stringify(user));
    },

    // Function to clear session and user data
    clearSessionData: async () => {
        set({ session: null, user: null });
        await AsyncStorage.removeItem('session');
        await AsyncStorage.removeItem('user');
    },

    // Function to restore session and user data from AsyncStorage
    restoreSessionData: async () => {
        const storedSession = await AsyncStorage.getItem('session');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedSession && storedUser) {
            set({
                session: JSON.parse(storedSession),
                user: JSON.parse(storedUser),
            });
        }
    },

    // Method to set the user only (for registration/login purposes)
    setUser: (user) => set({ user }),  // Add the setUser method to update user
}));

export default useAuthStore;
