/**
 * MaintenanceManager
 * Handles maintenance records and cost tracking.
 */
class MaintenanceManager {
    constructor() {
        this.STORAGE_KEY = 'maintenance';
        this.types = [
            'Vidange',
            'Pneus',
            'Freins',
            'Filtres',
            'Batterie',
            'Révision',
            'Réparation',
            'Autre'
        ];
    }

    getAll() {
        return window.StorageManager.get(this.STORAGE_KEY);
    }

    getByVehicle(vehicleId) {
        return this.getAll()
            .filter(m => m.vehicleId === vehicleId)
            .sort((a, b) => new Date(b.date) - new Date(a.date)); // Newest first
    }

    add(data) {
        const newRecord = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...data,
            cost: parseFloat(data.cost) || 0 // Ensure cost is a number
        };
        window.StorageManager.add(this.STORAGE_KEY, newRecord);
        return newRecord;
    }

    delete(id) {
        window.StorageManager.remove(this.STORAGE_KEY, id);
    }

    getTotalCost(vehicleId) {
        const records = this.getByVehicle(vehicleId);
        return records.reduce((sum, record) => sum + (parseFloat(record.cost) || 0), 0);
    }

    // --- UI Generation Methods ---

    renderView(container) {
        const vehicles = window.VehicleManager ? window.VehicleManager.getAll() : [];

        if (vehicles.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔧</div>
                    <p>Aucun véhicule trouvé.</p>
                    <p class="sub-text">Ajoutez un véhicule pour suivre son entretien.</p>
                    <button class="btn btn-primary" style="margin-top:1rem" onclick="document.querySelector('[data-view=vehicles]').click()">
                        Aller aux Véhicules
                    </button>
                </div>
            `;
            return;
        }

        const html = `
            <div class="module-header">
                <h3>Entretien & Maintenance</h3>
                <div class="header-actions">
                    <select id="vehicle-selector-maint" class="form-select">
                        ${vehicles.map(v => `<option value="${v.id}">${v.make} ${v.model} (${v.plate})</option>`).join('')}
                    </select>
                    <button id="btn-add-maint" class="btn btn-primary">
                        <span class="icon">+</span> Nouvelle Intervention
                    </button>
                </div>
            </div>

            <div id="maintenance-stats" class="stats-container">
                <!-- Stats injected here -->
            </div>

            <div id="maintenance-list-container">
                <!-- List injected here -->
            </div>

            <!-- Modal for Add Maintenance -->
            <div id="modal-add-maint" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4>Nouvelle Intervention</h4>
                        <span class="close-modal">&times;</span>
                    </div>
                    <form id="form-add-maint">
                        <input type="hidden" name="vehicleId" id="modal-vehicle-id-maint">
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label>Date</label>
                                <input type="date" name="date" required value="${new Date().toISOString().split('T')[0]}">
                            </div>
                            <div class="form-group">
                                <label>Type</label>
                                <select name="type" required class="form-select" style="width:100%">
                                    ${this.types.map(t => `<option value="${t}">${t}</option>`).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Kilométrage</label>
                                <input type="number" name="mileage" placeholder="ex: 50000">
                            </div>
                            <div class="form-group">
                                <label>Coût (€)</label>
                                <input type="number" name="cost" step="0.01" placeholder="0.00">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Description / Notes</label>
                            <input type="text" name="notes" placeholder="Détails de l'intervention...">
                        </div>

                        <div class="form-group">
                            <label>Garage / Prestataire</label>
                            <input type="text" name="provider" placeholder="ex: Garage du Centre">
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary close-modal">Annuler</button>
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        container.innerHTML = html;
        this._attachEvents(container);

        // Initial Load
        const selector = container.querySelector('#vehicle-selector-maint');
        if (selector.value) {
            this._renderMaintenanceList(container, selector.value);
        }
    }

    _renderMaintenanceList(container, vehicleId) {
        const listContainer = container.querySelector('#maintenance-list-container');
        const statsContainer = container.querySelector('#maintenance-stats');
        const records = this.getByVehicle(vehicleId);

        // Update Stats
        const totalCost = this.getTotalCost(vehicleId);
        statsContainer.innerHTML = `
            <div class="stat-card">
                <span class="stat-label">Coût Total</span>
                <span class="stat-value">${totalCost.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
            </div>
            <div class="stat-card">
                <span class="stat-label">Interventions</span>
                <span class="stat-value">${records.length}</span>
            </div>
        `;

        if (records.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state small">
                    <p>Aucune intervention enregistrée.</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = `
            <div class="maintenance-list">
                ${records.map(rec => `
                    <div class="maintenance-item">
                        <div class="maint-date">
                            <span class="day">${new Date(rec.date).getDate()}</span>
                            <span class="month">${new Date(rec.date).toLocaleString('default', { month: 'short' })}</span>
                            <span class="year">${new Date(rec.date).getFullYear()}</span>
                        </div>
                        <div class="maint-details">
                            <div class="maint-header">
                                <span class="maint-type">${rec.type}</span>
                                <span class="maint-cost">${parseFloat(rec.cost || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
                            </div>
                            <div class="maint-sub">
                                ${rec.mileage ? `<span>${parseInt(rec.mileage).toLocaleString()} km</span> • ` : ''}
                                ${rec.provider ? `<span>${rec.provider}</span>` : ''}
                            </div>
                            ${rec.notes ? `<div class="maint-notes">${rec.notes}</div>` : ''}
                        </div>
                        <button class="btn-icon delete-maint" data-id="${rec.id}" title="Supprimer">🗑️</button>
                    </div>
                `).join('')}
            </div>
        `;

        // Attach Delete
        listContainer.querySelectorAll('.delete-maint').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Supprimer cette intervention ?')) {
                    this.delete(btn.getAttribute('data-id'));
                    this._renderMaintenanceList(container, vehicleId);
                }
            });
        });
    }

    _attachEvents(container) {
        const modal = container.querySelector('#modal-add-maint');
        const btnAdd = container.querySelector('#btn-add-maint');
        const closeButtons = container.querySelectorAll('.close-modal');
        const form = container.querySelector('#form-add-maint');
        const selector = container.querySelector('#vehicle-selector-maint');

        selector.addEventListener('change', (e) => {
            this._renderMaintenanceList(container, e.target.value);
        });

        btnAdd.addEventListener('click', () => {
            container.querySelector('#modal-vehicle-id-maint').value = selector.value;
            modal.classList.remove('hidden');
        });

        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            this.add(data);
            modal.classList.add('hidden');
            this._renderMaintenanceList(container, selector.value);
        });
    }
}

window.MaintenanceManager = new MaintenanceManager();
