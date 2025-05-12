import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';  // Import Swipeable

const ChatItem = ({ chat, onPress, onSwipeRight }) => {

    const renderRightActions = () => (
        <View style={styles.swipeActions}>
            <TouchableOpacity style={styles.swipeAction} onPress={() => onSwipeRight(chat.id)}>
                <Text style={styles.swipeActionText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <Swipeable renderRightActions={renderRightActions}>
            <TouchableOpacity style={styles.chatItem} onPress={onPress}>
                <Image source={{ uri: chat.avatar }} style={styles.avatar} />
                <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                        <Text style={styles.chatName}>{chat.name}</Text>
                    </View>
                    <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.time}>{chat.time}</Text>
                    {chat.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Swipeable>
    );
};

const styles = StyleSheet.create({
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
        alignItems: 'flex-end',
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
        marginTop: 3,
    },
    unreadCount: {
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

export default ChatItem;
