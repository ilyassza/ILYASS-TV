import { auth } from './firebase-config.js';
import { 
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';

// Login function
export const loginAdmin = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Logout function
export const logoutAdmin = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Check authentication state
export const checkAuthState = (callback) => {
    return onAuthStateChanged(auth, (user) => {
        if (user) {
            callback({ isAuthenticated: true, user });
        } else {
            callback({ isAuthenticated: false, user: null });
        }
    });
};

// Protect admin routes
export const requireAuth = () => {
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            if (user) {
                resolve(user);
            } else {
                window.location.href = '/admin-login.html';
                reject('Not authenticated');
            }
        });
    });
};