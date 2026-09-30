const PhotoPicker = {
    init(wrapperId, inputId, previewId, placeholderId, callback) {
        this.wrapper = document.getElementById(wrapperId);
        this.input = document.getElementById(inputId);
        this.preview = document.getElementById(previewId);
        this.placeholder = document.getElementById(placeholderId);
        this.callback = callback;

        if (!this.wrapper || !this.input) {
            console.error('❌ PhotoPicker: ID tidak dijumpai! Sila semak HTML.');
            return;
        }

        console.log('✅ PhotoPicker berjaya diinisialisasi.');

        // PAKSA input file tersembunyi supaya tidak ganggu klik
        this.input.style.display = 'none';

        const clickHandler = (e) => {
            console.log('👆 KLIK DIKESAN! Membuka menu...');
            e.preventDefault();
            e.stopPropagation();
            this.showMenu();
        };

        if (this.placeholder) {
            this.placeholder.style.cursor = 'pointer';
            this.placeholder.addEventListener('click', clickHandler);
        }
        if (this.preview) {
            this.preview.style.cursor = 'pointer';
            this.preview.addEventListener('click', clickHandler);
        }

        this.input.addEventListener('change', (e) => this.handleFile(e));
    },

    showMenu() {
        this.closeMenu();

        const menu = document.createElement('div');
        menu.id = 'photoOptionMenu';
        
        // Kita letak di TENGAH SKRIN dulu untuk pastikan ia muncul
        menu.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 999999;
            display: flex;
            gap: 20px;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;

        // --- BUTANG CAMERA ---
        const camBtn = document.createElement('button');
        camBtn.style.cssText = `
            width: 60px; height: 60px; border-radius: 50%; border: none;
            background: #6c757d; display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: transform 0.2s;
        `;
        camBtn.innerHTML = '<i class="fas fa-camera" style="font-size: 24px; color: white;"></i>';
        camBtn.onclick = (ev) => {
            ev.stopPropagation();
            console.log('📷 Butang Camera ditekan');
            this.input.setAttribute('capture', 'environment');
            this.input.value = '';
            this.input.click();
            this.closeMenu();
        };

        // --- BUTANG GALLERY ---
        const galBtn = document.createElement('button');
        galBtn.style.cssText = `
            width: 60px; height: 60px; border-radius: 50%; border: none;
            background: #1a73e8; display: flex; align-items: center; justify-content: center;
            cursor: pointer; transition: transform 0.2s;
        `;
        galBtn.innerHTML = '<i class="fas fa-images" style="font-size: 24px; color: white;"></i>';
        galBtn.onclick = (ev) => {
            ev.stopPropagation();
            console.log('🖼️ Butang Gallery ditekan');
            this.input.removeAttribute('capture');
            this.input.value = '';
            this.input.click();
            this.closeMenu();
        };

        menu.appendChild(camBtn);
        menu.appendChild(galBtn);
        document.body.appendChild(menu);
        console.log('📦 Menu dimasukkan ke dalam HTML (DOM).');

        // Animasi muncul
        setTimeout(() => {
            menu.style.opacity = '1';
        }, 10);

        // Tutup bila klik di luar
        setTimeout(() => {
            document.addEventListener('click', this.closeMenu.bind(this), { once: true });
        }, 100);
    },

    closeMenu() {
        const menu = document.getElementById('photoOptionMenu');
        if (menu) {
            console.log('🚪 Menu ditutup.');
            menu.style.opacity = '0';
            setTimeout(() => {
                if (menu.parentNode) menu.parentNode.removeChild(menu);
            }, 200);
        }
    },

    handleFile(e) {
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
                if (this.callback) {
                    this.callback(base64);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    },

    reset() {
        if (this.preview) { this.preview.style.display = 'none'; this.preview.src = ''; }
        if (this.placeholder) { this.placeholder.style.display = 'flex'; }
        if (this.input) { this.input.value = ''; }
    }
};
