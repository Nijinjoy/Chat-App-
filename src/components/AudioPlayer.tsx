import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

const AudioPlayer = ({ uri, sender }: { uri: string; sender: 'me' | 'other' }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = async () => {
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri });
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isPlaying) setIsPlaying(false);
      });
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  return (
    <View style={{ padding: 10, alignSelf: sender === 'me' ? 'flex-end' : 'flex-start' }}>
      <TouchableOpacity onPress={handlePlayPause} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={isPlaying ? 'pause' : 'play'} size={24} color="#000" />
        <Text style={{ marginLeft: 8 }}>Voice Message</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AudioPlayer;
