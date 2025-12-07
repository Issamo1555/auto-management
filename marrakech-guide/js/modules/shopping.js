/**
 * Shopping Module
 */
class ShoppingModule {
    render(container) {
        const t = (key) => window.app.features.language ? window.app.features.language.t(key) : key;

        let html = `
            <div class="module-header">
                <h2 data-i18n="module.shopping.title">${t('module.shopping.title')}</h2>
                <p data-i18n="module.shopping.desc">${t('module.shopping.desc')}</p>
            </div>

            <div class="shopping-tips">
                <h3 data-i18n="shopping.tips.title">${t('shopping.tips.title')}</h3>
                <div class="tip-item"><span>🤝</span> <span data-i18n="shopping.tips.1">${t('shopping.tips.1')}</span></div>
                <div class="tip-item"><span>🏷️</span> <span data-i18n="shopping.tips.2">${t('shopping.tips.2')}</span></div>
                <div class="tip-item"><span>😊</span> <span data-i18n="shopping.tips.3">${t('shopping.tips.3')}</span></div>
            </div>

            <div class="cards-grid">
        `;

        window.SHOPPING.forEach(place => {
            const lang = window.app.features.language ? window.app.features.language.currentLang : 'fr';
            const getName = (p) => p.name[lang] || p.name['fr'] || p.name;
            const getType = (p) => p.type[lang] || p.type['fr'] || p.type;
            const getDesc = (p) => p.description[lang] || p.description['fr'] || p.description;
            const getTags = (p) => p.tags[lang] || p.tags['fr'] || p.tags;

            html += `
                <div class="card">
                    <div class="card-content">
                        <h3 class="card-title">${getName(place)}</h3>
                        <p class="card-subtitle">${getType(place)}</p>
                        <div class="card-tags">
                            ${getTags(place).map(tag => `<span class="tag">${tag}</span>`).join('')}
                        </div>
                        <p style="font-size: 0.9rem; margin-bottom: 0.5rem;">${getDesc(place)}</p>
                        <div class="place-address">📍 ${place.address}</div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }
}

window.ShoppingModule = ShoppingModule;
