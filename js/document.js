/**
 * DocumentManager
 * Handles document-specific logic, expiration checks, and UI rendering.
 */
class DocumentManager {
    constructor() {
        this.STORAGE_KEY = 'documents';
        this.docTypes = [
            'Permis de conduire',
            'Assurance',
            'Contrôle Technique',
            'Carte Grise',
            'Autre'
        ];
    }

    getAll() {
        return window.StorageManager.get(this.STORAGE_KEY);
    }

    getByVehicle(vehicleId) {
        return this.getAll().filter(doc => doc.vehicleId === vehicleId);
    }

    add(docData) {
        const newDoc = {
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            ...docData
        };
        window.StorageManager.add(this.STORAGE_KEY, newDoc);
        return newDoc;
    }

    delete(id) {
        window.StorageManager.remove(this.STORAGE_KEY, id);
    }

    // Check status based on expiry date
    getStatus(expiryDate) {
        if (!expiryDate) return 'unknown';

        const today = new Date();
        const expiry = new Date(expiryDate);
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'expired';
        if (diffDays <= 30) return 'warning';
        return 'valid';
    }

    getStatusLabel(status) {
        switch (status) {
            case 'expired': return 'Expiré';
            case 'warning': return 'Bientôt';
            case 'valid': return 'Valide';
            default: return 'N/A';
        }
    }

    // --- UI Generation Methods ---

