// config.js - Configuration File
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbxVt2YXx9XzzKGYQ_7B7mOduYj62nbVZExjBNdaYSL_V2jb0FpyqYoM1KydjtT45IZG/exec',
    CACHE_EXPIRY: 5 * 60 * 1000,
    PROFILE_CACHE_KEY: 'ma_inventory_profile',
    IMAGE_CACHE_KEY: 'ma_inventory_profile_image',
    APP_NAME: 'MA Inventory System',
    DEFAULT_AVATAR: 'https://ui-avatars.com/api/?name=User&background=1a73e8&color=fff&size=150'
};

const CacheManager = {
    set: function(key, data, expiryMinutes = 5) {
        const item = { data: data, timestamp: new Date().getTime(), expiry: expiryMinutes * 60 * 1000 };
        try { localStorage.setItem(key, JSON.stringify(item)); } catch (e) { console.warn('Cache failed:', e); }
    },
    get: function(key) {
        try {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return null;
            const item = JSON.parse(itemStr);
            if (new Date().getTime() - item.timestamp > item.expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return item.data;
        } catch (e) { return null; }
    },
    clearAll: function() {
        localStorage.removeItem(CONFIG.PROFILE_CACHE_KEY);
        localStorage.removeItem(CONFIG.IMAGE_CACHE_KEY);
    }
};

const APIHelper = {
    async fetchProfile() {
        try {
            const response = await fetch(CONFIG.API_URL + '?action=getProfile');
            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    },
    async fetchImage(fileId) {
        if (!fileId) return null;
        try {
            const response = await fetch(CONFIG.API_URL + '?action=getImage&fileId=' + encodeURIComponent(fileId));
            return await response.json();
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
};
