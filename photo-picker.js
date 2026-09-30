/**
 * Photo Picker Component (Final & Robust Version)
 * Menggunakan inline styles dengan !important untuk menjamin ia sentiasa kelihatan.
 */
const PhotoPicker = {
    init: function(config) {
        this.config = config || {};
        this.wrapper = document.getElementById(this.config.wrapperId || 'photoWrapper');
        this.input = document.getElementById(this.config.inputId || 'photoInput');
        this.preview = document.getElementById(this.config.previewId || 'photoPreview');
        this.placeholder = document.getElementById(this.config.placeholderId || 'photoPlaceholder');
        
        // Sembunyikan input file asal
        if (this.input) this.input.style.display = 'none';
        
        // Jadikan fungsi tersedia secara global untuk onclick di HTML
        window.showPhotoMenu = this.showMenu.bind(this);
        window.closePhotoMenu = this.closeMenu.bind(this);
        window.openFilePicker = this.openFilePicker.bind(this);
        
        console.log('✅ Photo Picker berjaya diinisialisasi.');
    },

    showMenu: function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.closeMenu();
        
        const menu = document.createElement('div');
        menu.id = 'photoOptionMenu';
        
        // INLINE STYLES DENGAN !IMPORTANT (JAMINAN TIADA CSS LAIN BOLEH TINDAS)
        menu.style.cssText = `
            position: fixed !important;
            background: white !important;
            padding: 15px !important;
            border-radius: 12px !important;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
            z-index: 999999 !important;
            display: flex !important;
            flex-direction: row !important;
            gap: 15px !important;
            animation: popIn 0.2s ease !important;
        `;

        // Kira posisi tepat di bawah elemen yang diklik
        const rect = e.currentTarget.getBoundingClientRect();
        menu.style.top = (rect.bottom + window.scrollY + 10) + 'px';
        menu.style.left = (rect.left + window.scrollX + (rect.width / 2) - 55) + 'px';

        // Butang Camera
        const cameraBtn = document.createElement('button');
        cameraBtn.style.cssText = `width: 50px !important; height: 50px !important; border-radius: 50% !important; border: none !important; background: #6c757d !important; display: flex !important; align-items: center !important; justify-content: center !important; cursor: pointer !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; transition: transform 0.2s !important;`;
        cameraBtn.innerHTML = '<i class="fas fa-camera" style="font-size: 22px !important; color: white !important;"></i>';
        cameraBtn.onmouseenter = () => cameraBtn.style.transform = 'scale(1.1)';
        cameraBtn.onmouseleave = () => cameraBtn.style.transform = 'scale(1)';
        cameraBtn.onclick = (ev) => { ev.stopPropagation(); this.openFilePicker('camera'); };

        // Butang Gallery
        const galleryBtn = document.createElement('button');
        galleryBtn.style.cssText = `width: 50px !important; height: 50px !important; border-radius: 50% !important; border: none !important; background: #1a73e8 !important; display: flex !important; align-items: center !important; justify-content: center !important; cursor: pointer !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important; transition: transform 0.2s !important;`;
        galleryBtn.innerHTML = '<i class="fas fa-images" style="font-size: 22px !important; color: white !important;"></i>';
        galleryBtn.onmouseenter = () => galleryBtn.style.transform = 'scale(1.1)';
        galleryBtn.onmouseleave = () => galleryBtn.style.transform = 'scale(1)';
        galleryBtn.onclick = (ev) => { ev.stopPropagation(); this.openFilePicker('gallery'); };

        menu.appendChild(cameraBtn);
        menu.appendChild(galleryBtn);
        document.body.appendChild(menu);

        // Tutup menu bila klik di luar
        setTimeout(() => {
            document.addEventListener('click', this.closeMenu.bind(this), { once: true });
        }, 100);
    },

    closeMenu: function() {
        const menu = document.getElementById('photoOptionMenu');
        if (menu) menu.remove();
    },

    openFilePicker: function(source) {
        if (!this.input) return;
        if (source === 'camera') {
            this.input.setAttribute('capture', 'environment');
        } else {
            this.input.removeAttribute('capture');
        }
        this.input.value = ''; // Reset supaya boleh pilih gambar yang sama
        this.input.click();
        this.closeMenu();
    },

    reset: function() {
        if (this.preview) { this.preview.style.display = 'none'; this.preview.src = ''; }
        if (this.placeholder) { this.placeholder.style.display = 'flex'; }
        if (this.input) { this.input.value = ''; }
    }
};
