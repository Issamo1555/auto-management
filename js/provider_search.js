/**
 * Provider Search Module
 * Handles provider search UI and recommendations display
 */

class ProviderSearchManager {
    constructor() {
        this.currentRecommendations = [];
    }

    /**
     * Open provider search modal
     * @param {Object} context - Context information (service type, vehicle, etc.)
     */
    openSearchModal(context = {}) {
        const modal = document.getElementById('modal-provider-search');
        if (!modal) {
            console.error('Provider search modal not found');
            return;
        }

        // Pre-fill form with context
        if (context.serviceType) {
            const serviceSelect = modal.querySelector('#provider-service-type');
            if (serviceSelect) serviceSelect.value = context.serviceType;
        }

        if (context.vehicleBrand) {
            const brandInput = modal.querySelector('#provider-vehicle-brand');
            if (brandInput) brandInput.value = context.vehicleBrand;
        }

        modal.classList.remove('hidden');
    }

    /**
     * Search for providers
     */
    async searchProviders() {
        const city = document.getElementById('provider-city').value;
        const serviceType = document.getElementById('provider-service-type').value;
        const vehicleBrand = document.getElementById('provider-vehicle-brand').value;
        const priceRange = document.getElementById('provider-price-range').value;

        if (!city || !serviceType) {
            alert('Veuillez sélectionner une ville et un type de service');
            return;
        }

        console.log('🔍 Starting provider search with params:', { city, serviceType, vehicleBrand, priceRange });
        // DEBUG: Alert to verify city value
        // alert(`DEBUG: Searching for ${city} - ${serviceType}`);

        // Show loading state
        const resultsContainer = document.getElementById('provider-results');
        resultsContainer.innerHTML = '<div class="loading-spinner">🔄 Recherche en cours...</div>';

        try {
            console.log('📞 Calling AIService.getRecommendations...');
            // Get recommendations from AI service
            const recommendations = await window.AIService.getRecommendations({
                city,
                serviceType,
                vehicleBrand,
                priceRange
            });

            if (!recommendations || recommendations.length === 0) {
                throw new Error('No local recommendations found');
            }

            console.log('✅ Recommendations received:', recommendations);
            this.currentRecommendations = recommendations;
            this.displayResults(recommendations, serviceType);
        } catch (error) {
            console.warn('AI recommendation failed, falling back to Google Places API:', error);
            // Fallback to Google Places API
            const places = await this._fetchGooglePlaces(city, serviceType);
            if (places && places.length > 0) {
                // Transform places into provider-like objects
                const transformed = places.map(p => ({
                    id: p.place_id,
                    name: p.name,
                    address: p.formatted_address,
                    rating: p.rating || 0,
                    reviews: p.user_ratings_total || 0,
                    priceRange: priceRange || '$$',
                    services: [serviceType],
                    specializations: [],
                    coordinates: { lat: p.geometry.location.lat, lng: p.geometry.location.lng },
                    aiReasoning: ''
                }));
                this.currentRecommendations = transformed;
                this.displayResults(transformed, serviceType);
            } else {
                resultsContainer.innerHTML = `<div class="error-message">❌ Aucun résultat Google Places trouvé.</div>`;
            }
        }
    }

    /**
     * Display search results
     */
    displayResults(providers, serviceType) {
        const resultsContainer = document.getElementById('provider-results');

        if (providers.length === 0) {
            resultsContainer.innerHTML = `
                <div class="empty-state small">
                    <p>Aucun fournisseur trouvé pour ces critères.</p>
                    <p class="sub-text">Essayez d'élargir votre recherche.</p>
                </div>
            `;
            return;
        }

        // Get price estimate
        const priceEstimate = window.AIService.getEstimatedPrice(serviceType);

        const html = `
            ${priceEstimate ? `
                <div class="price-estimate">
                    💰 <strong>Prix estimé pour ${serviceType}:</strong> ${priceEstimate.formatted}
                </div>
            ` : ''}
            
            <div class="provider-list">
                ${providers.map((provider, index) => this._renderProviderCard(provider, index + 1)).join('')}
            </div>
            
            <div style="margin-top: 1.5rem; text-align: center;">
                <button class="btn btn-secondary close-modal" style="width: 100%;">Fermer</button>
            </div>
        `;

        resultsContainer.innerHTML = html;
    }

