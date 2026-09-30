const PhotoPicker = {
    inputEl: null, previewEl: null, placeholderEl: null, wrapperEl: null, onImageSelected: null,

    init(wrapperId, inputId, previewId, placeholderId, callback) {
        this.wrapperEl = document.getElementById(wrapperId);
        this.inputEl = document.getElementById(inputId);
        this.previewEl = document.getElementById(previewId);
        this.placeholderEl = document.getElementById(placeholderId);
        this.onImageSelected = callback;

        if (this.wrapperEl) {
            this.wrapperEl.addEventListener('click', (e) => this.showMenu(e, this.wrapperEl));
        }
        this.inputEl.addEventListener('change', (e) => this.handleFile(e));
    },

    showMenu(e, triggerElement) {
        e.preventDefault(); 
        e.stopPropagation();
        this.closeMenu();

        const menu = document.createElement('div');
        menu.className = 'photo-option-menu'; 
        menu.id = 'photoOptionMenu';

        const rect = triggerElement.getBoundingClientRect();
        menu.style.top = (rect.bottom + window.scrollY + 10) + 'px';
        menu.style.left = (rect.left + window.scrollX + (rect.width / 2) - 55) + 'px';

        // BUTANG CAMERA
        const cameraBtn = document.createElement('div');
        cameraBtn.className = 'photo-option-item';
        cameraBtn.style.background = '#6c757d';
        cameraBtn.innerHTML = '<i class="fas fa-camera"></i>';
        cameraBtn.addEventListener('click', (ev) => {
            ev.stopPropagation(); // PENTING: Elak event bubble ke document
            this.selectSource('camera');
        });

        // BUTANG GALLERY
        const galleryBtn = document.createElement('div');
        galleryBtn.className = 'photo-option-item';
        galleryBtn.style.background = '#1a73e8';
        galleryBtn.innerHTML = '<i class="fas fa-images"></i>';
        galleryBtn.addEventListener('click', (ev) => {
            ev.stopPropagation(); // PENTING: Elak event bubble ke document
            this.selectSource('gallery');
        });

        menu.appendChild(cameraBtn);
        menu.appendChild(galleryBtn);
        document.body.appendChild(menu);

        // Tutup menu bila klik di luar
        setTimeout(() => {
            document.addEventListener('click', () => this.closeMenu(), { once: true });
        }, 100);
    },

    selectSource(source) {
        if (source === 'camera') {
            this.inputEl.setAttribute('capture', 'environment');
        } else {
            this.inputEl.removeAttribute('capture');
        }
        
        // Close menu DULU, kemudian buka file picker
        this.closeMenu();
        
        // Guna setTimeout kecil untuk pastikan menu dah close sebelum buka file picker
        setTimeout(() => {
            this.inputEl.click();
        }, 50);
    },

    closeMenu() {
        const menu = document.getElementById('photoOptionMenu');
        if (menu) menu.remove();
    },

    handleFile(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = ev.target.result;
                if (this.previewEl) { 
                    this.previewEl.src = base64; 
                    this.previewEl.style.display = 'block'; 
                }
                if (this.placeholderEl) this.placeholderEl.style.display = 'none';
                if (this.onImageSelected) this.onImageSelected(base64);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }
};
