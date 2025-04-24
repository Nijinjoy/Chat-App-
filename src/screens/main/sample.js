import {
    collection,
    addDoc,
    serverTimestamp,
    setDoc,
    doc,
    query,
    where,
    getDocs
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../firebase/config';

const createNewChat = async (participantIds, chatName = null, isGroup = false) => {
    try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
            throw new Error("You must be logged in to create a chat");
        }

        // Validate participants
        if (!participantIds || participantIds.length === 0) {
            throw new Error("At least one participant is required");
        }

        // For 1:1 chats, check if chat already exists
        if (!isGroup && participantIds.length === 1) {
            const existingChatQuery = query(
                collection(db, 'chats'),
                where('participants', 'array-contains', currentUser.uid),
                where('isGroup', '==', false)
            );

            const snapshot = await getDocs(existingChatQuery);
            const existingChat = snapshot.docs.find(doc => {
                const data = doc.data();
                return data.participants.includes(participantIds[0]);
            });

            if (existingChat) {
                return {
                    id: existingChat.id,
                    ...existingChat.data(),
                    exists: true
                };
            }
        }

        // Get participant info for chat details
        const participantsSnapshot = await getDocs(
            query(collection(db, 'users'), where('__name__', 'in', participantIds)
            );
        const participants = participantsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // Determine chat name if not provided
        let finalChatName = chatName;
        let chatAvatar = null;

        if (!isGroup && participants.length === 1) {
            finalChatName = participants[0].name;
            chatAvatar = participants[0].avatar;
        } else if (!chatName) {
            finalChatName = participants.map(p => p.name).join(', ');
        }

        // Create the chat document
        const chatData = {
            name: finalChatName,
            participants: [currentUser.uid, ...participantIds],
            isGroup,
            avatar: chatAvatar,
            createdAt: serverTimestamp(),
            lastMessage: "Chat created",
            lastMessageTime: serverTimestamp(),
            createdBy: currentUser.uid
        };

        const chatRef = await addDoc(collection(db, 'chats'), chatData);

        // Add welcome message
        await addDoc(collection(db, 'chats', chatRef.id, 'messages'), {
            senderId: currentUser.uid,
            text: isGroup ? `Welcome to the ${finalChatName} group!` : "Hello there!",
            timestamp: serverTimestamp(),
            read: false,
            type: 'text'
        });

        // Update user documents with chat reference
        const updatePromises = chatData.participants.map(userId =>
            updateDoc(doc(db, 'users', userId), {
                chats: arrayUnion(chatRef.id)
            }
            );

        await Promise.all(updatePromises);

        return {
            id: chatRef.id,
            ...chatData
        };

    } catch (error) {
        console.error("Error creating chat:", error);
        throw error;
    }
};

// Usage in your ChatListScreen component
const ChatListScreen = () => {
    const [users, setUsers] = useState([]); // For showing available users to chat with

    // Fetch users you can chat with (excluding yourself)
    useEffect(() => {
        const fetchUsers = async
