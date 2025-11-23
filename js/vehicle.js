/**
 * VehicleManager
 * Handles vehicle-specific logic and UI generation.
 */
class VehicleManager {
    constructor() {
        this.STORAGE_KEY = 'vehicles';
    }

    getAll() {
        return window.StorageManager.get(this.STORAGE_KEY);
    }

    add(vehicleData) {
        // Add ID and Timestamp
        const newVehicle = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...vehicleData
        };
        window.StorageManager.add(this.STORAGE_KEY, newVehicle);
        return newVehicle;
    }

    update(id, vehicleData) {
        const vehicles = this.getAll();
        const index = vehicles.findIndex(v => v.id === id);
        if (index !== -1) {
            // Keep existing creation date and ID, merge new data
            const updatedVehicle = {
                ...vehicles[index],
                ...vehicleData,
                id: id // Ensure ID doesn't change
            };
            window.StorageManager.update(this.STORAGE_KEY, updatedVehicle);
            return updatedVehicle;
        }
        return null;
    }

    delete(id) {
        window.StorageManager.remove(this.STORAGE_KEY, id);
    }

    // --- UI Generation Methods ---

    renderView(container) {
        const vehicles = this.getAll();

        const html = `
            <div class="module-header">
                <h3>Mes Véhicules</h3>
                <button id="btn-add-vehicle" class="btn btn-primary">
                    <span class="icon">+</span> Ajouter un véhicule
                </button>
            </div>

            ${this._renderVehicleList(vehicles)}

            <!-- Modal for Add Vehicle -->
            <div id="modal-add-vehicle" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4>Nouveau Véhicule</h4>
                        <span class="close-modal">&times;</span>
                    </div>
                    <form id="form-add-vehicle">
                        <div class="form-group">
                            <label>Marque</label>
                            <div style="display:flex; gap:10px; align-items:center;">
                                <select name="make" id="input-make" required class="form-select" style="flex:1">
                                    <option value="">Sélectionner une marque</option>
                                    ${window.CarData.map(c => `<option value="${c.brand}">${c.brand}</option>`).join('')}
                                </select>
                                <img id="preview-logo" src="" style="width:30px; height:30px; object-fit:contain; display:none;">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Modèle</label>
                            <select name="model" id="input-model" required class="form-select" disabled>
                                <option value="">Sélectionner d'abord une marque</option>
                            </select>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label>Année</label>
                                <input type="number" name="year" required placeholder="2020">
                            </div>
                            <div class="form-group">
                                <label>Immatriculation</label>
                                <input type="text" name="plate" required placeholder="AB-123-CD">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Kilométrage actuel</label>
                            <input type="number" name="mileage" required placeholder="ex: 45000">
                        </div>
                        <div class="form-group">
                            <label>Photo du véhicule (optionnel)</label>
                            <input type="file" id="input-vehicle-photo" accept="image/*">
                            <input type="hidden" name="photo" id="hidden-vehicle-photo">
                            <div id="vehicle-photo-preview" style="margin-top:10px; display:none;">
                                <img src="" style="max-width:100%; max-height:200px; border-radius:8px;">
                            </div>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary close-modal">Annuler</button>
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        // Add vehicle details modal (hidden by default)
        const detailsModal = `
            <div id="modal-vehicle-details" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4>Détails du véhicule</h4>
                        <button class="close-modal" id="close-vehicle-details">✖️</button>
                    </div>
                    <div class="modal-body" id="vehicle-details-body">
                        <!-- Filled dynamically -->
                    </div>
                </div>
            </div>`;
        container.innerHTML = html + detailsModal;
        this._attachEvents(container);
    }

    _renderVehicleList(vehicles) {
        if (vehicles.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-icon">🚗</div>
                    <p>Aucun véhicule enregistré.</p>
                    <p class="sub-text">Ajoutez votre premier véhicule pour commencer le suivi.</p>
                </div>
            `;
        }

        return `
            <div class="vehicle-grid">
                ${vehicles.map(v => `
                    <div class="vehicle-card">
                        <div class="card-header">
                            <div style="display:flex; align-items:center; gap:10px;">
                                ${v.photo ? `<img src="${v.photo}" style="width:40px; height:40px; object-fit:cover; border-radius:50%;">` : (v.logo ? `<img src="${v.logo}" style="width:24px; height:24px; object-fit:contain;">` : '')}
                                <h4 class="vehicle-title">${v.make} ${v.model}</h4>
                            </div>
                            <span class="vehicle-year">${v.year}</span>
                        </div>
                        <div class="card-body">
                            <div class="info-row">
                                <span class="label">Plaque:</span>
                                <span class="value">${v.plate}</span>
                            </div>
                            <div class="info-row">
                                <span class="label">Km:</span>
                                <span class="value">${parseInt(v.mileage).toLocaleString()} km</span>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button class="btn-icon edit-vehicle" data-id="${v.id}" title="Modifier">✏️</button>
                            <button class="btn-icon delete-vehicle" data-id="${v.id}" title="Supprimer">🗑️</button>
                            <button class="btn-text" data-id="${v.id}">Détails →</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    _attachEvents(container) {
        const modal = container.querySelector('#modal-add-vehicle');
        const btnAdd = container.querySelector('#btn-add-vehicle');
        const closeButtons = container.querySelectorAll('.close-modal');
        const form = container.querySelector('#form-add-vehicle');

        // Photo Upload Logic
        const photoInput = container.querySelector('#input-vehicle-photo');
        const photoHidden = container.querySelector('#hidden-vehicle-photo');
        const photoPreview = container.querySelector('#vehicle-photo-preview');
        const photoPreviewImg = photoPreview ? photoPreview.querySelector('img') : null;

        if (photoInput) {
            photoInput.addEventListener('change', async (e) => {
                if (e.target.files.length > 0) {
                    try {
                        const base64 = await window.Utils.compressImage(e.target.files[0]);
                        photoHidden.value = base64;
                        if (photoPreviewImg) {
                            photoPreviewImg.src = base64;
                            photoPreview.style.display = 'block';
                        }
                    } catch (err) {
                        console.error("Image compression failed", err);
                        alert("Erreur lors du traitement de l'image.");
                    }
                }
            });
        }
        // Details button listener
        container.querySelectorAll('.btn-text[data-id]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                this.showVehicleDetails(id);
            });
        });
        // Close details modal
        const closeDetailsBtn = container.querySelector('#close-vehicle-details');
        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', () => {
                const modal = container.querySelector('#modal-vehicle-details');
                if (modal) modal.classList.add('hidden');
            });
        }

        // Dropdown Logic
        const makeSelect = container.querySelector('#input-make');
        const modelSelect = container.querySelector('#input-model');
        const logoPreview = container.querySelector('#preview-logo');

        if (makeSelect) {
            makeSelect.addEventListener('change', (e) => {
                const brandName = e.target.value;
                const brandData = window.CarData.find(c => c.brand === brandName);

                // Reset Model
                modelSelect.innerHTML = '<option value="">Sélectionner un modèle</option>';
                modelSelect.disabled = !brandName;

                if (brandData) {
                    // Update Logo
                    if (brandData.logo) {
                        logoPreview.src = brandData.logo;
                        logoPreview.style.display = 'block';
                    } else {
                        logoPreview.style.display = 'none';
                    }

                    // Populate Models
                    if (brandData.models.length > 0) {
                        brandData.models.forEach(m => {
                            const opt = document.createElement('option');
                            opt.value = m;
                            opt.innerText = m;
                            modelSelect.appendChild(opt);
                        });
                    } else {
                        // Allow custom input for "Autre" or unknown brands? 
                        // For now, just add an "Autre" option
                        const opt = document.createElement('option');
                        opt.value = "Autre";
                        opt.innerText = "Autre / Inconnu";
                        modelSelect.appendChild(opt);
                    }
                } else {
                    logoPreview.style.display = 'none';
                }
            });
        }

        // Open Modal
        btnAdd.addEventListener('click', () => {
            modal.classList.remove('hidden');
        });

        // Close Modal
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                modal.classList.add('hidden');
            });
        });

        // Handle Form Submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Find logo URL to save
            const brandData = window.CarData.find(c => c.brand === data.make);
            if (brandData && brandData.logo) {
                data.logo = brandData.logo;
            }

            if (form.dataset.editingId) {
                this.update(form.dataset.editingId, data);
            } else {
                this.add(data);
            }

            modal.classList.add('hidden');
            this.renderView(container); // Re-render to show new vehicle
        });

        // Handle Delete
        container.querySelectorAll('.delete-vehicle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
                    const id = e.target.getAttribute('data-id');
                    this.delete(id);
                    this.renderView(container);
                }
            });
        });

        // Handle Edit
        container.querySelectorAll('.edit-vehicle').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const vehicle = this.getAll().find(v => v.id === id);
                if (vehicle) {
                    this._openEditModal(container, vehicle);
                }
            });
        });

        // Open Modal (Add Mode)
        btnAdd.addEventListener('click', () => {
            form.reset();
            delete form.dataset.editingId;
            modal.querySelector('.modal-header h4').textContent = 'Nouveau Véhicule';

            // Reset Preview
            if (photoPreview) photoPreview.style.display = 'none';
            if (photoHidden) photoHidden.value = '';
            if (logoPreview) logoPreview.style.display = 'none';
            if (modelSelect) {
                modelSelect.innerHTML = '<option value="">Sélectionner d\'abord une marque</option>';
                modelSelect.disabled = true;
            }

            modal.classList.remove('hidden');
        });
    }

    _openEditModal(container, vehicle) {
        const modal = container.querySelector('#modal-add-vehicle');
        const form = container.querySelector('#form-add-vehicle');
        const title = modal.querySelector('.modal-header h4');

        title.textContent = 'Modifier le Véhicule';
        form.dataset.editingId = vehicle.id;

        // Fill Basic Fields
        form.querySelector('[name="year"]').value = vehicle.year;
        form.querySelector('[name="plate"]').value = vehicle.plate;
        form.querySelector('[name="mileage"]').value = vehicle.mileage;

        // Handle Make/Model
        const makeSelect = form.querySelector('[name="make"]');
        const modelSelect = form.querySelector('[name="model"]');
        const logoPreview = container.querySelector('#preview-logo');

        makeSelect.value = vehicle.make;

        // Populate Models based on Make
        const brandData = window.CarData.find(c => c.brand === vehicle.make);
        if (brandData) {
            modelSelect.innerHTML = '<option value="">Sélectionner un modèle</option>';
            modelSelect.disabled = false;

            if (brandData.models.length > 0) {
                brandData.models.forEach(m => {
                    const opt = document.createElement('option');
                    opt.value = m;
                    opt.innerText = m;
                    modelSelect.appendChild(opt);
                });
            } else {
                const opt = document.createElement('option');
                opt.value = "Autre";
                opt.innerText = "Autre / Inconnu";
                modelSelect.appendChild(opt);
            }

            // Logo
            if (brandData.logo) {
                logoPreview.src = brandData.logo;
                logoPreview.style.display = 'block';
            }
        }

        modelSelect.value = vehicle.model;

        // Handle Photo
        const photoHidden = container.querySelector('#hidden-vehicle-photo');
        const photoPreview = container.querySelector('#vehicle-photo-preview');
        const photoPreviewImg = photoPreview.querySelector('img');

        if (vehicle.photo) {
            photoHidden.value = vehicle.photo;
            photoPreviewImg.src = vehicle.photo;
            photoPreview.style.display = 'block';
        } else {
            photoHidden.value = '';
            photoPreview.style.display = 'none';
        }

        modal.classList.remove('hidden');
    }

    // Show vehicle details in modal
    showVehicleDetails(id) {
        const vehicle = this.getAll().find(v => v.id === id);
        if (!vehicle) return;
        const modal = document.getElementById('modal-vehicle-details');
        const body = document.getElementById('vehicle-details-body');
        if (!modal || !body) return;
        const html = `
            <div class="vehicle-detail">
            <div class="vehicle-detail">
                ${vehicle.photo ? `<img src="${vehicle.photo}" style="width:100%;max-height:300px;object-fit:cover;border-radius:12px;margin-bottom:1rem;" />` : (vehicle.logo ? `<img src="${vehicle.logo}" style="width:48px;height:48px;object-fit:contain;margin-bottom:1rem;" />` : '')}
                <h4>${vehicle.make} ${vehicle.model} (${vehicle.year})</h4>
                <p><strong>Plaque :</strong> ${vehicle.plate}</p>
                <p><strong>Kilométrage :</strong> ${parseInt(vehicle.mileage).toLocaleString()} km</p>
                <p><strong>Créé le :</strong> ${new Date(vehicle.createdAt).toLocaleDateString()}</p>
            </div>
        `;
        body.innerHTML = html;
        modal.classList.remove('hidden');
    }
}

window.VehicleManager = new VehicleManager();
