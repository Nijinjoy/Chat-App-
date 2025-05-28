import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, StatusBar, Platform, Alert, TouchableOpacity, Text } from "react-native";
import { GiftedChat, Bubble, Send, Time, InputToolbar,Avatar } from "react-native-gifted-chat";
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
};

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { chatId, chatName } = route.params as ChatScreenParams;
  const [messages, setMessages] = useState([]);
  const [avatar, setAvatar] = useState('https://via.placeholder.com/120');
  const [currentUser, setCurrentUser] = useState(null);

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

    const channel = supabase
      .channel(`realtime-messages-${chatId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages' 
      }, (payload) => {
        const newMessage = payload.new;
        if (newMessage.chat_id !== chatId) return;

        setMessages(previousMessages => 
          GiftedChat.append(previousMessages, [mapMessageToGiftedChat(newMessage)])
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    const formattedMessages = data.map(mapMessageToGiftedChat);
    setMessages(formattedMessages);
  };

  const mapMessageToGiftedChat = (message) => ({
    _id: message.id,
    text: message.message,
    createdAt: new Date(message.created_at),
    user: {
      _id: message.sender_id,
      name: message.sender_id === currentUser?.id ? 'You' : chatName,
      avatar: message.sender_id === currentUser?.id ? avatar : 'https://via.placeholder.com/120',
    },
  });

  const onSend = useCallback(async (messages = []) => {
    if (!currentUser?.id) {
      console.error('Current user not available');
      return;
    }

    const newMessage = messages[0];
    
    const { error } = await supabase
      .from('messages')
      .insert([
        {
          chat_id: chatId,
          sender_id: currentUser.id,
          message: newMessage.text,
          created_at: newMessage.createdAt.toISOString(),
        },
      ]);

    if (error) {
      console.error('Error sending message:', error);
      return;
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages));
  }, [chatId, currentUser]);

  const renderBubble = (props) => (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#ffffff',
          marginBottom: 8,
          borderRadius: 12,
          borderBottomLeftRadius: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        },
        right: {
          backgroundColor: '#0084ff',
          marginBottom: 8,
          borderRadius: 12,
          borderBottomRightRadius: 0,
        },
      }}
      textStyle={{
        left: {
          color: '#000',
          fontSize: 16,
        },
        right: {
          color: '#fff',
          fontSize: 16,
        },
      }}
    />
  );

  const renderSend = (props) => (
    <Send {...props} containerStyle={{ justifyContent: 'center', marginRight: 8 }}>
      <View style={styles.sendButton}>
        <Ionicons name="send" size={20} color="white" />
      </View>
    </Send>
  );

  const renderTime = (props) => (
    <Time
      {...props}
      timeTextStyle={{
        left: {
          color: '#aaa',
          fontSize: 12,
        },
        right: {
          color: '#ddd',
          fontSize: 12,
        },
      }}
    />
  );

const renderInputToolbar = (props) => (
    <View>
      <InputToolbar
        {...props}
        containerStyle={styles.inputToolbar}
        primaryStyle={styles.inputPrimary}
      />
      <View style={styles.uploadOptions}>
        <TouchableOpacity onPress={() => handleUploadFile("image")}>
          <Feather name="image" size={22} color="#0084ff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleUploadFile("video")}>
          <Feather name="video" size={22} color="#0084ff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleUploadFile("pdf")}>
          <FontAwesome name="file-pdf-o" size={22} color="#d00" />
        </TouchableOpacity>
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
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: currentUser?.id || '0',
          name: 'You',
          avatar: avatar,
        }}
        renderBubble={renderBubble}
        renderSend={renderSend}
        renderTime={renderTime}
        renderInputToolbar={renderInputToolbar}
        alwaysShowSend
        scrollToBottom
        scrollToBottomComponent={() => (
          <MaterialIcons name="keyboard-arrow-down" size={24} color="#0084ff" />
        )}
        placeholder="Type a message..."
        textInputStyle={styles.textInput}
        alignTop
        keyboardShouldPersistTaps="never"
        bottomOffset={Platform.OS === 'ios' ? 64 : 0}
        minInputToolbarHeight={64}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sendButton: {
    backgroundColor: '#0084ff',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    marginRight: 4,
  },
  inputToolbar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    padding: 8,
    paddingBottom: 12,
  },
  inputPrimary: {
    alignItems: 'center',
    minHeight: 44,
  },
  accessoryStyle: {
    height: 44,
  },
  textInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 8,
    flex: 1,
  },
  uploadOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
});

export default ChatScreen;
