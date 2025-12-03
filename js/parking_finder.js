/**
 * Parking Finder Module
 * Trouve les parkings disponibles à Marrakech avec Google Places API
 */

class ParkingFinder {
    constructor() {
        this.parkings = [];
        this.map = null;
        this.markers = [];
        this.infoWindows = [];
    }

    /**
     * Initialize map for parking search
     */
    async initMap(containerId, center = { lat: 31.6295, lng: -7.9811 }) {
        if (!window.google || !window.google.maps) {
            await this.loadGoogleMaps();
        }

        const mapContainer = document.getElementById(containerId);
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }

        this.map = new google.maps.Map(mapContainer, {
            zoom: 13,
            center: center, // Marrakech center
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            styles: [
                {
                    featureType: 'poi.business',
                    stylers: [{ visibility: 'off' }]
                }
            ]
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
     * Search for parkings in Marrakech
     */
    async searchParkings(location = null, radius = 5000) {
        if (!this.map) {
            await this.initMap('parking-map');
        }

        // Default to Marrakech center if no location provided
        const searchLocation = location || { lat: 31.6295, lng: -7.9811 };

        const service = new google.maps.places.PlacesService(this.map);

        const request = {
            location: searchLocation,
            radius: radius,
            type: 'parking',
            keyword: 'parking'
        };

        return new Promise((resolve, reject) => {
            service.nearbySearch(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    this.parkings = results;
                    this.displayParkingsOnMap(results);
                    resolve(results);
                } else {
                    console.error('Places search failed:', status);
                    reject(new Error(`Erreur de recherche: ${status}`));
                }
            });
        });
    }

    /**
     * Display parkings on map with markers
     */
    displayParkingsOnMap(parkings) {
        // Clear existing markers
        this.clearMarkers();

        parkings.forEach((parking, index) => {
            const marker = new google.maps.Marker({
                position: parking.geometry.location,
                map: this.map,
                title: parking.name,
                animation: google.maps.Animation.DROP,
                icon: {
                    url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }
            });

            const infoWindow = new google.maps.InfoWindow({
                content: this.createInfoWindowContent(parking)
            });

            marker.addListener('click', () => {
                // Close all other info windows
                this.infoWindows.forEach(iw => iw.close());
                infoWindow.open(this.map, marker);
            });

            this.markers.push(marker);
            this.infoWindows.push(infoWindow);
        });

        // Fit map to show all markers
        if (parkings.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            parkings.forEach(parking => {
                bounds.extend(parking.geometry.location);
            });
            this.map.fitBounds(bounds);
        }
    }

    /**
     * Create info window content for parking
     */
    createInfoWindowContent(parking) {
        const rating = parking.rating ? `⭐ ${parking.rating}/5` : 'Pas de note';
        const openNow = parking.opening_hours?.open_now ? '🟢 Ouvert' : '🔴 Fermé';

        return `
            <div style="padding: 10px; max-width: 250px;">
                <h4 style="margin: 0 0 8px 0; color: #2563eb;">${parking.name}</h4>
                <p style="margin: 4px 0; font-size: 0.9rem;">${parking.vicinity}</p>
                <p style="margin: 4px 0; font-size: 0.9rem;">${rating}</p>
                <p style="margin: 4px 0; font-size: 0.9rem;">${openNow}</p>
                <button onclick="window.ParkingFinder.navigateToParking(${parking.geometry.location.lat()}, ${parking.geometry.location.lng()})" 
                    style="margin-top: 8px; padding: 6px 12px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🗺️ Y aller
                </button>
            </div>
        `;
    }

    /**
     * Clear all markers from map
     */
    clearMarkers() {
        this.markers.forEach(marker => marker.setMap(null));
        this.markers = [];
        this.infoWindows = [];
    }

