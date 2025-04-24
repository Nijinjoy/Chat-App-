import React, { useState, useRef } from 'react';
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
    Platform
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import ChatItem from '../../components/ChatItem';
import {
    collection,
    addDoc,
    serverTimestamp,
    setDoc,
    doc,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { getAuth } from 'firebase/auth';

const ChatListScreen = () => {
    const [searchMode, setSearchMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChats, setSelectedChats] = useState([]);
    const [headerTitle, setHeaderTitle] = useState('WhatsApp');
    const scrollY = useRef(new Animated.Value(0)).current;

    const [chats, setChats] = useState([
        {
            id: '1',
            name: 'John Doe',
            lastMessage: 'Hey, how are you doing?',
            time: '10:30 AM',
            unread: 2,
            avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
            isOnline: true
        },
    ]);

    const headerHeight = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [100, 60],
        extrapolate: 'clamp',
    });

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 30],
        outputRange: [1, 0.9],
        extrapolate: 'clamp',
    });

    const toggleSearch = () => {
        setSearchMode(!searchMode);
        if (!searchMode) {
            setSearchQuery('');
            setSelectedChats([]);
        }
    };

    const toggleChatSelection = (chatId) => {
        setSelectedChats(prev =>
            prev.includes(chatId)
                ? prev.filter(id => id !== chatId)
                : [...prev, chatId]
    );
    };

    const exitSelectionMode = () => {
        setSelectedChats([]);
    };

    const createTestChats = async () => {

    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#075E54" barStyle="light-content" />
            <Animated.View style={[
                styles.header,
                {
                    height: headerHeight,
                    opacity: headerOpacity,
                    backgroundColor: selectedChats.length > 0 ? '#075E54' : '#075E54',
                }
            ]}>
                {selectedChats.length > 0 ? (
                    <View style={styles.selectionHeader}>
                        <TouchableOpacity onPress={exitSelectionMode}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>

                        <Text style={styles.selectionCount}>
                            {selectedChats.length}
                        </Text>

                        <View style={styles.selectionActions}>
                            <TouchableOpacity style={styles.headerButton}>
                                <Feather name="archive" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerButton}>
                                <MaterialIcons name="delete" size={20} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerButton}>
                                <Feather name="more-vertical" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : searchMode ? (
                    <View style={styles.searchHeader}>
                        <TouchableOpacity onPress={toggleSearch}>
                            <Ionicons name="arrow-back" size={24} color="white" />
                            </TouchableOpacity>

            <TextInput
                                style={styles.searchInput}
                                placeholder="Search..."
                                placeholderTextColor="rgba(255,255,255,0.7)"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                autoFocus
                            />

                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <MaterialIcons
                                name="close"
                                size={20}
                                color={searchQuery ? 'white' : 'transparent'}
                            />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.defaultHeader}>
                        <Text style={styles.headerTitle}>{headerTitle}</Text>
                        <View style={styles.headerActions}>
                            <TouchableOpacity style={styles.headerButton}>
                                <Ionicons name="camera-outline" size={22} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.headerButton} onPress={toggleSearch}>
                                <Ionicons name="search" size={20} color="white" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.headerButton} onPress={createTestChats}>
                                <Feather name="more-vertical" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Animated.View>

            {/* Chat List */}
            <FlatList
                data={chats}
                renderItem={({ item }) => (
                    <ChatItem
                        chat={item}
                        isSelected={selectedChats.includes(item.id)}
                        onSelect={toggleChatSelection}
                    />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.chatList}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
            />
            <TouchableOpacity style={styles.fab} onPress={createTestChats}>
                <Ionicons name="chatbubble" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#075E54',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        paddingHorizontal: 15,
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    defaultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    searchHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    selectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerButton: {
        marginLeft: 20,
    },
    searchInput: {
        flex: 1,
        color: 'white',
        fontSize: 18,
        marginLeft: 10,
        paddingVertical: 5,
    },
    selectionCount: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 20,
    },
    selectionActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatList: {
        paddingBottom: 20,
    },
    fab: {
        position: 'absolute',
        bottom: 25,
        right: 25,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#25D366',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
});

export default ChatListScreen;
