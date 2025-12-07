/**
 * DocumentManager
 * Handles document-specific logic, expiration checks, and UI rendering.
 */
class DocumentManager {
    constructor() {
        this.STORAGE_KEY = 'documents';
        // Document types will be translated dynamically
        this.getDocTypes = () => {
            const t = (key) => window.I18n ? window.I18n.t(key) : key;
            return [
                t('documents.type_license'),
                t('documents.type_insurance'),
                t('documents.type_technical'),
                t('documents.type_registration'),
                t('documents.type_other')
            ];
        };
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
        const t = (key) => window.I18n ? window.I18n.t(key) : key;
        switch (status) {
            case 'expired': return t('documents.expired');
            case 'warning': return t('documents.expiring_soon');
            case 'valid': return t('documents.valid');
            default: return t('documents.unknown');
        }
    }

    // --- UI Generation Methods ---

    renderView(container) {
        const vehicles = window.VehicleManager ? window.VehicleManager.getAll() : [];
        const t = (key) => window.I18n ? window.I18n.t(key) : key;

        if (vehicles.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🚫</div>
                    <p>${t('documents.no_vehicles')}</p>
                    <p class="sub-text">${t('documents.add_vehicle_first')}</p>
                    <button class="btn btn-primary" style="margin-top:1rem" onclick="document.querySelector('[data-view=vehicles]').click()">
                        ${t('documents.go_to_vehicles')}
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
                <h3>${t('documents.title')}</h3>
                <div class="header-actions">
                    <select id="vehicle-selector" class="form-select">
                        ${vehicles.map(v => `<option value="${v.id}">${v.make} ${v.model} (${v.plate})</option>`).join('')}
                    </select>
                    <button id="btn-add-doc" class="btn btn-primary">
                        <span class="icon">+</span> ${t('documents.add')}
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
                        <h4>${t('documents.new_document')}</h4>
                        <span class="close-modal">&times;</span>
                    </div>
                    <form id="form-add-doc">
                        <input type="hidden" name="vehicleId" id="modal-vehicle-id">
                        
                        <div class="form-group">
                            <label>${t('documents.doc_type')}</label>
                            <select name="type" id="input-doc-type" required class="form-select">
                                ${this.getDocTypes().map(t => `<option value="${t}">${t}</option>`).join('')}
                            </select>
                            <input type="text" id="input-doc-type-other" name="typeOther" class="hidden" placeholder="${t('documents.enter_type')}" style="width:100%; margin-top:5px; padding:0.5rem; border:1px solid var(--border-color); border-radius:var(--radius-md);">
                        </div>
                        
                        <div class="form-group">
                            <label>${t('documents.expiry_date')}</label>
                            <input type="date" name="expiryDate" required>
                        </div>

                        <div class="form-group">
                            <label>${t('documents.notes')}</label>
                            <input type="text" name="notes" placeholder="${t('documents.notes_placeholder')}">
                        </div>

                        <div class="form-group">
                            <label>${t('documents.photo')}</label>
                            <input type="file" id="input-doc-photo" accept="image/*">
                            <input type="hidden" name="photo" id="hidden-doc-photo">
                            <div id="doc-photo-preview" style="margin-top:10px; display:none;">
                                <img src="" style="max-width:100%; max-height:200px; border-radius:8px;">
                            </div>
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary close-modal">${t('common.cancel')}</button>
                            <button type="submit" class="btn btn-primary">${t('common.save')}</button>
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
        const t = (key) => window.I18n ? window.I18n.t(key) : key;

        if (documents.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state small">
                    <p>${t('documents.no_documents')}</p>
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
                            <div class="doc-date">${t('documents.expires_on')}: ${new Date(doc.expiryDate).toLocaleDateString()}</div>
                            ${doc.notes ? `<div class="doc-notes">${doc.notes}</div>` : ''}
                            ${doc.photo ? `<div style="margin-top:0.5rem;"><img src="${doc.photo}" style="max-width:100%; max-height:150px; border-radius:8px; cursor:pointer;" onclick="window.open('${doc.photo}', '_blank')" alt="Document photo" /></div>` : ''}
                        </div>
                        <div class="card-actions">
                            <button class="btn-icon edit-doc" data-id="${doc.id}" title="${t('common.edit')}">✎</button>
                            <button class="btn-icon delete-doc" data-id="${doc.id}" title="${t('common.delete')}">✕</button>
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
        const t = (key) => window.I18n ? window.I18n.t(key) : key;

        // Update Title
        title.textContent = t('documents.edit_document');

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
        const t = (key) => window.I18n ? window.I18n.t(key) : key;

        if (typeSelect && typeOtherInput) {
            typeSelect.addEventListener('change', (e) => {
                if (e.target.value === t('documents.type_other')) {
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
            const t = (key) => window.I18n ? window.I18n.t(key) : key;
            // Reset Form
            form.reset();
            delete form.dataset.editingId;
            modal.querySelector('.modal-header h4').textContent = t('documents.new_document');
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
            const t = (key) => window.I18n ? window.I18n.t(key) : key;
            if (data.type === t('documents.type_other')) {
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

                    const t = (key) => window.I18n ? window.I18n.t(key) : key;
                    if (!modal) {
                        if (confirm(t('documents.delete_confirm'))) {
                            this.delete(docId);
                            this._renderDocumentList(container, selector.value);
                        }
                        return;
                    }

                    msg.textContent = t('documents.delete_confirm');
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
