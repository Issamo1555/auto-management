/**
 * Best Route Module - Leaflet/OpenStreetMap Version
 * Calcule le meilleur itinéraire pour visiter plusieurs fournisseurs/garages
 * Utilise OpenStreetMap via Leaflet.js
 */

class BestRouteManager {
    constructor() {
        this.waypoints = [];
        this.currentRoute = null;
        this.map = null;
        this.markers = [];
        this.routeLayer = null;
    }

    /**
     * Initialize Leaflet Map with OpenStreetMap
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

        // Default center (Marrakech, Morocco)
        const center = [31.6295, -7.9811];

        // Initialize Leaflet map
        this.map = L.map(containerId).setView(center, 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);

        console.log('✅ OpenStreetMap initialized');
    }

    /**
     * Add a waypoint (garage/provider)
     */
    addWaypoint(location, name) {
        this.waypoints.push({
            location: location, // {lat, lng}
            name: name,
            stopover: true
        });
    }

    /**
     * Clear all waypoints
     */
    clearWaypoints() {
        this.waypoints = [];
        this.clearMapLayers();
    }

    /**
     * Clear all markers and routes from map
     */
    clearMapLayers() {
        if (!this.map) return;

        // Remove all markers
        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];

        // Remove route layer
        if (this.routeLayer) {
            this.map.removeLayer(this.routeLayer);
            this.routeLayer = null;
        }
    }

    /**
     * Calculate best route
     */
    async calculateBestRoute(origin, destination = null) {
        if (this.waypoints.length === 0) {
            alert('Veuillez ajouter au moins un point d\'arrêt');
            return null;
        }

        // Clear previous route
        this.clearMapLayers();

        // Use mock data (in production, integrate with OSRM or GraphHopper API)
        const routeData = await this.mockCalculateRoute(origin, destination);

        // Display route on map
        this.displayRouteOnMap(routeData);

        return routeData;
    }

    /**
     * Display route on Leaflet map
     */
    displayRouteOnMap(routeData) {
        if (!this.map) return;

        const bounds = L.latLngBounds();

        // Add markers for each step
        routeData.steps.forEach((step, index) => {
            const coords = step.coordinates;
            const isStart = index === 0;
            const isEnd = index === routeData.steps.length - 1;
            const color = isStart ? '#10b981' : isEnd ? '#ef4444' : '#2563eb';

            const marker = L.marker([coords.lat, coords.lng], {
                icon: L.divIcon({
                    className: 'route-marker',
                    html: `<div style="background: ${color}; color: white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-size: 14px;">${index + 1}</div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16]
                })
            }).addTo(this.map);

            marker.bindPopup(`
                <div style="min-width: 150px;">
                    <strong style="color: ${color};">${step.name}</strong><br>
                    ${step.distance ? `📏 ${step.distance}<br>` : ''}
                    ${step.duration ? `⏱️ ${step.duration}` : ''}
                </div>
            `);

            this.markers.push(marker);
            bounds.extend([coords.lat, coords.lng]);
        });

        // Draw route line
        const routeCoords = routeData.steps.map(step => [step.coordinates.lat, step.coordinates.lng]);
        this.routeLayer = L.polyline(routeCoords, {
            color: '#2563eb',
            weight: 5,
            opacity: 0.7,
            smoothFactor: 1
        }).addTo(this.map);

        // Fit map to show entire route
        this.map.fitBounds(bounds, { padding: [50, 50] });
    }

    /**
     * Mock route calculation (simulated)
     */
    async mockCalculateRoute(origin, destination) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockSteps = [
            {
                name: origin || 'Point de départ',
                coordinates: { lat: 31.6295, lng: -7.9811 },
                distance: '0 km',
                duration: '0 min'
            },
            ...this.waypoints.map((wp, i) => ({
                name: wp.name || `Arrêt ${i + 1}`,
                coordinates: wp.location.lat ? wp.location : { lat: 31.6295 + (i + 1) * 0.01, lng: -7.9811 + (i + 1) * 0.01 },
                distance: `${((i + 1) * 2.5).toFixed(1)} km`,
                duration: `${(i + 1) * 8} min`
            })),
            {
                name: destination || 'Destination',
                coordinates: { lat: 31.6295 + (this.waypoints.length + 1) * 0.01, lng: -7.9811 + (this.waypoints.length + 1) * 0.01 },
                distance: `${((this.waypoints.length + 1) * 2.5).toFixed(1)} km`,
                duration: `${(this.waypoints.length + 1) * 8} min`
            }
        ];

        const totalDistance = (this.waypoints.length + 1) * 2.5;
        const totalDuration = (this.waypoints.length + 1) * 8;

        return {
            steps: mockSteps,
            totalDistance: totalDistance.toFixed(1) + ' km',
            totalDuration: totalDuration + ' min',
            optimizedOrder: this.waypoints.map((_, i) => i),
            optimizedWaypoints: this.waypoints
        };
    }

    /**
     * Open route modal
     */
    openRouteModal() {
        const modal = document.getElementById('modal-best-route');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => {
                this.initMap('route-map');
            }, 100);
        }
    }

    /**
     * Close route modal
     */
    closeRouteModal() {
        const modal = document.getElementById('modal-best-route');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Get user's current location
     */
    getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Géolocalisation non supportée'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        });
    }

    /**
     * Render route UI
     */
    renderRouteUI(routeData) {
        const container = document.getElementById('route-details');
        if (!container) return;

        let html = `
            <div class="route-summary">
                <h3>📍 Itinéraire Optimisé</h3>
                <div class="route-stats">
                    <div class="stat-item">
                        <span class="stat-label">Distance totale</span>
                        <span class="stat-value">${routeData.totalDistance}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Durée estimée</span>
                        <span class="stat-value">${routeData.totalDuration}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Arrêts</span>
                        <span class="stat-value">${routeData.steps.length - 1}</span>
                    </div>
                </div>
            </div>

            <div class="route-steps">
                <h4>🗺️ Étapes du trajet</h4>
                ${routeData.steps.map((step, index) => `
                    <div class="step-item">
                        <div class="step-number">${index + 1}</div>
                        <div class="step-details">
                            <strong>${step.name}</strong>
                            ${step.distance && step.duration ? `<p>${step.distance} • ${step.duration}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        container.innerHTML = html;
    }
}

// Initialize
window.BestRouteManager = new BestRouteManager();

console.log('✅ Best Route Manager (Leaflet) loaded');
