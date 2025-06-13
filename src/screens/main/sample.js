import React, { useState, useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    StatusBar,
    Platform,
    Alert,
    TouchableOpacity,
    Text,
    TextInput,
    FlatList,
    Image,
    KeyboardAvoidingView,
    ScrollView,
    ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, Feather, Ionicons, FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { supabase } from "../../services/supabase";
import HeaderComponent from "../../components/HeaderComponent";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

type ChatScreenParams = {
    chatId: string;
    chatName: string;
    avatar_url: string;
    receiverId: string;

};

type Message = {
    id: string;
    text: string;
    createdAt: Date;
    senderId: string;
    receiverId: string;
    isCurrentUser: boolean;
};

const ChatScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { chatId, chatName, avatar, receiverId } = route.params as ChatScreenParams;
    const [messages, setMessages] = useState < Message[] > ([]);
    const [currentUser, setCurrentUser] = useState < any > (null);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState < string | null > (null);
    const flatListRef = useRef < FlatList > (null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (data?.user) setCurrentUser(data.user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        if (!currentUser) return;

        fetchMessages();

        const channel = supabase
            .channel(`realtime_messages_${chatId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                    filter: `chat_id=eq.${chatId}`,
                },
                (payload) => {
                    const newMsg = payload.new;
                    if (newMsg.sender_id === currentUser.id) return;

                    setMessages((prev) => [
                        {
                            id: newMsg.id,
                            text: newMsg.message,
                            createdAt: new Date(newMsg.created_at),
                            senderId: newMsg.sender_id,
                            receiverId: newMsg.receiver_id,
                            isCurrentUser: false,
                        },
                        ...prev,
                    ]);
                }
    )
        .subscribe();

      return () => {
          supabase.removeChannel(channel);
      };
  }, [currentUser, chatId]);


    const fetchMessages = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("messages")
            .select("*")
            .eq("chat_id", chatId)
            .order("created_at", { ascending: false });

        if (!error && data) {
            const formatted = data.map((msg) => ({
                id: msg.id,
                text: msg.message,
                createdAt: new Date(msg.created_at),
                senderId: msg.sender_id,
                receiverId: msg.receiver_id,
                isCurrentUser: msg.sender_id === currentUser.id,
            }));
            setMessages(formatted);
        }
        setIsLoading(false);
    };


    const LoadingIndicator = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0084ff" />
        </View>
    );

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const tempMessage: Message = {
            id: Date.now().toString(),
            text: newMessage,
            createdAt: new Date(),
            senderId: currentUser.id,
            receiverId,
            isCurrentUser: true,
        };

        setMessages((prev) => [tempMessage, ...prev]);
        setNewMessage("");

        const { error } = await supabase.from("messages").insert([
            {
                chat_id: chatId,
                sender_id: currentUser.id,
                receiver_id: receiverId,
                message: newMessage,
                created_at: new Date().toISOString(),
            },
        ]);

        if (error) {
            console.error("Send error:", error.message);
            setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id));
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View
            style={[
                styles.messageRow,
                item.isCurrentUser ? styles.currentUserRow : styles.otherUserRow,
            ]}
        >
            {!item.isCurrentUser && (
                <Image source={{ uri: avatar }} style={styles.avatar} />
            )}
            <View
                style={[
                    styles.messageBubble,
                    item.isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
                ]}
            >
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageTime}>
                    {item.createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
            </View>
        </View>
    );


    const handleUploadFile = async (type: "image" | "video" | "pdf") => {
        try {
            let result;
            if (type === "pdf") {
                result = await DocumentPicker.getDocumentAsync({
                    type: "application/pdf",
                });
            } else {
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes:
                        type === "video"
                            ? ImagePicker.MediaTypeOptions.Videos
                            : ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: false,
                    quality: 0.7,
                });
            }

            if (result.canceled || result.assets?.length === 0) return;

            const fileUri = result.assets?.[0]?.uri || result.uri;
            const fileName = fileUri.split("/").pop();
            const fileExt = fileName?.split(".").pop() || "bin";
            const fileType =
                type === "pdf" ? "application/pdf" : `${type}/*`;

            const file = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const { data, error } = await supabase.storage
                .from("chat-uploads")
                .upload(`uploads/${Date.now()}-${fileName}`, Buffer.from(file, "base64"), {
                    contentType: fileType,
                    upsert: true,
                });

            if (error) {
                Alert.alert("Upload Failed", error.message);
                return;
            }

            const url = supabase.storage
                .from("chat-uploads")
                .getPublicUrl(data.path).data.publicUrl;

            await supabase.from("messages").insert([
                {
                    chat_id: chatId,
                    sender_id: currentUser.id,
                    message: `${type.toUpperCase()} file: ${url}`,
                    created_at: new Date().toISOString(),
                },
            ]);
        } catch (error) {
            console.error("Upload error:", error);
        }
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
              style={styles.flex}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
          >
              <View style={styles.flex}>
                  {isLoading ? (
                      <LoadingIndicator />
                  ) : (
                      <FlatList
                          ref={flatListRef}
                          data={messages}
                          renderItem={renderMessage}
                          keyExtractor={(item) => item.id}
                          inverted
                          contentContainerStyle={styles.messagesList}
                          ListEmptyComponent={
                              isLoading ? (
                                  <ActivityIndicator size="large" color="#0084ff" style={{ marginTop: 30 }} />
                              ) : (
                                  <Text style={styles.emptyText}>No messages yet</Text>
                              )
                          }
                        />


                    )}

                    <View style={styles.inputContainer}>
                        <View style={styles.uploadOptions}>
                            <TouchableOpacity onPress={() => handleUploadFile("image")} style={styles.uploadButton}>
                                <Feather name="image" size={22} color="#0084ff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleUploadFile("video")} style={styles.uploadButton}>
                                <Feather name="video" size={22} color="#0084ff" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleUploadFile("pdf")} style={styles.uploadButton}>
                                <FontAwesome name="file-pdf-o" size={22} color="#d00" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.messageInputContainer}>
                            <TextInput
                                style={styles.messageInput}
                                value={newMessage}
                                onChangeText={setNewMessage}
                                placeholder="Type a message..."
                                placeholderTextColor="#999"
                                multiline
                            />
                            <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
                                <Ionicons name="send" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    flex: {
        flex: 1,
    },
    messagesList: {
        paddingHorizontal: 12,
        paddingBottom: 16,
    },
    messageContainer: {
        flexDirection: 'row',
        marginVertical: 4,
        alignItems: 'flex-end',
    },
    currentUserMessage: {
        justifyContent: 'flex-end',
    },
    otherUserMessage: {
        justifyContent: 'flex-start',
    },
    messageText: {
        fontSize: 16,
    },
    currentUserText: {
        color: '#fff',
    },
    otherUserText: {
        color: '#000',
    },
    timeText: {
        fontSize: 12,
        marginTop: 4,
        textAlign: 'right',
    },
    currentUserTime: {
        color: '#ddd',
    },
    otherUserTime: {
        color: '#999',
    },
    inputContainer: {
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e5e5',
    },
    uploadOptions: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 8,
    },
    uploadButton: {
        marginRight: 16,
    },
    messageInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    messageInput: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#0084ff',
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },

    messageRow: {
        flexDirection: 'row',
        marginVertical: 4,
        width: '100%',
    },
    currentUserRow: {
        justifyContent: 'flex-end',
    },
    otherUserRow: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
        alignSelf: 'flex-end',
        marginBottom: 12,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 4,
    },
    currentUserBubble: {
        backgroundColor: '#0084ff',
        borderBottomRightRadius: 4,
        marginLeft: '20%', // This pushes the bubble to the right
    },
    otherUserBubble: {
        backgroundColor: '#ffffff',
        borderBottomLeftRadius: 4,
        marginRight: '20%', // This pushes the bubble to the left
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
        textAlign: 'center',
    },
    retryText: {
        color: '#0084ff',
        fontWeight: 'bold',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        color: '#999',
    },


});

export default ChatScreen;
