/**
 * StorageManager
 * Handles all interactions with LocalStorage.
 */
class StorageManager {
    constructor() {
        if (!this.isStorageAvailable()) {
            console.error("LocalStorage is not available!");
            alert("Attention: Votre navigateur ne supporte pas le stockage local. Vos données ne seront pas sauvegardées.");
        }
    }

    isStorageAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    }

    save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    // Add an item to a list stored at 'key'
    add(key, item) {
        const list = this.get(key);
        list.push(item);
        this.save(key, list);
        return list;
    }

    // Remove an item by ID from a list stored at 'key'
    remove(key, id) {
        let list = this.get(key);
        list = list.filter(item => item.id !== id);
        this.save(key, list);
        return list;
    }

    // Update an item by ID
    update(key, updatedItem) {
        let list = this.get(key);
        const index = list.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
            list[index] = updatedItem;
            this.save(key, list);
            return true;
        }
        return false;
    }
}

// Expose globally for now (MVS approach)
window.StorageManager = new StorageManager();
