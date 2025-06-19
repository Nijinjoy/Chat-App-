import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MessageBubble from '../../components/MessageBubble';
import { useRoute } from '@react-navigation/native';
import { supabase } from '../../services/supabase';
import HeaderComponent from '../../components/HeaderComponent';
import { groupMessagesByDate } from '../../utils/groupMessagesByDate';


type ChatScreenParams = {
  chatId: string;
  chatName: string;
  avatar_url?: string | null;
  receiverId: string;
};

type Message = {
  id: string;
  message: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  reply_to_message?: string | null;
}

const ChatScreen = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const scrollRef = useRef<ScrollView>(null);
  const route = useRoute();
  const { chatId, chatName, avatar, receiverId } = route.params as ChatScreenParams;
  const [replyToMessage, setReplyToMessage] = useState<Message | null>(null);


  useEffect(() => {
    console.log('ChatScreen Params:', {
      chatId,
      chatName,
      avatar,
      receiverId,
    });
  }, []);

    useEffect(() => {
      const getUser = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          setCurrentUserId(user.id);
        }
      };
      getUser();
    }, []);

    useEffect(() => {
      const fetchMessages = async () => {
        if (!chatId) return;
  
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });
  
        if (error) {
          console.error('Error fetching messages:', error.message);
        } else {
          setMessages(data as Message[]);
        }
      };
  
      fetchMessages();
    }, [chatId]);

  useEffect(() => {
    if (!chatId || !currentUserId) return;
    const channel = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId, currentUserId]);
 
    const formatTime = (timestamp: string) => {
      const date = new Date(timestamp);
      let hours = date.getHours();
      let minutes: any = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return `${hours}:${minutes} ${ampm}`;
    };

    const getOriginalMessageText = (replyId: string) => {
      const original = messages.find((msg) => msg.id === replyId);
      return original ? original.message : '';
    };

    const handleSend = async () => {
      if (!message.trim() || !currentUserId) {
        console.warn('Empty message or user not logged in');
        return;
      }
    
      const trimmedMessage = message.trim();
      console.log('Sending message:', trimmedMessage);
    
      try {
        // 1. Insert message
        const { data: insertData, error: insertError } = await supabase
          .from('messages')
          .insert([
            {
              chat_id: chatId,
              sender_id: currentUserId,
              receiver_id: receiverId,
              message: trimmedMessage,
            },
          ])
          .select();
    
        if (insertError) {
          console.error('❌ Error inserting message:', insertError.message);
          return;
        }
        console.log('✅ Message inserted:', insertData);
        setMessage('');
        const { data: receiverData, error: receiverError } = await supabase
          .from('users')
          .select('push_token, full_name')
          .eq('id', receiverId)
          .single();
    
        if (receiverError) {
          console.error('❌ Error fetching receiver push token:', receiverError.message);
          return;
        }
    
        if (!receiverData?.push_token) {
          console.warn('⚠️ Receiver has no push token saved.');
          return;
        }
    
        const pushToken = receiverData.push_token;
        console.log('✅ Receiver push token:', pushToken);
        const notificationPayload = {
          to: pushToken,
          sound: 'default',
          title: `New message from ${chatName}`,
          body: trimmedMessage,
          data: { chatId },
        };
    
        console.log('📤 Sending notification with payload:', notificationPayload);
    
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notificationPayload),
        });
    
        const responseData = await response.json();
        console.log('📩 Push API response:', responseData);
    
        if (responseData?.data?.status === 'error') {
          console.warn('⚠️ Expo push API error:', responseData.data.message);
        } else {
          console.log('✅ Push notification sent successfully.');
        }
    
      } catch (error) {
        console.error('🔥 Unexpected error in handleSend:', error);
      }
    };
    

  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <HeaderComponent
  chatName={chatName}
  showBack={true}
  avatar={avatar || undefined}
  showAvatar={!!avatar}
/>
      <ScrollView
        contentContainerStyle={styles.chatContainer}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
      >
 {Object.entries(groupMessagesByDate(messages)).map(([dateLabel, dayMessages]) => (
  <View key={dateLabel}>
    <View style={styles.dateSeparator}>
      <Text style={styles.dateText}>{dateLabel}</Text>
    </View>
    {dayMessages.map((msg) => (
 <MessageBubble
 key={msg.id}
 text={msg.message}
 time={formatTime(msg.created_at)}
 sender={msg.sender_id === currentUserId ? 'me' : 'other'}
 replyTo={msg.reply_to_message ? getOriginalMessageText(msg.reply_to_message) : null}
 onReply={() => setReplyToMessage(msg)} // Sets state for the input box to show "replying to"
/>
    ))}
  </View>
))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type your message..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    paddingHorizontal: 20,
    elevation: 4,
  },
  headerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  chatContainer: {
    flexGrow: 1,
    padding: 12,
  },
  messageRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  otherMessageRow: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  myBubble: {
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 0,
  },
  otherBubble: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    fontSize: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dateText: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    color: '#333',
  },
  
});

   // const handleSend = async () => {
    //   if (!message.trim() || !currentUserId) return;
  
    //   const { data, error, status, statusText } = await supabase
    //     .from('messages')
    //     .insert([
    //       {
    //         chat_id: chatId,
    //         sender_id: currentUserId,
    //         receiver_id: receiverId,
    //         message: message.trim(),
    //       },
    //     ])
    //     .select();
  
    //   if (error) {
    //     console.error('Send message failed:', error.message);
    //   } else {
    //     console.log('Message sent successfully:', { data, status, statusText });
    //     setMessage('');
    //   }
    // };
