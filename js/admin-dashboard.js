import { requireAuth, logoutAdmin } from './auth.js';
import { getApps, createApp, updateApp, deleteApp, updateAppRating } from './firestore.js';
import { uploadAppIcon, uploadAppScreenshot, uploadAppAPK, deleteFile } from './storage.js';

// Ensure user is authenticated
requireAuth().catch(() => window.location.href = '/admin-login.html');

// DOM Elements
const appsList = document.getElementById('appsList');
const appModal = document.getElementById('appModal');
const appForm = document.getElementById('appForm');
const loadingSpinner = document.getElementById('loadingSpinner');

let currentAppId = null;

// Event Listeners
document.getElementById('addAppBtn').addEventListener('click', () => openModal());
document.getElementById('logoutBtn').addEventListener('click', handleLogout);
appForm.addEventListener('submit', handleAppSubmit);

// Initialize dashboard
initDashboard();

async function initDashboard() {
    showLoading();
    const result = await getApps(2); // Get first two apps by default
    hideLoading();

    if (result.success) {
        renderApps(result.apps);
    } else {
        showError('Failed to load apps');
    }
}

function renderApps(apps) {
    appsList.innerHTML = apps.map(app => `
        <div class="app-card" data-id="${app.id}">
            <img src="${app.iconUrl}" alt="${app.name}" class="app-icon">
            <h3>${app.name}</h3>
            <div class="rating">
                ${renderRating(app.rating)}
            </div>
            <p>${app.description}</p>
            <div class="app-actions">
                <button onclick="editApp('${app.id}')" class="btn btn-primary">تعديل</button>
                <button onclick="deleteAppPrompt('${app.id}')" class="btn btn-danger">حذف</button>
            </div>
        </div>
    `).join('');
}

function renderRating(rating) {
    return '⭐'.repeat(rating);
}

async function handleAppSubmit(e) {
    e.preventDefault();
    showLoading();

    const formData = {
        name: document.getElementById('appName').value,
        description: document.getElementById('appDescription').value,
        rating: parseInt(document.getElementById('appRating').value),
    };

    try {
        // Handle file uploads
        const iconFile = document.getElementById('appIcon').files[0];
        const screenshotFiles = document.getElementById('appScreenshots').files;
        const apkFile = document.getElementById('appFile').files[0];

        if (currentAppId) {
            // Update existing app
            if (iconFile) {
                const iconResult = await uploadAppIcon(iconFile, currentAppId);
                if (iconResult.success) {
                    formData.iconUrl = iconResult.downloadURL;
                }
            }

            if (screenshotFiles.length > 0) {
                const screenshots = [];
                for (let i = 0; i < screenshotFiles.length; i++) {
                    const result = await uploadAppScreenshot(screenshotFiles[i], currentAppId, i);
                    if (result.success) {
                        screenshots.push(result.downloadURL);
                    }
                }
                formData.screenshots = screenshots;
            }

            if (apkFile) {
                const apkResult = await uploadAppAPK(apkFile, currentAppId);
                if (apkResult.success) {
                    formData.downloadUrl = apkResult.downloadURL;
                }
            }

            await updateApp(currentAppId, formData);
        } else {
            // Create new app
            const createResult = await createApp(formData);
            if (createResult.success) {
                const appId = createResult.id;
                
                if (iconFile) {
                    const iconResult = await uploadAppIcon(iconFile, appId);
                    if (iconResult.success) {
                        await updateApp(appId, { iconUrl: iconResult.downloadURL });
                    }
                }

                if (screenshotFiles.length > 0) {
                    const screenshots = [];
                    for (let i = 0; i < screenshotFiles.length; i++) {
                        const result = await uploadAppScreenshot(screenshotFiles[i], appId, i);
                        if (result.success) {
                            screenshots.push(result.downloadURL);
                        }
                    }
                    await updateApp(appId, { screenshots });
                }

                if (apkFile) {
                    const apkResult = await uploadAppAPK(apkFile, appId);
                    if (apkResult.success) {
                        await updateApp(appId, { downloadUrl: apkResult.downloadURL });
                    }
                }
            }
        }

        hideLoading();
        closeModal();
        initDashboard(); // Refresh the apps list
    } catch (error) {
        hideLoading();
        showError('Failed to save app');
        console.error(error);
    }
}

async function handleLogout() {
    const result = await logoutAdmin();
    if (result.success) {
        window.location.href = '/admin-login.html';
    } else {
        showError('Failed to logout');
    }
}

function openModal(appData = null) {
    currentAppId = appData ? appData.id : null;
    document.getElementById('modalTitle').textContent = appData ? 'تعديل التطبيق' : 'إضافة تطبيق جديد';
    
    if (appData) {
        document.getElementById('appName').value = appData.name;
        document.getElementById('appDescription').value = appData.description;
        document.getElementById('appRating').value = appData.rating;
        document.getElementById('iconPreview').src = appData.iconUrl;
        document.getElementById('iconPreview').style.display = 'block';
    } else {
        appForm.reset();
        document.getElementById('iconPreview').style.display = 'none';
    }
    
    appModal.style.display = 'block';
}

function closeModal() {
    appModal.style.display = 'none';
    currentAppId = null;
    appForm.reset();
}

async function deleteAppPrompt(appId) {
    if (confirm('هل أنت متأكد من حذف هذا التطبيق؟')) {
        showLoading();
        const result = await deleteApp(appId);
        hideLoading();
        
        if (result.success) {
            initDashboard();
        } else {
            showError('Failed to delete app');
        }
    }
}

// Utility functions
function showLoading() {
    loadingSpinner.style.display = 'flex';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
}

function showError(message) {
    alert(message); // You can replace this with a better error display
}

// Make functions available globally
window.editApp = async (appId) => {
    showLoading();
    const result = await getApp(appId);
    hideLoading();
    
    if (result.success) {
        openModal(result.app);
    } else {
        showError('Failed to load app data');
    }
};

window.deleteAppPrompt = deleteAppPrompt;
window.closeModal = closeModal;