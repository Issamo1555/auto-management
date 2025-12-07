/**
 * Monuments Module
 */
class MonumentsModule {
    render(container) {
        const t = (key) => window.app.features.language ? window.app.features.language.t(key) : key;

        let html = `
            <div class="module-header">
                <h2 data-i18n="module.monuments.title">${t('module.monuments.title')}</h2>
                <p data-i18n="module.monuments.desc">${t('module.monuments.desc')}</p>
            </div>
            <div class="cards-grid">
        `;

        window.MONUMENTS.forEach(place => {
            const lang = window.app.features.language ? window.app.features.language.currentLang : 'fr';
            const getName = (p) => p.name[lang] || p.name['fr'] || p.name;
            const getType = (p) => p.type[lang] || p.type['fr'] || p.type;
            const getDesc = (p) => p.description[lang] || p.description['fr'] || p.description;

            html += `
                <div class="card">
                    <img src="${place.image}" alt="${getName(place)}" class="card-image" loading="lazy">
                    <div class="card-content">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <h3 class="card-title">${getName(place)}</h3>
                            <span class="place-rating">★ ${place.rating}</span>
                        </div>
                        <p class="card-subtitle">${getType(place)}</p>
                        <div class="card-tags">
                            ${place.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <p style="font-size: 0.9rem; margin-bottom: 0.5rem;">${getDesc(place)}</p>
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary);">
                            <span>🕒 ${t('common.hours')}: ${place.hours}</span>
                            <span>💰 ${t('common.price')}: ${place.price}</span>
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

window.MonumentsModule = MonumentsModule;
