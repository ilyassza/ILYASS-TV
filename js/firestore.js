import { db } from './firebase-config.js';
import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    limit,
    orderBy
} from 'firebase/firestore';

const APPS_COLLECTION = 'apps';
const SETTINGS_COLLECTION = 'settings';

// Create a new app
export const createApp = async (appData) => {
    try {
        const docRef = await addDoc(collection(db, APPS_COLLECTION), {
            ...appData,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return { success: true, id: docRef.id };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Get all apps
export const getApps = async (limit = 10) => {
    try {
        const q = query(
            collection(db, APPS_COLLECTION),
            orderBy('createdAt', 'desc'),
            limit(limit)
        );
        const querySnapshot = await getDocs(q);
        const apps = [];
        querySnapshot.forEach((doc) => {
            apps.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, apps };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Get a single app
export const getApp = async (appId) => {
    try {
        const docRef = doc(db, APPS_COLLECTION, appId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return { success: true, app: { id: docSnap.id, ...docSnap.data() } };
        } else {
            return { success: false, error: 'App not found' };
        }
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Update an app
export const updateApp = async (appId, appData) => {
    try {
        const docRef = doc(db, APPS_COLLECTION, appId);
        await updateDoc(docRef, {
            ...appData,
            updatedAt: new Date()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Delete an app
export const deleteApp = async (appId) => {
    try {
        const docRef = doc(db, APPS_COLLECTION, appId);
        await deleteDoc(docRef);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Update app rating
export const updateAppRating = async (appId, rating) => {
    try {
        const docRef = doc(db, APPS_COLLECTION, appId);
        await updateDoc(docRef, {
            rating,
            updatedAt: new Date()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Get website settings
export const getSettings = async () => {
    try {
        const settingsSnapshot = await getDocs(collection(db, SETTINGS_COLLECTION));
        const settings = {};
        settingsSnapshot.forEach((doc) => {
            settings[doc.id] = doc.data();
        });
        return { success: true, settings };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Update website settings
export const updateSettings = async (settingId, data) => {
    try {
        const docRef = doc(db, SETTINGS_COLLECTION, settingId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};