/**
 * Restaurants Module
 */
class RestaurantsModule {
    render(container) {
        const t = (key) => window.app.features.language ? window.app.features.language.t(key) : key;

        let html = `
            <div class="module-header">
                <h2 data-i18n="module.restaurants.title">${t('module.restaurants.title')}</h2>
                <p data-i18n="module.restaurants.desc">${t('module.restaurants.desc')}</p>
            </div>
            <div class="cards-grid">
        `;

        window.RESTAURANTS.forEach(place => {
            const lang = window.app.features.language ? window.app.features.language.currentLang : 'fr';
            const getType = (p) => p.type[lang] || p.type['fr'] || p.type;
            const getTags = (p) => p.tags[lang] || p.tags['fr'] || p.tags;

            html += `
                <div class="card">
                    <img src="${place.image}" alt="${place.name}" class="card-image" loading="lazy">
                    <div class="card-content">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <h3 class="card-title">${place.name}</h3>
                            <span class="place-rating">★ ${place.rating}</span>
                        </div>
                        <p class="card-subtitle">${getType(place)} • ${t('restaurants.price_level')}: ${place.price_level}</p>
                        <div class="card-tags">
                            ${getTags(place).map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <div class="place-address">📍 ${place.address}</div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }
}

window.RestaurantsModule = RestaurantsModule;
