/**
 * Universal Photo Picker Component
 * Self-contained dengan inline styles, persis seperti HeaderMenu.
 */
const PhotoPicker = {
    init(wrapperId, inputId, previewId, placeholderId, callback) {
        this.wrapper = document.getElementById(wrapperId);
        this.input = document.getElementById(inputId);
        this.preview = document.getElementById(previewId);
        this.placeholder = document.getElementById(placeholderId);
        this.callback = callback;

        if (!this.wrapper || !this.input) {
            console.error('PhotoPicker: Wrapper atau Input tidak dijumpai!');
            return;
        }

        // Bind click pada placeholder dan preview
        if (this.placeholder) this.placeholder.addEventListener('click', (e) => this.showMenu(e));
        if (this.preview) this.preview.addEventListener('click', (e) => this.showMenu(e));

        // Handle bila fail dipilih
        this.input.addEventListener('change', (e) => this.handleFile(e));
    },

    showMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        this.closeMenu();

        const menu = document.createElement('div');
        menu.id = 'photoOptionMenu';
        
        // INLINE STYLES (Persis seperti HeaderMenu)
        menu.style.cssText = `
            position: fixed;
            background: transparent;
            padding: 5px;
            z-index: 10000;
            display: flex;
            gap: 15px;
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 0.2s ease, transform 0.2s ease;
        `;

        // Kira posisi tepat di bawah wrapper
        const rect = this.wrapper.getBoundingClientRect();
        menu.style.top = (rect.bottom + window.scrollY + 10) + 'px';
        menu.style.left = (rect.left + window.scrollX + (rect.width / 2) - 55) + 'px';

        // --- BUTANG CAMERA ---
        const camBtn = document.createElement('button');
        camBtn.style.cssText = `
            width: 50px; height: 50px; border-radius: 50%; border: none;
            background: #6c757d; display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            -webkit-tap-highlight-color: transparent;
        `;
        camBtn.innerHTML = '<i class="fas fa-camera" style="font-size: 22px; color: white;"></i>';
        camBtn.onmouseenter = () => camBtn.style.transform = 'scale(1.1)';
        camBtn.onmouseleave = () => camBtn.style.transform = 'scale(1)';
        camBtn.onclick = (ev) => {
            ev.stopPropagation();
            this.input.setAttribute('capture', 'environment');
            this.input.value = '';
            this.input.click();
            this.closeMenu();
        };

        // --- BUTANG GALLERY ---
        const galBtn = document.createElement('button');
        galBtn.style.cssText = `
            width: 50px; height: 50px; border-radius: 50%; border: none;
            background: #1a73e8; display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            -webkit-tap-highlight-color: transparent;
        `;
        galBtn.innerHTML = '<i class="fas fa-images" style="font-size: 22px; color: white;"></i>';
        galBtn.onmouseenter = () => galBtn.style.transform = 'scale(1.1)';
        galBtn.onmouseleave = () => galBtn.style.transform = 'scale(1)';
        galBtn.onclick = (ev) => {
            ev.stopPropagation();
            this.input.removeAttribute('capture');
            this.input.value = '';
            this.input.click();
            this.closeMenu();
        };

        menu.appendChild(camBtn);
        menu.appendChild(galBtn);
        document.body.appendChild(menu);

        // Trigger animasi muncul
        setTimeout(() => {
            menu.style.opacity = '1';
            menu.style.transform = 'scale(1)';
        }, 10);

        // Tutup bila klik di luar
        setTimeout(() => {
            document.addEventListener('click', this.closeMenu.bind(this), { once: true });
        }, 100);
    },

    closeMenu() {
        const menu = document.getElementById('photoOptionMenu');
        if (menu) {
            menu.style.opacity = '0';
            menu.style.transform = 'scale(0.8)';
            setTimeout(() => {
                if (menu.parentNode) menu.parentNode.removeChild(menu);
            }, 200);
        }
    },

    handleFile(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = ev.target.result;
                if (this.preview) {
                    this.preview.src = base64;
                    this.preview.style.display = 'block';
                }
                if (this.placeholder) {
                    this.placeholder.style.display = 'none';
                }
                if (this.callback) {
                    this.callback(base64);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    },

    reset() {
        if (this.preview) {
            this.preview.style.display = 'none';
            this.preview.src = '';
        }
        if (this.placeholder) {
            this.placeholder.style.display = 'flex';
        }
        if (this.input) {
            this.input.value = '';
        }
    }
};
