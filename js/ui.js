/**
 * UI Manager
 * Handles top bar interactions (notifications, user menu)
 */
class UIManager {
    constructor() {
        this.notificationPanel = null;
        this.userMenu = null;
    }

    init() {
        this.notificationPanel = document.getElementById('notification-panel');
        this.userMenu = document.getElementById('user-menu');

        // Notification bell click
        const notificationBell = document.getElementById('notification-bell');
        if (notificationBell) {
            notificationBell.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotificationPanel();
            });
        }

        // User avatar click
        const userAvatar = document.getElementById('user-avatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleUserMenu();
            });
        }

        // Close buttons
        document.getElementById('close-notifications')?.addEventListener('click', () => {
            this.hideNotificationPanel();
        });

        document.getElementById('close-user-menu')?.addEventListener('click', () => {
            this.hideUserMenu();
        });

        // Menu item clicks
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                this.handleMenuAction(action);
            });
        });

        // Close panels when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.notificationPanel?.contains(e.target) &&
                !document.getElementById('notification-bell')?.contains(e.target)) {
                this.hideNotificationPanel();
            }
            if (!this.userMenu?.contains(e.target) &&
                !document.getElementById('user-avatar')?.contains(e.target)) {
                this.hideUserMenu();
            }
        });

        // Mobile Menu Toggle
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');

        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                if (!sidebarOverlay) {
                    // Create overlay if it doesn't exist
                    const overlay = document.createElement('div');
                    overlay.className = 'sidebar-overlay';
                    document.body.appendChild(overlay);
                    overlay.addEventListener('click', () => {
                        sidebar.classList.remove('open');
                        overlay.classList.remove('active');
                    });
                }
                const overlay = document.querySelector('.sidebar-overlay');
                if (overlay) overlay.classList.toggle('active');
            });
        }

        // Close sidebar when clicking a nav item on mobile
        document.querySelectorAll('.nav-links li').forEach(item => {
            item.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('open');
                    const overlay = document.querySelector('.sidebar-overlay');
                    if (overlay) overlay.classList.remove('active');
                }
            });
        });

        // Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                if (window.SettingsManager) {
                    const currentSettings = window.SettingsManager.getSettings();
                    const newTheme = currentSettings.theme === 'dark' ? 'light' : 'dark';

                    // Update settings
                    const newSettings = { ...currentSettings, theme: newTheme };
                    window.SettingsManager.saveSettings(newSettings);

                    // Update UI if on settings page
                    const themeCheckbox = document.querySelector('input[name="theme_toggle"]');
                    if (themeCheckbox) {
                        themeCheckbox.checked = newTheme === 'dark';
                    }
                }
            });
        }

        // Initialize Search
        this.initSearch();
    }

    initSearch() {
        const searchInput = document.getElementById('global-search');
        const searchResults = document.getElementById('search-results');

        if (!searchInput || !searchResults) return;

        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();

            if (query.length < 1) {
                searchResults.classList.add('hidden');
                return;
            }

            // Debounce search (faster for "jQuery style" feel)
            searchTimeout = setTimeout(() => {
                this.performSearch(query);
            }, 50);
        });

        // Close results when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
                searchResults.classList.add('hidden');
            }
        });

        // Show results when focusing on search
        searchInput.addEventListener('focus', () => {
            if (searchInput.value.trim().length >= 2) {
                this.performSearch(searchInput.value.trim());
            }
        });
    }

    performSearch(query) {
        const searchResults = document.getElementById('search-results');
        const lowerQuery = query.toLowerCase();

        const results = {
            vehicles: [],
            documents: [],
            maintenance: []
        };

        // Search vehicles
        if (window.VehicleManager) {
            const vehicles = window.VehicleManager.getAll();
            const terms = lowerQuery.split(/\s+/).filter(t => t.length > 0);

            results.vehicles = vehicles.filter(v => {
                const searchableText = `${v.make} ${v.model} ${v.plate} ${v.year}`.toLowerCase();
                return terms.every(term => searchableText.includes(term));
            });
        }

        // Search documents
        if (window.DocumentManager) {
            const documents = window.DocumentManager.getAll();
            results.documents = documents.filter(d =>
                d.type.toLowerCase().includes(lowerQuery) ||
                (d.notes && d.notes.toLowerCase().includes(lowerQuery))
            );
        }

        // Search maintenance
        if (window.MaintenanceManager) {
            const maintenance = window.MaintenanceManager.getAll();
            results.maintenance = maintenance.filter(m =>
                m.type.toLowerCase().includes(lowerQuery) ||
                (m.notes && m.notes.toLowerCase().includes(lowerQuery))
            );
        }

        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query) {
        const searchResults = document.getElementById('search-results');
        const totalResults = results.vehicles.length + results.documents.length + results.maintenance.length;

        if (totalResults === 0) {
            searchResults.innerHTML = `
                <div class="search-no-results">
                    Aucun résultat pour "${query}"
                </div>
            `;
            searchResults.classList.remove('hidden');
            return;
        }

        let html = '';

        // Helper to highlight terms
        const highlight = (text, query) => {
            if (!query) return text;
            const terms = query.split(/\s+/).filter(t => t.length > 0);
            let highlighted = text;
            terms.forEach(term => {
                const regex = new RegExp(`(${term})`, 'gi');
                highlighted = highlighted.replace(regex, '<span class="highlight">$1</span>');
            });
            return highlighted;
        };

        // Vehicles
        if (results.vehicles.length > 0) {
            html += '<div class="search-category">Véhicules</div>';
            results.vehicles.forEach(v => {
                html += `
                    <div class="search-result-item" data-type="vehicle" data-id="${v.id}">
                        <div class="search-result-title">${highlight(`${v.make} ${v.model}`, query)}</div>
                        <div class="search-result-subtitle">${highlight(v.plate, query)} • ${highlight(v.year.toString(), query)}</div>
                    </div>
                `;
            });
        }

        // Documents
        if (results.documents.length > 0) {
            html += '<div class="search-category">Documents</div>';
            results.documents.forEach(d => {
                const vehicleName = this.getVehicleName(d.vehicleId);
                html += `
                    <div class="search-result-item" data-type="document" data-id="${d.id}">
                        <div class="search-result-title">${highlight(d.type, query)}</div>
                        <div class="search-result-subtitle">${vehicleName}</div>
                    </div>
                `;
            });
        }

        // Maintenance
        if (results.maintenance.length > 0) {
            html += '<div class="search-category">Entretiens</div>';
            results.maintenance.forEach(m => {
                const vehicleName = this.getVehicleName(m.vehicleId);
                html += `
                    <div class="search-result-item" data-type="maintenance" data-id="${m.id}">
                        <div class="search-result-title">${highlight(m.type, query)}</div>
                        <div class="search-result-subtitle">${vehicleName} • ${m.mileage} km</div>
                    </div>
                `;
            });
        }

        searchResults.innerHTML = html;
        searchResults.classList.remove('hidden');

        // Add click handlers
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.getAttribute('data-type');
                const id = item.getAttribute('data-id');
                this.navigateToResult(type, id);
                searchResults.classList.add('hidden');
                document.getElementById('global-search').value = '';
            });
        });
    }

    getVehicleName(vehicleId) {
        if (!window.VehicleManager) return 'Véhicule';
        const vehicle = window.VehicleManager.getAll().find(v => v.id === vehicleId);
        return vehicle ? `${vehicle.make} ${vehicle.model}` : 'Véhicule';
    }

    navigateToResult(type, id) {
        const navLinks = document.querySelectorAll('.nav-links li');

        if (type === 'vehicle') {
            // Navigate to vehicles
            navLinks.forEach(link => {
                if (link.getAttribute('data-view') === 'vehicles') {
                    link.click();
                }
            });
        } else if (type === 'document') {
            // Navigate to documents
            navLinks.forEach(link => {
                if (link.getAttribute('data-view') === 'documents') {
                    link.click();
                }
            });
        } else if (type === 'maintenance') {
            // Navigate to maintenance
            navLinks.forEach(link => {
                if (link.getAttribute('data-view') === 'maintenance') {
                    link.click();
                }
            });
        }
    }

    toggleNotificationPanel() {
        if (this.notificationPanel.classList.contains('hidden')) {
            this.showNotificationPanel();
            this.hideUserMenu();
        } else {
            this.hideNotificationPanel();
        }
    }

    showNotificationPanel() {
        this.notificationPanel.classList.remove('hidden');
        this.loadNotifications();
    }

    hideNotificationPanel() {
        this.notificationPanel?.classList.add('hidden');
    }

    toggleUserMenu() {
        if (this.userMenu.classList.contains('hidden')) {
            this.showUserMenu();
            this.hideNotificationPanel();
        } else {
            this.hideUserMenu();
        }
    }

    showUserMenu() {
        this.userMenu.classList.remove('hidden');
        this.updateUserInfo();
    }

    hideUserMenu() {
        this.userMenu?.classList.add('hidden');
    }

    loadNotifications() {
        const notificationList = document.getElementById('notification-list');
        if (!notificationList || !window.DocumentManager) return;

        const documents = window.DocumentManager.getAll();
        const notifications = [];

        documents.forEach(doc => {
            const status = window.DocumentManager.getStatus(doc.expiryDate);
            const vehicle = window.VehicleManager?.getAll().find(v => v.id === doc.vehicleId);
            const vehicleName = vehicle ? `${vehicle.make} ${vehicle.model}` : 'Véhicule';

            if (status === 'expired') {
                notifications.push({
                    type: 'error',
                    icon: '🔴',
                    title: `${doc.type} expiré`,
                    message: `${vehicleName} - Expiré le ${new Date(doc.expiryDate).toLocaleDateString()}`,
                    date: new Date(doc.expiryDate)
                });
            } else if (status === 'warning') {
                const expiry = new Date(doc.expiryDate);
                const diffDays = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
                notifications.push({
                    type: 'warning',
                    icon: '🟠',
                    title: `${doc.type} à renouveler`,
                    message: `${vehicleName} - Expire dans ${diffDays} jour(s)`,
                    date: expiry
                });
            }
        });

        if (notifications.length === 0) {
            notificationList.innerHTML = `
                <div class="empty-notification">
                    <span style="font-size:2rem;">✅</span>
                    <p>Aucune notification</p>
                    <p class="sub-text">Tous vos documents sont à jour !</p>
                </div>
            `;
        } else {
            notificationList.innerHTML = notifications.map(notif => `
                <div class="notification-item ${notif.type}">
                    <span class="notif-icon">${notif.icon}</span>
                    <div class="notif-content">
                        <div class="notif-title">${notif.title}</div>
                        <div class="notif-message">${notif.message}</div>
                    </div>
                </div>
            `).join('');
        }
    }

    updateUserInfo() {
        const settings = window.SettingsManager?.getSettings();
        if (settings && settings.userName) {
            const avatar = document.getElementById('user-avatar');
            if (avatar) {
                avatar.textContent = settings.userName.charAt(0).toUpperCase();
            }
        }
    }

    handleMenuAction(action) {
        this.hideUserMenu();

        switch (action) {
            case 'settings':
                document.querySelector('[data-view="settings"]')?.click();
                break;
            case 'export':
                if (window.SettingsManager) {
                    window.SettingsManager.exportData();
                }
                break;
            case 'about':
                alert('AutoManager v1.0\\n\\nApplication de gestion de véhicules\\n\\nDéveloppée avec ❤️');
                break;
        }
    }
}

window.UIManager = new UIManager();
