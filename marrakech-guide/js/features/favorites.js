/**
 * Favorites Feature
 */
class FavoritesFeature {
    constructor() {
        this.storageKey = 'favorites';
        this.favorites = window.app.storage.get(this.storageKey, []) || [];
    }

    toggleFavorite(item) {
        const index = this.favorites.findIndex(f => f.id === item.id);
        if (index === -1) {
            this.favorites.push(item);
            this.showToast('Ajouté aux favoris ❤️');
        } else {
            this.favorites.splice(index, 1);
            this.showToast('Retiré des favoris 💔');
        }
        window.app.storage.set(this.storageKey, this.favorites);
        this.updateUI();
    }

    isFavorite(id) {
        return this.favorites.some(f => f.id === id);
    }

    render(container) {
        const t = (key) => window.app.features.language ? window.app.features.language.t(key) : key;

        if (this.favorites.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="text-align: center; padding: 3rem;">
                    <span style="font-size: 3rem;">⭐</span>
                    <h3 data-i18n="favorites.empty">${t('favorites.empty')}</h3>
                    <p data-i18n="favorites.empty_desc">${t('favorites.empty_desc')}</p>
                    <button class="btn btn-primary" onclick="window.app.navigateTo('home')" style="margin-top: 1rem;">
                        <span data-i18n="favorites.explore">${t('favorites.explore')}</span>
                    </button>
                </div>
            `;
            return;
        }

        let html = `
            <div class="module-header">
                <h2 data-i18n="btn.favorites">${t('btn.favorites')}</h2>
                <p>${this.favorites.length} lieux sauvegardés</p>
            </div>
            <div class="cards-grid">
        `;

        this.favorites.forEach(place => {
            html += `
                <div class="card">
                    ${place.image ? `<img src="${place.image}" class="card-image" loading="lazy">` : ''}
                    <div class="card-content">
                        <h3 class="card-title">${place.name}</h3>
                        <p class="card-subtitle">${place.type}</p>
                        <div class="place-address">📍 ${place.address}</div>
                        <button class="btn btn-secondary btn-block" style="margin-top: 1rem;" 
                            onclick="window.app.features.favorites.toggleFavorite({id: '${place.id}'})">
                            Retirer
                        </button>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 2rem;
            z-index: 1000;
            animation: fadeInOut 2s ease forwards;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    updateUI() {
        // Update heart icons if visible
    }
}

// Add animation style
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, 20px); }
        10% { opacity: 1; transform: translate(-50%, 0); }
        90% { opacity: 1; transform: translate(-50%, 0); }
        100% { opacity: 0; transform: translate(-50%, -20px); }
    }
`;
document.head.appendChild(style);

window.FavoritesFeature = FavoritesFeature;
