/**
 * Global Configuration
 * Contains API keys and environment settings.
 * 
 * IMPORTANT: In a production environment, API keys should be restricted 
 * or handled via a backend proxy to prevent exposure.
 */

window.APP_CONFIG = {
    // Google Maps API Key
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',

    // OpenAI API Key (pour les recommandations AI)
    OPENAI_API_KEY: 'YOUR_OPENAI_API_KEY',

    // Application Settings
    APP_NAME: 'AutoManager',
    APP_VERSION: '1.5.0'
};

// Backward compatibility for the code I just wrote in provider_search.js
// which looks for window.GOOGLE_PLACES_API_KEY
window.GOOGLE_PLACES_API_KEY = window.APP_CONFIG.GOOGLE_MAPS_API_KEY;
