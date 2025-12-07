/**
 * Transport Module
 * Handles bus lines, map, and GPS features
 */

class TransportModule {
    constructor() {
        this.map = null;
        this.markers = [];
        this.polylines = [];
        this.userLocation = null;
    }

    async render(container) {
        const t = (key) => window.app.features.language ? window.app.features.language.t(key) : key;

        container.innerHTML = `
            <div class="transport-container">
                <div class="module-header">
                    <h2 data-i18n="module.transport.title">${t('module.transport.title')}</h2>
                    <p data-i18n="module.transport.desc">${t('module.transport.desc')}</p>
                </div>

                <!-- Map Section -->
                <div class="map-container" id="transport-map"></div>

                <!-- Actions -->
                <div class="actions-bar" style="display: flex; gap: 1rem; margin-bottom: 1rem;">
                    <button class="btn btn-primary btn-block" onclick="window.app.modules.transport.findNearbyStops()">
                        <span data-i18n="transport.stops_nearby">${t('transport.stops_nearby')}</span>
                    </button>
                </div>

                <!-- Bus Lines List -->
                <div class="bus-lines-list" id="bus-lines-list">
                    <!-- Lines injected here -->
                </div>
            </div>
        `;

        // Initialize Map
        this.initMap();

        // Render Lines
        this.renderLinesList();
    }

    initMap() {
        if (this.map) return;

        const mapContainer = document.getElementById('transport-map');
        if (!mapContainer) return;

        // Center on Marrakech
        this.map = L.map('transport-map').setView([31.6295, -7.9811], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(this.map);

        // Fix map size after render
        setTimeout(() => {
            this.map.invalidateSize();
        }, 100);
    }

    renderLinesList() {
        const container = document.getElementById('bus-lines-list');
        if (!container) return;
        const t = (key) => window.app.features.language ? window.app.features.language.t(key) : key;
        const lang = window.app.features.language ? window.app.features.language.currentLang : 'fr';
        const getName = (l) => l.name[lang] || l.name['fr'] || l.name;
        const getFreq = (l) => l.frequency[lang] || l.frequency['fr'] || l.frequency;

        let html = '';
        window.BUS_LINES.forEach(line => {
            html += `
                <div class="bus-line-item" onclick="window.app.modules.transport.showLine('${line.id}')">
                    <div class="line-badge" style="background-color: ${line.color}">
                        ${line.number}
                    </div>
                    <div class="line-info">
                        <div class="line-name">${getName(line)}</div>
                        <div class="line-details">
                            🕒 ${t('transport.frequency')}: ${getFreq(line)} • 📅 ${t('transport.schedule')}: ${line.hours}
                        </div>
                    </div>
                    <div class="line-action">
                        <span>👉</span>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    showLine(lineId) {
        const line = window.BUS_LINES.find(l => l.id === lineId);
        if (!line || !this.map) return;

        // Clear existing layers
        this.clearMap();

        const bounds = L.latLngBounds();
        const path = [];

        // Add stops
        line.stops.forEach((stop, index) => {
            const position = [stop.lat, stop.lng];
            path.push(position);
            bounds.extend(position);

            const marker = L.marker(position, {
                icon: L.divIcon({
                    className: 'bus-stop-marker',
                    html: `<div style="background: ${line.color}; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${index + 1}</div>`,
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                })
            }).addTo(this.map);

            marker.bindPopup(`<strong>${stop.name}</strong><br>Arrêt ${index + 1}`);
            this.markers.push(marker);
        });

        // Draw route
        const polyline = L.polyline(path, {
            color: line.color,
            weight: 4,
            opacity: 0.8
        }).addTo(this.map);
        this.polylines.push(polyline);

        // Fit bounds
        this.map.fitBounds(bounds, { padding: [50, 50] });

        // Scroll to map
        document.getElementById('transport-map').scrollIntoView({ behavior: 'smooth' });
    }

    clearMap() {
        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];
        this.polylines.forEach(p => this.map.removeLayer(p));
        this.polylines = [];
    }

    async findNearbyStops() {
        const t = (key) => window.app.features.language ? window.app.features.language.t(key) : key;

        if (!navigator.geolocation) {
            alert(t('common.geolocation_unsupported'));
            return;
        }

        const btn = document.querySelector('.btn-primary');
        const originalText = btn.innerHTML;
        btn.innerHTML = t('transport.searching');
        btn.disabled = true;

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;

                // Show user on map
                this.clearMap();
                const userMarker = L.marker([userLat, userLng], {
                    icon: L.divIcon({
                        html: '<div style="font-size: 24px;">📍</div>',
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    })
                }).addTo(this.map);
                this.markers.push(userMarker);
                this.map.setView([userLat, userLng], 15);

                // Find stops
                // (Simplified logic for demo)
                alert(`${t('transport.position_found')}: ${userLat.toFixed(4)}, ${userLng.toFixed(4)}`);

                btn.innerHTML = originalText;
                btn.disabled = false;
            },
            (error) => {
                alert(`${t('common.geolocation_error')}: ${error.message}`);
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        );
    }
}
