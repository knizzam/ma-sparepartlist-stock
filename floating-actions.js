/**
 * Header Dropdown Menu Component
 * Menu floating dengan icon bulat berwarna
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
        // Buang dropdown lama jika ada
        const oldDropdown = document.getElementById('headerDropdownMenu');
        if (oldDropdown) oldDropdown.remove();
        
        const dropdown = document.createElement('div');
        dropdown.id = 'headerDropdownMenu';
        dropdown.style.cssText = `
            position: absolute;
            top: 60px;
            right: 15px;
            background: transparent;
            padding: 8px;
            z-index: 1000;
            display: none;
            flex-direction: column;
            gap: 10px;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.2s ease, transform 0.2s ease;
        `;

        this.config.buttons.forEach(btn => {
            const item = document.createElement('div');
            item.title = btn.title;
            item.style.cssText = `
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: ${btn.color || '#333'};
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: transform 0.2s;
            `;
            item.innerHTML = `<i class="${btn.icon}" style="color: white; font-size: 20px;"></i>`;
            
            item.onmouseenter = () => item.style.transform = 'scale(1.1)';
            item.onmouseleave = () => item.style.transform = 'scale(1)';
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
