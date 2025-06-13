import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ text, time, sender }) => {
  const isMe = sender === 'me';
  return (
    <View style={[styles.message, isMe ? styles.myMessage : styles.otherMessage]}>
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    maxWidth: '75%',
    borderRadius: 10,
    marginVertical: 4,
    padding: 10,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF',
  },
  text: {
    fontSize: 16,
  },
  time: {
    fontSize: 10,
    textAlign: 'right',
    marginTop: 4,
  },
});

export default MessageBubble;
