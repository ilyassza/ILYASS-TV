// DOM Elements
const navMenuItems = document.querySelectorAll('.nav-menu li');
const mobileMenuItems = document.querySelectorAll('.mobile-menu li');
const sections = document.querySelectorAll('.section');
const themeSwitch = document.getElementById('theme-switch');
const mobileThemeSwitch = document.getElementById('mobile-theme-switch');
const langEnBtn = document.getElementById('lang-en-btn');
const langArBtn = document.getElementById('lang-ar-btn');
const mobileLangEnBtn = document.getElementById('mobile-lang-en-btn');
const mobileLangArBtn = document.getElementById('mobile-lang-ar-btn');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const mobileSidebar = document.querySelector('.mobile-sidebar');
const sectionLinks = document.querySelectorAll('[data-section-link]');
const adminButton = document.getElementById('admin-button');
const adminSection = document.getElementById('admin');
const adminLoginForm = document.getElementById('admin-login');
const adminPanel = document.getElementById('admin-panel');
const adminLoginBtn = document.getElementById('admin-login-btn');

// App Data (would normally be stored in a database)
let appData = {
    tvApp: {
        version: '1.0.0',
        downloadLink: '#'
    },
    playerApp: {
        version: '1.0.0',
        downloadLink: '#'
    },
    stats: {
        tvDownloads: '10,000+',
        playerDownloads: '5,000+',
        activeUsers: '7,500+',
        matchesStreamed: '1,200+'
    }
};

// Load data from localStorage if available
function loadAppData() {
    const savedData = localStorage.getItem('ilyassTvAppData');
    if (savedData) {
        appData = JSON.parse(savedData);
        updateUIWithAppData();
    }
}

// Save data to localStorage
function saveAppData() {
    localStorage.setItem('ilyassTvAppData', JSON.stringify(appData));
}

// Update UI with current app data
function updateUIWithAppData() {
    // Update version displays
    document.getElementById('tv-app-version').textContent = appData.tvApp.version;
    document.getElementById('player-app-version').textContent = appData.playerApp.version;
    
    // Update download links
    document.getElementById('tv-app-download').href = appData.tvApp.downloadLink;
    document.getElementById('player-app-download').href = appData.playerApp.downloadLink;
    
    // Update stats
    document.getElementById('tv-downloads').textContent = appData.stats.tvDownloads;
    document.getElementById('player-downloads').textContent = appData.stats.playerDownloads;
    document.getElementById('active-users').textContent = appData.stats.activeUsers;
    document.getElementById('matches-streamed').textContent = appData.stats.matchesStreamed;
    
    // Update admin form fields
    document.getElementById('tv-version').value = appData.tvApp.version;
    document.getElementById('tv-download-link').value = appData.tvApp.downloadLink;
    document.getElementById('player-version').value = appData.playerApp.version;
    document.getElementById('player-download-link').value = appData.playerApp.downloadLink;
    document.getElementById('stat-tv-downloads').value = appData.stats.tvDownloads;
    document.getElementById('stat-player-downloads').value = appData.stats.playerDownloads;
    document.getElementById('stat-active-users').value = appData.stats.activeUsers;
    document.getElementById('stat-matches-streamed').value = appData.stats.matchesStreamed;
}

// Mobile Menu Toggle
mobileMenuToggle.addEventListener('click', () => {
    mobileSidebar.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (mobileSidebar.classList.contains('active') && 
        !mobileSidebar.contains(e.target) && 
        !mobileMenuToggle.contains(e.target)) {
        mobileSidebar.classList.remove('active');
    }
});

