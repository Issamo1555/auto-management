/**
 * QR Scanner Module
 * Provides QR code scanning and generation capabilities
 */

class QRScanner {
    constructor() {
        this.html5QrCode = null;
        this.isScanning = false;
        this.cameras = [];
        this.currentCameraId = null;
        this.scannerElementId = 'qr-reader';
    }

    /**
     * Initialize QR scanner
     */
    async init() {
        // Check if Html5Qrcode library is loaded
        if (typeof Html5Qrcode === 'undefined') {
            console.error('html5-qrcode library not loaded');
            return false;
        }

        try {
            // Get available cameras
            this.cameras = await Html5Qrcode.getCameras();
            console.log(`Found ${this.cameras.length} camera(s)`);

            if (this.cameras.length === 0) {
                throw new Error('No cameras found');
            }

            // Create scanner instance
            this.html5QrCode = new Html5Qrcode(this.scannerElementId);

            return true;
        } catch (error) {
            console.error('Error initializing QR scanner:', error);
            this.showError('Impossible d\'accéder à la caméra');
            return false;
        }
    }

    /**
     * Start scanning
     */
    async startScanning() {
        if (!this.html5QrCode) {
            const initialized = await this.init();
            if (!initialized) return false;
        }

        if (this.isScanning) {
            console.log('Already scanning');
            return false;
        }

        try {
            // Use back camera on mobile, front camera on desktop
            const cameraId = this.cameras.length > 1
                ? this.cameras[this.cameras.length - 1].id  // Back camera
                : this.cameras[0].id;  // First available

            this.currentCameraId = cameraId;

            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            };

            await this.html5QrCode.start(
                cameraId,
                config,
                (decodedText, decodedResult) => {
                    this.onScanSuccess(decodedText, decodedResult);
                },
                (errorMessage) => {
                    // Silent - scanning errors are frequent and normal
                }
            );

            this.isScanning = true;
            this.updateScannerUI('scanning');
            console.log('QR Scanner started');

            return true;
        } catch (error) {
            console.error('Error starting scanner:', error);
            this.showError('Erreur lors du démarrage du scanner: ' + error.message);
            return false;
        }
    }

    /**
     * Stop scanning
     */
    async stopScanning() {
        if (!this.html5QrCode || !this.isScanning) {
            return;
        }

        try {
            await this.html5QrCode.stop();
            this.isScanning = false;
            this.updateScannerUI('idle');
            console.log('QR Scanner stopped');
        } catch (error) {
            console.error('Error stopping scanner:', error);
        }
    }

    /**
     * Switch camera (front/back)
     */
    async switchCamera() {
        if (this.cameras.length <= 1) {
            this.showError('Une seule caméra disponible');
            return;
        }

        const currentIndex = this.cameras.findIndex(cam => cam.id === this.currentCameraId);
        const nextIndex = (currentIndex + 1) % this.cameras.length;

        await this.stopScanning();
        this.currentCameraId = this.cameras[nextIndex].id;
        await this.startScanning();
    }

    /**
     * Handle successful QR code scan
     */
    onScanSuccess(decodedText, decodedResult) {
        console.log('QR Code detected:', decodedText);

        // Stop scanning temporarily
        this.stopScanning();

        // Play success sound (optional)
        this.playSuccessSound();

        // Try to parse as JSON (vehicle data)
        try {
            const data = JSON.parse(decodedText);

            if (data.type === 'vehicle' && data.vehicle) {
                this.handleVehicleData(data.vehicle);
            } else if (data.type === 'provider' && data.provider) {
                this.handleProviderData(data.provider);
            } else {
                // Generic data
                this.handleGenericData(decodedText);
            }
        } catch (error) {
            // Not JSON - treat as plain text
            this.handleGenericData(decodedText);
        }
    }

    /**
     * Handle vehicle data from QR code
     */
    handleVehicleData(vehicleData) {
        const modal = document.getElementById('qr-scanner-modal');
        const resultDiv = modal.querySelector('.qr-result');

        resultDiv.innerHTML = `
            <div class="qr-result-success">
                <h4>🚗 Véhicule détecté</h4>
                <div class="vehicle-preview">
                    <p><strong>Marque:</strong> ${vehicleData.make || 'N/A'}</p>
                    <p><strong>Modèle:</strong> ${vehicleData.model || 'N/A'}</p>
                    <p><strong>Année:</strong> ${vehicleData.year || 'N/A'}</p>
                    <p><strong>Immatriculation:</strong> ${vehicleData.plate || 'N/A'}</p>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="window.QRScanner.resumeScanning()">Scanner à nouveau</button>
                    <button class="btn btn-primary" onclick="window.QRScanner.importVehicle(${JSON.stringify(vehicleData).replace(/"/g, '&quot;')})">Importer</button>
                </div>
            </div>
        `;

        resultDiv.style.display = 'block';
    }

    /**
     * Handle provider data from QR code
     */
    handleProviderData(providerData) {
        const modal = document.getElementById('qr-scanner-modal');
        const resultDiv = modal.querySelector('.qr-result');

        resultDiv.innerHTML = `
            <div class="qr-result-success">
                <h4>🔧 Fournisseur détecté</h4>
                <div class="provider-preview">
                    <p><strong>Nom:</strong> ${providerData.name || 'N/A'}</p>
                    <p><strong>Téléphone:</strong> ${providerData.phone || 'N/A'}</p>
                    <p><strong>Ville:</strong> ${providerData.city || 'N/A'}</p>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="window.QRScanner.resumeScanning()">Scanner à nouveau</button>
                    <button class="btn btn-primary" onclick="window.QRScanner.importProvider(${JSON.stringify(providerData).replace(/"/g, '&quot;')})">Importer</button>
                </div>
            </div>
        `;

        resultDiv.style.display = 'block';
    }

    /**
     * Handle generic text data
     */
    handleGenericData(text) {
        const modal = document.getElementById('qr-scanner-modal');
        const resultDiv = modal.querySelector('.qr-result');

        resultDiv.innerHTML = `
            <div class="qr-result-info">
                <h4>📄 Données détectées</h4>
                <div class="generic-data">
                    <p>${text}</p>
                </div>
                <div class="form-actions">
                    <button class="btn btn-secondary" onclick="window.QRScanner.resumeScanning()">Scanner à nouveau</button>
                    <button class="btn btn-primary" onclick="window.QRScanner.copyToClipboard('${text.replace(/'/g, "\\'")}')">Copier</button>
                </div>
            </div>
        `;

        resultDiv.style.display = 'block';
    }

    /**
     * Import vehicle from QR data
     */
    importVehicle(vehicleData) {
        if (window.StorageManager && window.VehicleManager) {
            // Check if vehicle already exists
            const vehicles = window.StorageManager.getVehicles();
            const exists = vehicles.some(v => v.plate === vehicleData.plate);

            if (exists) {
                alert('⚠️ Ce véhicule existe déjà dans votre liste');
                this.closeModal();
                return;
            }

            // Add vehicle
            const newVehicle = {
                id: Date.now().toString(),
                ...vehicleData,
                addedDate: new Date().toISOString(),
            };

            vehicles.push(newVehicle);
            window.StorageManager.saveVehicles(vehicles);

            alert('✅ Véhicule importé avec succès !');
            this.closeModal();

            // Navigate to vehicles view
            const navItem = document.querySelector('.nav-links li[data-view="vehicles"]');
            if (navItem) navItem.click();
        } else {
            alert('❌ Erreur: Module de gestion non disponible');
        }
    }

    /**
     * Import provider from QR data
     */
    importProvider(providerData) {
        if (window.ProviderManager) {
            // Add provider to favorites
            const providers = JSON.parse(localStorage.getItem('favoriteProviders') || '[]');

            const newProvider = {
                id: Date.now().toString(),
                ...providerData,
                favorite: true,
                addedDate: new Date().toISOString(),
            };

            providers.push(newProvider);
            localStorage.setItem('favoriteProviders', JSON.stringify(providers));

            alert('✅ Fournisseur ajouté aux favoris !');
            this.closeModal();
        } else {
            alert('❌ Erreur: Module fournisseurs non disponible');
        }
    }

    /**
     * Copy text to clipboard
     */
    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('✅ Texte copié dans le presse-papier');
            this.closeModal();
        }).catch(err => {
            alert('❌ Erreur lors de la copie');
        });
    }

    /**
     * Resume scanning
     */
    resumeScanning() {
        const resultDiv = document.querySelector('.qr-result');
        if (resultDiv) {
            resultDiv.style.display = 'none';
            resultDiv.innerHTML = '';
        }
        this.startScanning();
    }

    /**
     * Generate QR code for vehicle
     */
    generateVehicleQR(vehicleId) {
        if (!window.StorageManager) {
            this.showError('Module de stockage non disponible');
            return;
        }

        const vehicles = window.StorageManager.getVehicles();
        const vehicle = vehicles.find(v => v.id === vehicleId);

        if (!vehicle) {
            this.showError('Véhicule non trouvé');
            return;
        }

        const qrData = {
            type: 'vehicle',
            vehicle: {
                make: vehicle.make,
                model: vehicle.model,
                year: vehicle.year,
                plate: vehicle.plate,
                vin: vehicle.vin,
                mileage: vehicle.mileage,
            },
            generated: new Date().toISOString(),
        };

        this.generateQRCode(JSON.stringify(qrData));
    }

    /**
     * Generate QR code from data
     */
    generateQRCode(data) {
        const qrContainer = document.getElementById('qr-code-display');
        if (!qrContainer) return;

        // Clear previous QR code
        qrContainer.innerHTML = '';

        // Check if QRCode library is loaded
        if (typeof QRCode === 'undefined') {
            this.showError('Bibliothèque QR Code non chargée');
            return;
        }

        try {
            new QRCode(qrContainer, {
                text: data,
                width: 256,
                height: 256,
                colorDark: '#000000',
                colorLight: '#ffffff',
                correctLevel: QRCode.CorrectLevel.H,
            });

            // Show download button
            const downloadBtn = document.getElementById('download-qr-btn');
            if (downloadBtn) {
                downloadBtn.style.display = 'block';
                downloadBtn.onclick = () => this.downloadQRCode();
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
            this.showError('Erreur lors de la génération du QR code');
        }
    }

    /**
     * Download generated QR code
     */
    downloadQRCode() {
        const qrContainer = document.getElementById('qr-code-display');
        const canvas = qrContainer.querySelector('canvas');

        if (!canvas) {
            alert('❌ Aucun QR code à télécharger');
            return;
        }

        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();

        alert('✅ QR code téléchargé !');
    }

    /**
     * Play success sound
     */
    playSuccessSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (error) {
            // Silent fail - sound is optional
        }
    }

    /**
     * Update scanner UI state
     */
    updateScannerUI(state) {
        const modal = document.getElementById('qr-scanner-modal');
        if (!modal) return;

        const statusEl = modal.querySelector('.scanner-status');
        if (statusEl) {
            const statusTexts = {
                idle: '📷 Prêt à scanner',
                scanning: '🔍 Recherche de QR code...',
                success: '✅ QR code détecté',
                error: '❌ Erreur',
            };

            statusEl.textContent = statusTexts[state] || statusTexts.idle;
        }

        // Update button badge
        const qrBtn = document.getElementById('qr-scanner-btn');
        if (qrBtn) {
            const badge = qrBtn.querySelector('.status-badge');
            if (badge) {
                badge.style.display = this.isScanning ? 'block' : 'none';
            }
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const modal = document.getElementById('qr-scanner-modal');
        const resultDiv = modal ? modal.querySelector('.qr-result') : null;

        if (resultDiv) {
            resultDiv.innerHTML = `
                <div class="qr-result-error">
                    <h4>❌ Erreur</h4>
                    <p>${message}</p>
                    <button class="btn btn-secondary" onclick="window.QRScanner.closeModal()">Fermer</button>
                </div>
            `;
            resultDiv.style.display = 'block';
        } else {
            alert(message);
        }

        this.updateScannerUI('error');
    }

    /**
     * Close QR scanner modal
     */
    closeModal() {
        this.stopScanning();
        const modal = document.getElementById('qr-scanner-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    /**
     * Open QR scanner modal
     */
    openModal() {
        const modal = document.getElementById('qr-scanner-modal');
        if (modal) {
            modal.classList.remove('hidden');

            // Switch to scanner tab by default
            this.switchTab('scan');
        }
    }

    /**
     * Switch between scan and generate tabs
     */
    switchTab(tab) {
        const scanTab = document.getElementById('qr-scan-tab');
        const generateTab = document.getElementById('qr-generate-tab');
        const scanBtn = document.querySelector('[data-tab="scan"]');
        const generateBtn = document.querySelector('[data-tab="generate"]');

        if (tab === 'scan') {
            scanTab.style.display = 'block';
            generateTab.style.display = 'none';
            scanBtn.classList.add('active');
            generateBtn.classList.remove('active');
            this.stopScanning();  // Reset scanner
        } else {
            scanTab.style.display = 'none';
            generateTab.style.display = 'block';
            scanBtn.classList.remove('active');
            generateBtn.classList.add('active');
            this.stopScanning();
            this.populateVehicleSelect();
        }
    }

    /**
     * Populate vehicle select for QR generation
     */
    populateVehicleSelect() {
        const select = document.getElementById('vehicle-select-qr');
        if (!select || !window.StorageManager) return;

        const vehicles = window.StorageManager.getVehicles();

        select.innerHTML = '<option value="">Sélectionner un véhicule</option>';

        vehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.id;
            option.textContent = `${vehicle.make} ${vehicle.model} (${vehicle.plate})`;
            select.appendChild(option);
        });
    }
}

// Initialize global instance
window.QRScanner = new QRScanner();
