import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { logo } from '../../assets/images';
import { useUser } from '../../context/UserContext';

const SplashScreen = ({ navigation }) => {
    // Animation refs and context
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const textSlide = useRef(new Animated.Value(30)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const circlePulse = useRef(new Animated.Value(0)).current;
    const { user, authChecked } = useUser();

    // Color scheme
    const colors = {
        bg: '#1E1E2D',
        primary: '#07C160',
        text: '#FFFFFF',
        mutedText: 'rgba(255,255,255,0.7)'
    };

    // Animation setup
    useEffect(() => {
        // Pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(circlePulse, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: false
                }),
                Animated.timing(circlePulse, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: false
                })
            ])
        ).start();

        // Main animation sequence
        Animated.parallel([
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true
                }),
                Animated.spring(logoScale, {
                    toValue: 1.1,
                    friction: 3,
                    useNativeDriver: true
                }),
                Animated.timing(logoScale, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true
                })
            ]),
            Animated.timing(textSlide, {
                toValue: 0,
                duration: 1000,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true
            })
        ]).start();
    }, []);

    // Navigation handler
    useEffect(() => {
        if (authChecked) {
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: false
            }).start(() => {
                navigation.replace(
                    user ? 'App' : 'Auth',
                    user ? {} : { screen: 'Welcome' }
                );
            });
        }
    }, [user, authChecked]);

    // Animation interpolations
    const circleSize = circlePulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20]
    });

    const circleOpacity = circlePulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0]
    });

    return (
        <View style={styles.container}>
            {/* Background circle animation */}
            <Animated.View style={[
                styles.circle,
                {
                    opacity: circleOpacity,
                    transform: [{ scale: circleSize }],
                    borderColor: colors.primary
                }
            ]} />

            {/* Logo with animation */}
            <Animated.View style={{
                opacity: fadeAnim,
                transform: [{ scale: logoScale }],
                marginBottom: 20
            }}>
                <Image source={logo} style={styles.logo} resizeMode="contain" />
            </Animated.View>

            {/* App info with animation */}
            <Animated.View style={{ transform: [{ translateY: textSlide }] }}>
                <Text style={[styles.appName, { color: colors.text }]}>WeChat</Text>
                <Text style={[styles.tagline, { color: colors.mutedText }]}>
                    Connect. Chat. Explore.
                </Text>

                {/* User info display - only shows when user exists */}
                {user && (
                    <View style={styles.userInfoContainer}>
                        <Text style={styles.userInfoText}>
                            Email: <Text style={{ color: colors.primary }}>{user.email}</Text>
                        </Text>
                        <Text style={styles.userInfoText}>
                            User ID: <Text style={{ color: colors.primary }}>
                                {user.uid.substring(0, 10)}...
                            </Text>
                        </Text>
                    </View>
                )}
            </Animated.View>

            {/* Progress bar */}
            <View style={styles.progressContainer}>
                <Animated.View style={[
                    styles.progressBar,
                    {
                        width: progressAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%']
                        }),
                        backgroundColor: colors.primary
                    }
                ]} />
            </View>
        </View>
    );
};

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        position: 'absolute',
        borderRadius: 100,
        borderWidth: 1,
    },
    logo: {
        width: 120,
        height: 120,
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tagline: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 8,
    },
    progressContainer: {
        width: '60%',
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginTop: 40,
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
    },
    userInfoContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        alignItems: 'center',
    },
    userInfoText: {
        fontSize: 12,
        marginVertical: 4,
        color: '#FFFFFF',
    },
});

export default SplashScreen;
