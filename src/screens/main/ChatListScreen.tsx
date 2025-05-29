import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import HeaderComponent from '../../components/HeaderComponent';

const dummyChats = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: '',
    lastMessage: 'Hey, how are you?',
    time: '10:45 AM',
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: '',
    lastMessage: 'Let’s catch up later!',
    time: '09:30 AM',
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Catherine Adams',
    avatar: '',
    lastMessage: 'Thanks for the update.',
    time: 'Yesterday',
    unreadCount: 1,
  },
];

const ChatItem = ({ chat, onPress }) => (
  <TouchableOpacity style={styles.chatItem} onPress={onPress}>
    <View style={styles.avatarPlaceholder}>
      <Text style={styles.avatarText}>{chat.name[0]}</Text>
    </View>
    <View style={styles.chatContent}>
      <View style={styles.chatHeader}>
        <Text style={styles.chatName}>{chat.name}</Text>
        <Text style={styles.chatTime}>{chat.time}</Text>
      </View>
      <View style={styles.chatFooter}>
        <Text style={styles.chatMessage} numberOfLines={1}>
          {chat.lastMessage}
        </Text>
        {chat.unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{chat.unreadCount}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const ChatListScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChats = dummyChats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="grey" barStyle="light-content" />
      <HeaderComponent
  title="Chats"
  showBack={false}
  rightIcons={
    <TouchableOpacity onPress={() => console.log("New Chat")}>
      <Ionicons name="chatbubble-ellipses-outline" size={24} color="white" />
    </TouchableOpacity>
  }
/>
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem chat={item} onPress={() => console.log('Chat pressed:', item.name)} />
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#fff' }}>No chats found</Text>
        }
      />
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="chatbubble" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomColor: '#eee',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#075E54',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ffffff', 
  },
  chatTime: {
    fontSize: 12,
    color: 'gray',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatMessage: {
    color: 'gray',
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#25D366',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  headerWrapper: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20,
    paddingBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff', 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 13,
    marginTop: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
});
