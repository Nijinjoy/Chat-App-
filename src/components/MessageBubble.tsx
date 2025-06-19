import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const MessageBubble = ({ text, time, sender, replyTo, onReply }) => {
  const isMe = sender === 'me';

  return (
    <TouchableOpacity
      onLongPress={() => onReply && onReply()}
      activeOpacity={0.8}
      style={[styles.message, isMe ? styles.myMessage : styles.otherMessage]}
    >
      {/* Show reply preview if exists */}
      {replyTo && (
        <View style={styles.replyContainer}>
          <Text style={styles.replyLabel}>Replying to:</Text>
          <Text style={styles.replyText} numberOfLines={1}>
            {replyTo}
          </Text>
        </View>
      )}
      <Text style={styles.text}>{text}</Text>
      <Text style={styles.time}>{time}</Text>
    </TouchableOpacity>
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
  replyContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#888',
    paddingLeft: 6,
    marginBottom: 4,
  },
  replyLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#555',
  },
  replyText: {
    fontSize: 12,
    color: '#333',
  },
  text: {
    fontSize: 16,
  },
  time: {
    fontSize: 10,
    textAlign: 'right',
    marginTop: 4,
    color: '#555',
  },
});

export default MessageBubble;

