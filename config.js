// config.js - Configuration File
const APP_CONFIG = {
    // Google Apps Script API URL (Ganti dengan URL Web App anda yang sebenar nanti)
    API_URL: 'https://script.google.com/macros/s/AKfycbxMZ-ipbF6vc1zVzPFNY6pcX30T33-nDDvH3edq20ilqLTkagLCOAeR6WP4FG-BIbuk/exec',
    
    // Cache Settings
    CACHE_EXPIRY: 5 * 60 * 1000, // 5 minutes in milliseconds
    PROFILE_CACHE_KEY: 'ma_inventory_profile',
    IMAGE_CACHE_KEY: 'ma_inventory_profile_image',
    
    // App Settings
    APP_NAME: 'MA Inventory System',
    DEFAULT_AVATAR: 'https://ui-avatars.com/api/?name=User&background=1a73e8&color=fff&size=150'
};

// Utility Functions for Caching
const CacheManager = {
    // Save data to localStorage with timestamp
    set: function(key, data, expiryMinutes = 5) {
        const item = {
            data: data,
            timestamp: new Date().getTime(),
            expiry: expiryMinutes * 60 * 1000
        };
        try {
            localStorage.setItem(key, JSON.stringify(item));
        } catch (e) {
            console.warn('Cache storage failed:', e);
        }
    },
    
    // Get data from localStorage if not expired
    get: function(key) {
        try {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return null;
            
            const item = JSON.parse(itemStr);
            const now = new Date().getTime();
            
            // Check if expired
            if (now - item.timestamp > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            
            return item.data;
        } catch (e) {
            console.warn('Cache retrieval failed:', e);
            return null;
        }
    },
    
    // Clear specific cache
    clear: function(key) {
        localStorage.removeItem(key);
    },
    
    // Clear all app cache
    clearAll: function() {
        localStorage.removeItem(APP_CONFIG.PROFILE_CACHE_KEY);
        localStorage.removeItem(APP_CONFIG.IMAGE_CACHE_KEY);
    }
};

// API Helper Functions
const APIHelper = {
    async fetchProfile() {
        try {
            // Nota: Pastikan backend GAS anda handle parameter '?action=getProfile'
            const response = await fetch(APP_CONFIG.API_URL + '?action=getProfile');
            return await response.json();
        } catch (error) {
            console.error('Error fetching profile:', error);
            return { success: false, message: error.message };
        }
    },
    
    async fetchImage(fileId) {
        if (!fileId) return null;
        
        try {
            const response = await fetch(APP_CONFIG.API_URL + '?action=getImage&fileId=' + encodeURIComponent(fileId));
            return await response.json();
        } catch (error) {
            console.error('Error fetching image:', error);
            return { success: false, message: error.message };
        }
    }
};
