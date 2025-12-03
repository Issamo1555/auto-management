/**
 * Voice Assistant Module
 * Provides voice recognition and text-to-speech capabilities for hands-free control
 */

class VoiceAssistant {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSupported = false;
        this.currentLanguage = 'fr-FR';
        this.commands = this.initCommands();

        this.checkSupport();
    }

    /**
     * Check browser support for Web Speech API
     */
    checkSupport() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition && this.synthesis) {
            this.isSupported = true;
            this.recognition = new SpeechRecognition();
            this.setupRecognition();
        } else {
            console.warn('Web Speech API non supporté sur ce navigateur');
            this.isSupported = false;
        }
    }

    /**
     * Setup speech recognition configuration
     */
    setupRecognition() {
        if (!this.recognition) return;

        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = this.currentLanguage;
        this.recognition.maxAlternatives = 1;

        // Event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI('listening');
            console.log('Assistant vocal: Écoute démarrée');
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase().trim();
            console.log('Reconnaissance:', transcript);
            this.updateUI('processing', transcript);
            this.processCommand(transcript);
        };

        this.recognition.onerror = (event) => {
            console.error('Erreur reconnaissance vocale:', event.error);
            this.isListening = false;

            let errorMessage = 'Erreur lors de la reconnaissance vocale';

            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'Aucune parole détectée';
                    break;
                case 'audio-capture':
                    errorMessage = 'Aucun microphone détecté';
                    break;
                case 'not-allowed':
                    errorMessage = 'Permission microphone refusée';
                    break;
                case 'network':
                    errorMessage = 'Erreur réseau';
                    break;
            }

            this.updateUI('error', errorMessage);
            setTimeout(() => this.stopListening(), 2000);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            if (this.shouldContinueListening) {
                this.recognition.start();
            } else {
                this.updateUI('idle');
            }
        };
    }

    /**
     * Initialize voice commands
     */
    initCommands() {
        return {
            navigation: {
                patterns: [
                    { regex: /(?:ouvrir|afficher|aller|voir)\s*(?:le|les)?\s*véhicules?/i, action: () => this.navigateTo('vehicles', 'Ouverture des véhicules') },
                    { regex: /(?:ouvrir|afficher|aller|voir)\s*(?:le|l')?\s*(?:tableau\s*de\s*bord|dashboard)/i, action: () => this.navigateTo('dashboard', 'Ouverture du tableau de bord') },
                    { regex: /(?:ouvrir|afficher|aller|voir)\s*(?:l'|les)?\s*(?:entretien|maintenance)/i, action: () => this.navigateTo('maintenance', 'Ouverture de l\'entretien') },
                    { regex: /(?:ouvrir|afficher|aller|voir)\s*(?:les)?\s*documents?/i, action: () => this.navigateTo('documents', 'Ouverture des documents') },
                    { regex: /(?:ouvrir|afficher|aller|voir)\s*(?:les)?\s*fournisseurs?/i, action: () => this.navigateTo('providers', 'Ouverture des fournisseurs') },
                    { regex: /(?:ouvrir|afficher|aller|voir)\s*(?:les)?\s*paramètres?/i, action: () => this.navigateTo('settings', 'Ouverture des paramètres') },
                ],
            },
            information: {
                patterns: [
                    { regex: /combien\s*(?:de|d')?\s*véhicules?/i, action: () => this.getVehicleCount() },
                    { regex: /(?:quel|quels)\s*(?:est|sont)\s*(?:le|les)?\s*(?:prochain|prochains)\s*entretiens?/i, action: () => this.getNextMaintenance() },
                    { regex: /(?:combien|quel)\s*(?:coute|coûte|est\s*le\s*cout|est\s*le\s*coût)/i, action: () => this.getTotalCosts() },
                ],
            },
            control: {
                patterns: [
                    { regex: /(?:arrête|arrêter|stop|fer(?:me|mer)|termine|terminer)/i, action: () => this.stopListening() },
                    { regex: /aide|help|qu'est-ce\s*que\s*tu\s*peux\s*faire/i, action: () => this.showHelp() },
                ],
            },
        };
    }

    /**
     * Start listening for voice commands
     */
    startListening() {
        if (!this.isSupported) {
            this.speak('Assistant vocal non supporté sur ce navigateur');
            return false;
        }

        if (this.isListening) {
            return false;
        }

        try {
            this.shouldContinueListening = false;
            this.recognition.start();
            return true;
        } catch (error) {
            console.error('Erreur démarrage reconnaissance:', error);
            this.updateUI('error', 'Impossible de démarrer le microphone');
            return false;
        }
    }

    /**
     * Stop listening
     */
    stopListening() {
        if (this.recognition && this.isListening) {
            this.shouldContinueListening = false;
            this.recognition.stop();
            this.speak('Assistant vocal arrêté');
        }
        this.updateUI('idle');
    }

    /**
     * Process recognized command
     */
    processCommand(transcript) {
        let commandFound = false;

        // Check all command categories
        for (const category in this.commands) {
            const patterns = this.commands[category].patterns;

            for (const pattern of patterns) {
                if (pattern.regex.test(transcript)) {
                    pattern.action();
                    commandFound = true;
                    break;
                }
            }

            if (commandFound) break;
        }

        if (!commandFound) {
            this.speak('Commande non reconnue. Dites "aide" pour voir les commandes disponibles.');
            this.updateUI('error', 'Commande non reconnue: ' + transcript);
        }
    }

    /**
     * Navigate to a specific view
     */
    navigateTo(viewName, message) {
        // Trigger navigation
        const navItem = document.querySelector(`.nav-links li[data-view="${viewName}"]`);
        if (navItem) {
            navItem.click();
            this.speak(message);
            this.updateUI('success', message);
        } else {
            this.speak('Impossible d\'ouvrir cette section');
            this.updateUI('error', 'Section non trouvée');
        }

        setTimeout(() => this.stopListening(), 1500);
    }

    /**
     * Get vehicle count
     */
    getVehicleCount() {
        if (window.StorageManager) {
            const vehicles = window.StorageManager.getVehicles();
            const count = vehicles.length;
            const message = count === 0
                ? 'Vous n\'avez aucun véhicule enregistré'
                : count === 1
                    ? 'Vous avez un véhicule enregistré'
                    : `Vous avez ${count} véhicules enregistrés`;

            this.speak(message);
            this.updateUI('success', message);
        } else {
            this.speak('Impossible de récupérer les informations');
            this.updateUI('error', 'Module non disponible');
        }

        setTimeout(() => this.stopListening(), 2000);
    }

    /**
     * Get next maintenance
     */
    getNextMaintenance() {
        if (window.StorageManager) {
            const maintenances = window.StorageManager.getMaintenances();

            // Find upcoming maintenance
            const upcoming = maintenances
                .filter(m => new Date(m.date) > new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date));

            let message;
            if (upcoming.length === 0) {
                message = 'Aucun entretien prévu';
            } else {
                const next = upcoming[0];
                const date = new Date(next.date).toLocaleDateString('fr-FR');
                message = `Prochain entretien: ${next.type} le ${date}`;
            }

            this.speak(message);
            this.updateUI('success', message);
        } else {
            this.speak('Impossible de récupérer les entretiens');
            this.updateUI('error', 'Module non disponible');
        }

        setTimeout(() => this.stopListening(), 3000);
    }

    /**
     * Get total costs
     */
    getTotalCosts() {
        if (window.StorageManager) {
            const maintenances = window.StorageManager.getMaintenances();
            const total = maintenances.reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0);
            const message = `Le coût total des entretiens est de ${total.toFixed(2)} dirhams`;

            this.speak(message);
            this.updateUI('success', message);
        } else {
            this.speak('Impossible de calculer les coûts');
            this.updateUI('error', 'Module non disponible');
        }

        setTimeout(() => this.stopListening(), 2000);
    }

    /**
     * Show help
     */
    showHelp() {
        const message = 'Vous pouvez dire: ouvrir véhicules, combien de véhicules, prochain entretien, ou arrêter.';
        this.speak(message);
        this.updateUI('info', message);
        setTimeout(() => this.stopListening(), 4000);
    }

    /**
     * Speak text using text-to-speech
     */
    speak(text) {
        if (!this.synthesis) return;

        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = this.currentLanguage;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Get French voice if available
        const voices = this.synthesis.getVoices();
        const frenchVoice = voices.find(voice => voice.lang.startsWith('fr'));
        if (frenchVoice) {
            utterance.voice = frenchVoice;
        }

        this.synthesis.speak(utterance);
    }

    /**
     * Update UI elements
     */
    updateUI(state, message = '') {
        const modal = document.getElementById('voice-assistant-modal');
        if (!modal) return;

        const statusEl = modal.querySelector('.voice-status');
        const transcriptEl = modal.querySelector('.voice-transcript');
        const responseEl = modal.querySelector('.voice-response');
        const indicator = modal.querySelector('.voice-indicator');

        if (!statusEl || !transcriptEl || !responseEl || !indicator) return;

        // Update indicator
        indicator.className = `voice-indicator ${state}`;

        // Update status text
        const statusTexts = {
            idle: '🎤 Prêt à écouter',
            listening: '🎤 En écoute...',
            processing: '⚙️ Traitement...',
            success: '✅ Commande exécutée',
            error: '❌ Erreur',
            info: 'ℹ️ Information',
        };

        statusEl.textContent = statusTexts[state] || statusTexts.idle;

        // Update transcript and response
        if (state === 'processing' || state === 'error') {
            transcriptEl.textContent = message;
            transcriptEl.style.display = message ? 'block' : 'none';
        }

        if (state === 'success' || state === 'info' || state === 'error') {
            responseEl.textContent = message;
            responseEl.style.display = message ? 'block' : 'none';
        }

        // Update button badge
        const voiceBtn = document.getElementById('voice-assistant-btn');
        if (voiceBtn) {
            const badge = voiceBtn.querySelector('.status-badge');
            if (badge) {
                badge.style.display = this.isListening ? 'block' : 'none';
            }
        }
    }

    /**
     * Toggle listening state
     */
    toggle() {
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }
}

// Initialize global instance
window.VoiceAssistant = new VoiceAssistant();
