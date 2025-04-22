import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { Image, View, StyleSheet } from 'react-native';
import { email } from '../../assets/images';

const WelcomeScreen = ({ navigation }) => {
    return (
        <Onboarding
            onDone={() => navigation.replace('Auth', { screen: 'Register' })}
            onSkip={() => navigation.replace('Auth', { screen: 'Register' })}
            pages={[
                {
                    backgroundColor: '#E6F0FA',
                    image: <Image source={email} style={styles.image} />,
                    title: 'Welcome to ChatApp',
                    subtitle: 'Connect with friends instantly and securely.',
                },
                {
                    backgroundColor: '#F3EDF7',
                    image: <Image source={email} style={styles.image} />,
                    title: 'Privacy First',
                    subtitle: 'All messages are encrypted for your security.',
                },
                {
                    backgroundColor: '#FFF5E0',
                    image: <Image source={email} style={styles.image} />,
                    title: 'Share Moments',
                    subtitle: 'Send images, videos, and voice notes easily.',
                },
            ]}
            bottomBarColor="#FFF"
            showSkip={true}
            bottomBarHeight={50}
        />
    );
};

const styles = StyleSheet.create({
    image: {
        width: 240,
        height: 240,
    },
});

export default WelcomeScreen;
