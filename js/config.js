/**
 * Global Configuration
 * Contains API keys and environment settings.
 * 
 * IMPORTANT: In a production environment, API keys should be restricted 
 * or handled via a backend proxy to prevent exposure.
 */

window.AppConfig = {
    // Google Places API Key for provider search fallback
    // Replace 'YOUR_API_KEY_HERE' with a valid key enabled for Places API (New) or Places API (Legacy)
    GOOGLE_PLACES_API_KEY: 'AIzaSyBQheW8LHwSb8f8Q3Yr25oENxcyXrytaVQ',

    // Google Gemini API Key (Optional)
    GEMINI_API_KEY: '',

    // Mistral AI API Key
    // Get your key at https://console.mistral.ai/
    MISTRAL_API_KEY: 'YOUR_MISTRAL_API_KEY',

    // Other global settings can be added here
    VERSION: '1.4.0'
};

// Backward compatibility for the code I just wrote in provider_search.js
// which looks for window.GOOGLE_PLACES_API_KEY
window.GOOGLE_PLACES_API_KEY = window.AppConfig.GOOGLE_PLACES_API_KEY;
