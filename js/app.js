/**
 * Main Application Entry Point
 */

class App {
    constructor() {
        this.init();
    }

    init() {
        // Check Authentication first
        if (window.AuthManager && !window.AuthManager.checkAuth()) {
            this.showAuthScreen();
            return;
        }

        // Initialize Router
        this.router();
        window.addEventListener('hashchange', () => this.router());

        // Initialize Navigation
        this.initNavigation();

        // Initialize UI Manager (Notifications, User Menu)
        if (window.UIManager) {
            window.UIManager.init();
        }

        // Apply Theme
        if (window.SettingsManager) {
            const settings = window.SettingsManager.getSettings();
            window.SettingsManager.applyTheme(settings.theme);
        }
    }

    showAuthScreen() {
        const screen = document.getElementById('auth-screen');
        const dots = screen.querySelectorAll('.pin-dot');
        let currentPin = '';

        screen.classList.remove('hidden');

        const updateDots = () => {
            dots.forEach((dot, index) => {
                if (index < currentPin.length) {
                    dot.classList.add('filled');
                } else {
                    dot.classList.remove('filled');
                }
                dot.classList.remove('error');
            });
        };

        const handleInput = (key) => {
            if (key === 'clear') {
                currentPin = '';
            } else if (key === 'back') {
                currentPin = currentPin.slice(0, -1);
            } else if (currentPin.length < 4) {
                currentPin += key;
            }

            updateDots();

            if (currentPin.length === 4) {
                setTimeout(() => {
                    if (window.AuthManager.login(currentPin)) {
                        screen.classList.add('hidden');
                        this.init(); // Proceed with normal init
                    } else {
                        // Error animation
                        dots.forEach(dot => dot.classList.add('error'));
                        currentPin = '';
                        setTimeout(updateDots, 400);
                    }
                }, 100);
            }
        };

        screen.querySelectorAll('.key').forEach(btn => {
            btn.addEventListener('click', (e) => {
                handleInput(e.target.dataset.key);
            });
        });

        // Biometric Unlock
        const btnBiometric = document.getElementById('btn-biometric-auth');
        if (window.AuthManager.isBiometricEnabled()) {
            btnBiometric.classList.remove('hidden');

            // Auto-trigger on load
            setTimeout(async () => {
                if (await window.AuthManager.verifyBiometric()) {
                    screen.classList.add('hidden');
                    this.init();
                }
            }, 500);

            btnBiometric.addEventListener('click', async () => {
                if (await window.AuthManager.verifyBiometric()) {
                    screen.classList.add('hidden');
                    this.init();
                }
            });
        }

        // Forgot PIN
        document.getElementById('btn-forgot-pin').addEventListener('click', () => {
            if (confirm('⚠️ Code oublié ?\n\nPour réinitialiser l\'application et définir un nouveau code, toutes les données locales doivent être effacées.\n\nVoulez-vous continuer ?')) {
                localStorage.clear();
                window.location.reload();
            }
        });
    }

    // Placeholder for router logic
    router() {
        const hash = window.location.hash.substring(1); // Remove '#'
        const viewName = hash || 'dashboard'; // Default to dashboard
        const viewContainer = document.getElementById('view-container');
        this.loadView(viewName, viewContainer);

        // Update active navigation link
        document.querySelectorAll('.nav-links li').forEach(link => {
            if (link.getAttribute('data-view') === viewName) {
                link.classList.add('active');
                const pageTitle = document.getElementById('page-title');
                if (pageTitle) pageTitle.innerText = link.innerText.replace(/^[^\s]+\s/, '');
            } else {
                link.classList.remove('active');
            }
        });
    }

    initNavigation() {
        console.log("AutoManager Initialized");

        // Apply saved theme (moved from old init)
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
    < div class="welcome-card" >
                <h3>Section: ${viewName.charAt(0).toUpperCase() + viewName.slice(1)}</h3>
                <p>Le module <strong>${viewName}</strong> est en cours de développement.</p>
            </div >
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
