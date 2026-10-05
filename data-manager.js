/**
 * DATA MANAGER - Centralized Cache Management
 * Menguruskan semua cache (Data & Gambar) untuk semua page
 */
const DataManager = {
    CACHE_EXPIRY: 5 * 60 * 1000, // 5 Minit

    /**
     * Ambil data dari API atau Cache
     */
    async fetchData(cacheKey, apiUrl, dataKey, forceRefresh = false) {
        // 1. Cuba ambil dari cache dulu
        if (!forceRefresh) {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (new Date().getTime() - parsed.timestamp < this.CACHE_EXPIRY) {
                        console.log('[DataManager] Using cache for:', cacheKey);
                        return parsed.data;
                    } else {
                        console.log('[DataManager] Cache expired for:', cacheKey);
                    }
                } catch (e) {
                    console.error('[DataManager] Cache parse error:', e);
                }
            }
        }

        // 2. Fetch dari API
        console.log('[DataManager] Fetching from API:', apiUrl);
        try {
            const res = await fetch(apiUrl);
            const result = await res.json();
            console.log('[DataManager] API Response:', result);
            
            if (result.success && result[dataKey]) {
                const dataArray = result[dataKey];
                localStorage.setItem(cacheKey, JSON.stringify({
                    data: dataArray,
                    timestamp: new Date().getTime()
                }));
                console.log('[DataManager] Data cached:', cacheKey, 'Items:', dataArray.length);
                return dataArray;
            }
            console.warn('[DataManager] No data found in response');
            return [];
        } catch (error) {
            console.error('[DataManager] Fetch API error:', error);
            return null;
        }
    },

    /**
     * Padam cache data
     */
    clearCache(cacheKey) {
        console.log('[DataManager] Clearing cache:', cacheKey);
        localStorage.removeItem(cacheKey);
    },

    /**
     * Ambil cache gambar
     */
    getCachedImage(prefix, identifier) {
        if (!identifier) return null;
        const key = `${prefix}_${identifier.replace(/[^a-zA-Z0-9]/g, '')}`;
        const cached = localStorage.getItem(key);
        if (cached) {
            try {
                const parsed = JSON.parse(cached);
                if (new Date().getTime() - parsed.timestamp < this.CACHE_EXPIRY) {
                    return parsed.base64;
                }
                localStorage.removeItem(key);
            } catch (e) {}
        }
        return null;
    },

    /**
     * Simpan cache gambar
     */
    setCachedImage(prefix, identifier, base64) {
        if (!identifier) return;
        const key = `${prefix}_${identifier.replace(/[^a-zA-Z0-9]/g, '')}`;
        localStorage.setItem(key, JSON.stringify({
            base64: base64,
            timestamp: new Date().getTime()
        }));
    },

    /**
     * Padam cache gambar
     */
    clearImageCache(prefix, identifier) {
        if (!identifier) return;
        const key = `${prefix}_${identifier.replace(/[^a-zA-Z0-9]/g, '')}`;
        localStorage.removeItem(key);
    }
};
