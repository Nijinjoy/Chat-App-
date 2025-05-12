import React, { useState, useRef, useEffect } from 'react';
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
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { APP_ROUTES } from '../../navigation/AppStack';
import { supabase } from '../../services/supabase';
import ChatItem from '../../components/ChatItem';

const ChatListScreen = () => {
    const navigation = useNavigation()
    const [searchMode, setSearchMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChats, setSelectedChats] = useState([]);
    const [headerTitle, setHeaderTitle] = useState('WhatsApp');
    const scrollY = useRef(new Animated.Value(0)).current;
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentUserId, setCurrentUserId] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);

            // Get logged-in user ID
            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser();

            if (userError) {
                console.error('Failed to get logged in user:', userError.message);
                return;
            }

            setCurrentUserId(user.id);

            // Fetch all users
            const { data, error } = await supabase
                .from('users')
                .select('id, email, full_name, created_at')
                .order('full_name', { ascending: true });

            if (error) {
                console.error('Error fetching users:', error.message);
                return;
            }

            // Exclude current user
            const filteredUsers = data.filter((u) => u.id !== user.id);

            setUsers(filteredUsers);
        } catch (err) {
            console.error('Unexpected error:', err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        fetchUsers();
    }, []);      

    const toggleSearch = () => {
        setSearchMode(!searchMode);
        if (!searchMode) {
            setSearchQuery('');
            setSelectedChats([]);
        }
    };

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

    const exitSelectionMode = () => {
        setSelectedChats([]);
    };

    const handleChatPress = (user: User) => {
        if (selectedChats.length > 0) {
            setSelectedChats(prev =>
                prev.includes(user.id)
                    ? prev.filter(id => id !== user.id)
                    : [...prev, user.id]
            );
        } else {
            navigation.navigate(APP_ROUTES.CHAT_DETAIL, {
                chatId: user.id,
                chatName: user.full_name,  // This will be the username
                avatar: user.avatar || 'default-avatar-url'
            });
        }
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

                                    <TouchableOpacity style={styles.headerButton} >
                                <Feather name="more-vertical" size={20} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Animated.View>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchUsers} />
                }
                renderItem={({ item }) => {
                    const formattedTime = item.created_at
                        ? new Date(item.created_at).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        })
                        : 'Just now';

                    return (
                        <ChatItem
                            chat={{
                                avatar: item.avatar || 'default-avatar-url',
                                name: item.full_name,
                                lastMessage: item.last_message || 'No message yet',
                                time: formattedTime,
                                unreadCount: item.unread_count || 0,
                            }}
                            onPress={() => handleChatPress(item)}
                        />
                    );
                }}
                ListEmptyComponent={
                    loading ? (
                        <ActivityIndicator size="large" color="#075E54" />
                    ) : (
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>No users found</Text>
                    )
                }
            />

            <TouchableOpacity style={styles.fab}  >
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
    userItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 14,
        color: 'gray',
    },

});

export default ChatListScreen;
