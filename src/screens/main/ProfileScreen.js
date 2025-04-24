import React from 'react';
import { View, Text } from 'react-native';
import { useUser } from '../../context/UserContext';

const ProfileScreen = () => {
    const { user } = useUser();  // Get the user details from context

    if (!user) {
        return (
            <View>
                <Text>No user details available</Text>
            </View>
        );
    }

    return (
        <View>
            <Text>Profile Screen</Text>
            <Text>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
            {/* Display other user details here */}
        </View>
    );
};

export default ProfileScreen;
