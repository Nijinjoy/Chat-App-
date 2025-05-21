import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Animated,
  ColorSchemeName,
  useColorScheme,
  ViewToken
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { chat, secure, share } from '../../assets/animations';
import { NavigatorScreenParams } from '@react-navigation/native';

const { width } = Dimensions.get('window');

type AuthStackParamList = {
    Register: undefined;
    Login: undefined;
  };
  
  type RootStackParamList = {
    Auth: NavigatorScreenParams<AuthStackParamList>;
  };

  //if we want to extend our properties in future,we use interface
  interface Slide{
    id:number,
    title:string,
    description:string,
    animation:object
  }
  

const slides: Slide[] = [
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

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<Slide>>(null);
  const isDark: ColorSchemeName = useColorScheme();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      navigation.replace('Auth', { screen: 'Register' });
    }
  };

  const handleSkip = () => {
    navigation.replace('Auth', { screen: 'Register' });
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setCurrentIndex(viewableItems[0].index!);
    }
  }).current;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDark === 'dark' ? '#000' : '#fff' }]}>
      {currentIndex < slides.length - 1 && (
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.slideContainer}>
            <LottieView source={item.animation} autoPlay loop style={styles.animation} />
            <Text style={[styles.title, { color: isDark === 'dark' ? '#fff' : '#333' }]}>{item.title}</Text>
            <Text style={[styles.description, { color: isDark === 'dark' ? '#aaa' : '#666' }]}>{item.description}</Text>
          </View>
        )}
      />

      <View style={styles.progressBar}>
        <View
          style={[styles.progress, { width: `${((currentIndex + 1) / slides.length) * 100}%` }]}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>
          {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 30,
    zIndex: 1,
  },
  skipText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    width: '80%',
    backgroundColor: '#ccc',
    borderRadius: 3,
    marginBottom: 20,
  },
  progress: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3,
  },
});

export default WelcomeScreen;
