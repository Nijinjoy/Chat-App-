import { View, Text, Image, StyleSheet, Animated, Easing } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { logo } from '../../assets/images';

const SplashScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const logoScale = useRef(new Animated.Value(0.8)).current;
    const textSlide = useRef(new Animated.Value(30)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;
    const circlePulse = useRef(new Animated.Value(0)).current;

    const colors = {
        bg: '#1E1E2D',
        primary: '#07C160', // WhatsApp-like green
        text: '#FFFFFF',
        mutedText: 'rgba(255,255,255,0.7)'
    };

    useEffect(() => {
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
            }),
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
            )
        ]).start();

        setTimeout(() => {
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 2000,
                easing: Easing.linear,
                useNativeDriver: false
            }).start();
        }, 1000);
        setTimeout(() => {
            navigation.replace('WelcomeScreen');
        }, 3000);
    }, []);

    const circleSize = circlePulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 20]
    });

    const circleOpacity = circlePulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0]
    });

    return (
        <View style={[styles.container, { backgroundColor: colors.bg }]}>
            <Animated.View style={[
                styles.circle,
                {
                    opacity: circleOpacity,
                    transform: [{ scale: circleSize }],
                    borderColor: colors.primary
                }
            ]} />
            <Animated.View style={{
                opacity: fadeAnim,
                transform: [{ scale: logoScale }],
                marginBottom: 20
            }}>
                <Image
                    source={logo}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </Animated.View>
            <Animated.View style={{ transform: [{ translateY: textSlide }] }}>
                <Text style={[styles.appName, { color: colors.text }]}>WeChat</Text>
                <Text style={[styles.tagline, { color: colors.mutedText }]}>
                    Connect. Chat. Explore.
                </Text>
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circle: {
        position: 'absolute',
        borderRadius: 1000,
        borderWidth: 1,
        width: 100,
        height: 100,
    },
    logo: {
        width: 100,
        height: 100,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    tagline: {
        fontSize: 16,
        textAlign: 'center'
    },
    progressContainer: {
        position: 'absolute',
        bottom: 50,
        width: '40%',
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 2,
        overflow: 'hidden'
    },
    progressBar: {
        height: '100%',
        borderRadius: 2
    }
});

export default SplashScreen;
