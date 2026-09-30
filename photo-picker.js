/**
 * Universal Photo Picker Component (Self-Contained)
 * Auto-inject CSS, jadi tidak perlu ubah styles.css atau register.css
 */
const PhotoPicker = {
    init(wrapperId, inputId, previewId, placeholderId, callback) {
        // 1. AUTO-INJECT CSS (Supaya floating menu sentiasa ada style)
        if (!document.getElementById('photo-picker-styles')) {
            const style = document.createElement('style');
            style.id = 'photo-picker-styles';
            style.textContent = `
                .photo-option-menu {
                    position: fixed; background: transparent; padding: 5px; z-index: 10000;
                    display: flex; gap: 15px; animation: popIn 0.2s ease;
                }
                .photo-option-item {
                    width: 50px; height: 50px; border-radius: 50%; border: none;
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .photo-option-item:active { transform: scale(0.9); }
                .photo-option-item i { font-size: 22px; color: white; }
                @keyframes popIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `;
            document.head.appendChild(style);
        }

        const wrapper = document.getElementById(wrapperId);
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        const placeholder = document.getElementById(placeholderId);

        if (!wrapper || !input) return;

        // 2. Fungsi Buka Menu
        const showMenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.closeMenu();

            const menu = document.createElement('div');
            menu.className = 'photo-option-menu';
            menu.id = 'photoOptionMenu';

            const rect = wrapper.getBoundingClientRect();
            menu.style.top = (rect.bottom + window.scrollY + 10) + 'px';
            menu.style.left = (rect.left + window.scrollX + (rect.width / 2) - 55) + 'px';

            const camBtn = document.createElement('button');
            camBtn.className = 'photo-option-item';
            camBtn.style.background = '#6c757d';
            camBtn.innerHTML = '<i class="fas fa-camera"></i>';
            camBtn.onclick = (ev) => {
                ev.stopPropagation();
                input.setAttribute('capture', 'environment');
                input.value = '';
                input.click();
                this.closeMenu();
            };

            const galBtn = document.createElement('button');
            galBtn.className = 'photo-option-item';
            galBtn.style.background = '#1a73e8';
            galBtn.innerHTML = '<i class="fas fa-images"></i>';
            galBtn.onclick = (ev) => {
                ev.stopPropagation();
                input.removeAttribute('capture');
                input.value = '';
                input.click();
                this.closeMenu();
            };

            menu.appendChild(camBtn);
            menu.appendChild(galBtn);
            document.body.appendChild(menu);

            setTimeout(() => {
                document.addEventListener('click', this.closeMenu, { once: true });
            }, 100);
        };

        // 3. Bind Click Events
        if (placeholder) placeholder.onclick = showMenu;
        if (preview) preview.onclick = showMenu;

        // 4. Handle File Change
        input.onchange = (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const base64 = ev.target.result;
                    if (preview) { preview.src = base64; preview.style.display = 'block'; }
                    if (placeholder) placeholder.style.display = 'none';
                    if (callback) callback(base64);
                };
                reader.readAsDataURL(e.target.files[0]);
            }
        };

        // 5. Fungsi Reset
        wrapper.resetPhoto = () => {
            if (preview) { preview.style.display = 'none'; preview.src = ''; }
            if (placeholder) placeholder.style.display = 'flex';
            input.value = '';
        };
    },

    closeMenu() {
        const menu = document.getElementById('photoOptionMenu');
        if (menu) menu.remove();
    }
};
