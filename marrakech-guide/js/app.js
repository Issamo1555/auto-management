/**
 * Core Application Logic
 */

class App {
    constructor() {
        this.router = new Router();
        this.storage = new Storage();
        this.modules = {};
        this.features = {};

        // Initialize features
        if (typeof LanguageFeature !== 'undefined') {
            this.features.language = new LanguageFeature();
        }

        this.init();
    }

    async init() {
        console.log('🚀 Marrakech Guide initializing...');

        // Initialize Router
        this.router.init();

        // Setup Event Listeners
        this.setupEventListeners();

        // Load initial module based on URL or default to home
        const currentRoute = this.router.getCurrentRoute();
        await this.loadModule(currentRoute || 'home');

        // Remove loading screen
        document.getElementById('loading-overlay').classList.add('hidden');
    }

    setupEventListeners() {
        // Navigation clicks
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const moduleName = e.currentTarget.dataset.module;
                this.navigateTo(moduleName);
            });
        });

        // Header buttons
        document.getElementById('btn-favorites').addEventListener('click', () => {
            this.navigateTo('favorites');
        });

        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            // Set initial value
            const currentLang = this.storage.get('language', 'fr');
            langSelect.value = currentLang;

            langSelect.addEventListener('change', (e) => {
                console.log('Language change triggered:', e.target.value);
                const lang = e.target.value;
                if (!this.features.language) {
                    console.log('Initializing LanguageFeature on demand');
                    this.features.language = new LanguageFeature();
                }
                this.features.language.setLanguage(lang);

                // Force re-render of the current module to apply translations
                const currentRoute = this.router.getCurrentRoute() || 'home';
                this.loadModule(currentRoute);
            });
        }
    }

    async navigateTo(moduleName) {
        // Update UI
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.module === moduleName);
        });

        // Update URL
        this.router.navigate(moduleName);

        // Load Module
        await this.loadModule(moduleName);
    }

    async loadModule(moduleName) {
        const contentContainer = document.getElementById('app-content');

        // Show loading state for heavy modules
        // contentContainer.innerHTML = '<div class="spinner"></div>';

        try {
            switch (moduleName) {
                case 'home':
                    this.renderHome(contentContainer);
                    break;
                case 'transport':
                    if (!this.modules.transport) {
                        this.modules.transport = new TransportModule();
                    }
                    await this.modules.transport.render(contentContainer);
                    break;
                case 'parking':
                    if (!this.modules.parking) {
                        this.modules.parking = new ParkingModule();
                    }
                    this.modules.parking.render(contentContainer);
                    break;
                case 'route-planner':
                    if (!this.features.routePlanner) {
                        this.features.routePlanner = new RoutePlannerFeature();
                    }
                    this.features.routePlanner.render(contentContainer);
                    break;
                case 'monuments':
                    if (!this.modules.monuments) {
                        this.modules.monuments = new MonumentsModule();
                    }
                    this.modules.monuments.render(contentContainer);
                    break;
                case 'restaurants':
                    if (!this.modules.restaurants) {
                        this.modules.restaurants = new RestaurantsModule();
                    }
                    this.modules.restaurants.render(contentContainer);
                    break;
                case 'shopping':
                    if (!this.modules.shopping) {
                        this.modules.shopping = new ShoppingModule();
                    }
                    this.modules.shopping.render(contentContainer);
                    break;
                case 'favorites':
                    if (!this.features.favorites) {
                        this.features.favorites = new FavoritesFeature();
                    }
                    this.features.favorites.render(contentContainer);
                    break;
                default:
                    this.renderHome(contentContainer);
            }
        } catch (error) {
            console.error(`Error loading module ${moduleName}:`, error);
            contentContainer.innerHTML = `<div class="error-message">Une erreur est survenue: ${error.message}</div>`;
        }
    }

    renderHome(container) {
        const t = (key) => {
            return this.features.language ? this.features.language.t(key) : key;
        };

        // Fallback if language feature not initialized yet (should be)
        const welcome = this.features.language ? this.features.language.t('home.welcome') : 'Bienvenue à Marrakech 🌴';
        const subtitle = this.features.language ? this.features.language.t('home.subtitle') : 'Votre guide numérique complet pour explorer la ville ocre.';

        container.innerHTML = `
            <div class="home-hero">
                <h2>${welcome}</h2>
                <p>${subtitle}</p>
            </div>
            
            <div class="cards-grid" style="margin-top: 2rem;">
                <div class="card" onclick="window.app.navigateTo('transport')">
                    <div class="card-content">
                        <span style="font-size: 2rem;">🚌</span>
                        <h3 data-i18n="module.transport.title">${this.features.language ? this.features.language.t('module.transport.title') : 'Transport'}</h3>
                        <p data-i18n="module.transport.desc">${this.features.language ? this.features.language.t('module.transport.desc') : 'Bus, Taxis et itinéraires'}</p>
                    </div>
                </div>
                <div class="card" onclick="window.app.navigateTo('parking')">
                    <div class="card-content">
                        <span style="font-size: 2rem;">🅿️</span>
                        <h3 data-i18n="module.parking.title">${this.features.language ? this.features.language.t('module.parking.title') : 'Parking'}</h3>
                        <p data-i18n="module.parking.desc">${this.features.language ? this.features.language.t('module.parking.desc') : 'Trouver une place'}</p>
                    </div>
                </div>
                <div class="card" onclick="window.app.navigateTo('route-planner')">
                    <div class="card-content">
                        <span style="font-size: 2rem;">🗺️</span>
                        <h3 data-i18n="module.route.title">${this.features.language ? this.features.language.t('module.route.title') : 'Trajet'}</h3>
                        <p data-i18n="module.route.desc">${this.features.language ? this.features.language.t('module.route.desc') : 'Calcul d\'itinéraire'}</p>
                    </div>
                </div>
                <div class="card" onclick="window.app.navigateTo('monuments')">
                    <div class="card-content">
                        <span style="font-size: 2rem;">🏛️</span>
                        <h3 data-i18n="module.monuments.title">${this.features.language ? this.features.language.t('module.monuments.title') : 'Monuments'}</h3>
                        <p data-i18n="module.monuments.desc">${this.features.language ? this.features.language.t('module.monuments.desc') : 'Histoire et culture'}</p>
                    </div>
                </div>
                <div class="card" onclick="window.app.navigateTo('restaurants')">
                    <div class="card-content">
                        <span style="font-size: 2rem;">🍽️</span>
                        <h3 data-i18n="module.restaurants.title">${this.features.language ? this.features.language.t('module.restaurants.title') : 'Restaurants'}</h3>
                        <p data-i18n="module.restaurants.desc">${this.features.language ? this.features.language.t('module.restaurants.desc') : 'Gastronomie locale'}</p>
                    </div>
                </div>
                <div class="card" onclick="window.app.navigateTo('shopping')">
                    <div class="card-content">
                        <span style="font-size: 2rem;">🛍️</span>
                        <h3 data-i18n="module.shopping.title">${this.features.language ? this.features.language.t('module.shopping.title') : 'Shopping'}</h3>
                        <p data-i18n="module.shopping.desc">${this.features.language ? this.features.language.t('module.shopping.desc') : 'Souks et artisanat'}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize App
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
