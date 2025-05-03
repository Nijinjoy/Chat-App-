import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { logo } from '../../assets/images';
import { chatAnimation, loadingDots } from '../../assets/animations';
import { AUTH_ROUTES } from '../../navigation/AuthStack';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    const fadeAnim = new Animated.Value(0);
    const logoScale = new Animated.Value(0.5);
    const textSlide = new Animated.Value(height * 0.1);
    const bgColor = new Animated.Value(0);

    const backgroundColor = bgColor.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ffffff', '#f8f9fa']
    });

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: true,
                }),
            Animated.timing(textSlide, {
                toValue: 0,
                duration: 800,
                easing: Easing.out(Easing.exp),
                useNativeDriver: true,
            }),
                Animated.timing(bgColor, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: false,
                }),
            ]),
        ]).start();

        // Navigate to Welcome screen after animation completes
        const timer = setTimeout(() => {
            navigation.replace('Auth');
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <Animated.View style={[styles.container, { backgroundColor }]}>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ scale: logoScale }] }}>
                <LottieView
                    source={chatAnimation}
                    autoPlay
                    loop={false}
                    style={styles.logoAnimation}
                    resizeMode="contain"
                />
            </Animated.View>

            <Animated.View style={[styles.textContainer, { transform: [{ translateY: textSlide }] }]}>
                <Text style={styles.title}>WeChat</Text>
                <Text style={styles.subtitle}>Secure messaging for everyone</Text>
            </Animated.View>

            <View style={styles.loadingContainer}>
                <LottieView
                    source={loadingDots}
                    autoPlay
                    loop
                    style={styles.loadingAnimation}
                />
                <Text style={styles.loadingText}>Getting things ready...</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    logoAnimation: {
        width: width * 0.5,
        height: width * 0.5,
    },
    textContainer: {
        alignItems: 'center',
    // marginTop: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#2d3436',
        // marginBottom: 8,
        fontFamily: 'System', 
    },
    subtitle: {
        fontSize: 16,
        color: '#636e72',
        fontWeight: '500',
    },
    loadingContainer: {
        position: 'absolute',
        bottom: height * 0.15,
        alignItems: 'center',
    },
    loadingAnimation: {
        width: 80,
        height: 40,
    },
    loadingText: {
        // marginTop: 8,
        fontSize: 14,
        color: '#b2bec3',
        fontWeight: '500',
    },
});

export default SplashScreen;
