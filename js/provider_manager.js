/**
 * Provider Manager
 * Handles CRUD operations for service providers using LocalStorage
 */

class ProviderManager {
    constructor() {
        this.STORAGE_KEY = 'service_providers';
        this._init();
    }

    /**
     * Initialize data from seed if empty
     */
    _init() {
        const stored = window.StorageManager.get(this.STORAGE_KEY);
        if (!stored || stored.length === 0) {
            console.log('🌱 Seeding provider data...');
            // Seed with static data from provider_data.js
            const seedData = window.ServiceProviders || [];
            window.StorageManager.save(this.STORAGE_KEY, seedData);
        }
    }

    /**
     * Get all providers
     */
    getAll() {
        return window.StorageManager.get(this.STORAGE_KEY) || [];
    }

    /**
     * Get provider by ID
     */
    getById(id) {
        return this.getAll().find(p => p.id === id);
    }

    /**
     * Add a new provider
     */
    add(provider) {
        const newProvider = {
            id: 'prov_' + Date.now(),
            rating: 0,
            reviews: 0,
            ...provider
        };
        window.StorageManager.add(this.STORAGE_KEY, newProvider);
        return newProvider;
    }

    /**
     * Update an existing provider
     */
    update(id, updates) {
        const providers = this.getAll();
        const index = providers.findIndex(p => p.id === id);
        if (index !== -1) {
            const updated = { ...providers[index], ...updates };
            window.StorageManager.update(this.STORAGE_KEY, updated);
            return updated;
        }
        return null;
    }

    /**
     * Delete a provider
     */
    delete(id) {
        window.StorageManager.remove(this.STORAGE_KEY, id);
    }
}

window.ProviderManager = new ProviderManager();
