/**
 * VehicleComparator
 * Handles vehicle comparison functionality
 */
class VehicleComparator {
    constructor() {
        this.selectedVehicles = new Set();
        this.maxSelection = 3;
        this.fabButton = null;
    }

    /**
     * Initialize the comparator
     */
    init() {
        this.createFAB();
        this.attachModalEvents();
    }

    /**
     * Create the Floating Action Button
     */
    createFAB() {
        // Check if FAB already exists
        if (document.querySelector('.fab-compare')) {
            this.fabButton = document.querySelector('.fab-compare');
            return;
        }

        const fab = document.createElement('div');
        fab.className = 'fab-compare hidden';
        fab.innerHTML = `
            <span>⚖️</span>
            <span>Comparer (<span id="compare-count">0</span>)</span>
        `;
        fab.addEventListener('click', () => this.showComparison());
        document.body.appendChild(fab);
        this.fabButton = fab;
    }

    /**
     * Add comparison checkboxes to vehicle cards
     */
    addCompareCheckboxes() {
        const vehicleCards = document.querySelectorAll('.vehicle-card');

        vehicleCards.forEach(card => {
            // Skip if checkbox already exists
            if (card.querySelector('.compare-checkbox')) {
                return;
            }

            const vehicleId = card.dataset.vehicleId;
            if (!vehicleId) return;

            const checkbox = document.createElement('label');
            checkbox.className = 'compare-checkbox';
            checkbox.innerHTML = `
                <input type="checkbox" 
                       data-vehicle-id="${vehicleId}"
                       ${this.selectedVehicles.has(vehicleId) ? 'checked' : ''}>
                <span>Comparer</span>
            `;

            // Position it in the card
            card.style.position = 'relative';
            card.insertBefore(checkbox, card.firstChild);

            // Attach event listener
            const input = checkbox.querySelector('input');
            input.addEventListener('change', (e) => {
                this.toggleVehicle(vehicleId, e.target.checked);
            });
        });

        this.updateFAB();
    }

    /**
     * Toggle vehicle selection
     */
    toggleVehicle(vehicleId, isChecked) {
        if (isChecked) {
            if (this.selectedVehicles.size >= this.maxSelection) {
                // Show alert and uncheck
                alert(`Vous pouvez comparer jusqu'à ${this.maxSelection} véhicules maximum`);
                const checkbox = document.querySelector(`input[data-vehicle-id="${vehicleId}"]`);
                if (checkbox) checkbox.checked = false;
                return;
            }
            this.selectedVehicles.add(vehicleId);
        } else {
            this.selectedVehicles.delete(vehicleId);
        }

        this.updateFAB();
    }

    /**
     * Update FAB button visibility and count
     */
    updateFAB() {
        if (!this.fabButton) return;

        const count = this.selectedVehicles.size;
        const countSpan = document.getElementById('compare-count');

        if (countSpan) {
            countSpan.textContent = count;
        }

        if (count >= 2) {
            this.fabButton.classList.remove('hidden');
        } else {
            this.fabButton.classList.add('hidden');
        }
    }

    /**
     * Show comparison modal with selected vehicles
     */
    showComparison() {
        if (this.selectedVehicles.size < 2) {
            alert('Sélectionnez au moins 2 véhicules pour comparer');
            return;
        }

        // Get vehicle data
        const vehicles = Array.from(this.selectedVehicles).map(id => {
            const vehicleData = window.VehicleManager.getAll().find(v => v.id === id);
            return vehicleData;
        }).filter(v => v !== undefined);

        if (vehicles.length < 2) {
            alert('Impossible de charger les données des véhicules');
            return;
        }

        // Generate comparison table
        const tableHTML = this.generateComparisonTable(vehicles);

        // Display in modal
        const modal = document.getElementById('modal-comparator');
        const content = document.getElementById('comparator-content');

        if (modal && content) {
            content.innerHTML = tableHTML;
            modal.classList.remove('hidden');
        }
    }

