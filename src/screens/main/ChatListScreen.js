import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HeaderComponent from '../../components/HeaderComponent';

const ChatListScreen = () => {
    const [search, setSearch] = useState('');
    const [chats, setChats] = useState([
        { id: '1', name: 'John Doe', lastMessage: 'Hey, how are you?', time: '10:30 AM', avatar: 'https://randomuser.me/api/portraits/men/1.jpg', unreadCount: 2 },
        { id: '2', name: 'Jane Smith', lastMessage: 'Are we meeting later?', time: '9:45 AM', avatar: 'https://randomuser.me/api/portraits/women/2.jpg', unreadCount: 0 },
        { id: '3', name: 'Alice Johnson', lastMessage: 'Let\'s grab lunch tomorrow!', time: '8:20 AM', avatar: 'https://randomuser.me/api/portraits/women/3.jpg', unreadCount: 1 },
        { id: '4', name: 'Bob Brown', lastMessage: 'Can you send me the files?', time: 'Yesterday', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', unreadCount: 0 },
    ]);

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(search.toLowerCase())
    );

    const renderChatItem = ({ item }) => (
        <TouchableOpacity style={styles.chatItem}>
            {/* Profile Picture */}
            <Image source={{ uri: item.avatar }} style={styles.avatar} />

            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.chatName}>{item.name}</Text>
                </View>
                <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            </View>

            <View style={styles.timeContainer}>
                <Text style={styles.time}>{item.time}</Text>
                {item.unreadCount > 0 && (
                    <View style={styles.unreadBadge}>
                        <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <HeaderComponent />
            <TextInput
                style={styles.searchInput}
                placeholder="Search"
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={filteredChats}
                renderItem={renderChatItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.chatList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5e5e5',
    },
    header: {
        height: 100,
        backgroundColor: '#075E54', // WhatsApp green color
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    headerTitle: {
        fontSize: 20,
        color: '#fff',
        fontWeight: 'bold',
    },
    searchInput: {
        height: 40,
        margin: 10,
        paddingLeft: 10,
        borderRadius: 20,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    chatList: {
        paddingBottom: 20,
    },
    chatItem: {
        flexDirection: 'row',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    chatInfo: {
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
        color: '#333',
    },
    lastMessage: {
        fontSize: 14,
        color: '#777',
        marginTop: 5,
    },
    timeContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end', // Align both time and badge to the right
        justifyContent: 'flex-start',
    },
    time: {
        fontSize: 12,
        color: '#aaa',
    },
    unreadBadge: {
        backgroundColor: '#25D366',
        borderRadius: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 3,
    },
    unreadCount: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

export default ChatListScreen;

