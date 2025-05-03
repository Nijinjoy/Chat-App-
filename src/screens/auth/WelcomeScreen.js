import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { chat, chatAnimation, secure, share } from '../../assets/animations';

const { width } = Dimensions.get('window');

const WelcomeScreen = () => {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);

    const slides = [
        {
            id: 1,
            title: 'Connect with Friends',
            description: 'Chat with your friends and family in real-time',
            animation: chat,
        },
        {
            id: 2,
            title: 'Secure Messaging',
            description: 'End-to-end encryption for all your conversations',
            animation: secure,
        },
        {
            id: 3,
            title: 'Share Moments',
            description: 'Send photos, videos and documents instantly',
            animation: share,
        },
    ];

    const scrollTo = () => {
        if (currentIndex < slides.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            navigation.navigate('Auth');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.slideContainer}>
                <LottieView
                    source={slides[currentIndex].animation}
                    autoPlay
                    loop
                    style={styles.animation}
                />
                <Text style={styles.title}>{slides[currentIndex].title}</Text>
                <Text style={styles.description}>{slides[currentIndex].description}</Text>
            </View>

            <Paginator data={slides} currentIndex={currentIndex} />

            <TouchableOpacity style={styles.button} onPress={scrollTo}>
                <Text style={styles.buttonText}>
                    {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// Create a new file Paginator.js
const Paginator = ({ data, currentIndex }) => {
    return (
        <View style={paginatorStyles.container}>
            {data.map((_, i) => (
                <View
                    key={i.toString()}
                    style={[
                        paginatorStyles.dot,
                        i === currentIndex ? paginatorStyles.dotActive : null,
                    ]}
        />
            ))}
        </View>
    );
};

const paginatorStyles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        height: 64,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dot: {
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 8,
        width: 10,
    },
    dotActive: {
        backgroundColor: '#007AFF',
        width: 20,
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    slideContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.9,
    },
    animation: {
        width: width * 0.8,
        height: width * 0.8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 32,
        marginBottom: 10,
        textAlign: 'center',
        color: '#333',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        paddingHorizontal: 40,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 25,
        marginBottom: 50,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default WelcomeScreen;
