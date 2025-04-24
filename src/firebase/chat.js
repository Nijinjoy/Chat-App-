import { db } from './config';
import { doc, setDoc } from 'firebase/firestore';

export const createChatRoom = async (chatId, users) => {
    await setDoc(doc(db, 'chats', chatId), {
        users,
        lastMessage: '',
        updatedAt: new Date(),
    });
};
