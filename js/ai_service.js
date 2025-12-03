/**
 * AI Service for Provider Recommendations
 * Uses Google Gemini API for intelligent provider matching
 */

class AIService {
    constructor() {
        // Using Google Gemini API (free tier)
        // Note: In production, API key should be stored securely on backend
        // Using Google Gemini API
        // Note: In production, API key should be stored securely on backend
        const settings = window.SettingsManager ? window.SettingsManager.getSettings() : {};
        this.GEMINI_API_KEY = window.AppConfig?.GEMINI_API_KEY || settings.geminiApiKey || 'AIzaSyBonWFiLUsJSjuN59tytqC7dyRx5FmdPLs';
        this.GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        this.cache = new Map();
        this.CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
    }

    /**
     * Get provider recommendations using AI
     * @param {Object} params - Search parameters
     * @param {string} params.city - User's city
     * @param {string} params.serviceType - Type of service needed
     * @param {string} params.vehicleBrand - Vehicle brand (optional)
     * @param {string} params.priceRange - Preferred price range (optional)
     * @returns {Promise<Array>} - Recommended providers
     */
    async getRecommendations(params) {
        console.log('🤖 AIService: getRecommendations called', params);
        const { city, serviceType, vehicleBrand, priceRange } = params;

        // Check cache first
        const cacheKey = JSON.stringify(params);
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
            console.log('Returning cached recommendations');
            return cached.data;
        }

