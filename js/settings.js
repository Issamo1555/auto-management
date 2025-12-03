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
        if (stored) {
            return { ...this.defaults, ...JSON.parse(stored) };
        }
        return this.defaults;
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
                <div class="module-header">
                    <h3>Paramètres</h3>
                </div>
                
                <form id="form-settings">
                    <div class="settings-grid">
                        
                        <!-- Apparence -->
                        <div class="settings-card">
                            <div class="settings-card-header">
                                <span>■</span>
                                <h4>Apparence</h4>
                            </div>
                            <div class="settings-card-body">
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <span class="setting-label">Mode Sombre</span>
                                        <span class="setting-desc">Basculer entre le thème clair et sombre</span>
                                    </div>
                                    <div class="setting-control">
                                        <label class="toggle-switch">
                                            <input type="checkbox" name="theme_toggle" ${settings.theme === 'dark' ? 'checked' : ''}>
                                            <span class="slider"></span>
                                        </label>
                                        <input type="hidden" name="theme" value="${settings.theme}">
                                    </div>
                                </div>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <span class="setting-label">Langue</span>
                                        <span class="setting-desc">Langue de l'interface</span>
                                    </div>
                                    <div class="setting-control">
                                        <select name="language" class="form-select">
                                            <option value="fr" ${settings.language === 'fr' ? 'selected' : ''}>Français</option>
                                            <option value="en" ${settings.language === 'en' ? 'selected' : ''}>English</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Profil -->
                        <div class="settings-card">
                            <div class="settings-card-header">
                                <span>◆</span>
                                <h4>Profil</h4>
                            </div>
                            <div class="settings-card-body">
                                <div class="form-group">
                                    <label>Nom d'utilisateur</label>
                                    <input type="text" name="userName" value="${settings.userName}" placeholder="Votre nom" class="form-input">
                                </div>
                            </div>
                        </div>

                        <!-- Notifications -->
                        <div class="settings-card">
                            <div class="settings-card-header">
                                <span>◉</span>
                                <h4>Notifications</h4>
                            </div>
                            <div class="settings-card-body">
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <span class="setting-label">Activer les notifications</span>
                                        <span class="setting-desc">Recevoir des alertes pour les documents</span>
                                    </div>
                                    <div class="setting-control">
                                        <label class="toggle-switch">
                                            <input type="checkbox" name="notifications" ${settings.notifications ? 'checked' : ''}>
                                            <span class="slider"></span>
                                        </label>
                                    </div>
                                </div>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <span class="setting-label">Délai d'alerte</span>
                                        <span class="setting-desc">Jours avant expiration</span>
                                    </div>
                                    <div class="setting-control" style="width: 100px;">
                                        <input type="number" name="alertDays" value="${settings.alertDays}" min="1" max="90" class="form-input">
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Data Management -->
                        <div class="settings-card">
                            <div class="settings-card-header">
                                <span>■</span>
                                <h4>Données & Sauvegarde</h4>
                            </div>
                            <div class="settings-card-body">
                                <p class="text-muted" style="font-size:0.9rem; margin-bottom:1rem;">Gérez vos données locales. Pensez à faire des sauvegardes régulières.</p>
                                
                                <div class="data-actions-grid">
                                    <div class="data-btn" id="btn-export-data">
                                        <span class="data-btn-icon">↓</span>
                                        <span class="data-btn-label">Sauvegarder</span>
                                    </div>
                                    <div class="data-btn" id="btn-import-data">
                                        <span class="data-btn-icon">↑</span>
                                        <span class="data-btn-label">Restaurer</span>
                                    </div>
                                    <div class="data-btn danger" id="btn-clear-data">
                                        <span class="data-btn-icon">✕</span>
                                        <span class="data-btn-label">Effacer tout</span>
                                    </div>
                                </div>
                                <input type="file" id="input-import-file" accept=".json" style="display:none;">
                            </div>
                        </div>

                        <!-- AI Configuration -->
                        <div class="settings-card">
                            <div class="settings-card-header">
                                <span>🤖</span>
                                <h4>Intelligence Artificielle</h4>
                            </div>
                            <div class="settings-card-body">
                                <div class="form-group">
                                    <label>Clé API Google Gemini</label>
                                    <input type="password" name="geminiApiKey" value="${settings.geminiApiKey || ''}" placeholder="Collez votre clé API ici" class="form-input">
                                    <p class="text-muted" style="font-size: 0.8rem; margin-top: 0.5rem;">
                                        Nécessaire pour les recommandations intelligentes. 
                                        <a href="https://makersuite.google.com/app/apikey" target="_blank" style="color: var(--primary-color);">Obtenir une clé</a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Security Section -->
                        <div class="settings-card">
                            <div class="settings-card-header">
                                <span>◆</span>
                                <h4>Sécurité</h4>
                            </div>
                            <div class="settings-card-body">
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <span class="setting-label">Code PIN</span>
                                        <span class="setting-desc">Protéger l'accès à l'application</span>
                                    </div>
                                    <div class="setting-control">
                                        ${window.AuthManager && window.AuthManager.isSetup() ?
                `<button type="button" id="btn-change-pin" class="btn btn-secondary btn-sm">Changer</button>
                                             <button type="button" id="btn-remove-pin" class="btn btn-danger-outline btn-sm" style="margin-left:0.5rem">Désactiver</button>`
                :
                `<button type="button" id="btn-set-pin" class="btn btn-primary btn-sm">Définir un code</button>`
            }
                                    </div>
                                </div>
                                
                                <div class="setting-item" id="biometric-setting" style="display:none;">
                                    <div class="setting-info">
                                        <span class="setting-label">Face ID / Touch ID</span>
                                        <span class="setting-desc">Déverrouillage biométrique</span>
                                    </div>
                                    <div class="setting-control">
                                        <label class="toggle-switch">
                                            <input type="checkbox" id="toggle-biometric" ${window.AuthManager && window.AuthManager.isBiometricEnabled() ? 'checked' : ''}>
                                            <span class="slider"></span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- About -->
                        <div class="settings-card">
                            <div class="settings-card-header">
                                <span>ℹ</span>
                                <h4>À propos</h4>
                            </div>
                            <div class="settings-card-body">
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <span class="setting-label">Version</span>
                                    </div>
                                    <div class="setting-control">
                                        <span class="badge">v1.1.0</span>
                                    </div>
                                </div>
                                <div class="setting-item">
                                    <div class="setting-info">
                                        <span class="setting-label">Développeur</span>
                                    </div>
                                    <div class="setting-control">
                                        <span class="text-muted">AutoManager Team</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="sticky-bottom">
                        <button type="button" id="btn-save-settings" class="btn btn-primary btn-lg" style="min-width: 200px;">
                            Enregistrer les modifications
                        </button>
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

                // Handle Theme Toggle
                if (formData.has('theme_toggle')) {
                    data.theme = 'dark';
                } else {
                    data.theme = 'light';
                }
                // Remove the toggle field from data to keep it clean
                delete data.theme_toggle;

                this.saveSettings(data);

                // Show success feedback without reload if possible, but reload is safer for language/theme
                const btn = e.target;
                const originalText = btn.textContent;
                btn.textContent = '✅ Enregistré !';
                btn.classList.add('btn-success');

                setTimeout(() => {
                    window.location.reload();
                }, 500);
            }
        });

        // Instant Theme Preview
        const themeToggle = container.querySelector('input[name="theme_toggle"]');
        if (themeToggle) {
            themeToggle.addEventListener('change', (e) => {
                this.applyTheme(e.target.checked ? 'dark' : 'light');
            });
        }

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

        // Security Buttons
        const btnSetPin = container.querySelector('#btn-set-pin');
        const btnChangePin = container.querySelector('#btn-change-pin');
        const btnRemovePin = container.querySelector('#btn-remove-pin');

        if (btnSetPin) {
            btnSetPin.addEventListener('click', () => {
                if (!window.AuthManager) {
                    alert('Erreur: Module d\'authentification non chargé.');
                    return;
                }
                this.handleSetPin();
            });
        }
        if (btnChangePin) {
            btnChangePin.addEventListener('click', () => {
                if (!window.AuthManager) {
                    alert('Erreur: Module d\'authentification non chargé.');
                    return;
                }
                this.handleSetPin();
            });
        }
        if (btnRemovePin) {
            btnRemovePin.addEventListener('click', () => {
                if (!window.AuthManager) {
                    alert('Erreur: Module d\'authentification non chargé.');
                    return;
                }
                if (confirm('Voulez-vous vraiment désactiver la protection par code PIN ?')) {
                    window.AuthManager.removePin();
                    this.renderView(container); // Re-render to update buttons
                }
            });
        }

        // Biometric Toggle
        const biometricRow = container.querySelector('#biometric-setting');
        const biometricToggle = container.querySelector('#toggle-biometric');

        // Check if browser supports WebAuthn
        if (window.PublicKeyCredential && biometricRow && window.AuthManager) {
            biometricRow.style.display = 'flex';

            biometricToggle.addEventListener('change', async (e) => {
                if (e.target.checked) {
                    try {
                        await window.AuthManager.enableBiometrics();
                        alert("✅ Biométrie activée !");
                    } catch (err) {
                        e.target.checked = false;
                        alert("❌ Erreur : " + err.message);
                    }
                } else {
                    window.AuthManager.disableBiometrics();
                }
            });
        }
    }

    handleSetPin() {
        const pin = prompt("Entrez un nouveau code PIN à 4 chiffres :");
        if (pin) {
            if (/^\d{4}$/.test(pin)) {
                window.AuthManager.setPin(pin);
                alert("Code PIN défini avec succès !");
                // Re-render to update buttons
                this.renderView(document.getElementById('main-content'));
            } else {
                alert("Le code doit contenir exactement 4 chiffres.");
            }
        }
    }

    exportData() {
        // Ensure all managers are loaded
        if (!window.VehicleManager || !window.DocumentManager || !window.MaintenanceManager) {
            alert('Erreur: Les modules ne sont pas tous chargés. Veuillez rafraîchir la page.');
            return;
        }

        const vehicles = window.VehicleManager.getAll() || [];
        const documents = window.DocumentManager.getAll() || [];
        const maintenance = window.MaintenanceManager.getAll() || [];

        const data = {
            vehicles: vehicles,
            documents: documents,
            maintenance: maintenance,
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };

        console.log('Export data:', data); // Debug log

        // Check if there's any data
        const totalItems = vehicles.length + documents.length + maintenance.length;
        if (totalItems === 0) {
            if (!confirm('Aucune donnée trouvée (0 véhicules, 0 documents, 0 entretiens).\n\nVoulez-vous quand même exporter un fichier vide ?')) {
                return;
            }
        }

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `automanager-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        // Show success message
        alert(`✅ Sauvegarde créée !\n\n${vehicles.length} véhicule(s)\n${documents.length} document(s)\n${maintenance.length} entretien(s)`);
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
