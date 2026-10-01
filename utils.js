/**
 * utils.js - Fungsi Bantuan Umum (UI & Formatting)
 * Mengandungi fungsi yang digunakan berulang di pelbagai halaman.
 */

const Utils = {
    /**
     * Paparkan notifikasi (Toast)
     * @param {string} message - Mesej untuk dipaparkan
     * @param {string} type - 'success', 'error', 'warning', atau 'info'
     */
    showToast(message, type = 'info') {
        // Buang toast lama jika ada
        const oldToast = document.querySelector('.toast');
        if (oldToast) oldToast.remove();
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Animasi hilang selepas 3 saat
        setTimeout(() => { 
            toast.style.opacity = '0'; 
            toast.style.transition = 'opacity 0.3s'; 
            setTimeout(() => toast.remove(), 300); 
        }, 3000);
    },

    /**
     * Format tarikh kepada format yang mudah dibaca (DD/MM/YYYY HH:mm)
     * @param {string|Date} dateString - Tarikh asal
     */
    formatDate(dateString) {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch (e) {
            return dateString; // Return asal jika gagal parse
        }
    },

    /**
     * Semak jika nilai adalah kosong atau hanya whitespace
     */
    isEmpty(value) {
        return value === null || value === undefined || String(value).trim() === '';
    }
};
