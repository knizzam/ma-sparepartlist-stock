/**
 * Floating Action Menu (FAM) Component
 * Versi Diperbaiki - Selari dengan Header
 */

const FloatingActions = {
    defaultConfig: {
        position: 'top-right',
        buttons: [],
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        iconColor: '#333',
        hoverColor: '#f0f0f0'
    },

    init(config = {}) {
        this.config = { ...this.defaultConfig, ...config };
        this.createMenu();
        this.createOverlay();
        this.attachEvents();
    },

    createMenu() {
        const menuContainer = document.createElement('div');
        menuContainer.id = 'floatingActionMenu';
        menuContainer.className = 'floating-action-container';
        
        // PERBAIKAN: Position selari dengan header content
        if (this.config.position === 'top-right') {
            menuContainer.style.cssText = `
                position: fixed;
                top: 1px;
                right: 15px;
                z-index: 1001;
            `;
        } else {
            menuContainer.style.cssText = `
                position: fixed;
                top: 1px;
                left: 15px;
                z-index: 1001;
            `;
        }

        const menuItems = document.createElement('div');
        menuItems.id = 'floatingMenuItems';
        menuItems.className = 'floating-menu-items';
        
        this.config.buttons.forEach((btn, index) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'floating-menu-item';
            menuItem.style.cssText = `
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: ${this.config.backgroundColor};
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                margin-bottom: 10px;
                transition: all 0.2s;
                opacity: 0;
                transform: translateY(-10px);
                pointer-events: none;
            `;
            
            menuItem.innerHTML = `<i class="${btn.icon}" style="font-size: 18px; color: ${btn.color || this.config.iconColor};"></i>`;
            menuItem.title = btn.title;
            
            menuItem.onclick = (e) => {
                e.stopPropagation();
                btn.action();
                this.closeMenu();
            };
            
            menuItem.onmouseenter = () => {
                menuItem.style.background = this.config.hoverColor;
                menuItem.style.transform = 'scale(1.1)';
            };
            
            menuItem.onmouseleave = () => {
                menuItem.style.background = this.config.backgroundColor;
                menuItem.style.transform = 'scale(1)';
            };
            
            menuItems.appendChild(menuItem);
        });

        const triggerBtn = document.createElement('div');
        triggerBtn.id = 'floatingTriggerBtn';
        triggerBtn.className = 'floating-trigger-btn';
        triggerBtn.style.cssText = `
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        `;
        
        triggerBtn.innerHTML = '<i class="fas fa-ellipsis-v" style="font-size: 18px; color: #333;"></i>';
        
        triggerBtn.onmouseenter = () => {
            triggerBtn.style.background = '#f0f0f0';
            triggerBtn.style.transform = 'scale(1.05)';
        };
        
        triggerBtn.onmouseleave = () => {
            triggerBtn.style.background = 'white';
            triggerBtn.style.transform = 'scale(1)';
        };

        menuContainer.appendChild(menuItems);
        menuContainer.appendChild(triggerBtn);
        document.body.appendChild(menuContainer);
    },

    createOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'floatingOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.3);
            z-index: 1000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
        `;
        
        overlay.onclick = () => this.closeMenu();
        document.body.appendChild(overlay);
    },

    attachEvents() {
        const triggerBtn = document.getElementById('floatingTriggerBtn');
        triggerBtn.onclick = (e) => {
            e.stopPropagation();
            this.toggleMenu();
        };
    },

    toggleMenu() {
        const menuItems = document.getElementById('floatingMenuItems');
        const overlay = document.getElementById('floatingOverlay');
        const triggerBtn = document.getElementById('floatingTriggerBtn');
        
        if (menuItems.classList.contains('show')) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    },

    openMenu() {
        const menuItems = document.getElementById('floatingMenuItems');
        const overlay = document.getElementById('floatingOverlay');
        const triggerBtn = document.getElementById('floatingTriggerBtn');
        const items = menuItems.querySelectorAll('.floating-menu-item');
        
        menuItems.classList.add('show');
        overlay.style.opacity = '1';
        overlay.style.pointerEvents = 'auto';
        
        triggerBtn.querySelector('i').style.transform = 'rotate(90deg)';
        
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
                item.style.pointerEvents = 'auto';
            }, index * 50);
        });
    },

    closeMenu() {
        const menuItems = document.getElementById('floatingMenuItems');
        const overlay = document.getElementById('floatingOverlay');
        const triggerBtn = document.getElementById('floatingTriggerBtn');
        const items = menuItems.querySelectorAll('.floating-menu-item');
        
        menuItems.classList.remove('show');
        overlay.style.opacity = '0';
        overlay.style.pointerEvents = 'none';
        
        triggerBtn.querySelector('i').style.transform = 'rotate(0deg)';
        
        items.forEach((item) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(-10px)';
            item.style.pointerEvents = 'none';
        });
    },

    updateButtons(newButtons) {
        this.config.buttons = newButtons;
        const menuItems = document.getElementById('floatingMenuItems');
        menuItems.innerHTML = '';
        
        newButtons.forEach((btn) => {
            const menuItem = document.createElement('div');
            menuItem.className = 'floating-menu-item';
            menuItem.style.cssText = `
                width: 44px;
                height: 44px;
                border-radius: 50%;
                background: ${this.config.backgroundColor};
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                margin-bottom: 10px;
                transition: all 0.2s;
                opacity: 0;
                transform: translateY(-10px);
                pointer-events: none;
            `;
            
            menuItem.innerHTML = `<i class="${btn.icon}" style="font-size: 18px; color: ${btn.color || this.config.iconColor};"></i>`;
            menuItem.title = btn.title;
            
            menuItem.onclick = (e) => {
                e.stopPropagation();
                btn.action();
                this.closeMenu();
            };
            
            menuItem.onmouseenter = () => {
                menuItem.style.background = this.config.hoverColor;
                menuItem.style.transform = 'scale(1.1)';
            };
            
            menuItem.onmouseleave = () => {
                menuItem.style.background = this.config.backgroundColor;
                menuItem.style.transform = 'scale(1)';
            };
            
            menuItems.appendChild(menuItem);
        });
    }
};
