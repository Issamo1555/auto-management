/**
 * SettingsManager
 * Handles user preferences and settings.
 */
class SettingsManager {
    constructor() {
        this.STORAGE_KEY = 'app_settings';
        this.defaults = {
            language: 'fr',
            theme: 'light',
            notifications: true,
            alertDays: 30,
            userName: 'Propriétaire'
        };
    }

    getSettings() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : this.defaults;
    }

    saveSettings(settings) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
        this.applyTheme(settings.theme);
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    renderView(container) {
        const settings = this.getSettings();

        // Apply theme on render
        this.applyTheme(settings.theme);

        const html = `
            <div class="settings-container">
                <h3>Paramètres</h3>
                
                <form id="form-settings">
                    <div class="settings-grid">
                        <!-- Profile Section -->
                        <div class="settings-section">
                            <h4>👤 Profil</h4>
                            <div class="form-group">
                                <label>Nom d'utilisateur</label>
                                <input type="text" name="userName" value="${settings.userName}" placeholder="Votre nom">
                            </div>
                        </div>

                        <!-- Preferences Section -->
                        <div class="settings-section">
                            <h4>⚙️ Préférences</h4>
                            <div class="form-group">
                                <label>Langue</label>
                                <select name="language" class="form-select">
                                    <option value="fr" ${settings.language === 'fr' ? 'selected' : ''}>Français</option>
                                    <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                                    <option value="ar" ${settings.language === 'ar' ? 'selected' : ''}>العربية</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Thème</label>
                                <select name="theme" class="form-select">
                                    <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>Clair</option>
                                    <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>Sombre</option>
                                </select>
                            </div>
                        </div>

                        <!-- Notifications Section -->
                        <div class="settings-section">
                            <h4>🔔 Notifications</h4>
                            <div class="form-group">
                                <label class="checkbox-label">
                                    <input type="checkbox" name="notifications" ${settings.notifications ? 'checked' : ''}>
                                    <span>Activer les notifications</span>
                                </label>
                            </div>

                            <div class="form-group">
                                <label>Délai d'alerte (jours)</label>
                                <input type="number" name="alertDays" value="${settings.alertDays}" min="1" max="90">
                            </div>
                        </div>

                        <!-- Data Section -->
                        <div class="settings-section full-width">
                            <h4>💾 Gestion des Données</h4>
                            <p class="text-muted" style="margin-bottom:1rem; font-size:0.9rem;">Sauvegardez vos données ou restaurez une copie de sécurité.</p>
                            
                            <div class="data-actions">
                                <div class="data-group">
                                    <button type="button" id="btn-export-data" class="btn btn-secondary">
                                        📥 Exporter (Backup)
                                    </button>
                                    <button type="button" id="btn-import-data" class="btn btn-secondary">
                                        📤 Importer (Restore)
                                    </button>
                                    <input type="file" id="input-import-file" accept=".json" style="display:none;">
                                </div>
                                
                                <button type="button" id="btn-clear-data" class="btn btn-danger-outline">
                                    🗑️ Effacer tout
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions sticky-bottom">
                        <button type="button" id="btn-save-settings" class="btn btn-primary btn-lg">Enregistrer les modifications</button>
                    </div>
                </form>
            </div>
        `;

        container.innerHTML = html;
        this._attachEvents(container);
    }

    _attachEvents(container) {
        const form = container.querySelector('#form-settings');
        const btnExport = container.querySelector('#btn-export-data');
        const btnImport = container.querySelector('#btn-import-data');
        const fileInput = container.querySelector('#input-import-file');
        const btnClear = container.querySelector('#btn-clear-data');

        // Event Delegation for Save Button
        container.addEventListener('click', (e) => {
            if (e.target && e.target.id === 'btn-save-settings') {
                e.preventDefault();
                console.log("Saving settings (Delegated)...");
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Convert checkbox to boolean
                data.notifications = formData.has('notifications');
                data.alertDays = parseInt(data.alertDays);

                this.saveSettings(data);
                alert('Paramètres enregistrés avec succès! La page va se recharger.');
                window.location.reload();
            }
        });

        btnExport.addEventListener('click', () => {
            this.exportData();
        });

        btnImport.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importData(e.target.files[0]);
            }
        });

        btnClear.addEventListener('click', () => {
            if (confirm('⚠️ Êtes-vous sûr de vouloir effacer TOUTES les données? Cette action est irréversible!')) {
                if (confirm('Dernière confirmation: Toutes les données (véhicules, documents, entretiens) seront supprimées définitivement.')) {
                    this.clearAllData();
                }
            }
        });
    }

    exportData() {
        const data = {
            vehicles: window.VehicleManager.getAll(),
            documents: window.DocumentManager.getAll(),
            maintenance: window.MaintenanceManager.getAll(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `automanager-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    clearAllData() {
        localStorage.clear();
        alert('Toutes les données ont été effacées. La page va se recharger.');
        window.location.reload();
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                // Basic Validation
                if (!data.vehicles || !data.documents || !data.maintenance || !data.settings) {
                    throw new Error("Format de fichier invalide. Les clés requises sont manquantes.");
                }

                if (confirm(`Voulez-vous restaurer la sauvegarde du ${new Date(data.exportDate).toLocaleDateString()} ?\nCeci écrasera les données actuelles.`)) {
                    // Restore Data
                    window.StorageManager.save('vehicles', data.vehicles);
                    window.StorageManager.save('documents', data.documents);
                    window.StorageManager.save('maintenance', data.maintenance);
                    this.saveSettings(data.settings);

                    alert('Données restaurées avec succès! La page va se recharger.');
                    window.location.reload();
                }
            } catch (err) {
                console.error(err);
                alert('Erreur lors de l\'importation: ' + err.message);
            }
        };
        reader.readAsText(file);
    }
}

window.SettingsManager = new SettingsManager();
