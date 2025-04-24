// firebase/startChat.js
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

export const startChat = async (currentUserId, otherUserId) => {
    if (!currentUserId || !otherUserId) {
        throw new Error('Both user IDs are required');
    }

    try {
        const chatId = [currentUserId, otherUserId].sort().join('_');
        const q = query(
            collection(db, 'chats'),
            where('members', 'array-contains', currentUserId)
        );

        const querySnapshot = await getDocs(q);

        const existingChat = querySnapshot.docs.find(doc => {
            const members = doc.data().members || [];
            return members.includes(otherUserId);
        });

        if (existingChat) {
            return { chatId: existingChat.id, alreadyExists: true };
        }

        const newChatRef = await addDoc(collection(db, 'chats'), {
            members: [currentUserId, otherUserId],
            lastMessage: '',
            updatedAt: serverTimestamp(),
        });

        return { chatId: newChatRef.id, alreadyExists: false };

    } catch (error) {
        console.error('Error starting chat:', error.message);
        throw error;
    }
};
