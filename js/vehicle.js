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
                            <label>Type de véhicule</label>
                            <select name="vehicleType" id="input-vehicle-type" required class="form-select">
                                <option value="">Sélectionner un type</option>
                                <option value="car">Voiture</option>
                                <option value="motorcycle">Moto</option>
                                <option value="truck">Camion</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Marque</label>
                            <div style="display:flex; gap:10px; align-items:center;">
                                <select name="make" id="input-make" required class="form-select" style="flex:1" disabled>
                                    <option value="">Sélectionner d'abord un type</option>
                                </select>
                                <img id="preview-logo" src="" style="width:30px; height:30px; object-fit:contain; display:none;">
                            </div>
                            <input type="text" id="input-make-other" name="makeOther" class="hidden" placeholder="Saisir la marque" style="width:100%; margin-top:5px; padding:0.5rem; border:1px solid var(--border-color); border-radius:var(--radius-md);">
                        </div>
                        <div class="form-group">
                            <label>Modèle</label>
                            <select name="model" id="input-model" required class="form-select" disabled>
                                <option value="">Sélectionner d'abord une marque</option>
                            </select>
                            <input type="text" id="input-model-other" name="modelOther" class="hidden" placeholder="Saisir le modèle" style="width:100%; margin-top:5px; padding:0.5rem; border:1px solid var(--border-color); border-radius:var(--radius-md);">
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
                    <div class="empty-icon">▶</div>
                    <p>Aucun véhicule enregistré.</p>
                    <p class="sub-text">Ajoutez votre premier véhicule pour commencer le suivi.</p>
                </div>
            `;
        }

        return `
            <div class="vehicle-grid">
                ${vehicles.map(v => `
                    <div class="vehicle-card">
                        <div class="vehicle-photo-placeholder">
                            ${v.photo ? `<img src="${v.photo}" class="vehicle-photo-img" alt="${v.make}">` : this._getVehicleIcon(v.vehicleType || 'car')}
                        </div>
                        <div class="card-header">
                            <h4 class="vehicle-title">${v.make} ${v.model}</h4>
                            <span class="vehicle-year">${v.year}</span>
                        </div>
                        <div class="card-body">
                            <div class="info-grid">
                                <div class="info-item">
                                    <span class="info-label">Plaque</span>
                                    <span class="info-value">${v.plate}</span>
                                </div>
                                <div class="info-item">
                                    <span class="info-label">Kilométrage</span>
                                    <span class="info-value">${parseInt(v.mileage).toLocaleString()} km</span>
                                </div>
                            </div>
                        </div>
                        <div class="card-footer">
                            <button class="btn-icon edit-vehicle" onclick="window.VehicleManager.promptEdit('${v.id}')" title="Modifier">✎</button>
                            <button class="btn-icon delete-vehicle" onclick="window.VehicleManager.promptDelete('${v.id}')" title="Supprimer">✕</button>
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

        // Close details modal
        const closeDetailsBtn = container.querySelector('#close-vehicle-details');
        if (closeDetailsBtn) {
            closeDetailsBtn.addEventListener('click', () => {
                const modal = container.querySelector('#modal-vehicle-details');
                if (modal) modal.classList.add('hidden');
            });
        }

        // Vehicle Type Dropdown Logic
        const vehicleTypeSelect = container.querySelector('#input-vehicle-type');
        const makeSelect = container.querySelector('#input-make');
        const modelSelect = container.querySelector('#input-model');
        const logoPreview = container.querySelector('#preview-logo');

        // Custom Inputs
        const makeOtherInput = container.querySelector('#input-make-other');
        const modelOtherInput = container.querySelector('#input-model-other');

        // Helper to toggle custom input
        const toggleCustomInput = (select, input) => {
            if (select.value === 'Autre') {
                input.classList.remove('hidden');
                input.required = true;
            } else {
                input.classList.add('hidden');
                input.required = false;
                input.value = '';
            }
        };

        if (vehicleTypeSelect && makeSelect) {
            vehicleTypeSelect.addEventListener('change', (e) => {
                const vehicleType = e.target.value;
                let brandData;

                // Select appropriate dataset
                if (vehicleType === 'car') {
                    brandData = window.CarData;
                } else if (vehicleType === 'motorcycle') {
                    brandData = window.MotorcycleData;
                } else if (vehicleType === 'truck') {
                    brandData = window.TruckData;
                }

                // Reset and populate brand dropdown
                makeSelect.innerHTML = '<option value="">Sélectionner une marque</option>';
                makeSelect.disabled = !vehicleType;
                modelSelect.innerHTML = '<option value="">Sélectionner d\'abord une marque</option>';
                modelSelect.disabled = true;
                logoPreview.style.display = 'none';

                // Hide custom inputs
                makeOtherInput.classList.add('hidden');
                modelOtherInput.classList.add('hidden');

                if (brandData) {
                    brandData.forEach(brand => {
                        const opt = document.createElement('option');
                        opt.value = brand.brand;
                        opt.textContent = brand.brand;
                        makeSelect.appendChild(opt);
                    });

                    // Add "Autre" option
                    const optOther = document.createElement('option');
                    optOther.value = "Autre";
                    optOther.textContent = "Autre / Inconnu";
                    makeSelect.appendChild(optOther);
                }
            });
        }

        // Dropdown Logic
        if (makeSelect) {
            makeSelect.addEventListener('change', (e) => {
                const brandName = e.target.value;
                toggleCustomInput(makeSelect, makeOtherInput);

                const vehicleType = vehicleTypeSelect ? vehicleTypeSelect.value : 'car';

                // Get correct dataset
                let dataSource;
                if (vehicleType === 'motorcycle') {
                    dataSource = window.MotorcycleData;
                } else if (vehicleType === 'truck') {
                    dataSource = window.TruckData;
                } else {
                    dataSource = window.CarData;
                }

                const brandData = dataSource ? dataSource.find(c => c.brand === brandName) : null;

                // Reset Model
                modelSelect.innerHTML = '<option value="">Sélectionner un modèle</option>';
                modelSelect.disabled = !brandName;
                modelOtherInput.classList.add('hidden');

                if (brandData) {
                    // Update Logo
                    if (brandData.logo) {
                        logoPreview.src = brandData.logo;
                        logoPreview.style.display = 'block';
                    } else {
                        logoPreview.style.display = 'none';
                    }

                    // Populate Models
                    if (brandData.models && brandData.models.length > 0) {
                        brandData.models.forEach(m => {
                            const opt = document.createElement('option');
                            opt.value = m;
                            opt.innerText = m;
                            modelSelect.appendChild(opt);
                        });
                    }
                } else {
                    logoPreview.style.display = 'none';
                }

                // Always add "Autre" option for models
                const optOther = document.createElement('option');
                optOther.value = "Autre";
                optOther.innerText = "Autre / Inconnu";
                modelSelect.appendChild(optOther);
            });
        }

        if (modelSelect) {
            modelSelect.addEventListener('change', () => {
                toggleCustomInput(modelSelect, modelOtherInput);
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

            // Handle "Other" values
            if (data.make === 'Autre') {
                data.make = data.makeOther;
            }
            if (data.model === 'Autre') {
                data.model = data.modelOther;
            }

            // Cleanup temp fields
            delete data.makeOther;
            delete data.modelOther;

            // Find logo URL to save (only if standard brand)
            let dataSource;
            const vehicleType = data.vehicleType || 'car';
            if (vehicleType === 'motorcycle') {
                dataSource = window.MotorcycleData;
            } else if (vehicleType === 'truck') {
                dataSource = window.TruckData;
            } else {
                dataSource = window.CarData;
            }

            const brandData = dataSource ? dataSource.find(c => c.brand === data.make) : null;
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

        // Event Delegation for Vehicle Actions (Delete, Edit, Details)
        // We are now using inline onclick handlers for robustness against re-renders
        // See promptDelete() and promptEdit() methods below

        // Details (Note: Details button might be inside the card but not in footer, check HTML)
        // In updated HTML, details are shown by clicking the card or specific elements?
        // The previous code had .btn-text[data-id] for details, but new card design removed "Details ->" button.
        // However, let's keep it if there are any, or if we want to make the whole card clickable (except buttons).

        // If we want to make the whole card clickable for details (except actions):
        const vehicleGrid = container.querySelector('.vehicle-grid');
        if (vehicleGrid) {
            vehicleGrid.addEventListener('click', (e) => {
                const target = e.target;
                const card = target.closest('.vehicle-card');
                const deleteBtn = target.closest('.delete-vehicle');
                const editBtn = target.closest('.edit-vehicle');

                if (card && !deleteBtn && !editBtn) {
                    // Optional: Make card clickable for details
                    // const id = deleteBtn ? deleteBtn.getAttribute('data-id') : (editBtn ? editBtn.getAttribute('data-id') : null);
                    // For now, we rely on the specific buttons.
                }
            });
        }

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

        // Handle Vehicle Type
        const vehicleTypeSelect = form.querySelector('#input-vehicle-type');
        if (vehicleTypeSelect) {
            vehicleTypeSelect.value = vehicle.vehicleType || 'car';
            // Trigger change event to populate brands
            vehicleTypeSelect.dispatchEvent(new Event('change'));
        }

        // Handle Make/Model
        const makeSelect = form.querySelector('[name="make"]');
        const modelSelect = form.querySelector('[name="model"]');
        const logoPreview = container.querySelector('#preview-logo');

        // Wait a bit for the vehicle type change to populate brands
        setTimeout(() => {
            makeSelect.value = vehicle.make;

            // Get correct data source based on vehicle type
            let dataSource;
            const vehicleType = vehicle.vehicleType || 'car';
            if (vehicleType === 'motorcycle') {
                dataSource = window.MotorcycleData;
            } else if (vehicleType === 'truck') {
                dataSource = window.TruckData;
            } else {
                dataSource = window.CarData;
            }

            // Populate Models based on Make
            const brandData = dataSource.find(c => c.brand === vehicle.make);
            if (brandData) {
                modelSelect.innerHTML = '<option value="">Sélectionner un modèle</option>';
                modelSelect.disabled = false;

                if (brandData.models && brandData.models.length > 0) {
                    brandData.models.forEach(m => {
                        const opt = document.createElement('option');
                        opt.value = m;
                        opt.textContent = m;
                        modelSelect.appendChild(opt);
                    });
                } else {
                    const opt = document.createElement('option');
                    opt.value = "Autre";
                    opt.textContent = "Autre / Inconnu";
                    modelSelect.appendChild(opt);
                }

                // Logo
                if (brandData.logo) {
                    logoPreview.src = brandData.logo;
                    logoPreview.style.display = 'block';
                } else {
                    logoPreview.style.display = 'none';
                }
            } else {
                logoPreview.style.display = 'none';
            }
        }, 100);

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

    promptDelete(id) {
        const modal = document.getElementById('modal-confirm');
        const msg = document.getElementById('confirm-message');
        const btnOk = document.getElementById('btn-confirm-ok');
        const btnCancel = document.getElementById('btn-confirm-cancel');
        const btnClose = document.getElementById('close-confirm-modal');

        if (!modal) {
            // Fallback if modal not found
            if (confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
                this.delete(id);
                window.location.reload();
            }
            return;
        }

        // Setup Modal
        msg.textContent = 'Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.';
        modal.classList.remove('hidden');

        // Cleanup old listeners (simple way: clone node)
        const newBtnOk = btnOk.cloneNode(true);
        btnOk.parentNode.replaceChild(newBtnOk, btnOk);

        const newBtnCancel = btnCancel.cloneNode(true);
        btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

        const newBtnClose = btnClose.cloneNode(true);
        btnClose.parentNode.replaceChild(newBtnClose, btnClose);

        // Attach new listeners
        newBtnOk.addEventListener('click', () => {
            this.delete(id);
            modal.classList.add('hidden');
            window.location.reload();
        });

        const closeModal = () => {
            modal.classList.add('hidden');
        };

        newBtnCancel.addEventListener('click', closeModal);
        newBtnClose.addEventListener('click', closeModal);
    }

    promptEdit(id) {
        const vehicle = this.getAll().find(v => v.id === id);
        if (vehicle) {
            const container = document.getElementById('view-container');
            this._openEditModal(container, vehicle);
        }
    }

    _getVehicleIcon(type) {
        const icons = {
            'car': '▶',
            'motorcycle': '◀',
            'truck': '▲'
        };
        return icons[type] || '▶';
    }
}

window.VehicleManager = new VehicleManager();
