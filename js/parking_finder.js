/**
 * Parking Finder Module - Leaflet/OpenStreetMap Version
 * Trouve les parkings disponibles à Marrakech
 */

class ParkingFinder {
    constructor() {
        this.parkings = [];
        this.map = null;
        this.markers = [];
    }

    /**
     * Initialize Leaflet map for parking search
     */
    async initMap(containerId, center = [31.6295, -7.9811]) {
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

        // Initialize Leaflet map
        this.map = L.map(containerId).setView(center, 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.map);

        console.log('✅ Parking Finder Map initialized');
    }

    /**
     * Search for parkings (mock data)
     */
    async searchParkings(location) {
        // Clear previous markers
        this.clearMarkers();

        // Mock parking data for Marrakech
        this.parkings = [
            {
                name: 'Parking Koutoubia',
                address: 'Avenue Mohammed V, Marrakech',
                lat: 31.6258,
                lng: -7.9891,
                capacity: 200,
                price: '10 DH/heure',
                available: true
            },
            {
                name: 'Parking Jamâa El Fna',
                address: 'Place Jamâa El Fna, Marrakech',
                lat: 31.6253,
                lng: -7.9898,
                capacity: 150,
                price: '15 DH/heure',
                available: true
            },
            {
                name: 'Parking Gueliz',
                address: 'Avenue Mohammed V, Gueliz',
                lat: 31.6350,
                lng: -8.0100,
                capacity: 300,
                price: '8 DH/heure',
                available: true
            },
            {
                name: 'Parking Menara Mall',
                address: 'Avenue Menara, Marrakech',
                lat: 31.6150,
                lng: -8.0200,
                capacity: 500,
                price: 'Gratuit (clients)',
                available: true
            }
        ];

        // Display parkings on map
        this.displayParkingsOnMap();

        // Render list
        this.renderParkingList();

        return this.parkings;
    }

    /**
     * Display parkings on map
     */
    displayParkingsOnMap() {
        if (!this.map) return;

        const bounds = L.latLngBounds();

        this.parkings.forEach(parking => {
            const marker = L.marker([parking.lat, parking.lng], {
                icon: L.divIcon({
                    className: 'parking-marker',
                    html: `<div style="background: #2563eb; color: white; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 20px; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">🅿️</div>`,
                    iconSize: [36, 36],
                    iconAnchor: [18, 18]
                })
            }).addTo(this.map);

            marker.bindPopup(`
                <div style="min-width: 200px;">
                    <strong style="color: #2563eb; font-size: 1.1em;">${parking.name}</strong><br>
                    <p style="margin: 0.5rem 0; color: #666;">${parking.address}</p>
                    <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                        <span>💰 ${parking.price}</span>
                        <span>🚗 ${parking.capacity} places</span>
                    </div>
                    ${parking.available ? '<span style="color: #10b981; font-weight: bold;">✓ Disponible</span>' : '<span style="color: #ef4444;">✗ Complet</span>'}
                </div>
            `);

            this.markers.push(marker);
            bounds.extend([parking.lat, parking.lng]);
        });

        // Fit map to show all parkings
        if (this.parkings.length > 0) {
            this.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }

    /**
     * Render parking list
     */
    renderParkingList() {
        const container = document.getElementById('parking-list');
        if (!container) return;

        let html = '<h4>🅿️ Parkings trouvés</h4>';

        this.parkings.forEach((parking, index) => {
            html += `
                <div class="parking-item" onclick="window.ParkingFinder.focusParking(${index})">
                    <div class="parking-header">
                        <strong>${parking.name}</strong>
                        <span class="parking-price">${parking.price}</span>
                    </div>
                    <p class="parking-address">${parking.address}</p>
                    <div class="parking-info">
                        <span>🚗 ${parking.capacity} places</span>
                        <span class="${parking.available ? 'available' : 'full'}">
                            ${parking.available ? '✓ Disponible' : '✗ Complet'}
                        </span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    /**
     * Focus on a specific parking
     */
    focusParking(index) {
        const parking = this.parkings[index];
        if (!parking || !this.map) return;

        this.map.setView([parking.lat, parking.lng], 16);
        this.markers[index].openPopup();
    }

    /**
     * Clear all markers
     */
    clearMarkers() {
        if (!this.map) return;

        this.markers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.markers = [];
    }

    /**
     * Open parking modal
     */
    openModal() {
        const modal = document.getElementById('modal-parking-finder');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => {
                this.initMap('parking-map');
                this.searchParkings('Marrakech');
            }, 100);
        }
    }

    /**
     * Close parking modal
     */
    closeModal() {
        const modal = document.getElementById('modal-parking-finder');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
}

// Initialize
window.ParkingFinder = new ParkingFinder();

console.log('✅ Parking Finder (Leaflet) loaded');