    /**
     * Generate comparison table HTML
     */
    generateComparisonTable(vehicles) {
        // Define comparison rows
        const comparisonRows = [
            { label: 'Image', key: 'image', type: 'image' },
            { label: 'Marque', key: 'make', type: 'text' },
            { label: 'Modèle', key: 'model', type: 'text' },
            { label: 'Année', key: 'year', type: 'number', higherIsBetter: true },
            { label: 'Type', key: 'vehicleType', type: 'text' },
            { label: 'Immatriculation', key: 'plate', type: 'text' },
            { label: 'Kilométrage', key: 'mileage', type: 'number', higherIsBetter: false, unit: ' km' },
            { label: 'Photo', key: 'photo', type: 'text' }
        ];

        let tableHTML = '<table class="comparator-table"><tbody>';

        comparisonRows.forEach(row => {
            tableHTML += '<tr>';
            tableHTML += `<th>${row.label}</th>`;

            // Get values for this row
            const values = vehicles.map(v => this.getVehicleValue(v, row));

            // Determine winners for numeric comparisons
            let winnerIndices = [];
            if (row.type === 'number') {
                winnerIndices = this.findWinners(values, row.higherIsBetter);
            }

            // Add cells for each vehicle
            values.forEach((value, index) => {
                const isWinner = winnerIndices.includes(index);
                const cellClass = isWinner ? 'cell-winner' : '';

                if (row.type === 'image') {
                    tableHTML += `<td class="${cellClass}">${value}</td>`;
                } else {
                    const displayValue = value !== null && value !== undefined ? value : '-';
                    tableHTML += `<td class="${cellClass}">${displayValue}</td>`;
                }
            });

            tableHTML += '</tr>';
        });

        tableHTML += '</tbody></table>';
        return tableHTML;
    }

    /**
     * Get vehicle value for a specific row
     */
    getVehicleValue(vehicle, row) {
        const value = vehicle[row.key];

        if (row.type === 'image') {
            return `
                <img src="${vehicle.photo || 'assets/car-placeholder.png'}" 
                     alt="${vehicle.make} ${vehicle.model}"
                     onerror="this.src='assets/car-placeholder.png'">
                <div><strong>${vehicle.make} ${vehicle.model}</strong></div>
            `;
        }

        if (row.type === 'number' && value !== null && value !== undefined) {
            return value + (row.unit || '');
        }

        if (row.type === 'date' && value) {
            return new Date(value).toLocaleDateString('fr-FR');
        }

        return value || '-';
    }

    /**
     * Find winner indices for numeric comparison
     */
    findWinners(values, higherIsBetter) {
        // Extract numeric values only
        const numericValues = values.map(v => {
            if (typeof v === 'string') {
                const num = parseFloat(v.replace(/[^0-9.-]/g, ''));
                return isNaN(num) ? null : num;
            }
            return typeof v === 'number' ? v : null;
        });

        // Filter out null values
        const validValues = numericValues.filter(v => v !== null);
        if (validValues.length === 0) return [];

        // Find best value
        const bestValue = higherIsBetter
            ? Math.max(...validValues)
            : Math.min(...validValues);

        // Return indices of cells with best value
        return numericValues
            .map((v, i) => v === bestValue ? i : -1)
            .filter(i => i !== -1);
    }

    /**
     * Attach modal events
     */
    attachModalEvents() {
        const modal = document.getElementById('modal-comparator');
        if (!modal) return;

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
            }
        });
    }

    /**
     * Clear all selections
     */
    clearSelections() {
        this.selectedVehicles.clear();

        // Uncheck all checkboxes
        document.querySelectorAll('.compare-checkbox input').forEach(checkbox => {
            checkbox.checked = false;
        });

        this.updateFAB();
    }
}

// Initialize and expose globally
window.VehicleComparator = new VehicleComparator();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.VehicleComparator.init();
    });
} else {
    window.VehicleComparator.init();
}
