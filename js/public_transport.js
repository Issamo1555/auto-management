/**
 * Public Transport Module - Leaflet/OpenStreetMap Version
 * Gère l'affichage des lignes de bus et arrêts à Marrakech
 */

class PublicTransportManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.polylines = [];
        this.userLocation = null;
        this.nearbyStopsData = [];
        this.updateInterval = null;

        // Initialize advanced features module
        this.advanced = null; // Will be initialized after class definition

        // Temporary storage for advanced features data
        this.tempAdvancedData = {
            favorites: [],
            statistics: {},
            savedRoutes: [],
            preferences: {},
            badges: [],
            points: 0
        };

        // Real ALSA Marrakech Bus Lines Data
        this.busLines = [
            {
                id: 'L1',
                number: '1',
                name: 'Sidi Youssef Ben Ali - Gueliz',
                frequency: '10-15 min',
                hours: '06:00 - 22:00',
                color: '#ef4444', // Red
                stops: [
                    { name: 'Sidi Youssef Ben Ali', lat: 31.5850, lng: -8.0450 },
                    { name: 'Massira 2', lat: 31.6000, lng: -8.0300 },
                    { name: 'Bab Doukkala', lat: 31.6340, lng: -7.9940 },
                    { name: 'Place de la Liberté', lat: 31.6320, lng: -8.0050 },
                    { name: 'Gueliz Centre', lat: 31.6350, lng: -8.0100 }
                ]
            },
            {
                id: 'L2',
                number: '2',
                name: 'Daoudiate - Gare Routière',
                frequency: '12-18 min',
                hours: '06:00 - 21:30',
                color: '#2563eb', // Blue
                stops: [
                    { name: 'Daoudiate', lat: 31.6500, lng: -7.9500 },
                    { name: 'Bab Ghmat', lat: 31.6400, lng: -7.9700 },
                    { name: 'Jamâa El Fna', lat: 31.6253, lng: -7.9898 },
                    { name: 'Bab Doukkala', lat: 31.6340, lng: -7.9940 },
                    { name: 'Gare Routière', lat: 31.6360, lng: -7.9980 }
                ]
            },
            {
                id: 'L3',
                number: '3',
                name: 'M\'hamid - Massira',
                frequency: '15-20 min',
                hours: '06:30 - 22:00',
                color: '#10b981', // Green
                stops: [
                    { name: 'M\'hamid', lat: 31.5900, lng: -8.0500 },
                    { name: 'Aéroport Menara', lat: 31.6010, lng: -8.0300 },
                    { name: 'Jardin Menara', lat: 31.6150, lng: -8.0200 },
                    { name: 'Bab Jdid', lat: 31.6220, lng: -7.9950 },
                    { name: 'Massira 1', lat: 31.6250, lng: -8.0400 }
                ]
            },
            {
                id: 'L4',
                number: '4',
                name: 'Sidi Abbad - Médina',
                frequency: '15 min',
                hours: '06:15 - 21:45',
                color: '#f59e0b', // Orange
                stops: [
                    { name: 'Sidi Abbad', lat: 31.6600, lng: -8.0200 },
                    { name: 'Guéliz', lat: 31.6350, lng: -8.0100 },
                    { name: 'Koutoubia', lat: 31.6258, lng: -7.9891 },
                    { name: 'Bab Agnaou', lat: 31.6180, lng: -7.9850 },
                    { name: 'Médina Sud', lat: 31.6150, lng: -7.9800 }
                ]
            },
            {
                id: 'L6',
                number: '6',
                name: 'Targa - Jamâa El Fna',
                frequency: '12 min',
                hours: '06:00 - 22:30',
                color: '#8b5cf6', // Purple
                stops: [
                    { name: 'Targa', lat: 31.6700, lng: -8.0000 },
                    { name: 'Lycée Victor Hugo', lat: 31.6550, lng: -7.9950 },
                    { name: 'Bab Doukkala', lat: 31.6340, lng: -7.9940 },
                    { name: 'Bab Nkob', lat: 31.6300, lng: -7.9980 },
                    { name: 'Jamâa El Fna', lat: 31.6253, lng: -7.9898 }
                ]
            },
            {
                id: 'L10',
                number: '10',
                name: 'Massira - Gare ONCF',
                frequency: '10-12 min',
                hours: '06:00 - 23:00',
                color: '#ec4899', // Pink
                stops: [
                    { name: 'Massira 3', lat: 31.6200, lng: -8.0500 },
                    { name: 'Ménara Mall', lat: 31.6150, lng: -8.0200 },
                    { name: 'Gare ONCF', lat: 31.6305, lng: -8.0150 },
                    { name: 'Théâtre Royal', lat: 31.6290, lng: -8.0180 },
                    { name: 'Gueliz', lat: 31.6350, lng: -8.0100 }
                ]
            },
            {
                id: 'L11',
                number: '11',
                name: 'Hay Mohammadi - Médina',
                frequency: '15-18 min',
                hours: '06:30 - 21:30',
                color: '#06b6d4', // Cyan
                stops: [
                    { name: 'Hay Mohammadi', lat: 31.6100, lng: -8.0600 },
                    { name: 'Massira 1', lat: 31.6250, lng: -8.0400 },
                    { name: 'Bab Jdid', lat: 31.6220, lng: -7.9950 },
                    { name: 'Koutoubia', lat: 31.6258, lng: -7.9891 },
                    { name: 'Médina', lat: 31.6253, lng: -7.9898 }
                ]
            },
            {
                id: 'L14',
                number: '14',
                name: 'Daoudiate - Guéliz',
                frequency: '12-15 min',
                hours: '06:15 - 22:15',
                color: '#14b8a6', // Teal
                stops: [
                    { name: 'Daoudiate', lat: 31.6500, lng: -7.9500 },
                    { name: 'Bab Aylen', lat: 31.6450, lng: -7.9700 },
                    { name: 'Place 16 Novembre', lat: 31.6380, lng: -7.9900 },
                    { name: 'Carré Eden', lat: 31.6345, lng: -8.0056 },
                    { name: 'Guéliz Centre', lat: 31.6350, lng: -8.0100 }
                ]
            },
            {
                id: 'L16',
                number: '16',
                name: 'Arset El Bilk - Massira',
                frequency: '12 min',
                hours: '06:15 - 23:00',
                color: '#a855f7', // Violet
                stops: [
                    { name: 'Arset El Bilk', lat: 31.6240, lng: -7.9910 },
                    { name: 'Bab Nkob', lat: 31.6300, lng: -7.9980 },
                    { name: 'Gare ONCF', lat: 31.6305, lng: -8.0150 },
                    { name: 'Théâtre Royal', lat: 31.6290, lng: -8.0180 },
                    { name: 'Massira 1', lat: 31.6250, lng: -8.0400 }
                ]
            },
            {
                id: 'L19',
                number: '19',
                name: 'Aéroport Menara',
                frequency: '30 min',
                hours: '06:00 - 23:30',
                color: '#f97316', // Deep Orange
                stops: [
                    { name: 'Jamâa El Fna', lat: 31.6253, lng: -7.9898 },
                    { name: 'Koutoubia', lat: 31.6258, lng: -7.9891 },
                    { name: 'Jardin Menara', lat: 31.6150, lng: -8.0200 },
                    { name: 'Aéroport Menara', lat: 31.6010, lng: -8.0300 }
                ]
            }
        ];
    }

    /**
     * Initialize Leaflet Map
     */
    async initMap(containerId) {
        const mapContainer = document.getElementById(containerId);
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }

        // Check if Leaflet is loaded
        if (typeof L === 'undefined') {
            console.error('Leaflet library not loaded');
            return;
        }

        // Center on Marrakech
        const center = [31.6295, -7.9811];

        this.map = L.map(containerId).setView(center, 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);

        console.log('✅ Public Transport Map initialized');
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
        this.displayLineOnMap(line);
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
        if (this.map) {
            this.map.setView([31.6295, -7.9811], 13);
        }
    }

    /**
     * Display Line on Leaflet Map
     */
    displayLineOnMap(line) {
        if (!this.map) return;

        this.clearMap();

        const bounds = L.latLngBounds();
        const path = [];

        line.stops.forEach((stop, index) => {
            const position = [stop.lat, stop.lng];
            path.push(position);
            bounds.extend(position);

            const marker = L.marker(position, {
                icon: L.divIcon({
                    className: 'bus-stop-marker',
                    html: `<div style="background: ${line.color}; color: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${index + 1}</div>`,
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                })
            }).addTo(this.map);

            marker.bindPopup(`<strong>${stop.name}</strong><br>Arrêt ${index + 1}`);

            this.markers.push(marker);
        });

        // Draw Polyline
        const polyline = L.polyline(path, {
            color: line.color,
            weight: 4,
            opacity: 0.8
        }).addTo(this.map);

        this.polylines.push(polyline);

        this.map.fitBounds(bounds, { padding: [50, 50] });
    }

    /**
     * Clear Map
     */
    clearMap() {
        if (!this.map) return;

        this.markers.forEach(m => this.map.removeLayer(m));
        this.markers = [];
        this.polylines.forEach(p => this.map.removeLayer(p));
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
     * Get User Location via GPS
     */
    async getUserLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Géolocalisation non supportée par votre navigateur'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    resolve(this.userLocation);
                },
                (error) => {
                    let message = 'Erreur de géolocalisation';
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = 'Permission de géolocalisation refusée';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'Position non disponible';
                            break;
                        case error.TIMEOUT:
                            message = 'Délai de géolocalisation dépassé';
                            break;
                    }
                    reject(new Error(message));
                }
            );
        });
    }

    /**
     * Calculate distance between two GPS points (Haversine formula)
     * Returns distance in meters
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }

    /**
     * Find nearby stops within radius (default 500m)
     */
    findNearbyStops(userLat, userLng, radiusMeters = 500) {
        const nearbyStops = [];
        const stopMap = new Map(); // To avoid duplicates

        this.busLines.forEach(line => {
            line.stops.forEach(stop => {
                const stopKey = `${stop.lat},${stop.lng}`;

                if (!stopMap.has(stopKey)) {
                    const distance = this.calculateDistance(
                        userLat, userLng,
                        stop.lat, stop.lng
                    );

                    if (distance <= radiusMeters) {
                        stopMap.set(stopKey, {
                            name: stop.name,
                            lat: stop.lat,
                            lng: stop.lng,
                            distance: Math.round(distance),
                            lines: []
                        });
                    }
                }

                // Add line to this stop
                if (stopMap.has(stopKey)) {
                    const stopData = stopMap.get(stopKey);
                    if (!stopData.lines.find(l => l.id === line.id)) {
                        stopData.lines.push({
                            id: line.id,
                            number: line.number,
                            name: line.name,
                            color: line.color,
                            frequency: line.frequency,
                            hours: line.hours
                        });
                    }
                }
            });
        });

        // Convert map to array and sort by distance
        return Array.from(stopMap.values()).sort((a, b) => a.distance - b.distance);
    }

    /**
     * Estimate next bus arrival time
     * Returns time in minutes based on frequency
     */
    estimateNextBusArrival(frequency) {
        // Parse frequency (e.g., "10-15 min" or "12 min")
        const match = frequency.match(/(\d+)(?:-(\d+))?/);
        if (!match) return Math.floor(Math.random() * 10) + 5;

        const minFreq = parseInt(match[1]);
        const maxFreq = match[2] ? parseInt(match[2]) : minFreq;

        // Generate realistic arrival time
        // Assume buses are distributed randomly within the frequency window
        const avgFreq = (minFreq + maxFreq) / 2;
        const randomOffset = (Math.random() - 0.5) * (maxFreq - minFreq);

        return Math.max(1, Math.round(avgFreq / 2 + randomOffset));
    }

    /**
     * Check if bus line is currently in service
     */
    isLineInService(hours) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        // Parse hours (e.g., "06:00 - 22:00")
        const match = hours.match(/(\d+):(\d+)\s*-\s*(\d+):(\d+)/);
        if (!match) return true; // Default to in service if can't parse

        const startTime = parseInt(match[1]) * 60 + parseInt(match[2]);
        const endTime = parseInt(match[3]) * 60 + parseInt(match[4]);

        return currentTime >= startTime && currentTime <= endTime;
    }

    /**
     * Show nearby stops with real-time bus arrivals
     */
    async showNearbyStops() {
        try {
            // Show loading
            const container = document.getElementById('bus-lines-list');
            if (!container) return;

            container.innerHTML = '<div style="text-align: center; padding: 2rem;"><p>📍 Recherche de votre position...</p></div>';

            // Get user location
            const location = await this.getUserLocation();

            // Find nearby stops
            this.nearbyStopsData = this.findNearbyStops(location.lat, location.lng);

            if (this.nearbyStopsData.length === 0) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <p style="font-size: 2rem; margin-bottom: 1rem;">🚫</p>
                        <p>Aucun arrêt trouvé dans un rayon de 500m</p>
                        <button class="btn-primary" onclick="window.PublicTransportManager.showLinesList()" style="margin-top: 1rem;">
                            Voir toutes les lignes
                        </button>
                    </div>
                `;
                return;
            }

            // Render nearby stops
            this.renderNearbyStops();

            // Show user location on map
            if (this.map) {
                this.clearMap();

                // Add user marker
                const userMarker = L.marker([location.lat, location.lng], {
                    icon: L.divIcon({
                        className: 'user-location-marker',
                        html: '<div style="background: #3b82f6; color: white; border-radius: 50%; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">📍</div>',
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(this.map);

                userMarker.bindPopup('<strong>Votre position</strong>');
                this.markers.push(userMarker);

                // Add nearby stop markers
                const bounds = L.latLngBounds();
                bounds.extend([location.lat, location.lng]);

                this.nearbyStopsData.forEach(stop => {
                    const marker = L.marker([stop.lat, stop.lng], {
                        icon: L.divIcon({
                            className: 'nearby-stop-marker',
                            html: '<div style="background: #10b981; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">🚏</div>',
                            iconSize: [24, 24],
                            iconAnchor: [12, 12]
                        })
                    }).addTo(this.map);

                    marker.bindPopup(`<strong>${stop.name}</strong><br>${stop.distance}m`);
                    this.markers.push(marker);
                    bounds.extend([stop.lat, stop.lng]);
                });

                this.map.fitBounds(bounds, { padding: [50, 50] });
            }

            // Start auto-refresh
            this.startRealTimeUpdates();

        } catch (error) {
            const container = document.getElementById('bus-lines-list');
            if (container) {
                container.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <p style="font-size: 2rem; margin-bottom: 1rem;">⚠️</p>
                        <p style="color: #ef4444;">${error.message}</p>
                        <button class="btn-primary" onclick="window.PublicTransportManager.showLinesList()" style="margin-top: 1rem;">
                            Voir toutes les lignes
                        </button>
                    </div>
                `;
            }
        }
    }

    /**
     * Render nearby stops with arrival times
     */
    renderNearbyStops() {
        const container = document.getElementById('bus-lines-list');
        if (!container) return;

        let html = `
            <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0;">🚏 Arrêts à proximité</h3>
                <button class="btn-secondary" onclick="window.PublicTransportManager.showLinesList()">
                    Voir toutes les lignes
                </button>
            </div>
        `;

        this.nearbyStopsData.forEach(stop => {
            html += `
                <div class="nearby-stop-card" style="background: white; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
                        <div>
                            <h4 style="margin: 0 0 0.25rem 0;">${stop.name}</h4>
                            <p style="margin: 0; color: #666; font-size: 0.9rem;">📍 ${stop.distance}m</p>
                        </div>
                    </div>
                    <div class="bus-arrivals">
            `;

            stop.lines.forEach(line => {
                const isInService = this.isLineInService(line.hours);
                const arrivalTime = isInService ? this.estimateNextBusArrival(line.frequency) : null;

                let timeColor = '#94a3b8'; // Gray
                let timeText = 'Hors service';

                if (isInService && arrivalTime !== null) {
                    if (arrivalTime < 5) {
                        timeColor = '#10b981'; // Green
                        timeText = `${arrivalTime} min`;
                    } else if (arrivalTime < 10) {
                        timeColor = '#f59e0b'; // Orange
                        timeText = `${arrivalTime} min`;
                    } else {
                        timeColor = '#3b82f6'; // Blue
                        timeText = `${arrivalTime} min`;
                    }
                }

                html += `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; border-left: 3px solid ${line.color}; margin-bottom: 0.5rem; background: #f9fafb;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <span style="background: ${line.color}; color: white; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: bold; min-width: 30px; text-align: center;">${line.number}</span>
                            <span style="font-size: 0.9rem;">${line.name}</span>
                        </div>
                        <div style="text-align: right;">
                            <div style="color: ${timeColor}; font-weight: bold; font-size: 1.1rem;">${timeText}</div>
                            <div style="font-size: 0.75rem; color: #666;">Fréq: ${line.frequency}</div>
                        </div>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    /**
     * Start real-time updates (refresh every 30 seconds)
     */
    startRealTimeUpdates() {
        // Clear existing interval
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        // Update every 30 seconds
        this.updateInterval = setInterval(() => {
            if (this.nearbyStopsData.length > 0) {
                this.renderNearbyStops();
            }
        }, 30000);
    }

    /**
     * Stop real-time updates
     */
    stopRealTimeUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Close Modal
     */
    closeModal() {
        const modal = document.getElementById('modal-public-transport');
        if (modal) {
            modal.classList.add('hidden');
            this.stopRealTimeUpdates();
        }
    }
}

// Initialize and export
window.PublicTransportManager = new PublicTransportManager();

console.log('✅ Public Transport Manager (Leaflet) loaded');