    /**
     * Render a single provider card
     */
    _renderProviderCard(provider, rank) {
        const priceSymbols = {
            '$': '💵 Économique',
            '$$': '💵💵 Moyen',
            '$$$': '💵💵💵 Premium'
        };

        return `
            <div class="provider-card" data-provider-id="${provider.id}">
                <div class="provider-rank">#${rank}</div>
                <div class="provider-header">
                    <div class="provider-info">
                        <h4 class="provider-name">${provider.name}</h4>
                        <div class="provider-rating">
                            ${'⭐'.repeat(Math.floor(provider.rating))}
                            <span class="rating-value">${provider.rating}/5</span>
                            <span class="review-count">(${provider.reviews} avis)</span>
                        </div>
                    </div>
                    <div class="provider-price-badge">
                        ${priceSymbols[provider.priceRange] || provider.priceRange}
                    </div>
                </div>

                <div class="provider-details">
                    <div class="provider-address">
                        📍 ${provider.address}
                    </div>

                    <div class="provider-services">
                        <strong>Services:</strong> ${provider.services.slice(0, 4).join(', ')}
                        ${provider.services.length > 4 ? ` +${provider.services.length - 4} autres` : ''}
                    </div>

                    ${provider.specializations.length > 0 ? `
                        <div class="provider-specializations">
                            <strong>Spécialisations:</strong> ${provider.specializations.join(', ')}
                        </div>
                    ` : ''}

                    ${provider.aiReasoning ? `
                        <div class="ai-reasoning">
                            🤖 <strong>Recommandé car:</strong> ${provider.aiReasoning}
                        </div>
                    ` : ''}
                </div>

                <div class="provider-actions">
                <button class="btn btn-secondary" onclick="window.ProviderSearchManager.callProvider('${provider.phone}')">
                    📞 Appeler
                </button>
                <button class="btn btn-secondary" onclick="window.open('https://wa.me/${provider.phone.replace(/\D/g, '')}', '_blank')">
                    � WhatsApp
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='mailto:${provider.email || ''}?subject=Demande de devis'">
                    📝 Devis
                </button>
                <button class="btn btn-secondary" onclick="window.open('${provider.website || '#'}', '_blank')">
                    📅 RDV
                </button>
                <button class="btn btn-secondary" onclick="window.ProviderSearchManager.openMap(${provider.coordinates.lat}, ${provider.coordinates.lng})">
                    🗺️ Itinéraire
                </button>
                <button class="btn btn-primary" onclick="window.ProviderSearchManager.selectProvider('${provider.id}')">
                    ✓ Choisir
                </button>
            </div>
            </div>
        `;
    }

    /**
     * Call provider
     */
    callProvider(phone) {
        window.location.href = `tel:${phone}`;
    }

