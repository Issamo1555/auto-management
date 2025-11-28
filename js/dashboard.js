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

        // Get user name from settings
        const settings = window.SettingsManager ? window.SettingsManager.getSettings() : { userName: 'Propriétaire' };
        const userName = settings.userName || 'Propriétaire';

        const html = `
            <div class="dashboard-grid">
                <!-- Welcome Section -->
                <div class="welcome-section">
                    <h3>Bonjour, ${userName}</h3>
                    <p>Voici un aperçu de votre flotte.</p>
                </div>

                <!-- Stats Cards -->
                <div class="stats-row">
                    <div class="dash-card blue" onclick="document.querySelector('[data-view=vehicles]').click()" style="cursor: pointer;">
                        <div class="dash-icon">▶</div>
                        <div class="dash-info">
                            <span class="dash-value">${totalVehicles}</span>
                            <span class="dash-label">Véhicules</span>
                        </div>
                    </div>
                    <div class="dash-card ${activeAlerts > 0 ? 'red' : 'green'}" onclick="document.querySelector('[data-view=documents]').click()" style="cursor: pointer;">
                        <div class="dash-icon">◉</div>
                        <div class="dash-info">
                            <span class="dash-value">${activeAlerts}</span>
                            <span class="dash-label">Alertes</span>
                        </div>
                    </div>
                    <div class="dash-card purple" onclick="document.querySelector('[data-view=maintenance]').click()" style="cursor: pointer;">
                        <div class="dash-icon">$</div>
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
                        <div class="chart-wrapper">
                            <canvas id="chart-cost-time"></canvas>
                        </div>
                    </div>
                    <div class="chart-container">
                        <h4>Répartition par type</h4>
                        <div class="chart-wrapper">
                            <canvas id="chart-cost-type"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Notifications -->
                <div class="section-title">Notifications</div>
                <div class="recent-list">
                    ${this._renderNotifications(documents)}
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

    _renderNotifications(documents) {
        if (!window.DocumentManager) {
            return '<p class="text-muted">Aucune notification.</p>';
        }

        const notifications = [];

        documents.forEach(doc => {
            const status = window.DocumentManager.getStatus(doc.expiryDate);
            const vehicle = window.VehicleManager?.getAll().find(v => v.id === doc.vehicleId);
            const vehicleName = vehicle ? `${vehicle.make} ${vehicle.model}` : 'Véhicule';

            if (status === 'expired') {
                notifications.push({
                    type: 'error',
                    icon: '🔴',
                    title: `${doc.type} expiré`,
                    message: `${vehicleName} - Expiré le ${new Date(doc.expiryDate).toLocaleDateString()}`,
                    date: new Date(doc.expiryDate)
                });
            } else if (status === 'warning') {
                const expiry = new Date(doc.expiryDate);
                const diffDays = Math.ceil((expiry - new Date()) / (1000 * 60 * 60 * 24));
                notifications.push({
                    type: 'warning',
                    icon: '🟠',
                    title: `${doc.type} à renouveler`,
                    message: `${vehicleName} - Expire dans ${diffDays} jour(s)`,
                    date: expiry
                });
            }
        });

        if (notifications.length === 0) {
            return `
                <div class="empty-notification">
                    <span style="font-size:2rem;">✅</span>
                    <p>Aucune notification</p>
                    <p class="sub-text">Tous vos documents sont à jour !</p>
                </div>
            `;
        }

        return notifications.map(notif => `
            <div class="notification-item ${notif.type}">
                <span class="notif-icon">${notif.icon}</span>
                <div class="notif-content">
                    <div class="notif-title">${notif.title}</div>
                    <div class="notif-message">${notif.message}</div>
                </div>
            </div>
        `).join('');
    }
}

window.DashboardManager = new DashboardManager();
