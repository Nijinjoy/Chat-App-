
// Responsibility: Send, retrieve, and listen for chat messages.
import { db } from './config';
import {
    addDoc,
    collection,
    query,
    orderBy,
    onSnapshot,
    serverTimestamp,
} from 'firebase/firestore';

export const sendMessage = async (chatId, message) => {
    const ref = collection(db, 'chats', chatId, 'messages');
    await addDoc(ref, {
        ...message,
        createdAt: serverTimestamp(),
    });
};

export const listenToMessages = (chatId, callback) => {
    const q = query(collection(db, 'chats', chatId, 'messages'), orderBy('createdAt'));
    return onSnapshot(q, snapshot => {
        const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(messages);
    });
};
