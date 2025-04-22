import { firebase } from '../constants/Firestore';

// Send a message to Firestore
export const sendMessage = async (chatId, message) => {
    try {
        await firebase.firestore().collection('chats').doc(chatId).collection('messages').add({
            text: message,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
        throw error;
    }
};

// Fetch messages for a specific chat
export const fetchMessages = async (chatId) => {
    try {
        const snapshot = await firebase.firestore().collection('chats').doc(chatId).collection('messages').orderBy('timestamp', 'asc').get();
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        throw error;
    }
};
