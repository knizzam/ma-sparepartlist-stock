/**
 * Universal Photo Picker Component
 * Boleh digunakan di Add Product, Registration, dll.
 */
const PhotoPicker = {
    inputEl: null,
    previewEl: null,
    placeholderEl: null,
    onImageSelected: null,

    // Inisialisasi: (ID butang klik, ID input file, ID preview img, ID placeholder, callback function)
    init(triggerId, inputId, previewId, placeholderId, callback) {
        const trigger = document.getElementById(triggerId);
        if (!trigger) return;

        this.inputEl = document.getElementById(inputId);
        this.previewEl = document.getElementById(previewId);
        this.placeholderEl = document.getElementById(placeholderId);
        this.onImageSelected = callback;

        trigger.addEventListener('click', (e) => this.showMenu(e, trigger));
        this.inputEl.addEventListener('change', (e) => this.handleFile(e));
    },

    showMenu(e, triggerElement) {
        e.preventDefault();
        e.stopPropagation();
        this.closeMenu();

        const menu = document.createElement('div');
        menu.className = 'photo-option-menu';
        menu.id = 'photoOptionMenu';

        // Kira posisi tepat di bawah elemen yang diklik
        const rect = triggerElement.getBoundingClientRect();
        menu.style.top = (rect.bottom + window.scrollY + 10) + 'px';
        menu.style.left = (rect.left + window.scrollX + (rect.width / 2) - 55) + 'px'; // Center

        menu.innerHTML = `
            <div class="photo-option-item" onclick="PhotoPicker.selectSource('camera')" style="background: #6c757d;">
                <i class="fas fa-camera"></i>
            </div>
            <div class="photo-option-item" onclick="PhotoPicker.selectSource('gallery')" style="background: #1a73e8;">
                <i class="fas fa-images"></i>
            </div>
        `;
        document.body.appendChild(menu);
        
        // Tutup bila klik di luar
        setTimeout(() => document.addEventListener('click', this.closeMenu.bind(this), { once: true }), 100);
    },

    selectSource(source) {
        if (source === 'camera') this.inputEl.setAttribute('capture', 'environment');
        else this.inputEl.removeAttribute('capture');
        this.inputEl.click();
        this.closeMenu();
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