    renderView(container) {
        const vehicles = window.VehicleManager ? window.VehicleManager.getAll() : [];

        if (vehicles.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🚫</div>
                    <p>Aucun véhicule trouvé.</p>
                    <p class="sub-text">Veuillez d'abord ajouter un véhicule pour gérer ses documents.</p>
                    <button class="btn btn-primary" style="margin-top:1rem" onclick="document.querySelector('[data-view=vehicles]').click()">
                        Aller aux Véhicules
                    </button>
                </div>
            `;
            return;
        }

        // Default to first vehicle if not stored in session (could add session state later)
        // For MVS, we'll just pick the first one or let user select.
        // Let's render a selector.

        const html = `
            <div class="module-header">
                <h3>Documents</h3>
                <div class="header-actions">
                    <select id="vehicle-selector" class="form-select">
                        ${vehicles.map(v => `<option value="${v.id}">${v.make} ${v.model} (${v.plate})</option>`).join('')}
                    </select>
                    <button id="btn-add-doc" class="btn btn-primary">
                        <span class="icon">+</span> Nouveau Document
                    </button>
                </div>
            </div>

            <div id="document-list-container">
                <!-- Documents will be loaded here based on selection -->
            </div>

            <!-- Modal for Add Document -->
            <div id="modal-add-doc" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4>Ajouter un Document</h4>
                        <span class="close-modal">&times;</span>
                    </div>
                    <form id="form-add-doc">
                        <input type="hidden" name="vehicleId" id="modal-vehicle-id">
                        
                        <div class="form-group">
                            <label>Type de document</label>
                            <select name="type" id="input-doc-type" required class="form-select">
                                ${this.docTypes.map(t => `<option value="${t}">${t}</option>`).join('')}
                            </select>
                            <input type="text" id="input-doc-type-other" name="typeOther" class="hidden" placeholder="Saisir le type de document" style="width:100%; margin-top:5px; padding:0.5rem; border:1px solid var(--border-color); border-radius:var(--radius-md);">
                        </div>
                        
                        <div class="form-group">
                            <label>Date d'expiration</label>
                            <input type="date" name="expiryDate" required>
                        </div>

                        <div class="form-group">
                            <label>Notes (Optionnel)</label>
                            <input type="text" name="notes" placeholder="Numéro de police, détails...">
                        </div>

                        <div class="form-group">
                            <label>Photo du document (optionnel)</label>
                            <input type="file" id="input-doc-photo" accept="image/*">
                            <input type="hidden" name="photo" id="hidden-doc-photo">
                            <div id="doc-photo-preview" style="margin-top:10px; display:none;">
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

        container.innerHTML = html;
        this._attachEvents(container);

        // Trigger initial load
        const selector = container.querySelector('#vehicle-selector');
        if (selector.value) {
            this._renderDocumentList(container, selector.value);
        }
    }

    update(id, docData) {
        const documents = this.getAll();
        const index = documents.findIndex(doc => doc.id === id);
        if (index !== -1) {
            // Keep existing creation date and ID, merge new data
            const updatedDoc = {
                ...documents[index],
                ...docData,
                id: id // Ensure ID doesn't change
            };
            window.StorageManager.update(this.STORAGE_KEY, updatedDoc);
            return updatedDoc;
        }
        return null;
    }

    _renderDocumentList(container, vehicleId) {
        const listContainer = container.querySelector('#document-list-container');
        const documents = this.getByVehicle(vehicleId);

        if (documents.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state small">
                    <p>Aucun document pour ce véhicule.</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = `
            <div class="document-grid">
                ${documents.map(doc => {
            const status = this.getStatus(doc.expiryDate);
            return `
                    <div class="document-card status-${status}">
                        <div class="doc-icon">▣</div>
                        <div class="doc-info">
                            <div class="doc-header">
                                <span class="doc-type">${doc.type}</span>
                                <span class="status-badge ${status}">${this.getStatusLabel(status)}</span>
                            </div>
                            <div class="doc-date">Expire le: ${new Date(doc.expiryDate).toLocaleDateString()}</div>
                            ${doc.notes ? `<div class="doc-notes">${doc.notes}</div>` : ''}
                            ${doc.photo ? `<div style="margin-top:0.5rem;"><img src="${doc.photo}" style="max-width:100%; max-height:150px; border-radius:8px; cursor:pointer;" onclick="window.open('${doc.photo}', '_blank')" alt="Document photo" /></div>` : ''}
                        </div>
                        <div class="card-actions">
                            <button class="btn-icon edit-doc" data-id="${doc.id}" title="Modifier">✎</button>
                            <button class="btn-icon delete-doc" data-id="${doc.id}" title="Supprimer">✕</button>
                        </div>
                    </div>
                `}).join('')}
            </div>
        `;


    }

    _openEditModal(container, doc) {
        const modal = container.querySelector('#modal-add-doc');
        const form = container.querySelector('#form-add-doc');
        const title = modal.querySelector('.modal-header h4');

        // Update Title
        title.textContent = 'Modifier le Document';

        // Fill Form
        form.querySelector('[name="type"]').value = doc.type;
        form.querySelector('[name="expiryDate"]').value = doc.expiryDate;
        form.querySelector('[name="notes"]').value = doc.notes || '';

        // Handle Photo Preview
        const photoPreview = container.querySelector('#doc-photo-preview');
        const photoPreviewImg = photoPreview.querySelector('img');
        const photoHidden = container.querySelector('#hidden-doc-photo');

        if (doc.photo) {
            photoHidden.value = doc.photo;
            photoPreviewImg.src = doc.photo;
            photoPreview.style.display = 'block';
        } else {
            photoHidden.value = '';
            photoPreview.style.display = 'none';
        }

        // Set Editing ID
        form.dataset.editingId = doc.id;

        modal.classList.remove('hidden');
    }

    _attachEvents(container) {
        const modal = container.querySelector('#modal-add-doc');
        const btnAdd = container.querySelector('#btn-add-doc');
        const closeButtons = container.querySelectorAll('.close-modal');
        const form = container.querySelector('#form-add-doc');
        const selector = container.querySelector('#vehicle-selector');

        // Photo Upload Logic
        const photoInput = container.querySelector('#input-doc-photo');
        const photoHidden = container.querySelector('#hidden-doc-photo');
        const photoPreview = container.querySelector('#doc-photo-preview');
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

        // Custom Doc Type Logic
        const typeSelect = container.querySelector('#input-doc-type');
        const typeOtherInput = container.querySelector('#input-doc-type-other');

        if (typeSelect && typeOtherInput) {
            typeSelect.addEventListener('change', (e) => {
                if (e.target.value === 'Autre') {
                    typeOtherInput.classList.remove('hidden');
                    typeOtherInput.required = true;
                } else {
                    typeOtherInput.classList.add('hidden');
                    typeOtherInput.required = false;
                    typeOtherInput.value = '';
                }
            });
        }

        // Vehicle Selector Change
        selector.addEventListener('change', (e) => {
            this._renderDocumentList(container, e.target.value);
        });

        // Open Modal (Add Mode)
        btnAdd.addEventListener('click', () => {
            // Reset Form
            form.reset();
            delete form.dataset.editingId;
            modal.querySelector('.modal-header h4').textContent = 'Ajouter un Document';
            if (photoPreview) photoPreview.style.display = 'none';
            if (photoHidden) photoHidden.value = '';

            // Reset custom input
            if (typeOtherInput) {
                typeOtherInput.classList.add('hidden');
                typeOtherInput.required = false;
            }

            // Set the current vehicle ID in the hidden field
            container.querySelector('#modal-vehicle-id').value = selector.value;
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

            // Handle "Other" type
            if (data.type === 'Autre') {
                data.type = data.typeOther;
            }
            delete data.typeOther;

            if (form.dataset.editingId) {
                // Update Mode
                this.update(form.dataset.editingId, data);
            } else {
                // Add Mode
                this.add(data);
            }

            modal.classList.add('hidden');
            this._renderDocumentList(container, selector.value);
        });

        // Event Delegation for Document Actions
        const listContainer = container.querySelector('#document-list-container');
        if (listContainer) {
            listContainer.addEventListener('click', (e) => {
                const target = e.target;

                // Delete
                const deleteBtn = target.closest('.delete-doc');
                if (deleteBtn) {
                    const docId = deleteBtn.getAttribute('data-id');
                    const modal = document.getElementById('modal-confirm');
                    const msg = document.getElementById('confirm-message');
                    const btnOk = document.getElementById('btn-confirm-ok');
                    const btnCancel = document.getElementById('btn-confirm-cancel');
                    const btnClose = document.getElementById('close-confirm-modal');

                    if (!modal) {
                        if (confirm('Supprimer ce document ?')) {
                            this.delete(docId);
                            this._renderDocumentList(container, selector.value);
                        }
                        return;
                    }

                    msg.textContent = 'Êtes-vous sûr de vouloir supprimer ce document ?';
                    modal.classList.remove('hidden');

                    const newBtnOk = btnOk.cloneNode(true);
                    btnOk.parentNode.replaceChild(newBtnOk, btnOk);

                    const newBtnCancel = btnCancel.cloneNode(true);
                    btnCancel.parentNode.replaceChild(newBtnCancel, btnCancel);

                    const newBtnClose = btnClose.cloneNode(true);
                    btnClose.parentNode.replaceChild(newBtnClose, btnClose);

                    newBtnOk.addEventListener('click', () => {
                        this.delete(docId);
                        modal.classList.add('hidden');
                        this._renderDocumentList(container, selector.value);
                    });

                    const closeModal = () => {
                        modal.classList.add('hidden');
                    };

                    newBtnCancel.addEventListener('click', closeModal);
                    newBtnClose.addEventListener('click', closeModal);

                    return;
                }

                // Edit
                const editBtn = target.closest('.edit-doc');
                if (editBtn) {
                    const docId = editBtn.getAttribute('data-id');
                    const doc = this.getAll().find(d => d.id === docId);
                    if (doc) {
                        this._openEditModal(container, doc);
                    }
                    return;
                }
            });
        }
    }
}

window.DocumentManager = new DocumentManager();
