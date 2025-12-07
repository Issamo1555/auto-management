/**
 * Parking Module
 */
class ParkingModule {
    constructor() {
        this.map = null;
        this.markers = [];
    }

    async render(container) {
        const t = (key) => window.app.features.language ? window.app.features.language.t(key) : key;

        container.innerHTML = `
            <div class="transport-container">
                <div class="module-header">
                    <h2 data-i18n="module.parking.title">${t('module.parking.title')}</h2>
                    <p data-i18n="module.parking.desc">${t('module.parking.desc')}</p>
                </div>

                <!-- Map Section -->
                <div class="map-container" id="parking-map"></div>

                <!-- Filters -->
                <div class="actions-bar" style="display: flex; gap: 0.5rem; margin-bottom: 1rem; overflow-x: auto; padding-bottom: 0.5rem;">
                    <button class="tag active" onclick="window.app.modules.parking.filter('all')" data-i18n="parking.filter.all">${t('parking.filter.all')}</button>
                    <button class="tag" onclick="window.app.modules.parking.filter('available')" data-i18n="parking.filter.available">${t('parking.filter.available')}</button>
                    <button class="tag" onclick="window.app.modules.parking.filter('Souterrain')" data-i18n="parking.filter.underground">${t('parking.filter.underground')}</button>
                </div>

                <!-- Parking List -->
                <div class="cards-grid" id="parking-list">
                    <!-- Parkings injected here -->
                </div>
            </div>
        `;

        // Initialize Map
        this.initMap();

        // Render List
        this.renderList(window.PARKING_LOCATIONS);
    }

    initMap() {
        if (this.map) return;

        const mapContainer = document.getElementById('parking-map');
        if (!mapContainer) return;

        // Center on Marrakech
        this.map = L.map('parking-map').setView([31.6295, -7.9811], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Add markers
        this.addMarkers(window.PARKING_LOCATIONS);

        // Fix map size
        setTimeout(() => {
            this.map.invalidateSize();
        }, 100);
    }

    addMarkers(locations) {
        // Clear existing
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];
        const lang = window.app.features.language ? window.app.features.language.currentLang : 'fr';
        const getName = (p) => p.name[lang] || p.name['fr'] || p.name; // Name might be string or object
        const getType = (p) => p.type[lang] || p.type['fr'] || p.type;
        const getPrice = (p) => p.price[lang] || p.price['fr'] || p.price;

        locations.forEach(loc => {
            let color = '#3b82f6'; // Blue
            if (loc.status === 'full') color = '#ef4444'; // Red
            if (loc.status === 'busy') color = '#f59e0b'; // Orange
            if (loc.status === 'available') color = '#10b981'; // Green

            const marker = L.marker([loc.lat, loc.lng], {
                icon: L.divIcon({
                    className: 'parking-marker',
                    html: `<div style="background: ${color}; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">P</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            }).addTo(this.map);

            marker.bindPopup(`
                <strong>${getName(loc)}</strong><br>
                ${getType(loc)}<br>
                ${getPrice(loc)}<br>
                <span style="color: ${color}">● ${this.getStatusLabel(loc.status)}</span>
            `);

            this.markers.push(marker);
        });
    }

    renderList(locations) {
        const container = document.getElementById('parking-list');
        if (!container) return;
        const t = (key) => window.app.features.language ? window.app.features.language.t(key) : key;
        const lang = window.app.features.language ? window.app.features.language.currentLang : 'fr';
        const getName = (p) => p.name[lang] || p.name['fr'] || p.name;
        const getType = (p) => p.type[lang] || p.type['fr'] || p.type;
        const getPrice = (p) => p.price[lang] || p.price['fr'] || p.price;
        const getAddress = (p) => p.address[lang] || p.address['fr'] || p.address;

        let html = '';
        locations.forEach(loc => {
            let statusColor = 'text-green-600';
            if (loc.status === 'full') statusColor = 'text-red-600';
            if (loc.status === 'busy') statusColor = 'text-orange-600';

            html += `
                <div class="card" onclick="window.app.modules.parking.focusLocation('${loc.id}')">
                    <div class="card-content">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <h3 class="card-title">${getName(loc)}</h3>
                            <span style="font-weight: bold; font-size: 0.9rem;">${getPrice(loc)}</span>
                        </div>
                        <p class="card-subtitle">${getType(loc)} • ${loc.capacity} ${t('parking.places')}</p>
                        <div style="margin-bottom: 0.5rem;">
                            <span class="${statusColor}">● ${this.getStatusLabel(loc.status)}</span>
                        </div>
                        <div class="place-address">📍 ${getAddress(loc)}</div>
                        <button class="btn btn-secondary btn-block" style="margin-top: 0.5rem;" onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}')">
                            ${t('parking.go')}
                        </button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    getStatusLabel(status) {
        const t = (key) => window.app.features.language ? window.app.features.language.t(key) : key;
        switch (status) {
            case 'available': return t('parking.status.available');
            case 'busy': return t('parking.status.busy');
            case 'full': return t('parking.status.full');
            default: return status;
        }
    }

    filter(type) {
        let filtered = window.PARKING_LOCATIONS;
        if (type !== 'all') {
            if (type === 'available') {
                filtered = filtered.filter(l => l.status === 'available');
            } else {
                filtered = filtered.filter(l => l.type === type);
            }
        }

        this.renderList(filtered);
        this.addMarkers(filtered);
    }

    focusLocation(id) {
        const loc = window.PARKING_LOCATIONS.find(l => l.id === id);
        if (loc && this.map) {
            this.map.setView([loc.lat, loc.lng], 16);
            document.getElementById('parking-map').scrollIntoView({ behavior: 'smooth' });
        }
    }
}

window.ParkingModule = ParkingModule;
