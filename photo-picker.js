/**
 * Universal Photo Picker Component
 * Boleh digunakan di Add Product, Registration Users, dll.
 * 
 * Cara Guna:
 * PhotoPicker.init('wrapperId', 'inputId', 'previewId', 'placeholderId', callback);
 */

const PhotoPicker = {
    inputEl: null,
    previewEl: null,
    placeholderEl: null,
    wrapperEl: null,
    onImageSelected: null,

    /**
     * Inisialisasi Photo Picker
     * @param {string} wrapperId - ID div wrapper
     * @param {string} inputId - ID input file
     * @param {string} previewId - ID img preview
     * @param {string} placeholderId - ID div placeholder
     * @param {function} callback - Fungsi dipanggil bila gambar dipilih (terima base64)
     */
    init(wrapperId, inputId, previewId, placeholderId, callback) {
        this.wrapperEl = document.getElementById(wrapperId);
        this.inputEl = document.getElementById(inputId);
        this.previewEl = document.getElementById(previewId);
        this.placeholderEl = document.getElementById(placeholderId);
        this.onImageSelected = callback;

        if (!this.wrapperEl || !this.inputEl) {
            console.error('PhotoPicker: Wrapper atau Input tidak dijumpai!');
            return;
        }

        // Klik pada wrapper (placeholder ATAU preview) akan buka menu
        this.wrapperEl.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showMenu(e);
        });

        // Handle bila user pilih gambar
        this.inputEl.addEventListener('change', (e) => this.handleFile(e));
    },

    /**
     * Tunjuk floating menu
     */
    showMenu(e) {
        this.closeMenu();

        const menu = document.createElement('div');
        menu.className = 'photo-option-menu';
        menu.id = 'photoOptionMenu';

        // Kira posisi di bawah elemen yang diklik
        const rect = this.wrapperEl.getBoundingClientRect();
        menu.style.top = (rect.bottom + window.scrollY + 10) + 'px';
        menu.style.left = (rect.left + window.scrollX + (rect.width / 2) - 55) + 'px';

        // Butang Camera
        const cameraBtn = document.createElement('button');
        cameraBtn.className = 'photo-option-item';
        cameraBtn.style.background = '#6c757d';
        cameraBtn.innerHTML = '<i class="fas fa-camera"></i>';
        cameraBtn.onclick = (ev) => {
            ev.stopPropagation();
            this.selectSource('camera');
        };

        // Butang Gallery
        const galleryBtn = document.createElement('button');
        galleryBtn.className = 'photo-option-item';
        galleryBtn.style.background = '#1a73e8';
        galleryBtn.innerHTML = '<i class="fas fa-images"></i>';
        galleryBtn.onclick = (ev) => {
            ev.stopPropagation();
            this.selectSource('gallery');
        };

        menu.appendChild(cameraBtn);
        menu.appendChild(galleryBtn);
        document.body.appendChild(menu);

        // Auto close bila klik di luar
        setTimeout(() => {
            document.addEventListener('click', () => this.closeMenu(), { once: true });
        }, 100);
    },

    /**
     * Pilih sumber (camera atau gallery)
     */
    selectSource(source) {
        if (source === 'camera') {
            this.inputEl.setAttribute('capture', 'environment');
        } else {
            this.inputEl.removeAttribute('capture');
        }

        // Reset value supaya boleh pilih gambar yang sama
        this.inputEl.value = '';

        // Close menu dulu, kemudian buka file picker
        this.closeMenu();

        // Guna setTimeout untuk pastikan menu dah close sebelum buka file picker
        setTimeout(() => {
            this.inputEl.click();
        }, 50);
    },

    /**
     * Tutup menu
     */
    closeMenu() {
        const menu = document.getElementById('photoOptionMenu');
        if (menu) menu.remove();
    },

    /**
     * Handle bila user pilih gambar
     */
    handleFile(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = ev.target.result;

                // Update preview
                if (this.previewEl) {
                    this.previewEl.src = base64;
                    this.previewEl.style.display = 'block';
                }

                // Sembunyikan placeholder
                if (this.placeholderEl) {
                    this.placeholderEl.style.display = 'none';
                }

                // Panggil callback jika ada
                if (this.onImageSelected) {
                    this.onImageSelected(base64);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    },

    /**
     * Reset photo picker (buang gambar)
     */
    reset() {
        if (this.previewEl) {
            this.previewEl.style.display = 'none';
            this.previewEl.src = '';
        }
        if (this.placeholderEl) {
            this.placeholderEl.style.display = 'flex';
        }
        if (this.inputEl) {
            this.inputEl.value = '';
        }
    }
};
