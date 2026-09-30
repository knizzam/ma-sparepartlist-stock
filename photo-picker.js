const PhotoPicker = {
    init: function(config) {
        this.config = config || {};
        this.wrapper = document.getElementById(this.config.wrapperId || 'photoWrapper');
        this.input = document.getElementById(this.config.inputId || 'photoInput');
        this.preview = document.getElementById(this.config.previewId || 'photoPreview');
        this.placeholder = document.getElementById(this.config.placeholderId || 'photoPlaceholder');
        
        if (this.input) this.input.style.display = 'none';
        
        window.showPhotoMenu = this.showMenu.bind(this);
        window.closePhotoMenu = this.closeMenu.bind(this);
        window.openFilePicker = this.openFilePicker.bind(this);
        
        console.log('✅ PhotoPicker Ready');
    },

    showMenu: function(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        this.closeMenu();
        
        alert('🚨 MENU SEDANG DIBUKA!');
        
        const menu = document.createElement('div');
        menu.id = 'photoOptionMenu';
        
        // LETAK DI TENGAH SKRIN - PASTI KELUAR
        menu.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: white !important;
            padding: 30px !important;
            border-radius: 15px !important;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
            z-index: 9999999 !important;
            display: flex !important;
            flex-direction: row !important;
            gap: 20px !important;
            border: 3px solid red !important;
        `;

        const cameraBtn = document.createElement('button');
        cameraBtn.style.cssText = `width: 70px !important; height: 70px !important; border-radius: 50% !important; border: none !important; background: #6c757d !important; display: flex !important; align-items: center !important; justify-content: center !important; cursor: pointer !important; font-size: 30px !important; color: white !important;`;
        cameraBtn.innerHTML = '📷';
        cameraBtn.onclick = (ev) => { ev.stopPropagation(); this.openFilePicker('camera'); };

        const galleryBtn = document.createElement('button');
        galleryBtn.style.cssText = `width: 70px !important; height: 70px !important; border-radius: 50% !important; border: none !important; background: #1a73e8 !important; display: flex !important; align-items: center !important; justify-content: center !important; cursor: pointer !important; font-size: 30px !important; color: white !important;`;
        galleryBtn.innerHTML = '🖼️';
        galleryBtn.onclick = (ev) => { ev.stopPropagation(); this.openFilePicker('gallery'); };

        menu.appendChild(cameraBtn);
        menu.appendChild(galleryBtn);
        document.body.appendChild(menu);
        
        console.log('✅ Menu dicipta di DOM');
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
