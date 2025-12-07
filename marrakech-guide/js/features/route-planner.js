/**
 * Route Planner Feature
 * Calculates optimal routes combining walking and bus lines
 */
class RoutePlannerFeature {
    constructor() {
        this.container = null;
    }

    render(container) {
        this.container = container;
        const t = (key) => window.app.features.language ? window.app.features.language.t(key) : key;

        container.innerHTML = `
            <div class="module-header">
                <h2 data-i18n="module.route.title">${t('module.route.title')}</h2>
                <p data-i18n="module.route.desc">${t('module.route.desc')}</p>
            </div>

            <div class="card" style="margin-bottom: 1.5rem;">
                <div class="card-content">
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <div class="input-group">
                            <label style="font-size: 0.9rem; font-weight: 500; margin-bottom: 0.25rem; display: block;" data-i18n="route.from">${t('route.from')}</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <input type="text" id="route-from" placeholder="${t('route.current_location')}" style="flex: 1; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                                <button class="btn btn-secondary" onclick="window.app.features.routePlanner.useCurrentLocation()">📍</button>
                            </div>
                        </div>
                        <div class="input-group">
                            <label style="font-size: 0.9rem; font-weight: 500; margin-bottom: 0.25rem; display: block;" data-i18n="route.to">${t('route.to')}</label>
                            <input type="text" id="route-to" placeholder="Ex: Place Jemaa El Fna" style="width: 100%; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
                        </div>
                        <button class="btn btn-primary btn-block" onclick="window.app.features.routePlanner.calculateRoute()">
                            <span data-i18n="route.calculate">${t('route.calculate')}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div id="route-results">
                <!-- Results injected here -->
            </div>
        `;
    }

    useCurrentLocation() {
        const input = document.getElementById('route-from');
        input.value = "📍 Ma position (Gueliz)";
        // In a real app, we would get coordinates here
    }

    calculateRoute() {
        const from = document.getElementById('route-from').value;
        const to = document.getElementById('route-to').value;
        const resultsContainer = document.getElementById('route-results');

        if (!to) {
            alert('Veuillez entrer une destination');
            return;
        }

        resultsContainer.innerHTML = '<div class="spinner" style="margin: 2rem auto;"></div>';

        // Simulate calculation delay
        setTimeout(() => {
            this.showResults(resultsContainer, from, to);
        }, 1500);
    }

    showResults(container, from, to) {
        // Mock results based on real lines
        const routes = [
            {
                type: 'recommended',
                duration: '25 min',
                price: '4 DH',
                steps: [
                    { icon: '🚶', text: 'Marcher 5 min vers Arrêt Gueliz' },
                    { icon: '🚌', text: 'Prendre Ligne 1 (Direction Sidi Youssef)', color: '#ef4444' },
                    { icon: '🛑', text: 'Descendre à Place de la Liberté' },
                    { icon: '🚶', text: 'Marcher 3 min vers destination' }
                ]
            },
            {
                type: 'fastest',
                duration: '18 min',
                price: '15 DH',
                steps: [
                    { icon: '🚕', text: 'Petit Taxi (Compteur)' },
                    { icon: '🏁', text: 'Arrivée directe' }
                ]
            },
            {
                type: 'cheapest',
                duration: '35 min',
                price: '0 DH',
                steps: [
                    { icon: '🚶', text: 'Marcher tout le long (Santé !)' },
                    { icon: '🔥', text: '145 Calories brûlées' }
                ]
            }
        ];

        let html = `
            <h3 style="margin-bottom: 1rem;">Itinéraires suggérés</h3>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
        `;

        routes.forEach(route => {
            html += `
                <div class="card">
                    <div class="card-content">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span style="font-weight: 700; font-size: 1.1rem;">${route.duration}</span>
                                ${route.type === 'recommended' ? '<span class="tag" style="background: #dcfce7; color: #166534;">Recommandé</span>' : ''}
                            </div>
                            <span style="font-weight: 600;">${route.price}</span>
                        </div>
                        
                        <div class="route-steps" style="display: flex; flex-direction: column; gap: 0.75rem; position: relative; padding-left: 1rem; border-left: 2px solid var(--border-color);">
                            ${route.steps.map(step => `
                                <div style="display: flex; align-items: center; gap: 0.75rem;">
                                    <span style="background: var(--bg-color); padding: 2px; border-radius: 4px; z-index: 1; margin-left: -1.6rem;">${step.icon}</span>
                                    <span style="font-size: 0.95rem; ${step.color ? `color: ${step.color}; font-weight: 600;` : ''}">${step.text}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }
}

window.RoutePlannerFeature = RoutePlannerFeature;
