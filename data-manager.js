/**
 * DATA MANAGER
 * Menguruskan semua cache (Data & Gambar) untuk semua page.
 */
const DataManager = {
    CACHE_EXPIRY: 5 * 60 * 1000, // 5 Minit

    /**
     * Ambil data dari API atau Cache
     * @param {string} cacheKey - Kunci cache (contoh: 'ma_inventory_user_list')
     * @param {string} apiUrl - URL API untuk fetch
     * @param {string} dataKey - Kunci data dalam response JSON (contoh: 'users' atau 'products')
     * @param {boolean} forceRefresh - Paksa ambil dari API, abaikan cache
     */
    async fetchData(cacheKey, apiUrl, dataKey, forceRefresh = false) {
        // 1. Cuba ambil dari cache dulu (jika tidak force refresh)
        if (!forceRefresh) {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                try {
                    const parsed = JSON.parse(cached);
                    if (new Date().getTime() - parsed.timestamp < this.CACHE_EXPIRY) {
                        return parsed.data; // Pulangkan data cache serta-merta
                    }
                } catch (e) {
                    console.error("Cache parse error:", e);
                }
            }
        }

        // 2. Jika tiada cache atau force refresh, fetch dari API
        try {
            const res = await fetch(apiUrl);
            const result = await res.json();
            
            if (result.success && result[dataKey]) {
                const dataArray = result[dataKey];
                // Simpan ke cache
                localStorage.setItem(cacheKey, JSON.stringify({
                    data: dataArray,
                    timestamp: new Date().getTime()
                }));
                return dataArray;
            }
            return [];
        } catch (error) {
            console.error("Fetch API error:", error);
            return null; // Return null untuk tandakan error
        }
    },

    /**
     * Padam cache data (PENTING: Panggil ini selepas berjaya Add/Update/Delete)
     */
    clearCache(cacheKey) {
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
                localStorage.removeItem(key); // Expired, buang
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
     * Padam cache gambar (PENTING: Panggil ini selepas Delete)
     */
    clearImageCache(prefix, identifier) {
        if (!identifier) return;
        const key = `${prefix}_${identifier.replace(/[^a-zA-Z0-9]/g, '')}`;
        localStorage.removeItem(key);
    }
};
