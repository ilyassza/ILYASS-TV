import { storage } from './firebase-config.js';
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage';

// Upload a file to Firebase Storage
export const uploadFile = async (file, path) => {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return {
            success: true,
            downloadURL,
            path: snapshot.ref.fullPath
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Upload app icon
export const uploadAppIcon = async (file, appId) => {
    const extension = file.name.split('.').pop();
    const path = `apps/${appId}/icon.${extension}`;
    return uploadFile(file, path);
};

// Upload app screenshot
export const uploadAppScreenshot = async (file, appId, index) => {
    const extension = file.name.split('.').pop();
    const path = `apps/${appId}/screenshot_${index}.${extension}`;
    return uploadFile(file, path);
};

// Upload APK file
export const uploadAppAPK = async (file, appId) => {
    const extension = file.name.split('.').pop();
    const path = `apps/${appId}/app.${extension}`;
    return uploadFile(file, path);
};

// Delete a file from Firebase Storage
export const deleteFile = async (path) => {
    try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};

// Get download URL for a file
export const getFileURL = async (path) => {
    try {
        const storageRef = ref(storage, path);
        const url = await getDownloadURL(storageRef);
        return {
            success: true,
            url
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
};