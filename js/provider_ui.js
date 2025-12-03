/**
 * Provider UI Manager
 * Handles the display and interaction for the Provider Management view
 */

class ProviderUIManager {
    constructor() {
        this.container = null;
    }

    /**
     * Initialize the view
     */
    init(container) {
        this.container = container;
        this.renderList();
    }

    /**
     * Render the list of providers
     */
    renderList() {
        const providers = window.ProviderManager.getAll();

        this.container.innerHTML = `
            <div class="module-header">
                <h3>Gestion des Fournisseurs</h3>
                <button id="btn-add-provider" class="btn btn-primary">
                    <span class="icon">+</span> Nouveau Fournisseur
                </button>
            </div>

            <div class="provider-grid">
                ${providers.map(p => this._renderCard(p)).join('')}
            </div>

            ${providers.length === 0 ? `
                <div class="empty-state">
                    <div class="empty-icon">🔧</div>
                    <p>Aucun fournisseur enregistré.</p>
                    <p class="sub-text">Ajoutez vos garages et mécaniciens préférés.</p>
                </div>
            ` : ''}

            <!-- Modal for Add/Edit Provider -->
            <div id="modal-manage-provider" class="modal hidden">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 id="modal-provider-title">Nouveau Fournisseur</h4>
                        <span class="close-modal">&times;</span>
                    </div>
                    <form id="form-manage-provider">
                        <input type="hidden" name="id">
                        
                        <div class="form-group">
                            <label>Nom du Garage / Prestataire</label>
                            <input type="text" name="name" required placeholder="ex: Garage Atlas">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Ville</label>
                                <select name="city" required class="form-select" style="width:100%">
                                    ${window.MoroccanCities.map(c => `<option value="${c}">${c}</option>`).join('')}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Téléphone</label>
                                <input type="tel" name="phone" placeholder="+212 6...">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Adresse</label>
                            <input type="text" name="address" placeholder="Adresse complète">
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label>Gamme de Prix</label>
                                <select name="priceRange" class="form-select" style="width:100%">
                                    <option value="$">💵 Économique</option>
                                    <option value="$$" selected>💵💵 Moyen</option>
                                    <option value="$$$">💵💵💵 Premium</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Note (0-5)</label>
                                <input type="number" name="rating" min="0" max="5" step="0.1" value="0">
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Services (séparés par des virgules)</label>
                            <input type="text" name="services" placeholder="ex: Vidange, Freins, Pneus">
                        </div>

                        <div class="form-group">
                            <label>Spécialisations (Marques, etc.)</label>
                            <input type="text" name="specializations" placeholder="ex: Renault, BMW, Diesel">
                        </div>

                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary close-modal">Annuler</button>
                            <button type="submit" class="btn btn-primary">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this._attachEvents();
    }

    /**
     * Render a single provider card
     */
    _renderCard(provider) {
        return `
            <div class="provider-card" style="margin-bottom: 0;">
                <div class="provider-header">
                    <div class="provider-info">
                        <h4 class="provider-name">${provider.name}</h4>
                        <div class="provider-rating">
                            <span class="rating-value">⭐ ${provider.rating}/5</span>
                            <span class="review-count">(${provider.reviews || 0} avis)</span>
                        </div>
                    </div>
                    <div class="provider-price-badge">
                        ${provider.priceRange}
                    </div>
                </div>
                <div class="provider-details">
                    <div class="provider-address">📍 ${provider.city} - ${provider.address}</div>
                    <div class="provider-services">🔧 ${provider.services.slice(0, 3).join(', ')}...</div>
                </div>
                <div class="provider-actions" style="flex-wrap: wrap; gap: 0.5rem;">
                <button class="btn btn-secondary" onclick="window.open('https://wa.me/${provider.phone.replace(/\D/g, '')}', '_blank')">
                    💬 WhatsApp
                </button>
                <button class="btn btn-secondary" onclick="window.location.href='mailto:${provider.email || ''}?subject=Demande de devis'">
                    📝 Devis
                </button>
                <button class="btn btn-secondary" onclick="window.open('${provider.website || '#'}', '_blank')">
                    📅 RDV
                </button>
                <div style="flex-basis: 100%; height: 0;"></div> <!-- Line break -->
                <button class="btn btn-secondary btn-edit-provider" data-id="${provider.id}">✎ Modifier</button>
                <button class="btn btn-danger-outline btn-delete-provider" data-id="${provider.id}">✕ Supprimer</button>
            </div>
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    _attachEvents() {
        const container = this.container;
        const modal = container.querySelector('#modal-manage-provider');
        const form = container.querySelector('#form-manage-provider');
        const btnAdd = container.querySelector('#btn-add-provider');
        const closeButtons = container.querySelectorAll('.close-modal');

        // Open Add Modal
        btnAdd.addEventListener('click', () => {
            form.reset();
            form.querySelector('[name="id"]').value = '';
            container.querySelector('#modal-provider-title').textContent = 'Nouveau Fournisseur';
            modal.classList.remove('hidden');
        });

        // Close Modal
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => modal.classList.add('hidden'));
        });

        // Handle Form Submit
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Process arrays
            data.services = data.services.split(',').map(s => s.trim()).filter(s => s);
            data.specializations = data.specializations.split(',').map(s => s.trim()).filter(s => s);
            data.rating = parseFloat(data.rating);

            if (data.id) {
                window.ProviderManager.update(data.id, data);
            } else {
                window.ProviderManager.add(data);
            }

            modal.classList.add('hidden');
            this.renderList(); // Refresh list

            if (window.UIManager) {
                window.UIManager.showNotification('Fournisseur enregistré avec succès', 'success');
            }
        });

        // Edit & Delete Actions (Event Delegation)
        container.addEventListener('click', (e) => {
            // Check if clicked element or its parent is the delete button
            const deleteBtn = e.target.closest('.btn-delete-provider');
            if (deleteBtn) {
                const id = deleteBtn.dataset.id;
                if (confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
                    // Use setTimeout to ensure UI updates after confirm dialog closes
                    setTimeout(() => {
                        window.ProviderManager.delete(id);
                        this.renderList();
                        if (window.UIManager) {
                            window.UIManager.showNotification('Fournisseur supprimé', 'success');
                        }
                    }, 0);
                }
                return;
            }

            // Check if clicked element or its parent is the edit button
            const editBtn = e.target.closest('.btn-edit-provider');
            if (editBtn) {
                const id = editBtn.dataset.id;
                const provider = window.ProviderManager.getById(id);
                if (provider) {
                    this._fillForm(form, provider);
                    container.querySelector('#modal-provider-title').textContent = 'Modifier Fournisseur';
                    modal.classList.remove('hidden');
                }
            }
        });
    }

    /**
     * Fill form with provider data
     */
    _fillForm(form, provider) {
        form.querySelector('[name="id"]').value = provider.id;
        form.querySelector('[name="name"]').value = provider.name;
        form.querySelector('[name="city"]').value = provider.city;
        form.querySelector('[name="phone"]').value = provider.phone || '';
        form.querySelector('[name="address"]').value = provider.address || '';
        form.querySelector('[name="priceRange"]').value = provider.priceRange;
        form.querySelector('[name="rating"]').value = provider.rating;
        form.querySelector('[name="services"]').value = provider.services.join(', ');
        form.querySelector('[name="specializations"]').value = provider.specializations.join(', ');
    }
}

window.ProviderUIManager = new ProviderUIManager();
