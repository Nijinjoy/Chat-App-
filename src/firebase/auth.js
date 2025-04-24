import { auth } from "./config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

// Register function
export const registerWithEmail = async (email, password, fullName) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set user's display name
        await updateProfile(userCredential.user, {
            displayName: fullName,
        });
        return {
            success: true,
            user: userCredential.user,
        };
    } catch (error) {
        console.log("Registration error:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};
