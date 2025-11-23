/**
 * DashboardManager
 * Aggregates data from all modules to provide a high-level summary.
 */
class DashboardManager {
    renderView(container) {
        // Gather Data
        const vehicles = window.VehicleManager ? window.VehicleManager.getAll() : [];
        const documents = window.DocumentManager ? window.DocumentManager.getAll() : [];
        const maintenance = window.MaintenanceManager ? window.MaintenanceManager.getAll() : [];

        // Calculate Stats
        const totalVehicles = vehicles.length;

        // Alerts (Expired or Warning)
        let activeAlerts = 0;
        if (window.DocumentManager) {
            activeAlerts = documents.filter(doc => {
                const status = window.DocumentManager.getStatus(doc.expiryDate);
                return status === 'expired' || status === 'warning';
            }).length;
        }

        // Total Cost
        const totalCost = maintenance.reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0);

        const html = `
            <div class="dashboard-grid">
                <!-- Welcome Section -->
                <div class="welcome-section">
                    <h3>Bonjour, Propriétaire 👋</h3>
                    <p>Voici un aperçu de votre flotte.</p>
                </div>

                <!-- Stats Cards -->
                <div class="stats-row">
                    <div class="dash-card blue">
                        <div class="dash-icon">🚘</div>
                        <div class="dash-info">
                            <span class="dash-value">${totalVehicles}</span>
                            <span class="dash-label">Véhicules</span>
                        </div>
                    </div>
                    <div class="dash-card ${activeAlerts > 0 ? 'red' : 'green'}">
                        <div class="dash-icon">🔔</div>
                        <div class="dash-info">
                            <span class="dash-value">${activeAlerts}</span>
                            <span class="dash-label">Alertes</span>
                        </div>
                    </div>
                    <div class="dash-card purple">
                        <div class="dash-icon">💶</div>
                        <div class="dash-info">
                            <span class="dash-value">${totalCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</span>
                            <span class="dash-label">Dépenses Totales</span>
                        </div>
                    </div>
                </div>

                <!-- Statistics Charts -->
                <div class="section-title">Statistiques Détaillées</div>
                <div class="charts-row">
                    <div class="chart-container">
                        <h4>Coût cumulé dans le temps</h4>
                        <canvas id="chart-cost-time"></canvas>
                    </div>
                    <div class="chart-container">
                        <h4>Répartition par type</h4>
                        <canvas id="chart-cost-type"></canvas>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="section-title">Actions Rapides</div>
                <div class="quick-actions">
                    <button class="action-btn" onclick="document.querySelector('[data-view=vehicles]').click()">
                        <span>➕</span> Ajouter un Véhicule
                    </button>
                    <button class="action-btn" onclick="document.querySelector('[data-view=documents]').click()">
                        <span>📄</span> Gérer les Documents
                    </button>
                    <button class="action-btn" onclick="document.querySelector('[data-view=maintenance]').click()">
                        <span>🔧</span> Noter un Entretien
                    </button>
                </div>

                <!-- Recent Activity (Mockup for now, could be real) -->
                <div class="section-title">Activité Récente</div>
                <div class="recent-list">
                    ${this._renderRecentActivity(maintenance, documents)}
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Render Charts if ChartsManager is available
        if (window.ChartsManager) {
            window.ChartsManager.renderCostOverTime(
                document.getElementById('chart-cost-time'),
                maintenance
            );
            window.ChartsManager.renderCostByType(
                document.getElementById('chart-cost-type'),
                maintenance
            );
        }
    }

    _renderRecentActivity(maintenance, documents) {
        // Combine and sort by date (newest first)
        const combined = [
            ...maintenance.map(m => ({ ...m, category: 'maintenance', date: m.date })),
            ...documents.map(d => ({ ...d, category: 'document', date: d.createdAt })) // Use creation date for docs for now
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5); // Top 5

        if (combined.length === 0) {
            return '<p class="text-muted">Aucune activité récente.</p>';
        }

        return combined.map(item => {
            const isMaint = item.category === 'maintenance';
            return `
                <div class="activity-item">
                    <div class="activity-icon ${isMaint ? 'bg-blue' : 'bg-green'}">
                        ${isMaint ? '🔧' : '📄'}
                    </div>
                    <div class="activity-info">
                        <div class="activity-title">${isMaint ? item.type : 'Nouveau document: ' + item.type}</div>
                        <div class="activity-date">${new Date(item.date).toLocaleDateString()}</div>
                    </div>
                    ${isMaint ? `<div class="activity-cost">${parseFloat(item.cost).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>` : ''}
                </div>
            `;
        }).join('');
    }
}

window.DashboardManager = new DashboardManager();
