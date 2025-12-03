/**
 * Best Route Module
 * Calcule le meilleur itinéraire pour visiter plusieurs fournisseurs/garages
 * Utilise Google Maps Directions API pour optimiser le trajet
 */

class BestRouteManager {
    constructor() {
        this.waypoints = [];
        this.currentRoute = null;
        this.map = null;
        this.directionsService = null;
        this.directionsRenderer = null;
    }

    /**
     * Initialize Google Maps
     */
    async initMap(containerId) {
        if (!window.google || !window.google.maps) {
            await this.loadGoogleMaps();
        }

        const mapContainer = document.getElementById(containerId);
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }

        // Default center (Morocco)
        const center = { lat: 33.5731, lng: -7.5898 }; // Casablanca

        this.map = new google.maps.Map(mapContainer, {
            zoom: 12,
            center: center,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true
        });

        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            map: this.map,
            suppressMarkers: false,
            polylineOptions: {
                strokeColor: '#2563eb',
                strokeWeight: 5
            }
        });
    }

    /**
     * Load Google Maps API
     */
    loadGoogleMaps() {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }

            const apiKey = window.APP_CONFIG?.GOOGLE_MAPS_API_KEY || '';
            if (!apiKey) {
                reject(new Error('Google Maps API key not configured'));
                return;
            }

            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Google Maps'));
            document.head.appendChild(script);
        });
    }

    /**
     * Add a waypoint (garage/provider)
     */
    addWaypoint(location, name) {
        this.waypoints.push({
            location: location, // Can be address string or {lat, lng}
            name: name,
            stopover: true
        });
    }

    /**
     * Clear all waypoints
     */
    clearWaypoints() {
        this.waypoints = [];
        if (this.directionsRenderer) {
            this.directionsRenderer.setDirections({ routes: [] });
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

        if (!this.directionsService) {
            await this.initMap('route-map');
        }

        // If no destination, use last waypoint as destination
        const dest = destination || this.waypoints[this.waypoints.length - 1].location;
        const waypts = destination ? this.waypoints : this.waypoints.slice(0, -1);

        const request = {
            origin: origin,
            destination: dest,
            waypoints: waypts.map(w => ({
                location: w.location,
                stopover: w.stopover
            })),
            optimizeWaypoints: true, // This is the key feature!
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC
        };

        return new Promise((resolve, reject) => {
            this.directionsService.route(request, (result, status) => {
                if (status === 'OK') {
                    this.currentRoute = result;
                    this.directionsRenderer.setDirections(result);
                    resolve(this.parseRouteResult(result));
                } else {
                    console.error('Directions request failed:', status);
                    reject(new Error(`Erreur de calcul d'itinéraire: ${status}`));
                }
            });
        });
    }

    /**
     * Parse route result
     */
    parseRouteResult(result) {
        const route = result.routes[0];
        const optimizedOrder = route.waypoint_order;

        let totalDistance = 0;
        let totalDuration = 0;

        const steps = route.legs.map((leg, index) => {
            totalDistance += leg.distance.value;
            totalDuration += leg.duration.value;

            return {
                from: leg.start_address,
                to: leg.end_address,
                distance: leg.distance.text,
                duration: leg.duration.text,
                distanceMeters: leg.distance.value,
                durationSeconds: leg.duration.value
            };
        });

        return {
            steps: steps,
            totalDistance: (totalDistance / 1000).toFixed(1) + ' km',
            totalDuration: this.formatDuration(totalDuration),
            optimizedOrder: optimizedOrder,
            optimizedWaypoints: optimizedOrder.map(i => this.waypoints[i])
        };
    }

    /**
     * Format duration in seconds to human readable
     */
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        }
        return `${minutes}min`;
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
                <h4>Étapes du trajet</h4>
        `;

        routeData.steps.forEach((step, index) => {
            html += `
                <div class="route-step">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-details">
                        <div class="step-from">${step.from}</div>
                        <div class="step-arrow">↓</div>
                        <div class="step-to">${step.to}</div>
                        <div class="step-info">
                            <span>🚗 ${step.distance}</span>
                            <span>⏱️ ${step.duration}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
            </div>
            <div class="route-actions">
                <button class="btn btn-primary" onclick="window.BestRouteManager.openInGoogleMaps()">
                    🗺️ Ouvrir dans Google Maps
                </button>
                <button class="btn btn-secondary" onclick="window.BestRouteManager.shareRoute()">
                    📤 Partager l'itinéraire
                </button>
            </div>
        `;

        container.innerHTML = html;
    }

    /**
     * Open route in Google Maps app
     */
    openInGoogleMaps() {
        if (!this.currentRoute) return;

        const route = this.currentRoute.routes[0];
        const origin = route.legs[0].start_location;
        const destination = route.legs[route.legs.length - 1].end_location;

        // Build waypoints string
        const waypoints = route.legs.slice(0, -1).map(leg =>
            `${leg.end_location.lat()},${leg.end_location.lng()}`
        ).join('|');

        const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat()},${origin.lng()}&destination=${destination.lat()},${destination.lng()}&waypoints=${waypoints}&travelmode=driving`;

        window.open(url, '_blank');
    }

    /**
     * Share route
     */
    async shareRoute() {
        if (!this.currentRoute) return;

        const routeData = this.parseRouteResult(this.currentRoute);
        const text = `Itinéraire AutoManager:\n\nDistance: ${routeData.totalDistance}\nDurée: ${routeData.totalDuration}\n\n${routeData.steps.map((s, i) => `${i + 1}. ${s.from} → ${s.to} (${s.distance})`).join('\n')}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Itinéraire AutoManager',
                    text: text
                });
            } catch (error) {
                console.log('Share cancelled or failed:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text);
            alert('✅ Itinéraire copié dans le presse-papier !');
        }
    }

    /**
     * Use current location as origin
     */
    async useCurrentLocation() {
        try {
            const location = await this.getCurrentLocation();
            const originInput = document.getElementById('route-origin');
            if (originInput) {
                originInput.value = `${location.lat}, ${location.lng}`;
                alert('✅ Position actuelle définie comme point de départ');
            }
        } catch (error) {
            alert('❌ Impossible d\'obtenir votre position.\n' + error.message);
        }
    }

    /**
     * Add waypoint from input field
     */
    addWaypointFromInput() {
        const input = document.getElementById('waypoint-input');
        if (!input || !input.value.trim()) {
            alert('Veuillez entrer une adresse');
            return;
        }

        const address = input.value.trim();
        this.addWaypoint(address, address);
        input.value = '';

        this.renderWaypointsList();
    }

    /**
     * Remove waypoint
     */
    removeWaypoint(index) {
        this.waypoints.splice(index, 1);
        this.renderWaypointsList();
    }

    /**
     * Render waypoints list
     */
    renderWaypointsList() {
        const container = document.getElementById('waypoints-list');
        if (!container) return;

        if (this.waypoints.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.9rem;">Aucun arrêt ajouté</p>';
            return;
        }

        let html = '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';
        this.waypoints.forEach((waypoint, index) => {
            html += `
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem; background: var(--card-bg); border-radius: 6px; border: 1px solid var(--border-color);">
                    <span style="font-size: 0.9rem;">${index + 1}. ${waypoint.name}</span>
                    <button onclick="window.BestRouteManager.removeWaypoint(${index})" style="background: none; border: none; color: #ef4444; cursor: pointer; font-size: 1.2rem;">×</button>
                </div>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Calculate route from UI
     */
    async calculateRoute() {
        const originInput = document.getElementById('route-origin');
        const destinationInput = document.getElementById('route-destination');

        if (!originInput || !originInput.value.trim()) {
            alert('Veuillez entrer un point de départ');
            return;
        }

        if (this.waypoints.length === 0) {
            alert('Veuillez ajouter au moins un point d\'arrêt');
            return;
        }

        const origin = originInput.value.trim();
        const destination = destinationInput && destinationInput.value.trim() ? destinationInput.value.trim() : null;

        try {
            const routeData = await this.calculateBestRoute(origin, destination);
            this.renderRouteUI(routeData);
        } catch (error) {
            alert('❌ Erreur lors du calcul de l\'itinéraire:\n' + error.message);
        }
    }
}

// Initialize and export
window.BestRouteManager = new BestRouteManager();
