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
import { Ionicons } from '@expo/vector-icons'
import HeaderComponent from "../../components/HeaderComponent";
import { supabase } from "../../services/supabase";

const ChatScreen = () => {
    const navigation = useNavigation()
    const route = useRoute();
    const { chatId, chatName, avatar } = route.params;
    const [messageText, setMessageText] = useState("");
    const [messages, setMessages] = useState([]);
    const flatListRef = useRef();

    const getCurrentTime = () => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? "PM" : "AM";
        return `${hours % 12 || 12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
    };

    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from("messages")
                .select("*")
                .eq("chat_id", chatId)
            // .order("timestamp", { ascending: true });

            if (error) {
                console.error("Failed to fetch messages:", error.message);
            } else {
                setMessages(data);
            }
        };

        fetchMessages();
    }, [chatId]);

    const sendMessage = useCallback(async () => {
        if (messageText.trim() === "") return;

        // const timestamp = getCurrentTime();

        // Get current user
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.error("User not found:", userError?.message);
            return;
        }

        const newMessage = {
            chat_id: chatId,
            sender_id: user.id,
            text: messageText,
            // timestamp,
            // type: "sent",
        };

        // Update UI immediately
        setMessages((prev) => [
            ...prev,
            {
                id: `${prev.length + 1}`,
                ...newMessage,
            },
        ]);
        setMessageText("");

        const { error } = await supabase.from("messages").insert([newMessage]);
        if (error) {
            console.error("Error saving message:", error.message);
        }

        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messageText]);


    const renderMessage = ({ item }) => (
        <View
            style={[
                styles.messageContainer,
                item.type === "sent" ? styles.sentContainer : styles.receivedContainer,
            ]}
        >
            <View
                style={[
                    styles.messageBubble,
                    item.type === "sent" ? styles.sentBubble : styles.receivedBubble,
                ]}
            >
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
        </View>
    );


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
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.chatList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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

});

export default ChatScreen;
