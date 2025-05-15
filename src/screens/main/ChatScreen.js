import React, { useCallback, useState, useRef, useEffect } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    Text,
    KeyboardAvoidingView,
    Platform,
    Image,
    StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import HeaderComponent from "../../components/HeaderComponent";
import { supabase } from "../../services/supabase";
import useAuthStore from "../../store/authStore";

const ChatScreen = () => {
    const navigation = useNavigation()
    const route = useRoute();
    const { chatId, chatName, } = route.params;
    const [messageText, setMessageText] = useState("");
    const [messages, setMessages] = useState([]);
    const [avatar, setAvatar] = useState('https://via.placeholder.com/120');
    const [currentUser, setCurrentUser] = useState(null); 
    const flatListRef = useRef();
    const { user } = useAuthStore();

    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching messages:', error);
            return;
        }
        setMessages(data || []);
    };

    // useEffect(() => {
    //     const fetchUserProfile = async () => {
    //         const { data, error } = await supabase.auth.getUser();
    //         if (error || !data?.user) {
    //             console.error('User not found:', error);
    //             return;
    //         }
    //         setCurrentUser(data.user);
    //         setAvatar(data.user.user_metadata?.avatar || 'https://via.placeholder.com/120');
    //     };
    //     fetchUserProfile();
    //     fetchMessages();
    // }, []);


    useEffect(() => {
        const fetchUserProfile = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error || !data?.user) {
                console.error("User not found:", error);
                return;
            }
            setCurrentUser(data.user);
            setAvatar(data.user.user_metadata?.avatar || "https://via.placeholder.com/120");
        };

        fetchUserProfile();
        fetchMessages();

        // ✅ Supabase v2 real-time subscription using .channel()
        const channel = supabase
            .channel('chat-messages-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `chat_id=eq.${chatId}`,
                },
                (payload) => {
                    console.log('New message received:', payload.new);
                    setMessages((prevMessages) => [...prevMessages, payload.new]);
        }
    )
        .subscribe();

        // Cleanup on unmount
        return () => {
            supabase.removeChannel(channel);
        };
    }, [chatId]);


    const sendMessage = async () => {
        if (!messageText.trim()) return;

        if (!currentUser || !currentUser.id) {
            console.error('❌ currentUser is null or invalid');
            return;
        }
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    chat_id: chatId,
                    sender_id: currentUser.id,
                    message: messageText,
                    created_at: new Date().toISOString(),
                },
            ])
            .select();

        if (error) {
            console.error('Error sending message:', error.message);
            return;
        }
        setMessages((prevMessages) => [...prevMessages, data[0]]);
        setMessageText('');
    };

    const formatDateLabel = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        const isToday =
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();

        const isYesterday =
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear();

        if (isToday) return "Today";
        if (isYesterday) return "Yesterday";

        return date.toLocaleDateString();
    };

    const groupMessagesWithDateSeparators = () => {
        const result = [];
        let lastDate = null;

        for (let i = 0; i < messages.length; i++) {
            const msgDate = new Date(messages[i].created_at).toDateString();
            if (msgDate !== lastDate) {
                result.push({
                    type: "separator",
                    id: `separator-${i}`,
                    dateLabel: formatDateLabel(messages[i].created_at),
                });
                lastDate = msgDate;
            }
            result.push({ ...messages[i], type: "message" });
        }

        return result;
    };


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor='#075E54' barStyle="light-content" translucent />
            <HeaderComponent
                chatName={chatName}
                avatar={avatar}
                status="online"
                showAvatar
                showBack
                showIcons
            />
            <KeyboardAvoidingView
                style={styles.screen}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={80}
            >
                <FlatList
                    ref={flatListRef}
                    data={groupMessagesWithDateSeparators()}
                    keyExtractor={(item, index) => item?.id?.toString() || `key-${index}`}
                    contentContainerStyle={{ padding: 10 }}
                    renderItem={({ item }) => {
                        if (item.type === "separator") {
                            return (
                                <View style={styles.dateSeparatorContainer}>
                                    <Text style={styles.dateSeparatorText}>{item.dateLabel}</Text>
                                </View>
                            );
                        }

                        const isCurrentUser = item.sender_id === currentUser?.id;

                        return (
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: isCurrentUser ? "flex-end" : "flex-start",
                                    marginBottom: 10,
                                }}
                            >
                                <View
                                    style={{
                                        maxWidth: "75%",
                                        padding: 12,
                                        backgroundColor: isCurrentUser ? "#dcf8c6" : "#ffffff",
                                        borderRadius: 16,
                                        borderTopRightRadius: isCurrentUser ? 0 : 16,
                                        borderTopLeftRadius: isCurrentUser ? 16 : 0,
                                        borderBottomLeftRadius: 16,
                                        borderBottomRightRadius: 16,
                                        shadowColor: "#000",
                                        shadowOpacity: 0.05,
                                        shadowRadius: 2,
                                        shadowOffset: { width: 0, height: 1 },
                                        elevation: 1,
                                    }}
                                >
                                    <Text style={{ fontSize: 16, color: "#333" }}>{item.message}</Text>
                                    <Text
                                        style={{
                                            fontSize: 10,
                                            color: "gray",
                                            textAlign: "right",
                                            marginTop: 4,
                                        }}
                                    >
                                        {new Date(item.created_at).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
                />


                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Feather name="plus" size={24} color="gray" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.textbox}
                        value={messageText}
                        placeholder="Type your message"
                        onChangeText={setMessageText}
                        onSubmitEditing={sendMessage}
                    />
                    {messageText === "" ? (
                        <TouchableOpacity style={styles.iconButton}>
                            <MaterialIcons name="camera-alt" size={24} color="gray" />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.iconButton, styles.sendButton]}
                            onPress={sendMessage}
                        >
                            <Feather name="send" size={20} color="white" />
                        </TouchableOpacity>
                    )}
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e5ddd5",
    },
    screen: {
        flex: 1,
    },
    chatList: {
        padding: 10,
        paddingBottom: 20,
    },
    messageContainer: {
        marginVertical: 4,
    },
    sentContainer: {
        alignItems: "flex-end",
    },
    receivedContainer: {
        alignItems: "flex-start",
    },
    messageBubble: {
        maxWidth: "80%",
        padding: 10,
        borderRadius: 12,
        elevation: 2,
        marginBottom: 2,
    },
    sentBubble: {
        backgroundColor: "#dcf8c6",
        borderTopRightRadius: 0,
    },
    receivedBubble: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 0,
    },
    messageText: {
        fontSize: 16,
        color: "#000",
    },
    timestamp: {
        fontSize: 11,
        color: "#555",
        alignSelf: "flex-end",
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: "white",
        borderTopWidth: 0.5,
        borderColor: "#ccc",
        elevation: 10,
    },
    textbox: {
        flex: 1,
        height: 40,
        borderWidth: 0.5,
        borderColor: "#ccc",
        borderRadius: 20,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: "#f9f9f9",
    },
    iconButton: {
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    sendButton: {
        backgroundColor: "#25D366",
    },
    header: {
        backgroundColor: '#075E54',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        paddingTop: Platform.OS === 'android' ? 20 : 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 15,
    },
    headerText: {
        flexDirection: 'column',
    },
    headerName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    headerStatus: {
        color: 'lightgray',
        fontSize: 12,
    },
    headerIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 20,
    },
    dateSeparatorContainer: {
        alignSelf: "center",
        backgroundColor: "#e0e0e0",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginVertical: 10,
    },
    dateSeparatorText: {
        fontSize: 12,
        color: "#555",
    },
});

export default ChatScreen;
