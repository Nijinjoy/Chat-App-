import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../services/supabase';

const ContactScreen = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get authenticated user
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) throw authError;

            if (!user) throw new Error('No authenticated user found');

            // Fetch profile from custom users table by uid
            const { data, error: profileError } = await supabase
                .from('users')
                .select('*') // Select all columns or specify the ones you need
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;
            if (!data) throw new Error('User profile not found');

            setUserProfile(data);
        } catch (error) {
            console.error('Error fetching user profile:', error.message);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" />
                <Text>Loading user profile...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.error}>Error: {error}</Text>
            </View>
        );
    }

    if (!userProfile) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text>User profile not found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Profile</Text>

            <View style={styles.profileItem}>
                <Text style={styles.label}>UID:</Text>
                <Text style={styles.value}>{userProfile.uid}</Text>
            </View>

            <View style={styles.profileItem}>
                <Text style={styles.label}>Display Name:</Text>
                <Text style={styles.value}>{userProfile.display_name || 'Not set'}</Text>
            </View>

            <View style={styles.profileItem}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{userProfile.email}</Text>
            </View>

            <View style={styles.profileItem}>
                <Text style={styles.label}>Phone:</Text>
                <Text style={styles.value}>{userProfile.phone || 'Not provided'}</Text>
            </View>

            <View style={styles.profileItem}>
                <Text style={styles.label}>Provider:</Text>
                <Text style={styles.value}>{userProfile.provider_type}</Text>
            </View>

            <View style={styles.profileItem}>
                <Text style={styles.label}>Member Since:</Text>
                <Text style={styles.value}>
                    {new Date(userProfile.created_at).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );
};

export default ContactScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    profileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        fontWeight: '600',
        color: '#555',
    },
    value: {
        flex: 1,
        textAlign: 'right',
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
});