        try {
            console.log('🤖 AIService: Trying AI recommendations...');
            // Try AI-powered recommendations
            const aiRecommendations = await this._getAIRecommendations(params);
            console.log('🤖 AIService: AI success', aiRecommendations);

            // Cache the results
            this.cache.set(cacheKey, {
                data: aiRecommendations,
                timestamp: Date.now()
            });

            return aiRecommendations;
        } catch (error) {
            console.warn('AI service failed, falling back to rule-based matching:', error);
            // Fallback to rule-based matching
            try {
                console.log('🤖 AIService: Trying fallback...');
                const fallback = this._getRuleBasedRecommendations(params);
                console.log('🤖 AIService: Fallback success', fallback);
                return fallback;
            } catch (fallbackError) {
                console.error('❌ AIService: Fallback also failed!', fallbackError);
                throw fallbackError;
            }
        }
    }

    /**
     * Get AI-powered recommendations using Google Gemini
     */
    async _getAIRecommendations(params) {
        const { city, serviceType, vehicleBrand, priceRange } = params;

        // Filter providers by city first
        const allProviders = window.ProviderManager ? window.ProviderManager.getAll() : window.ServiceProviders;
        const cityProviders = allProviders.filter(p => p.city === city);

        if (cityProviders.length === 0) {
            throw new Error(`No providers found in ${city}`);
        }

        // Create prompt for Gemini
        const prompt = this._createPrompt(params, cityProviders);

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        try {
            // Call Gemini API
            const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.candidates[0].content.parts[0].text;

            // Parse AI response to get provider IDs
            const recommendedIds = this._parseAIResponse(aiResponse);

            // Return providers with AI reasoning
            return cityProviders
                .filter(p => recommendedIds.includes(p.id))
                .map(p => ({
                    ...p,
                    aiReasoning: this._extractReasoningForProvider(aiResponse, p.id)
                }));
        } catch (error) {
            clearTimeout(timeoutId);
            throw error;
        }
    }

    /**
     * Create prompt for Gemini AI
     */
    _createPrompt(params, providers) {
        const { city, serviceType, vehicleBrand, priceRange } = params;

        const providersInfo = providers.map(p =>
            `ID: ${p.id}
Name: ${p.name}
Services: ${p.services.join(', ')}
Specializations: ${p.specializations.join(', ')}
Price Range: ${p.priceRange}
Rating: ${p.rating}/5 (${p.reviews} avis)
Address: ${p.address}`
        ).join('\n\n');

        return `Tu es un expert en recommandation de garages automobiles au Maroc.

**Contexte:**
Un client à ${city} cherche un garage pour: ${serviceType}
${vehicleBrand ? `Véhicule: ${vehicleBrand}` : ''}
${priceRange ? `Budget préféré: ${priceRange}` : ''}

**Garages disponibles à ${city}:**
${providersInfo}

**Instructions:**
1. Analyse les garages et recommande les 3 MEILLEURS pour ce client
2. Prends en compte:
   - La spécialisation (marque du véhicule si mentionnée)
   - Les services proposés
   - Le rapport qualité/prix
   - Les avis clients
   - L'adéquation avec le budget
3. Classe-les par ordre de pertinence (meilleur en premier)

**Format de réponse STRICT:**
Pour chaque garage recommandé, utilise EXACTEMENT ce format:
RECOMMANDATION: [ID du garage]
RAISON: [Explication en 1-2 phrases]

Exemple:
RECOMMANDATION: cas_001
RAISON: Excellent rapport qualité/prix avec spécialisation dans les pièces authentiques.

Donne UNIQUEMENT les 3 meilleures recommandations.`;
    }

    /**
     * Parse AI response to extract provider IDs
     */
    _parseAIResponse(response) {
        const regex = /RECOMMANDATION:\s*([a-z_0-9]+)/gi;
        const matches = [...response.matchAll(regex)];
        return matches.map(m => m[1]);
    }

    /**
     * Extract reasoning for a specific provider
     */
    _extractReasoningForProvider(response, providerId) {
        const regex = new RegExp(`RECOMMANDATION:\\s*${providerId}\\s*RAISON:\\s*([^\\n]+)`, 'i');
        const match = response.match(regex);
        return match ? match[1].trim() : 'Recommandé par notre IA';
    }

    /**
     * Fallback: Rule-based recommendations (no AI)
     */
    _getRuleBasedRecommendations(params) {
        const { city, serviceType, vehicleBrand, priceRange } = params;

        const allProviders = window.ProviderManager ? window.ProviderManager.getAll() : window.ServiceProviders;
        let providers = allProviders.filter(p => p.city === city);

        if (providers.length === 0) {
            console.log(`No providers found in ${city} for rule-based matching.`);
            return [];
        }

        // Filter by service type
        if (serviceType) {
            providers = providers.filter(p =>
                p.services.some(s => s.toLowerCase().includes(serviceType.toLowerCase()))
            );
        }

        // Filter by vehicle brand specialization
        if (vehicleBrand) {
            const specialized = providers.filter(p =>
                p.specializations.some(s => s.toLowerCase().includes(vehicleBrand.toLowerCase()))
            );
            if (specialized.length > 0) {
                providers = specialized;
            }
        }

        // Filter by price range
        if (priceRange) {
            providers = providers.filter(p => p.priceRange === priceRange);
        }

        // Sort by rating
        providers.sort((a, b) => {
            if (b.rating !== a.rating) return b.rating - a.rating;
            return b.reviews - a.reviews;
        });

        // Return top 3 with reasoning
        return providers.slice(0, 3).map(p => ({
            ...p,
            aiReasoning: this._generateRuleBasedReasoning(p, serviceType, vehicleBrand)
        }));
    }

    /**
     * Generate reasoning for rule-based recommendations
     */
    _generateRuleBasedReasoning(provider, serviceType, vehicleBrand) {
        const reasons = [];

        if (provider.rating >= 4.5) {
            reasons.push(`Excellente note (${provider.rating}/5)`);
        }

        if (vehicleBrand && provider.specializations.some(s => s.toLowerCase().includes(vehicleBrand.toLowerCase()))) {
            reasons.push(`Spécialisé ${vehicleBrand}`);
        }

        if (serviceType && provider.services.includes(serviceType)) {
            reasons.push(`Service ${serviceType} disponible`);
        }

        if (provider.priceRange === '$') {
            reasons.push('Prix économique');
        } else if (provider.priceRange === '$$$') {
            reasons.push('Service premium');
        }

        return reasons.length > 0 ? reasons.join('. ') : 'Garage recommandé';
    }

    /**
     * Get estimated price for a service
     */
    getEstimatedPrice(serviceType) {
        const prices = window.ServicePrices[serviceType];
        if (!prices) return null;

        return {
            min: prices.min,
            max: prices.max,
            avg: prices.avg,
            formatted: `${prices.min} - ${prices.max} MAD`
        };
    }

    /**
     * Get personalized car buying advice
     */
    /**
     * Get personalized car buying advice using Mistral AI
     */
    async getCarAdvice(userNeeds, topCars) {
        console.log('🤖 AIService: getCarAdvice called (Mistral)', userNeeds);

        const prompt = `
            Tu es un expert automobile au Maroc.
            
            Un utilisateur cherche une voiture avec ces critères :
            - Budget: ${userNeeds.budget} DH
            - Usage: ${userNeeds.usage}
            - Type: ${userNeeds.type_achat}
            - Kilométrage annuel: ${userNeeds.km_annuel}
            - Préférences: ${userNeeds.marques.join(', ')}
            
            Voici les voitures recommandées par notre algorithme :
            ${topCars.map(c => `- ${c.marque} ${c.modele} (${c.match}% match)`).join('\n')}
            
            Donne un conseil personnalisé en 3-4 phrases. 
            Explique pourquoi la première recommandation est bonne pour son usage spécifique.
            Mentionne un point de vigilance si c'est une occasion.
            
            Réponse courte et directe.
        `;

        // Check for API Key
        const apiKey = window.AppConfig?.MISTRAL_API_KEY || '';

        // Simulation Mode if no key or default key
        if (!apiKey || apiKey === 'YOUR_MISTRAL_API_KEY') {
            console.warn('⚠️ No Mistral API Key found. Using Simulation Mode.');
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(`[MODE SIMULATION] D'après vos critères (${userNeeds.usage}, budget ${userNeeds.budget} DH), la ${topCars[0].marque} ${topCars[0].modele} est un excellent choix. Elle offre le meilleur compromis pour un usage ${userNeeds.usage}. En occasion, vérifiez bien l'historique d'entretien et l'état de la courroie de distribution.`);
                }, 1500);
            });
        }

        try {
            const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "mistral-tiny",
                    messages: [
                        { role: "user", content: prompt }
                    ],
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.message || 'Mistral API error');
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('AI Advice failed', error);
            return "L'assistant IA n'est pas disponible pour le moment. Vérifiez votre clé API Mistral.";
        }
    }
}

window.AIService = new AIService();