    /**
     * Open map to provider location
     */
    openMap(lat, lng) {
        const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
        window.open(url, '_blank');
    }
    /**
    * Fetch provider suggestions from Google Places API as fallback
    * @param {string} city - City name entered by user
    * @param {string} serviceType - Service type (e.g., "Garage", "Mécanicien")
    */
    /**
    * Load Google Maps API dynamically if not already loaded
    */
    async _loadGoogleMapsScript() {
        console.log('🗺️ _loadGoogleMapsScript called');
        if (window.google && window.google.maps && window.google.maps.places) {
            console.log('🗺️ Google Maps already loaded');
            return true;
        }

        const apiKey = window.GOOGLE_PLACES_API_KEY || (window.AppConfig && window.AppConfig.GOOGLE_PLACES_API_KEY);
        if (!apiKey) {
            console.warn('⚠️ Google Places API key not set');
            return false;
        }

        if (document.getElementById('google-maps-script')) {
            console.log('🗺️ Script element already exists, waiting for load...');
            return new Promise(resolve => {
                const script = document.getElementById('google-maps-script');
                script.addEventListener('load', () => {
                    console.log('🗺️ Existing script loaded');
                    resolve(true);
                });
                script.addEventListener('error', () => {
                    console.error('❌ Existing script failed to load');
                    resolve(false);
                });
            });
        }

        console.log('🗺️ Creating new script element...');
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.id = 'google-maps-script';
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = () => {
                console.log('🗺️ Google Maps script loaded successfully');
                resolve(true);
            };
            script.onerror = (e) => {
                console.error('❌ Failed to load Google Maps script', e);
                resolve(false);
            };
            document.head.appendChild(script);
        });
    }

    /**
    * Fetch provider suggestions from Google Places API as fallback
    * @param {string} city - City name entered by user
    * @param {string} serviceType - Service type (e.g., "Garage", "Mécanicien")
    */
    async _fetchGooglePlaces(city, serviceType) {
        console.log(`🗺️ _fetchGooglePlaces called for ${city} - ${serviceType}`);
        const loaded = await this._loadGoogleMapsScript();
        if (!loaded) {
            console.error('❌ Google Maps script not loaded, aborting search');
            return [];
        }

        return new Promise((resolve) => {
            console.log('🗺️ Initializing PlacesService...');
            const service = new google.maps.places.PlacesService(document.createElement('div'));
            const request = {
                query: `${serviceType} in ${city}`,
                fields: ['place_id', 'name', 'formatted_address', 'rating', 'user_ratings_total', 'geometry']
            };

            console.log('🗺️ Sending textSearch request...', request);
            service.textSearch(request, (results, status) => {
                console.log(`🗺️ textSearch callback received. Status: ${status}`);
                if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                    console.log(`✅ Found ${results.length} results`);
                    resolve(results);
                } else {
                    console.warn('⚠️ Google Places search failed or empty:', status);
                    // Alert the user for debugging purposes
                    // alert(`Google Places Error: ${status}. Check API Key permissions.`);
                    resolve([]);
                }
            });
        });
    }
    /**
     * Select a provider (save to maintenance record)
     */
    selectProvider(providerId) {
        const provider = this.currentRecommendations.find(p => p.id === providerId);
        if (!provider) return;

        // Fill maintenance form with provider info
        const providerInput = document.querySelector('[name="provider"]');
        if (providerInput) {
            providerInput.value = provider.name;
        }

        // Close modal
        const modal = document.getElementById('modal-provider-search');
        if (modal) modal.classList.add('hidden');

        // Show success message
        if (window.UIManager) {
            window.UIManager.showNotification(`✓ ${provider.name} sélectionné`, 'success');
        } else {
            alert(`✓ ${provider.name} sélectionné`);
        }
    }

    /**
     * Attach events to provider search modal using event delegation
     */
    attachEvents(container) {
        console.log('🔧 Attaching provider search events via delegation...');

        // Use document.body for delegation to ensure we catch events even if modal is re-rendered
        document.body.addEventListener('click', (e) => {
            // Search button - handled by submit event if type="submit", but we catch click just in case it's changed
            if (e.target && e.target.id === 'btn-search-providers' && e.target.type !== 'submit') {
                console.log('🖱️ Search button clicked (non-submit)!');
                e.preventDefault();
                this.searchProviders();
            }

            // Close button
            if (e.target && (e.target.classList.contains('close-modal') || e.target.closest('.close-modal'))) {
                const modal = document.getElementById('modal-provider-search');
                if (modal && modal.contains(e.target)) {
                    modal.classList.add('hidden');
                }
            }
        });

        // Form submit - Primary way to handle search
        document.body.addEventListener('submit', (e) => {
            if (e.target && e.target.id === 'form-provider-search') {
                console.log('📝 Form submitted via delegation!');
                e.preventDefault();
                this.searchProviders();
            }
        });

        console.log('✅ Provider search events attached via delegation');
    }
}

window.ProviderSearchManager = new ProviderSearchManager();
// Initialize events immediately using delegation
window.ProviderSearchManager.attachEvents();
