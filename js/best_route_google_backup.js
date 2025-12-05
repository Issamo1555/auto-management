/**
 * Best Route Module
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
            location: location, // {lat, lng} or address string
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

        if (this.isMockMode) {
            return this.mockCalculateRoute(origin, destination);
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
                <div class="route-step" style="display: flex; gap: 1rem; padding: 0.75rem; border-bottom: 1px solid var(--border-color); align-items: flex-start;">
                    <div class="step-number" style="background: var(--primary-color); color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; flex-shrink: 0;">${index + 1}</div>
                    <div class="step-details" style="flex: 1;">
                        <div class="step-from" style="font-weight: 500; margin-bottom: 0.25rem;">${step.from}</div>
                        <div class="step-arrow" style="color: var(--text-secondary); font-size: 0.8rem; margin: 0.25rem 0;">↓</div>
                        <div class="step-to" style="font-weight: 500; margin-bottom: 0.5rem;">${step.to}</div>
                        <div class="step-info" style="display: flex; gap: 1rem; font-size: 0.85rem; color: var(--text-secondary); background: var(--background-color); padding: 0.25rem 0.5rem; border-radius: 4px;">
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
     * Setup Google Places Autocomplete
     */
    setupAutocomplete() {
        const originInput = document.getElementById('route-origin');
        const destinationInput = document.getElementById('route-destination');
        const waypointInput = document.getElementById('waypoint-input');

        if (originInput) {
            this.autocompleteOrigin = new google.maps.places.Autocomplete(originInput, {
                componentRestrictions: { country: 'ma' }, // Morocco only
                fields: ['formatted_address', 'geometry', 'name']
            });
        }

        if (destinationInput) {
            this.autocompleteDestination = new google.maps.places.Autocomplete(destinationInput, {
                componentRestrictions: { country: 'ma' },
                fields: ['formatted_address', 'geometry', 'name']
            });
        }

        if (waypointInput) {
            this.autocompleteWaypoint = new google.maps.places.Autocomplete(waypointInput, {
                componentRestrictions: { country: 'ma' },
                fields: ['formatted_address', 'geometry', 'name']
            });
        }
    }

    /**
     * Search nearby places (garages, monuments, restaurants)
     */
    searchNearbyPlaces(type, location) {
        return new Promise((resolve, reject) => {
            if (!this.placesService) {
                reject(new Error('Places service not initialized'));
                return;
            }

            const request = {
                location: location,
                radius: 5000, // 5km
                type: type // 'car_repair', 'tourist_attraction', 'restaurant'
            };

            this.placesService.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else {
                    reject(new Error('Places search failed'));
                }
            });
        });
    }

    /**
     * Show quick suggestions (garages, monuments, restaurants)
     */
    async showQuickSuggestions() {
        const container = document.getElementById('quick-suggestions');
        if (!container) return;

        // Get suggestions from tourism data
        const suggestions = [
            { icon: '🔧', name: 'Garages à proximité', type: 'car_repair' },
            { icon: '🏛️', name: 'Monuments historiques', type: 'tourist_attraction' },
            { icon: '🍽️', name: 'Restaurants', type: 'restaurant' },
            { icon: '🅿️', name: 'Parkings', type: 'parking' }
        ];

        let html = '<div class="suggestions-grid">';
        suggestions.forEach(sug => {
            html += `
                <button class="suggestion-btn" onclick="window.BestRouteManager.addSuggestionType('${sug.type}')">
                    <span class="suggestion-icon">${sug.icon}</span>
                    <span class="suggestion-text">${sug.name}</span>
                </button>
            `;
        });
        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Add suggestion type to waypoints
     */
    async addSuggestionType(type) {
        try {
            const originInput = document.getElementById('route-origin');
            if (!originInput || !originInput.value) {
                alert('Veuillez d\'abord entrer un point de départ');
                return;
            }

            // Geocode origin
            const geocoder = new google.maps.Geocoder();
            const result = await new Promise((resolve, reject) => {
                geocoder.geocode({ address: originInput.value }, (results, status) => {
                    if (status === 'OK') resolve(results[0]);
                    else reject(new Error('Geocoding failed'));
                });
            });

            const location = result.geometry.location;

            // Search nearby places
            const places = await this.searchNearbyPlaces(type, location);

            if (places.length === 0) {
                alert('Aucun lieu trouvé à proximité');
                return;
            }

            // Show places selection modal
            this.showPlacesSelection(places);
        } catch (error) {
            alert('Erreur: ' + error.message);
        }
    }

    /**
     * Show places selection modal
     */
    showPlacesSelection(places) {
        const modal = document.getElementById('places-selection-modal');
        if (!modal) return;

        const list = modal.querySelector('.places-list');
        if (!list) return;

        let html = '';
        places.slice(0, 10).forEach((place, index) => {
            html += `
                <div class="place-item" onclick="window.BestRouteManager.selectPlace(${index})">
                    <div class="place-info">
                        <strong>${place.name}</strong>
                        <p>${place.vicinity}</p>
                        ${place.rating ? `<span class="rating">⭐ ${place.rating}</span>` : ''}
                    </div>
                    <button class="btn-add">Ajouter</button>
                </div>
            `;
        });

        list.innerHTML = html;
        modal.style.display = 'block';

        // Store places for selection
        this.tempPlaces = places;
    }

    /**
     * Select a place from suggestions
     */
    selectPlace(index) {
        if (!this.tempPlaces || !this.tempPlaces[index]) return;

        const place = this.tempPlaces[index];
        this.addWaypoint(place.vicinity, place.name);
        this.renderWaypointsList();

        // Close modal
        const modal = document.getElementById('places-selection-modal');
        if (modal) modal.style.display = 'none';

        alert(`✅ ${place.name} ajouté à l'itinéraire`);
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



    /**
     * Mock Calculate Route
     */
    async mockCalculateRoute(origin, destination) {
        return new Promise(resolve => {
            setTimeout(() => {
                const mockSteps = [
                    {
                        from: origin,
                        to: this.waypoints[0].location,
                        distance: '5.2 km',
                        duration: '15 min',
                        distanceMeters: 5200,
                        durationSeconds: 900
                    }
                ];

                for (let i = 0; i < this.waypoints.length - 1; i++) {
                    mockSteps.push({
                        from: this.waypoints[i].location,
                        to: this.waypoints[i + 1].location,
                        distance: '3.1 km',
                        duration: '10 min',
                        distanceMeters: 3100,
                        durationSeconds: 600
                    });
                }

                if (destination) {
                    mockSteps.push({
                        from: this.waypoints[this.waypoints.length - 1].location,
                        to: destination,
                        distance: '4.5 km',
                        duration: '12 min',
                        distanceMeters: 4500,
                        durationSeconds: 720
                    });
                }

                resolve({
                    steps: mockSteps,
                    totalDistance: '12.8 km',
                    totalDuration: '37 min',
                    optimizedOrder: [],
                    optimizedWaypoints: this.waypoints
                });
            }, 1000);
        });
    }
}

// Initialize and export
window.BestRouteManager = new BestRouteManager();

