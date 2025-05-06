// src/contexts/ThemeContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            const storedTheme = await AsyncStorage.getItem('darkMode');
            if (storedTheme !== null) {
                setDarkMode(storedTheme === 'true');
            }
        };
        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newTheme = !darkMode;
        setDarkMode(newTheme);
        await AsyncStorage.setItem('darkMode', newTheme.toString());
    };

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
