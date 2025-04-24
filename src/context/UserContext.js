import React, { createContext, useState, useContext } from 'react';

// Create a User Context
const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Default value is null (no user logged in)

    // Function to update user details (this can be used to set user after login)
    const setUserDetails = (userData) => {
        setUser(userData);
    };

    return (
        <UserContext.Provider value={{ user, setUserDetails }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use the UserContext
export const useUser = () => {
    return useContext(UserContext);
};
