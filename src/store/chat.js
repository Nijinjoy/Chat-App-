import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useChatStore = create(
    immer((set) => ({
        activeChat: null,
        messages: [],
        chats: [],
        setActiveChat: (chatId) => set({ activeChat: chatId }),
        addMessage: (message) =>
            set((state) => {
                state.messages.push(message);
            }),
        setChats: (chats) => set({ chats }),
    }))
);
