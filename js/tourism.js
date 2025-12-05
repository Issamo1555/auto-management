/**
 * Tourism Manager
 * Manages rental agencies, monuments, and restaurants recommendations
 */

class TourismManager {
    constructor() {
        this.currentCity = 'Marrakech';
        this.currentView = 'overview'; // overview, rentals, monuments, restaurants
        this.selectedType = 'voiture'; // voiture, moto, vélo
        this.map = null;
        this.markers = [];
    }

    /**
     * Initialize the tourism module
     */
    init() {
        console.log('🌍 Tourism Manager initialized');
        this.setupEventListeners();
        this.loadOverview();
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // City selector
        const citySelector = document.getElementById('tourism-city');
        if (citySelector) {
            citySelector.addEventListener('change', (e) => {
                this.currentCity = e.target.value;
                this.refreshView();
            });
        }

        // Category buttons
        document.querySelectorAll('[data-tourism-category]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.tourismCategory;
                this.showCategory(category);
            });
        });
    }

    /**
     * Load overview with top recommendations
     */
    loadOverview() {
        const container = document.getElementById('tourism-content');
        if (!container) return;

        const rentals = window.TourismDataHelpers.getRentalsByCity(this.currentCity);
        const monuments = window.TourismDataHelpers.getMonumentsByCity(this.currentCity);
        const restaurants = window.TourismDataHelpers.getRestaurantsByCity(this.currentCity);
        const contacts = window.TourismDataHelpers.getContactsByCity(this.currentCity);

        container.innerHTML = `
            <div class="tourism-overview">
                <h2>🌍 Découvrir ${this.currentCity}</h2>
                
                <div class="tourism-categories">
                    <div class="category-card" data-tourism-category="rentals">
                        <div class="category-icon">🚗</div>
                        <h3>Location de Véhicules</h3>
                        <p>${rentals.length} agences disponibles</p>
                        <button class="btn-primary">Explorer</button>
                    </div>
                    
                    <div class="category-card" data-tourism-category="monuments">
                        <div class="category-icon">🏛️</div>
                        <h3>Monuments Historiques</h3>
                        <p>${monuments.length} sites à visiter</p>
                        <button class="btn-primary">Découvrir</button>
                    </div>
                    
                    <div class="category-card" data-tourism-category="restaurants">
                        <div class="category-icon">🍽️</div>
                        <h3>Restaurants</h3>
                        <p>${restaurants.length} établissements</p>
                        <button class="btn-primary">Voir</button>
                    </div>

                    <div class="category-card" data-tourism-category="contacts">
                        <div class="category-icon">📞</div>
                        <h3>Contacts Utiles</h3>
                        <p>${contacts.length} contacts</p>
                        <button class="btn-primary">Consulter</button>
                    </div>

                    <div class="category-card" data-tourism-category="shopping">
                        <div class="category-icon">🛍️</div>
                        <h3>Shopping & Artisanat</h3>
                        <p>Conseils & Adresses</p>
                        <button class="btn-primary">Découvrir</button>
                    </div>
                </div>

                <div class="top-recommendations">
                    <h3>🔥 Top Recommandations</h3>
                    ${this.renderTopRecommendations(rentals, monuments, restaurants)}
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    /**
     * Render top recommendations
     */
    renderTopRecommendations(rentals, monuments, restaurants) {
        const topRental = rentals.sort((a, b) => b.rating - a.rating)[0];
        const topMonument = monuments.sort((a, b) => b.rating - a.rating)[0];
        const topRestaurant = restaurants.sort((a, b) => b.rating - a.rating)[0];

        let html = '<div class="recommendations-grid">';

        if (topRental) {
            html += this.renderRentalCard(topRental, true);
        }

        if (topMonument) {
            html += this.renderMonumentCard(topMonument, true);
        }

        if (topRestaurant) {
            html += this.renderRestaurantCard(topRestaurant, true);
        }

        html += '</div>';
        return html;
    }

    /**
     * Show specific category
     */
    showCategory(category) {
        this.currentView = category;

        switch (category) {
            case 'rentals':
                this.showRentals();
                break;
            case 'monuments':
                this.showMonuments();
                break;
            case 'restaurants':
                this.showRestaurants();
                break;
            case 'contacts':
                this.showContacts();
                break;
            case 'shopping':
                this.showShopping();
                break;
        }
    }

    /**
     * Show rentals
     */
    showRentals() {
        const modal = document.getElementById('tourism-rentals-modal');
        if (!modal) return;

        const rentals = window.TourismDataHelpers.getRentalsByCity(this.currentCity);

        const content = modal.querySelector('.modal-content-body');
        content.innerHTML = `
            <div class="rentals-filters">
                <h3>Type de véhicule</h3>
                <div class="filter-buttons">
                    <button class="filter-btn active" data-type="all">Tous</button>
                    <button class="filter-btn" data-type="voiture">🚗 Voiture</button>
                    <button class="filter-btn" data-type="moto">🏍️ Moto</button>
                    <button class="filter-btn" data-type="vélo">🚲 Vélo</button>
                </div>
            </div>

            <div class="rentals-list">
                ${rentals.map(rental => this.renderRentalCard(rental)).join('')}
            </div>
        `;

        // Filter buttons
        content.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                content.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const type = e.target.dataset.type;
                this.filterRentals(type);
            });
        });

        modal.classList.remove('hidden');
    }

    /**
     * Filter rentals by type
     */
    filterRentals(type) {
        let rentals = window.TourismDataHelpers.getRentalsByCity(this.currentCity);

        if (type !== 'all') {
            rentals = rentals.filter(r => r.types.includes(type));
        }

        const list = document.querySelector('.rentals-list');
        if (list) {
            list.innerHTML = rentals.map(rental => this.renderRentalCard(rental)).join('');
        }
    }

    /**
     * Render rental card
     */
    renderRentalCard(rental, compact = false) {
        const cheapest = rental.vehicles.reduce((min, v) =>
            v.pricePerDay < min ? v.pricePerDay : min, Infinity
        );

        return `
            <div class="tourism-card ${compact ? 'compact' : ''}">
                <div class="card-header">
                    <h4>🚗 ${rental.name}</h4>
                    <div class="rating">
                        <span class="stars">${'⭐'.repeat(Math.round(rental.rating))}</span>
                        <span class="rating-value">${rental.rating}</span>
                        <span class="reviews">(${rental.reviews} avis)</span>
                    </div>
                </div>
                <div class="card-body">
                    <p class="types">
                        ${rental.types.map(t => {
            const icon = t === 'voiture' ? '🚗' : t === 'moto' ? '🏍️' : '🚲';
            return `<span class="type-badge">${icon} ${t}</span>`;
        }).join('')}
                    </p>
                    <p class="price">À partir de <strong>${cheapest} DH/jour</strong></p>
                    <p class="services">
                        ${rental.services.slice(0, 3).map(s => `<span class="service-tag">${s}</span>`).join('')}
                    </p>
                    <p class="address">📍 ${rental.address}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-secondary" onclick="TourismManager.call('${rental.phone}')">
                        📞 Appeler
                    </button>
                    <button class="btn-primary" onclick="TourismManager.navigate(${rental.location.lat}, ${rental.location.lng})">
                        🗺️ Y aller
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Show monuments
     */
    showMonuments() {
        const modal = document.getElementById('tourism-monuments-modal');
        if (!modal) return;

        const monuments = window.TourismDataHelpers.getMonumentsByCity(this.currentCity);

        const content = modal.querySelector('.modal-content-body');
        content.innerHTML = `
            <div class="monuments-list">
                ${monuments.map(monument => this.renderMonumentCard(monument)).join('')}
            </div>
        `;

        modal.classList.remove('hidden');
    }

    /**
     * Render monument card
     */
    renderMonumentCard(monument, compact = false) {
        return `
            <div class="tourism-card ${compact ? 'compact' : ''}">
                <div class="card-header">
                    <h4>🏛️ ${monument.name}</h4>
                    <div class="rating">
                        <span class="stars">${'⭐'.repeat(Math.round(monument.rating))}</span>
                        <span class="rating-value">${monument.rating}</span>
                        <span class="reviews">(${monument.reviews} avis)</span>
                    </div>
                </div>
                <div class="card-body">
                    <p class="monument-type">
                        <span class="type-badge">${monument.type}</span>
                        <span class="period">${monument.period}</span>
                    </p>
                    <p class="description">${monument.description.substring(0, 150)}...</p>
                    <div class="monument-info">
                        <p>🕐 ${monument.openingHours}</p>
                        <p>💰 ${monument.entryPrice}</p>
                        <p>⏱️ Durée: ${monument.visitDuration}</p>
                    </div>
                    ${monument.tips ? `<p class="tips">💡 ${monument.tips}</p>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn-secondary" onclick="TourismManager.showOnMap(${monument.location.lat}, ${monument.location.lng}, '${monument.name}')">
                        🗺️ Voir sur la carte
                    </button>
                    <button class="btn-primary" onclick="TourismManager.navigate(${monument.location.lat}, ${monument.location.lng})">
                        🧭 Y aller
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Show restaurants
     */
    showRestaurants() {
        const modal = document.getElementById('tourism-restaurants-modal');
        if (!modal) return;

        const restaurants = window.TourismDataHelpers.getRestaurantsByCity(this.currentCity);

        const content = modal.querySelector('.modal-content-body');
        content.innerHTML = `
            <div class="restaurants-filters">
                <h3>Filtrer par prix</h3>
                <div class="filter-buttons">
                    <button class="filter-btn active" data-price="all">Tous</button>
                    <button class="filter-btn" data-price="$">$ Économique</button>
                    <button class="filter-btn" data-price="$$">$$ Moyen</button>
                    <button class="filter-btn" data-price="$$$">$$$ Haut de gamme</button>
                </div>
            </div>

            <div class="restaurants-list">
                ${restaurants.map(resto => this.renderRestaurantCard(resto)).join('')}
            </div>
        `;

        // Filter buttons
        content.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                content.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const price = e.target.dataset.price;
                this.filterRestaurants(price);
            });
        });

        modal.classList.remove('hidden');
    }

    /**
     * Filter restaurants by price
     */
    filterRestaurants(priceRange) {
        let restaurants = window.TourismDataHelpers.getRestaurantsByCity(this.currentCity);

        if (priceRange !== 'all') {
            restaurants = restaurants.filter(r => r.priceRange === priceRange);
        }

        const list = document.querySelector('.restaurants-list');
        if (list) {
            list.innerHTML = restaurants.map(resto => this.renderRestaurantCard(resto)).join('');
        }
    }

    /**
     * Render restaurant card
     */
    renderRestaurantCard(restaurant, compact = false) {
        return `
            <div class="tourism-card ${compact ? 'compact' : ''}">
                <div class="card-header">
                    <h4>🍽️ ${restaurant.name}</h4>
                    <div class="rating">
                        <span class="stars">${'⭐'.repeat(Math.round(restaurant.rating))}</span>
                        <span class="rating-value">${restaurant.rating}</span>
                        <span class="reviews">(${restaurant.reviews} avis)</span>
                    </div>
                </div>
                <div class="card-body">
                    <p class="cuisine">
                        ${restaurant.cuisine.map(c => `<span class="cuisine-tag">${c}</span>`).join('')}
                    </p>
                    <p class="price-range">
                        Prix moyen: <strong>${restaurant.avgPrice} DH</strong>
                        <span class="price-indicator">${restaurant.priceRange}</span>
                    </p>
                    <div class="specialties">
                        <strong>Spécialités:</strong>
                        <ul>
                            ${restaurant.specialties.slice(0, 3).map(s => `<li>${s}</li>`).join('')}
                        </ul>
                    </div>
                    <p class="hours">🕐 ${restaurant.openingHours}</p>
                    <p class="features">
                        ${restaurant.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                    </p>
                    <p class="address">📍 ${restaurant.address}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-secondary" onclick="TourismManager.call('${restaurant.phone}')">
                        📞 ${restaurant.reservationRequired ? 'Réserver' : 'Appeler'}
                    </button>
                    <button class="btn-primary" onclick="TourismManager.navigate(${restaurant.location.lat}, ${restaurant.location.lng})">
                        🗺️ Y aller
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Show contacts
     */
    showContacts() {
        const modal = document.getElementById('tourism-contacts-modal');
        if (!modal) return;

        const contacts = window.TourismDataHelpers.getContactsByCity(this.currentCity);

        const content = modal.querySelector('.modal-content-body');
        content.innerHTML = `
            <div class="contacts-list">
                ${contacts.map(contact => this.renderContactCard(contact)).join('')}
            </div>
        `;

        modal.classList.remove('hidden');
    }

    /**
     * Render contact card
     */
    renderContactCard(contact) {
        return `
            <div class="tourism-card">
                <div class="card-header">
                    <h4>${contact.type === 'change' ? '💱' : '🚨'} ${contact.name}</h4>
                    <span class="type-badge">${contact.type}</span>
                </div>
                <div class="card-body">
                    <p class="description">${contact.description}</p>
                    <p class="hours">🕐 ${contact.openingHours}</p>
                    <p class="address">📍 ${contact.address}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-secondary" onclick="TourismManager.call('${contact.phone}')">
                        📞 Appeler
                    </button>
                    ${contact.location ? `
                    <button class="btn-primary" onclick="TourismManager.navigate(${contact.location.lat}, ${contact.location.lng})">
                        🗺️ Y aller
                    </button>` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Show shopping
     */
    showShopping() {
        const modal = document.getElementById('modal-tourism-shopping');
        if (!modal) return;

        const shops = window.TourismDataHelpers.getShoppingByCity(this.currentCity);
        const container = document.getElementById('shopping-list-container');

        if (container) {
            if (shops.length === 0) {
                container.innerHTML = '<p style="text-align: center; color: #666;">Aucune adresse disponible pour cette ville.</p>';
            } else {
                container.innerHTML = shops.map(shop => this.renderShoppingCard(shop)).join('');
            }
        }

        modal.classList.remove('hidden');
    }

    /**
     * Close shopping modal
     */
    closeShoppingModal() {
        const modal = document.getElementById('modal-tourism-shopping');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Render shopping card
     */
    renderShoppingCard(shop) {
        return `
            <div class="tourism-card">
                <div class="card-header">
                    <h4>🛍️ ${shop.name}</h4>
                    <span class="type-badge">${shop.type}</span>
                </div>
                <div class="card-body">
                    <p class="description">${shop.description}</p>
                    <div class="tags" style="margin-bottom: 0.5rem;">
                        ${shop.tags.map(tag => `<span class="feature-tag" style="background: #e0f2fe; color: #0284c7;">${tag}</span>`).join('')}
                    </div>
                    ${shop.tips ? `<p class="tips" style="background: #fffbeb; color: #92400e; padding: 0.5rem; border-radius: 4px; font-size: 0.9rem;">💡 <strong>Conseil:</strong> ${shop.tips}</p>` : ''}
                    <p class="hours">🕐 ${shop.openingHours}</p>
                    <p class="address">📍 ${shop.address}</p>
                </div>
                <div class="card-actions">
                    <button class="btn-primary" onclick="TourismManager.navigate(${shop.location.lat}, ${shop.location.lng})">
                        🗺️ Y aller
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Refresh current view
     */
    refreshView() {
        if (this.currentView === 'overview') {
            this.loadOverview();
        } else {
            this.showCategory(this.currentView);
        }
    }

    /**
     * Call phone number
     */
    static call(phone) {
        window.location.href = `tel:${phone}`;
    }

    /**
     * Navigate to location
     */
    static navigate(lat, lng) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        window.open(url, '_blank');
    }

    /**
     * Show on map
     */
    static showOnMap(lat, lng, name) {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
        window.open(url, '_blank');
    }
}

// Initialize
window.TourismManager = new TourismManager();

console.log('✅ Tourism Manager loaded');
