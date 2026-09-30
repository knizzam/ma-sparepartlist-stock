/**
 * Photo Picker Component
 */
const PhotoPicker = {
    init(config = {}) {
        this.config = {
            wrapperId: 'photoWrapper',
            inputId: 'photoInput',
            previewId: 'photoPreview',
            placeholderId: 'photoPlaceholder',
            onImageSelected: null,
            ...config
        };
        
        this.wrapper = document.getElementById(this.config.wrapperId);
        this.input = document.getElementById(this.config.inputId);
        this.preview = document.getElementById(this.config.previewId);
        this.placeholder = document.getElementById(this.config.placeholderId);

        if (!this.wrapper || !this.input) {
            console.error('❌ PhotoPicker: ID tidak dijumpai! Sila semak HTML.');
            return;
        }

        console.log('✅ PhotoPicker berjaya diinisialisasi.');
        this.input.style.display = 'none';

        this.createMenu();
        this.attachEvents();
    },

    createMenu() {
        const oldMenu = document.getElementById('photoOptionMenu');
        if (oldMenu) oldMenu.remove();
        
        const menu = document.createElement('div');
        menu.id = 'photoOptionMenu';
        menu.style.cssText = `
            position: fixed;
            background: white;
            padding: 10px 15px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 999999;
            display: none;
            flex-direction: row;
            gap: 15px;
            opacity: 0;
            transform: scale(0.8);
            transition: opacity 0.2s ease, transform 0.2s ease;
        `;

        const camBtn = document.createElement('button');
        camBtn.style.cssText = `
            width: 50px; height: 50px; border-radius: 50%; border: none;
            background: #6c757d; display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: transform 0.2s;
        `;
        camBtn.innerHTML = '<i class="fas fa-camera" style="font-size: 22px; color: white;"></i>';
        camBtn.onclick = (e) => {
            e.stopPropagation();
            console.log('📷 Kamera dipilih');
            this.input.setAttribute('capture', 'environment');
            this.input.value = '';
            this.input.click();
            this.close();
        };

        const galBtn = document.createElement('button');
        galBtn.style.cssText = `
            width: 50px; height: 50px; border-radius: 50%; border: none;
            background: #1a73e8; display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: transform 0.2s;
        `;
        galBtn.innerHTML = '<i class="fas fa-images" style="font-size: 22px; color: white;"></i>';
        galBtn.onclick = (e) => {
            e.stopPropagation();
            console.log('🖼️ Galeri dipilih');
            this.input.removeAttribute('capture');
            this.input.value = '';
            this.input.click();
            this.close();
        };

        menu.appendChild(camBtn);
        menu.appendChild(galBtn);
        document.body.appendChild(menu);
        console.log('📦 Menu floating dicipta dalam DOM.');
    },

    attachEvents() {
        const openMenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('👆 Klik dikesan pada foto! Membuka menu...');
            
            const menu = document.getElementById('photoOptionMenu');
            if (!menu) return;

            const rect = this.wrapper.getBoundingClientRect();
            menu.style.top = (rect.bottom + window.scrollY + 10) + 'px';
            menu.style.left = (rect.left + window.scrollX + (rect.width / 2) - 55) + 'px';

            menu.style.display = 'flex';
            setTimeout(() => {
                menu.style.opacity = '1';
                menu.style.transform = 'scale(1)';
            }, 10);

            setTimeout(() => {
                document.addEventListener('click', this.close.bind(this), { once: true });
            }, 100);
        };

        if (this.placeholder) {
            this.placeholder.addEventListener('click', openMenu);
        }
        if (this.preview) {
            this.preview.addEventListener('click', openMenu);
        }

        this.input.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                console.log('📁 Fail dipilih, memproses...');
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
                    if (this.config.onImageSelected) {
                        this.config.onImageSelected(base64);
                    }
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        });
    },

    close() {
        const menu = document.getElementById('photoOptionMenu');
        if (menu) {
            console.log('🚪 Menu ditutup.');
            menu.style.opacity = '0';
            menu.style.transform = 'scale(0.8)';
            setTimeout(() => {
                menu.style.display = 'none';
            }, 200);
        }
    },

    reset() {
        if (this.preview) { this.preview.style.display = 'none'; this.preview.src = ''; }
        if (this.placeholder) { this.placeholder.style.display = 'flex'; }
        if (this.input) { this.input.value = ''; }
    }
};
