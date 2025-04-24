// firebase/config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAZJj-w35T2kWu7IRtPOnE84lOn6RIWwF0",
    authDomain: "chat-application-41487.firebaseapp.com",
    databaseURL: "https://chat-application-41487-default-rtdb.firebaseio.com",
    projectId: "chat-application-41487",
    storageBucket: "chat-application-41487.appspot.com",
    messagingSenderId: "230295587212",
    appId: "1:230295587212:web:e33243132c2914d777eea9",
};

const app = initializeApp(firebaseConfig);

// Export Firebase services
const auth = getAuth(app);
const db = getFirestore(app); // For Firestore
const rtdb = getDatabase(app); // Optional: Realtime DB
const storage = getStorage(app); // For images, voice, etc.

export { auth, db, rtdb, storage };
