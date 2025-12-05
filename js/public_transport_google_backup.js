/**
 * Public Transport Module
 * Gère l'affichage des lignes de bus et arrêts à Marrakech
 */

class PublicTransportManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.polylines = [];
        this.isMockMode = false;

        // Mock Data for Marrakech Bus Lines
        this.busLines = [
            {
                id: 'L1',
                number: '1',
                name: 'Bab Doukkala - Gueliz',
                frequency: '10-15 min',
                hours: '06:00 - 22:30',
                color: '#ef4444', // Red
                stops: [
                    { name: 'Bab Doukkala', lat: 31.6340, lng: -7.9940 },
                    { name: 'Gare Routière', lat: 31.6360, lng: -7.9980 },
                    { name: 'Place de la Liberté', lat: 31.6320, lng: -8.0050 },
                    { name: 'Carré Eden', lat: 31.6345, lng: -8.0056 },
                    { name: 'Gueliz Centre', lat: 31.6350, lng: -8.0100 }
                ]
            },
            {
                id: 'L11',
                number: '11',
                name: 'Mhamid - Jamâa El Fna',
                frequency: '15-20 min',
                hours: '06:30 - 22:00',
                color: '#2563eb', // Blue
                stops: [
                    { name: 'Mhamid Terminus', lat: 31.5900, lng: -8.0500 },
                    { name: 'Aéroport Menara', lat: 31.6010, lng: -8.0300 },
                    { name: 'Jardin Menara', lat: 31.6150, lng: -8.0200 },
                    { name: 'Bab Jdid', lat: 31.6220, lng: -7.9950 },
                    { name: 'Jamâa El Fna', lat: 31.6253, lng: -7.9898 }
                ]
            },
            {
                id: 'L16',
                number: '16',
                name: 'Arset El Bilk - Massira',
                frequency: '12 min',
                hours: '06:15 - 23:00',
                color: '#10b981', // Green
                stops: [
                    { name: 'Arset El Bilk', lat: 31.6240, lng: -7.9910 },
                    { name: 'Bab Nkob', lat: 31.6300, lng: -7.9980 },
                    { name: 'Gare ONCF', lat: 31.6305, lng: -8.0150 },
                    { name: 'Théâtre Royal', lat: 31.6290, lng: -8.0180 },
                    { name: 'Massira 1', lat: 31.6250, lng: -8.0400 }
                ]
            }
        ];
    }

    /**
     * Initialize Map
     */
    async initMap(containerId) {
        if (this.isMockMode) {
            this.initMockMap(containerId);
            return;
        }

        if (!window.google || !window.google.maps) {
            await this.loadGoogleMaps();
        }

        const mapContainer = document.getElementById(containerId);
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }

        // Center on Marrakech
        const center = { lat: 31.6295, lng: -7.9811 };

        this.map = new google.maps.Map(mapContainer, {
            zoom: 13,
            center: center,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true
        });
    }

    /**
     * Initialize Mock Map
     */
    initMockMap(containerId) {
        const mapContainer = document.getElementById(containerId);
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div style="width: 100%; height: 100%; background: #e5e7eb; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #374151; border-radius: 8px;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">🚌</div>
                <h3 style="margin: 0; font-size: 1.2rem;">Mode Démonstration</h3>
                <p style="margin: 0.5rem 0 0; font-size: 0.9rem; opacity: 0.8;">Carte des transports simulée</p>
                <p style="margin: 0.25rem 0 0; font-size: 0.8rem; opacity: 0.6;">Sélectionnez une ligne pour voir les détails</p>
            </div>
        `;
    }

    /**
     * Load Google Maps API (reused logic)
     */
    loadGoogleMaps() {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const apiKey = window.APP_CONFIG?.GOOGLE_MAPS_API_KEY || '';

            if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
                console.warn('No Google Maps API key found. Using mock mode.');
                this.isMockMode = true;
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => {
                console.warn('Failed to load Google Maps. Using mock mode.');
                this.isMockMode = true;
                resolve();
            };
            document.head.appendChild(script);
        });
    }

    /**
     * Render Bus Lines List
     */
    renderBusLines() {
        const container = document.getElementById('bus-lines-list');
        if (!container) return;

        let html = '<div class="bus-lines-grid">';

        this.busLines.forEach(line => {
            html += `
                <div class="bus-line-card" onclick="window.PublicTransportManager.selectLine('${line.id}')">
                    <div class="line-header">
                        <span class="line-number" style="background-color: ${line.color}">${line.number}</span>
                        <h4 class="line-name">${line.name}</h4>
                    </div>
                    <div class="line-info">
                        <p>🕒 ${line.frequency}</p>
                        <p>📅 ${line.hours}</p>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Select a bus line
     */
    selectLine(lineId) {
        const line = this.busLines.find(l => l.id === lineId);
        if (!line) return;

        // Update UI details
        this.renderLineDetails(line);

        // Update Map
        if (this.isMockMode) {
            this.mockDisplayLine(line);
        } else {
            this.displayLineOnMap(line);
        }
    }

    /**
     * Render Line Details in Side Panel
     */
    renderLineDetails(line) {
        const container = document.getElementById('selected-line-details');
        if (!container) return;

        let html = `
            <div class="line-details-header">
                <button class="btn-back" onclick="window.PublicTransportManager.showLinesList()">← Retour</button>
                <div style="display: flex; align-items: center; gap: 1rem; margin-top: 1rem;">
                    <span class="line-number large" style="background-color: ${line.color}">${line.number}</span>
                    <div>
                        <h3 style="margin: 0;">${line.name}</h3>
                        <p style="margin: 0.25rem 0; color: var(--text-secondary);">Bus de ville</p>
                    </div>
                </div>
            </div>

            <div class="line-stats">
                <div class="stat-box">
                    <span class="label">Fréquence</span>
                    <span class="value">${line.frequency}</span>
                </div>
                <div class="stat-box">
                    <span class="label">Horaires</span>
                    <span class="value">${line.hours}</span>
                </div>
            </div>

            <div class="stops-list">
                <h4>🚏 Arrêts desservis</h4>
                <div class="stops-timeline">
        `;

        line.stops.forEach((stop, index) => {
            html += `
                <div class="stop-item">
                    <div class="stop-dot" style="border-color: ${line.color}"></div>
                    <div class="stop-info">
                        <span class="stop-name">${stop.name}</span>
                        ${index === 0 ? '<span class="stop-tag start">Départ</span>' : ''}
                        ${index === line.stops.length - 1 ? '<span class="stop-tag end">Terminus</span>' : ''}
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
        container.classList.remove('hidden');
        document.getElementById('bus-lines-list').classList.add('hidden');
    }

    /**
     * Show Lines List (Back button)
     */
    showLinesList() {
        document.getElementById('selected-line-details').classList.add('hidden');
        document.getElementById('bus-lines-list').classList.remove('hidden');

        // Clear map
        this.clearMap();
        if (this.isMockMode) {
            this.initMockMap('transport-map');
        } else if (this.map) {
            this.map.setZoom(13);
            this.map.setCenter({ lat: 31.6295, lng: -7.9811 });
        }
    }

    /**
     * Display Line on Real Map
     */
    displayLineOnMap(line) {
        if (!this.map) return;

        this.clearMap();

        // Add Markers
        const bounds = new google.maps.LatLngBounds();
        const path = [];

        line.stops.forEach((stop, index) => {
            const position = { lat: stop.lat, lng: stop.lng };
            path.push(position);
            bounds.extend(position);

            const marker = new google.maps.Marker({
                position: position,
                map: this.map,
                title: stop.name,
                label: {
                    text: (index + 1).toString(),
                    color: 'white',
                    fontSize: '12px'
                },
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: line.color,
                    fillOpacity: 1,
                    strokeColor: 'white',
                    strokeWeight: 2
                }
            });

            this.markers.push(marker);
        });

        // Draw Polyline
        const polyline = new google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: line.color,
            strokeOpacity: 0.8,
            strokeWeight: 4
        });

        polyline.setMap(this.map);
        this.polylines.push(polyline);

        this.map.fitBounds(bounds);
    }

    /**
     * Mock Display Line (for demo mode)
     */
    mockDisplayLine(line) {
        const mapContainer = document.getElementById('transport-map');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div style="width: 100%; height: 100%; background: #f3f4f6; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0.1; background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"></div>
                
                <h3 style="z-index: 1; color: ${line.color}; font-size: 2rem; margin: 0;">Ligne ${line.number}</h3>
                <p style="z-index: 1; color: #4b5563;">${line.name}</p>
                
                <div style="z-index: 1; margin-top: 2rem; display: flex; align-items: center; gap: 1rem;">
                    ${line.stops.map((stop, i) => `
                        <div style="display: flex; flex-direction: column; align-items: center;">
                            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${line.color}; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
                            <span style="font-size: 0.7rem; margin-top: 4px; max-width: 60px; text-align: center;">${stop.name}</span>
                        </div>
                        ${i < line.stops.length - 1 ? `<div style="width: 30px; height: 2px; background: ${line.color}; margin-bottom: 15px;"></div>` : ''}
                    `).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Clear Map
     */
    clearMap() {
        this.markers.forEach(m => m.setMap(null));
        this.markers = [];
        this.polylines.forEach(p => p.setMap(null));
        this.polylines = [];
    }

    /**
     * Open Modal
     */
    openModal() {
        const modal = document.getElementById('modal-public-transport');
        if (modal) {
            modal.classList.remove('hidden');
            this.renderBusLines();
            setTimeout(() => {
                this.initMap('transport-map');
            }, 100);
        }
    }

    /**
     * Close Modal
     */
    closeModal() {
        const modal = document.getElementById('modal-public-transport');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
}

// Initialize and export
window.PublicTransportManager = new PublicTransportManager();