    /**
     * Navigate to parking
     */
    navigateToParking(lat, lng) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
        window.open(url, '_blank');
    }

    /**
     * Render parkings list
     */
    renderParkingsList(parkings) {
        const container = document.getElementById('parking-list');
        if (!container) return;

        if (parkings.length === 0) {
            container.innerHTML = '<p style="color: var(--text-secondary);">Aucun parking trouvé dans cette zone.</p>';
            return;
        }

        let html = '<div style="display: flex; flex-direction: column; gap: 1rem;">';

        parkings.forEach((parking, index) => {
            const rating = parking.rating ? `⭐ ${parking.rating}/5` : 'Pas de note';
            const openNow = parking.opening_hours?.open_now ?
                '<span style="color: #10b981;">🟢 Ouvert</span>' :
                '<span style="color: #ef4444;">🔴 Fermé</span>';

            const distance = parking.geometry?.location ?
                this.calculateDistance(
                    { lat: 31.6295, lng: -7.9811 },
                    { lat: parking.geometry.location.lat(), lng: parking.geometry.location.lng() }
                ) : null;

            html += `
                <div class="parking-card" style="padding: 1rem; background: var(--card-bg); border-radius: 8px; border: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                        <h4 style="margin: 0; color: var(--text-primary);">${index + 1}. ${parking.name}</h4>
                        ${openNow}
                    </div>
                    <p style="margin: 4px 0; color: var(--text-secondary); font-size: 0.9rem;">📍 ${parking.vicinity}</p>
                    <p style="margin: 4px 0; color: var(--text-secondary); font-size: 0.9rem;">${rating}</p>
                    ${distance ? `<p style="margin: 4px 0; color: var(--text-secondary); font-size: 0.9rem;">📏 ~${distance} km du centre</p>` : ''}
                    <div style="margin-top: 0.75rem; display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary" onclick="window.ParkingFinder.navigateToParking(${parking.geometry.location.lat()}, ${parking.geometry.location.lng()})" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                            🗺️ Y aller
                        </button>
                        <button class="btn btn-secondary" onclick="window.ParkingFinder.showOnMap(${index})" style="font-size: 0.9rem; padding: 0.5rem 1rem;">
                            📍 Voir sur carte
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    /**
     * Show specific parking on map
     */
    showOnMap(index) {
        if (index >= 0 && index < this.markers.length) {
            const marker = this.markers[index];
            const infoWindow = this.infoWindows[index];

            // Close all info windows
            this.infoWindows.forEach(iw => iw.close());

            // Open selected info window
            infoWindow.open(this.map, marker);

            // Center map on marker
            this.map.setCenter(marker.getPosition());
            this.map.setZoom(15);
        }
    }

    /**
     * Calculate distance between two points (Haversine formula)
     */
    calculateDistance(point1, point2) {
        const R = 6371; // Earth radius in km
        const dLat = this.toRad(point2.lat - point1.lat);
        const dLon = this.toRad(point2.lng - point1.lng);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRad(point1.lat)) * Math.cos(this.toRad(point2.lat)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance.toFixed(1);
    }

    /**
     * Convert degrees to radians
     */
    toRad(degrees) {
        return degrees * (Math.PI / 180);
    }

    /**
     * Search parkings from UI
     */
    async searchFromUI() {
        const btn = document.getElementById('btn-search-parking');
        if (btn) {
            btn.disabled = true;
            btn.textContent = '🔍 Recherche en cours...';
        }

        try {
            // Get user location or use Marrakech center
            let location = { lat: 31.6295, lng: -7.9811 };

            const useCurrentLocation = document.getElementById('use-current-location')?.checked;
            if (useCurrentLocation) {
                try {
                    const userLocation = await this.getCurrentLocation();
                    location = userLocation;
                } catch (error) {
                    console.log('Could not get user location, using Marrakech center');
                }
            }

            const parkings = await this.searchParkings(location);
            this.renderParkingsList(parkings);

            if (btn) {
                btn.disabled = false;
                btn.textContent = '🔍 Rechercher des parkings';
            }
        } catch (error) {
            alert('❌ Erreur lors de la recherche:\n' + error.message);
            if (btn) {
                btn.disabled = false;
                btn.textContent = '🔍 Rechercher des parkings';
            }
        }
    }

    /**
     * Get current location
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
     * Open parking finder modal
     */
    openModal() {
        const modal = document.getElementById('modal-parking-finder');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => {
                this.initMap('parking-map');
                this.searchFromUI();
            }, 100);
        }
    }

    /**
     * Close parking finder modal
     */
    closeModal() {
        const modal = document.getElementById('modal-parking-finder');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
}

// Initialize and export
window.ParkingFinder = new ParkingFinder();
