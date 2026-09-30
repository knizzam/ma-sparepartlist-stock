const PhotoPicker = {
    init: function(config) {
        this.config = config || {};
        this.wrapper = document.getElementById(this.config.wrapperId || 'photoWrapper');
        this.input = document.getElementById(this.config.inputId || 'photoInput');
        this.preview = document.getElementById(this.config.previewId || 'photoPreview');
        this.placeholder = document.getElementById(this.config.placeholderId || 'photoPlaceholder');
        
        if (this.input) this.input.style.display = 'none';
        
        // Paksa wrapper jadi relative supaya menu boleh melekat padanya
        if (this.wrapper) {
            this.wrapper.style.position = 'relative';
            this.wrapper.style.overflow = 'visible'; // Elak menu terpotong
        }
        
        window.showPhotoMenu = this.showMenu.bind(this);
        window.closePhotoMenu = this.closeMenu.bind(this);
        window.openFilePicker = this.openFilePicker.bind(this);
    },

    showMenu: function(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.closeMenu();
        
        const menu = document.createElement('div');
        menu.id = 'photoOptionMenu';
        
        // GUNA POSITION ABSOLUTE SUPAYA MELEKAT PADA WRAPPER
        menu.style.cssText = `
            position: absolute !important;
            bottom: -65px !important; /* Letak tepat di bawah frame */
            left: 50% !important;
            transform: translateX(-50%) !important;
            background: transparent !important;
            padding: 5px !important;
            z-index: 100 !important;
            display: flex !important;
            flex-direction: row !important;
            gap: 15px !important;
            white-space: nowrap !important;
        `;

        // Butang Camera
        const cameraBtn = document.createElement('button');
        cameraBtn.style.cssText = `
            width: 50px !important; height: 50px !important; border-radius: 50% !important;
            border: none !important; background: #6c757d !important;
            display: flex !important; align-items: center !important; justify-content: center !important;
            cursor: pointer !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            transition: transform 0.2s !important; margin: 0 !important; padding: 0 !important;
        `;
        cameraBtn.innerHTML = '<i class="fas fa-camera" style="font-size: 22px !important; color: white !important;"></i>';
        cameraBtn.onmouseenter = () => cameraBtn.style.transform = 'scale(1.1)';
        cameraBtn.onmouseleave = () => cameraBtn.style.transform = 'scale(1)';
        cameraBtn.onclick = (ev) => { ev.stopPropagation(); this.openFilePicker('camera'); };

        // Butang Gallery
        const galleryBtn = document.createElement('button');
        galleryBtn.style.cssText = `
            width: 50px !important; height: 50px !important; border-radius: 50% !important;
            border: none !important; background: #1a73e8 !important;
            display: flex !important; align-items: center !important; justify-content: center !important;
            cursor: pointer !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            transition: transform 0.2s !important; margin: 0 !important; padding: 0 !important;
        `;
        galleryBtn.innerHTML = '<i class="fas fa-images" style="font-size: 22px !important; color: white !important;"></i>';
        galleryBtn.onmouseenter = () => galleryBtn.style.transform = 'scale(1.1)';
        galleryBtn.onmouseleave = () => galleryBtn.style.transform = 'scale(1)';
        galleryBtn.onclick = (ev) => { ev.stopPropagation(); this.openFilePicker('gallery'); };

        menu.appendChild(cameraBtn);
        menu.appendChild(galleryBtn);
        
        // LETAK DALAM WRAPPER (BUKAN BODY) SUPAYA IKUT FRAME SCROLL
        this.wrapper.appendChild(menu);

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
        this.input.value = '';
        this.input.click();
        this.closeMenu();
    },

    reset: function() {
        if (this.preview) { this.preview.style.display = 'none'; this.preview.src = ''; }
        if (this.placeholder) { this.placeholder.style.display = 'flex'; }
        if (this.input) { this.input.value = ''; }
    }
};