// Navigation - Desktop Menu
navMenuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all menu items
        navMenuItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Show corresponding section
        const sectionId = item.getAttribute('data-section');
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Navigation - Mobile Menu
mobileMenuItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remove active class from all menu items
        mobileMenuItems.forEach(i => i.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Show corresponding section
        const sectionId = item.getAttribute('data-section');
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
        
        // Close mobile sidebar
        mobileSidebar.classList.remove('active');
        
        // Update desktop menu
        navMenuItems.forEach(navItem => {
            if (navItem.getAttribute('data-section') === sectionId) {
                navMenuItems.forEach(i => i.classList.remove('active'));
                navItem.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Section Links
sectionLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const sectionId = link.getAttribute('data-section-link');
        
        // Show corresponding section
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
        
        // Update desktop menu
        navMenuItems.forEach(navItem => {
            navItem.classList.remove('active');
            if (navItem.getAttribute('data-section') === sectionId) {
                navItem.classList.add('active');
            }
        });
        
        // Update mobile menu
        mobileMenuItems.forEach(mobileItem => {
            mobileItem.classList.remove('active');
            if (mobileItem.getAttribute('data-section') === sectionId) {
                mobileItem.classList.add('active');
            }
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Theme Toggle - Desktop
themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', themeSwitch.checked);
    
    // Sync mobile theme switch
    mobileThemeSwitch.checked = themeSwitch.checked;
});

// Theme Toggle - Mobile
mobileThemeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', mobileThemeSwitch.checked);
    
    // Sync desktop theme switch
    themeSwitch.checked = mobileThemeSwitch.checked;
});

// Check for saved theme preference
const savedTheme = localStorage.getItem('darkMode');
if (savedTheme === 'true') {
    themeSwitch.checked = true;
    mobileThemeSwitch.checked = true;
    document.body.classList.add('dark-mode');
}

// Language Toggle - Desktop
langEnBtn.addEventListener('click', () => {
    document.body.classList.remove('rtl');
    langEnBtn.classList.add('active');
    langArBtn.classList.remove('active');
    mobileLangEnBtn.classList.add('active');
    mobileLangArBtn.classList.remove('active');
    localStorage.setItem('language', 'en');
});

langArBtn.addEventListener('click', () => {
    document.body.classList.add('rtl');
    langArBtn.classList.add('active');
    langEnBtn.classList.remove('active');
    mobileLangArBtn.classList.add('active');
    mobileLangEnBtn.classList.remove('active');
    localStorage.setItem('language', 'ar');
});

// Language Toggle - Mobile
mobileLangEnBtn.addEventListener('click', () => {
    document.body.classList.remove('rtl');
    mobileLangEnBtn.classList.add('active');
    mobileLangArBtn.classList.remove('active');
    langEnBtn.classList.add('active');
    langArBtn.classList.remove('active');
    localStorage.setItem('language', 'en');
});

mobileLangArBtn.addEventListener('click', () => {
    document.body.classList.add('rtl');
    mobileLangArBtn.classList.add('active');
    mobileLangEnBtn.classList.remove('active');
    langArBtn.classList.add('active');
    langEnBtn.classList.remove('active');
    localStorage.setItem('language', 'ar');
});

// Check for saved language preference
const savedLanguage = localStorage.getItem('language');
if (savedLanguage === 'ar') {
    document.body.classList.add('rtl');
    langArBtn.classList.add('active');
    langEnBtn.classList.remove('active');
    mobileLangArBtn.classList.add('active');
    mobileLangEnBtn.classList.remove('active');
} else {
    langEnBtn.classList.add('active');
    langArBtn.classList.remove('active');
    mobileLangEnBtn.classList.add('active');
    mobileLangArBtn.classList.remove('active');
}

// Admin Panel
adminButton.addEventListener('click', () => {
    // Hide all other sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show admin section
    adminSection.classList.add('active');
    
    // Remove active class from all menu items
    menuItems.forEach(i => i.classList.remove('active'));
});

// Admin Login
adminLoginBtn.addEventListener('click', () => {
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;
    
    // Simple authentication (in a real app, this would be server-side)
    if (username === 'admin' && password === 'admin123') {
        adminLoginForm.style.display = 'none';
        adminPanel.style.display = 'block';
    } else {
        alert('Invalid username or password');
    }
});

// Update TV App
document.getElementById('update-tv-btn').addEventListener('click', () => {
    appData.tvApp.version = document.getElementById('tv-version').value;
    appData.tvApp.downloadLink = document.getElementById('tv-download-link').value;
    saveAppData();
    updateUIWithAppData();
    alert('ILYASS TV app updated successfully!');
});

// Update Player App
document.getElementById('update-player-btn').addEventListener('click', () => {
    appData.playerApp.version = document.getElementById('player-version').value;
    appData.playerApp.downloadLink = document.getElementById('player-download-link').value;
    saveAppData();
    updateUIWithAppData();
    alert('ILYASS Player app updated successfully!');
});

// Update Stats
document.getElementById('update-stats-btn').addEventListener('click', () => {
    appData.stats.tvDownloads = document.getElementById('stat-tv-downloads').value;
    appData.stats.playerDownloads = document.getElementById('stat-player-downloads').value;
    appData.stats.activeUsers = document.getElementById('stat-active-users').value;
    appData.stats.matchesStreamed = document.getElementById('stat-matches-streamed').value;
    saveAppData();
    updateUIWithAppData();
    alert('Statistics updated successfully!');
});

// Contact Form Submission
document.querySelector('.contact-form .submit-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    if (name && email && subject && message) {
        // In a real app, this would send data to a server
        alert('Thank you for your message! We will get back to you soon.');
        document.getElementById('name').value = '';
        document.getElementById('email').value = '';
        document.getElementById('subject').value = '';
        document.getElementById('message').value = '';
    } else {
        alert('Please fill in all fields');
    }
});

// Quick download buttons
document.getElementById('quick-tv-app-download').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = appData.tvApp.downloadLink;
});

document.getElementById('quick-player-app-download').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = appData.playerApp.downloadLink;
});

// Footer download links
document.getElementById('footer-tv-download').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = appData.tvApp.downloadLink;
});

document.getElementById('footer-player-download').addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = appData.playerApp.downloadLink;
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadAppData();
    
    // Set quick download links
    document.getElementById('quick-tv-app-download').href = appData.tvApp.downloadLink;
    document.getElementById('quick-player-app-download').href = appData.playerApp.downloadLink;
    document.getElementById('footer-tv-download').href = appData.tvApp.downloadLink;
    document.getElementById('footer-player-download').href = appData.playerApp.downloadLink;
});