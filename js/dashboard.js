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

        // Calculate Upcoming Maintenance
        const upcomingMaintenance = this._getUpcomingMaintenance(vehicles, maintenance);

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

                <!-- Upcoming Maintenance Section -->
                <div class="section-title">Prochains Entretiens (Estimations)</div>
                <div class="upcoming-list">
                    ${this._renderUpcomingMaintenance(upcomingMaintenance)}
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
                        <h4>Coût par Véhicule</h4>
                        <div class="chart-wrapper">
                            <canvas id="chart-cost-vehicle"></canvas>
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
            window.ChartsManager.renderCostByVehicle(
                document.getElementById('chart-cost-vehicle'),
                maintenance,
                vehicles
            );
        }
    }

    _getUpcomingMaintenance(vehicles, maintenance) {
        const upcoming = [];
        const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;

        vehicles.forEach(vehicle => {
            // Find last maintenance
            const vehicleMaint = maintenance.filter(m => m.vehicleId === vehicle.id);
            if (vehicleMaint.length === 0) return;

            // Sort by date descending
            vehicleMaint.sort((a, b) => new Date(b.date) - new Date(a.date));
            const lastMaint = vehicleMaint[0];
            const lastDate = new Date(lastMaint.date);

            // Estimate next date (1 year later)
            const nextDate = new Date(lastDate.getTime() + ONE_YEAR_MS);
            const daysUntil = Math.ceil((nextDate - new Date()) / (1000 * 60 * 60 * 24));

            if (daysUntil > 0 && daysUntil < 60) { // Show if due within 60 days
                upcoming.push({
                    vehicle: `${vehicle.make} ${vehicle.model}`,
                    date: nextDate,
                    days: daysUntil,
                    type: 'Révision annuelle'
                });
            }
        });

        return upcoming.sort((a, b) => a.days - b.days);
    }

    _renderUpcomingMaintenance(upcoming) {
        if (upcoming.length === 0) {
            return `
                <div class="empty-state small" style="padding: 1rem;">
                    <p>Aucun entretien prévu prochainement.</p>
                </div>
            `;
        }

        return `
            <div class="upcoming-grid">
                ${upcoming.map(item => `
                    <div class="upcoming-card">
                        <div class="upcoming-icon">🔧</div>
                        <div class="upcoming-info">
                            <div class="upcoming-title">${item.vehicle}</div>
                            <div class="upcoming-desc">${item.type} - Dans ${item.days} jours</div>
                        </div>
                        <div class="upcoming-date">${item.date.toLocaleDateString()}</div>
                    </div>
                `).join('')}
            </div>
        `;
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
