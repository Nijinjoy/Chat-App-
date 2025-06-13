// ✅ This custom hook fetches initial messages and listens for real-time updates from Supabase.

import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

export interface MessageType {
  id: string;
  chat_id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  created_at: string;
}

export const useChatMessages = (chatId: string, currentUserId: string) => {
  const [messages, setMessages] = useState<MessageType[]>([]);

  useEffect(() => {
    if (!chatId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    // Real-time subscription
    const channel = supabase
      .channel(`realtime:messages:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          const newMessage = payload.new as MessageType;
          setMessages((prev) => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  return messages;
};

