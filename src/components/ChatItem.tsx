import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const ChatItem = ({ user, onPress, onSwipeRight }) => {
  const renderRightActions = () => (
    <View style={styles.swipeActions}>
      <TouchableOpacity style={styles.swipeAction} onPress={() => onSwipeRight(user.id)}>
        <Text style={styles.swipeActionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const hasAvatar = !!user.avatar_url;

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <TouchableOpacity style={styles.chatItem} onPress={onPress}>
        {hasAvatar ? (
          <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>{user.full_name ? user.full_name[0].toUpperCase() : 'U'}</Text>
          </View>
        )}
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{user.full_name || user.email}</Text>
            <Text style={styles.chatTime}>{user.lastMessageTime || '2 June 2025'}</Text>
          </View>
          <View style={styles.chatFooter}>
            <Text style={styles.chatMessage} numberOfLines={1}>
              {user.lastMessage || 'Hello users'}
            </Text>
            {user.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{user.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

export default ChatItem;

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  avatarPlaceholder: {
    backgroundColor: '#bbb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color:'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'white',
  },
  chatTime: {
    fontSize: 12,
    color: '#aaa',
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  chatMessage: {
    flex: 1,
    fontSize: 14,
    color: '#777',
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 10,
  },
  unreadText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  swipeActions: {
    width: 75,
    justifyContent: 'center',
    backgroundColor: '#f44336',
  },
  swipeAction: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  swipeActionText: {
    color: '#fff',
    fontWeight: 'bold',
    padding: 10,
  },
});
