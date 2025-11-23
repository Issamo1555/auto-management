/**
 * Main Application Entry Point
 */

class App {
    constructor() {
        this.init();
    }

    init() {
        console.log("AutoManager Initialized");

        // Apply saved theme
        if (window.SettingsManager) {
            const settings = window.SettingsManager.getSettings();
            window.SettingsManager.applyTheme(settings.theme);
        }

        this.setupNavigation();
        this.setupMobileMenu();
        // Load default view
        this.loadView('dashboard', document.getElementById('view-container'));
    }

    setupMobileMenu() {
        const toggleBtn = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebar-overlay');
        if (!toggleBtn || !sidebar || !overlay) return;

        // Toggle sidebar visibility
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });

        // Hide when clicking outside
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-links li');
        const pageTitle = document.getElementById('page-title');
        const viewContainer = document.getElementById('view-container');

        console.log(`Found ${navLinks.length} navigation items.`);

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Navigation clicked:', link.innerText);
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                const viewName = link.getAttribute('data-view');
                const viewTitle = link.innerText.replace(/^[^\s]+\s/, '');
                if (pageTitle) pageTitle.innerText = viewTitle;
                this.loadView(viewName, viewContainer);
            });
        });
    }

    loadView(viewName, container) {
        console.log("Loading view:", viewName);
        if (!container) return;

        // Clear container
        container.innerHTML = '';

        if (viewName === 'vehicles') {
            if (window.VehicleManager) {
                window.VehicleManager.renderView(container);
            } else {
                container.innerHTML = '<p class="error">Erreur: Module Véhicule non chargé.</p>';
            }
            return;
        }

        if (viewName === 'documents') {
            if (window.DocumentManager) {
                window.DocumentManager.renderView(container);
            } else {
                container.innerHTML = '<p class="error">Erreur: Module Documents non chargé.</p>';
            }
            return;
        }

        if (viewName === 'maintenance') {
            if (window.MaintenanceManager) {
                window.MaintenanceManager.renderView(container);
            } else {
                container.innerHTML = '<p class="error">Erreur: Module Maintenance non chargé.</p>';
            }
            return;
        }

        if (viewName === 'dashboard') {
            if (window.DashboardManager) {
                window.DashboardManager.renderView(container);
            } else {
                container.innerHTML = '<p class="error">Erreur: Module Dashboard non chargé.</p>';
            }
            return;
        }

        if (viewName === 'settings') {
            if (window.SettingsManager) {
                window.SettingsManager.renderView(container);
            } else {
                container.innerHTML = '<p class="error">Erreur: Module Paramètres non chargé.</p>';
            }
            return;
        }

        // Fallback
        container.innerHTML = `
            <div class="welcome-card">
                <h3>Section: ${viewName.charAt(0).toUpperCase() + viewName.slice(1)}</h3>
                <p>Le module <strong>${viewName}</strong> est en cours de développement.</p>
            </div>
        `;
    }
}

// Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
    // Initialize notifications after a short delay to ensure all modules are loaded
    setTimeout(() => {
        if (window.NotificationManager) {
            window.NotificationManager.init();
        }
    }, 1000);
});
