//firebase config

import { firebase } from './Firebase';  // Import firebase from your Firebase initialization file

// Reference to your Firestore database
const firestore = firebase.firestore();

// Firestore collections can be defined here for easier access
const usersCollection = firestore.collection('users');
const chatsCollection = firestore.collection('chats');
const messagesCollection = (chatId) => firestore.collection('chats').doc(chatId).collection('messages');

export { firestore, usersCollection, chatsCollection, messagesCollection };
