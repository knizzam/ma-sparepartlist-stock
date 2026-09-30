/**
 * Header Dropdown Menu Component
 * Menu dropdown yang muncul di bawah butang 3 titik dalam header
 */
const HeaderMenu = {
    init(config = {}) {
        this.config = {
            triggerId: 'headerMenuTrigger',
            buttons: [],
            ...config
        };
        this.createDropdown();
        this.attachEvents();
    },

    createDropdown() {
        // Buang dropdown lama jika ada (elak duplicate)
        const oldDropdown = document.getElementById('headerDropdownMenu');
        if (oldDropdown) oldDropdown.remove();
        
        const dropdown = document.createElement('div');
        dropdown.id = 'headerDropdownMenu';
        dropdown.style.cssText = `
            position: absolute;
            top: 60px;
            right: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            padding: 8px 0;
            z-index: 1000;
            display: none;
            flex-direction: column;
            min-width: 160px;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.2s ease, transform 0.2s ease;
        `;

        this.config.buttons.forEach(btn => {
            const item = document.createElement('div');
            item.style.cssText = `
                padding: 12px 16px;
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                color: #333;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.2s;
            `;
            item.innerHTML = `<i class="${btn.icon}" style="color: ${btn.color || '#333'}; width: 20px; text-align: center; font-size: 16px;"></i> <span>${btn.title}</span>`;
            
            item.onmouseenter = () => item.style.background = '#f0f4f8';
            item.onmouseleave = () => item.style.background = 'transparent';
            item.onclick = (e) => {
                e.stopPropagation();
                btn.action();
                this.close();
            };
            
            dropdown.appendChild(item);
        });

        document.body.appendChild(dropdown);
    },

    attachEvents() {
        const trigger = document.getElementById(this.config.triggerId);
        const dropdown = document.getElementById('headerDropdownMenu');
        
        if (trigger && dropdown) {
            trigger.onclick = (e) => {
                e.stopPropagation();
                this.toggle();
            };

            document.addEventListener('click', (e) => {
                if (!trigger.contains(e.target) && !dropdown.contains(e.target)) {
                    this.close();
                }
            });
        }
    },

    toggle() {
        const dropdown = document.getElementById('headerDropdownMenu');
        if (dropdown.style.display === 'flex') {
            this.close();
        } else {
            dropdown.style.display = 'flex';
            setTimeout(() => {
                dropdown.style.opacity = '1';
                dropdown.style.transform = 'translateY(0)';
            }, 10);
        }
    },

    close() {
        const dropdown = document.getElementById('headerDropdownMenu');
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 200);
    }
};
