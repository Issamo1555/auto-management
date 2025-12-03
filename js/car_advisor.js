/**
 * Car Advisor Module
 * Gère le wizard, la collecte des besoins et le scoring des véhicules
 */

class CarAdvisor {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.userPreferences = {
            budget: 150000,
            type_achat: 'occasion', // neuf, occasion, indifferent
            usage: 'mixte',
            km_annuel: '10-20k',
            carburant: [],
            transmission: [],
            places: 5,
            marques: []
        };
        this.selectedForComparison = new Set();

        // Bind methods
        this.init = this.init.bind(this);
        this.renderStep = this.renderStep.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.selectOption = this.selectOption.bind(this);
        this.exportAdvice = this.exportAdvice.bind(this);
        this.toggleComparison = this.toggleComparison.bind(this);
        this.openComparator = this.openComparator.bind(this);
        this.updateFab = this.updateFab.bind(this);
    }

    init() {
        console.log("Car Advisor Initialized");

        // Event Listeners
        const btnNext = document.getElementById('btn-advisor-next');
        const btnPrev = document.getElementById('btn-advisor-prev');
        const menuLink = document.querySelector('li[data-view="car-advisor"]');

        if (btnNext) btnNext.addEventListener('click', this.handleNext);
        if (btnPrev) btnPrev.addEventListener('click', this.handlePrev);

        if (menuLink) {
            menuLink.addEventListener('click', () => {
                this.openModal();
            });
        }

        // Initial Render
        this.renderStep(1);

        // Add Floating Action Button for Comparator
        if (!document.getElementById('fab-compare')) {
            const fab = document.createElement('div');
            fab.id = 'fab-compare';
            fab.className = 'fab-compare hidden';
            fab.innerHTML = '<span>⚖️ Comparer (0)</span>';
            fab.onclick = this.openComparator;
            document.body.appendChild(fab);
        }
    }

    openModal() {
        const modal = document.getElementById('modal-car-advisor');
        if (modal) {
            modal.classList.remove('hidden');
            this.currentStep = 1;
            this.renderStep(1);
            this.updateButtons();
        }
    }

    updateButtons() {
        const btnNext = document.getElementById('btn-advisor-next');
        const btnPrev = document.getElementById('btn-advisor-prev');

        if (btnPrev) btnPrev.disabled = this.currentStep === 1;

        if (btnNext) {
            if (this.currentStep === this.totalSteps) {
                btnNext.textContent = "🔍 Analyser";
                btnNext.classList.add('btn-success');
            } else {
                btnNext.textContent = "Suivant";
                btnNext.classList.remove('btn-success');
            }
        }

        // Update Progress Bar
        const progressFill = document.getElementById('advisor-progress-fill');
        if (progressFill) {
            const percent = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${percent}%`;
        }

        // Update Steps UI
        document.querySelectorAll('.advisor-progress .step').forEach(el => {
            const stepNum = parseInt(el.dataset.step);
            if (stepNum === this.currentStep) el.classList.add('active');
            else el.classList.remove('active');
        });
    }

    handleNext() {
        // Collect data from current step
        this.collectStepData(this.currentStep);

        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.renderStep(this.currentStep);
        } else {
            this.showResults();
        }
        this.updateButtons();
    }

    handlePrev() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.renderStep(this.currentStep);
            this.updateButtons();
        }
    }

    collectStepData(step) {
        if (step === 1) {
            const budgetInput = document.getElementById('advisor-budget');
            if (budgetInput) this.userPreferences.budget = parseInt(budgetInput.value);

            // Type achat is handled by click selection
        }
        // Other steps data collection is handled by immediate selection or similar logic
    }

    selectOption(key, value, element) {
        // Handle single selection
        if (key === 'usage' || key === 'type_achat' || key === 'km_annuel') {
            this.userPreferences[key] = value;
            // Visual update
            const parent = element.closest('.options-grid');
            parent.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            element.classList.add('selected');
        }
        // Handle multi selection (arrays)
        else if (Array.isArray(this.userPreferences[key])) {
            const index = this.userPreferences[key].indexOf(value);
            if (index === -1) {
                this.userPreferences[key].push(value);
                element.classList.add('selected');
            } else {
                this.userPreferences[key].splice(index, 1);
                element.classList.remove('selected');
            }
        }
    }

    renderStep(step) {
        const container = document.getElementById('advisor-content');
        if (!container) return;

        let html = '';

        switch (step) {
            case 1: // Budget & Type
                html = `
                    <div class="advisor-step active">
                        <h3 class="step-title">Quel est votre budget ?</h3>
                        <p class="step-subtitle">Définissez votre fourchette de prix et le type de véhicule.</p>
                        
                        <div class="form-group" style="margin-bottom: 2rem;">
                            <label style="font-size: 1.2rem; margin-bottom: 1rem;">Budget Maximum: <span id="budget-display" style="color: var(--primary-color); font-weight: bold;">${this.userPreferences.budget.toLocaleString()} DH</span></label>
                            <input type="range" id="advisor-budget" min="50000" max="1000000" step="10000" value="${this.userPreferences.budget}" 
                                oninput="document.getElementById('budget-display').textContent = parseInt(this.value).toLocaleString() + ' DH'">
                            <div class="range-labels">
                                <span>50k DH</span>
                                <span>1M+ DH</span>
                            </div>
                        </div>

                        <h4 style="margin-bottom: 1rem;">Type de véhicule</h4>
                        <div class="options-grid">
                            <div class="option-card ${this.userPreferences.type_achat === 'neuf' ? 'selected' : ''}" onclick="window.carAdvisor.selectOption('type_achat', 'neuf', this)">
                                <span class="option-icon">✨</span>
                                <span class="option-label">Neuf</span>
                                <span class="option-desc">Garantie constructeur, 0 km</span>
                            </div>
                            <div class="option-card ${this.userPreferences.type_achat === 'occasion' ? 'selected' : ''}" onclick="window.carAdvisor.selectOption('type_achat', 'occasion', this)">
                                <span class="option-icon">🔄</span>
                                <span class="option-label">Occasion</span>
                                <span class="option-desc">Meilleur rapport qualité/prix</span>
                            </div>
                            <div class="option-card ${this.userPreferences.type_achat === 'indifferent' ? 'selected' : ''}" onclick="window.carAdvisor.selectOption('type_achat', 'indifferent', this)">
                                <span class="option-icon">🤷‍♂️</span>
                                <span class="option-label">Peu importe</span>
                                <span class="option-desc">Je veux juste la meilleure affaire</span>
                            </div>
                        </div>
                    </div>
                `;
                break;

            case 2: // Usage
                html = `
                    <div class="advisor-step active">
                        <h3 class="step-title">Comment allez-vous l'utiliser ?</h3>
                        <p class="step-subtitle">Pour adapter la motorisation et le confort.</p>
                        
                        <div class="options-grid">
                            <div class="option-card ${this.userPreferences.usage === 'ville' ? 'selected' : ''}" onclick="window.carAdvisor.selectOption('usage', 'ville', this)">
                                <span class="option-icon">🏙️</span>
                                <span class="option-label">Ville</span>
                                <span class="option-desc">Trajets courts, bouchons, stationnement</span>
                            </div>
                            <div class="option-card ${this.userPreferences.usage === 'route' ? 'selected' : ''}" onclick="window.carAdvisor.selectOption('usage', 'route', this)">
                                <span class="option-icon">🛣️</span>
                                <span class="option-label">Autoroute</span>
                                <span class="option-desc">Longs trajets, stabilité, confort</span>
                            </div>
                            <div class="option-card ${this.userPreferences.usage === 'mixte' ? 'selected' : ''}" onclick="window.carAdvisor.selectOption('usage', 'mixte', this)">
                                <span class="option-icon">⚖️</span>
                                <span class="option-label">Mixte</span>
                                <span class="option-desc">Un peu des deux</span>
                            </div>
                            <div class="option-card ${this.userPreferences.usage === 'famille' ? 'selected' : ''}" onclick="window.carAdvisor.selectOption('usage', 'famille', this)">
                                <span class="option-icon">👨‍👩‍👧‍👦</span>
                                <span class="option-label">Famille</span>
                                <span class="option-desc">Espace, sécurité, coffre</span>
                            </div>
                        </div>
                    </div>
                `;
                break;

            case 3: // Tech
                html = `
                    <div class="advisor-step active">
                        <h3 class="step-title">Préférences Techniques</h3>
                        <p class="step-subtitle">Sélectionnez vos indispensables (plusieurs choix possibles).</p>
                        
                        <h4 style="margin-bottom: 1rem;">Carburant</h4>
                        <div class="options-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); margin-bottom: 2rem;">
                            <div class="option-card ${this.userPreferences.carburant.includes('Diesel') ? 'selected' : ''}" onclick="window.carAdvisor.selectOption('carburant', 'Diesel', this)">
                                <span class="option-label">Diesel</span>
                            </div>
                            <div class="option-card ${this.userPreferences.carburant.includes('Essence') ? 'selected' : ''}" onclick="window.carAdvisor.selectOption('carburant', 'Essence', this)">
                                <span class="option-label">Essence</span>
                            </div>
                            <div class="option-card ${this.userPreferences.carburant.includes('Hybride') ? 'selected' : ''}" onclick="window.carAdvisor.selectOption('carburant', 'Hybride', this)">
                                <span class="option-label">Hybride</span>
                            </div>
                        </div>

                        <h4 style="margin-bottom: 1rem;">Transmission</h4>
                        <div class="options-grid" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
                            <div class="option-card ${this.userPreferences.transmission.includes('Automatique') ? 'selected' : ''}" onclick="window.carAdvisor.selectOption('transmission', 'Automatique', this)">
                                <span class="option-label">Automatique</span>
                            </div>
                            <div class="option-card ${this.userPreferences.transmission.includes('Manuelle') ? 'selected' : ''}" onclick="window.carAdvisor.selectOption('transmission', 'Manuelle', this)">
                                <span class="option-label">Manuelle</span>
                            </div>
                        </div>
                    </div>
                `;
                break;

            case 4: // Preferences (Marques)
                html = `
                    <div class="advisor-step active">
                        <h3 class="step-title">Derniers détails</h3>
                        <p class="step-subtitle">Avez-vous des préférences de marque ?</p>
                        
                        <div class="options-grid" style="grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));">
                            ${['Dacia', 'Renault', 'Peugeot', 'Hyundai', 'Volkswagen', 'BMW', 'Mercedes', 'Toyota'].map(brand => `
                                <div class="option-card ${this.userPreferences.marques.includes(brand) ? 'selected' : ''}" onclick="window.carAdvisor.selectOption('marques', '${brand}', this)">
                                    <span class="option-label">${brand}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                break;
        }

        container.innerHTML = html;
    }

    calculateScores() {
        const results = window.VEHICLES_DATABASE.map(car => {
            let score = 0;
            let maxScore = 0;

            // 1. Budget Filter (Hard or Soft)
            // On vérifie si le prix rentre dans le budget
            let price = 0;
            if (this.userPreferences.type_achat === 'neuf') {
                price = car.prix_neuf.min;
            } else {
                // Moyenne occasion 2-5 ans
                price = car.prix_occasion["2-5 ans"] || car.prix_occasion["< 2 ans"];
            }

            // Si hors budget > 20%, on exclut (score = -1)
            if (price > this.userPreferences.budget * 1.2) return { ...car, score: 0, match: 0 };

            // Score Budget (30 points)
            if (price <= this.userPreferences.budget) score += 30;
            else score += 15; // Un peu au dessus
            maxScore += 30;

            // 2. Usage Score (30 points)
            const usageKey = this.userPreferences.usage; // ville, route, famille...
            if (car.scoring[usageKey]) {
                score += car.scoring[usageKey] * 3; // Note sur 10 * 3
            }
            maxScore += 30;

            // 3. Tech Matches (20 points)
            // Carburant
            if (this.userPreferences.carburant.length > 0) {
                const hasFuel = this.userPreferences.carburant.some(f => car.carburant.includes(f));
                if (hasFuel) score += 10;
            } else {
                score += 10; // Pas de pref
            }
            // Transmission
            if (this.userPreferences.transmission.length > 0) {
                const hasTrans = this.userPreferences.transmission.some(t => car.transmission.includes(t));
                if (hasTrans) score += 10;
            } else {
                score += 10;
            }
            maxScore += 20;

            // 4. Marque Preference (20 points)
            if (this.userPreferences.marques.length > 0) {
                if (this.userPreferences.marques.includes(car.marque)) score += 20;
            } else {
                score += 20; // Pas de pref
            }
            maxScore += 20;

            const matchPercent = Math.round((score / maxScore) * 100);
            return { ...car, score, match: matchPercent, estimatedPrice: price };
        });

        // Filter out zero matches and sort
        return results
            .filter(r => r.match > 0)
            .sort((a, b) => b.match - a.match)
            .slice(0, 5); // Top 5
    }

    showResults() {
        const recommendations = this.calculateScores();
        const container = document.getElementById('advisor-content');

        // Hide next button, show restart or close
        document.getElementById('btn-advisor-next').style.display = 'none';
        document.getElementById('btn-advisor-prev').textContent = "🔄 Recommencer";
        document.getElementById('btn-advisor-prev').onclick = () => {
            this.currentStep = 1;
            this.renderStep(1);
            this.updateButtons();
            document.getElementById('btn-advisor-next').style.display = 'block';
            document.getElementById('btn-advisor-prev').onclick = this.handlePrev; // Reset handler
        };

        if (recommendations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">😕</div>
                    <h3>Aucun résultat trouvé</h3>
                    <p>Essayez d'augmenter votre budget ou d'élargir vos critères.</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="results-header" style="margin-bottom: 2rem;">
                <h3 class="step-title">🏆 Vos meilleures options</h3>
                <p class="step-subtitle">Basé sur un budget de ${this.userPreferences.budget.toLocaleString()} DH</p>
                
                <div id="ai-advice-container" style="margin-top: 1rem; padding: 1rem; background: #f0f9ff; border-radius: 12px; border: 1px solid #bae6fd; display: none;">
                    <h4 style="color: #0369a1; margin-bottom: 0.5rem;">💡 L'avis de l'Expert IA</h4>
                    <p id="ai-advice-text" style="color: #0c4a6e; line-height: 1.5;">Chargement de l'analyse...</p>
                </div>

                <button id="btn-ask-ai" class="btn btn-primary" style="margin-top: 1rem; width: 100%; justify-content: center; background: linear-gradient(135deg, #6366f1, #8b5cf6);">
                    ✨ Demander l'avis de l'IA
                </button>
                <button id="btn-export-pdf" class="btn btn-secondary" style="margin-top: 0.5rem; width: 100%; justify-content: center;">
                    📄 Exporter en PDF
                </button>
            </div>
            <div class="results-list">
        `;

        recommendations.forEach(car => {
            const avitoLink = `https://www.avito.ma/fr/maroc/voitures-${car.marque.toLowerCase()}_${car.modele.toLowerCase()}--à_vendre?price_max=${this.userPreferences.budget}`;
            const moteurLink = `https://www.moteur.ma/fr/voiture/neuf/${car.marque.toLowerCase()}/${car.modele.toLowerCase()}`;

            html += `
                <div class="recommendation-card">
                    <div class="rec-header">
                        <span class="vehicle-title">${car.marque} ${car.modele}</span>
                        <span class="rec-match-badge">${car.match}% Match</span>
                    </div>
                    <div class="rec-body">
                        <div class="rec-details">
                            <div class="rec-price">~${car.estimatedPrice.toLocaleString()} DH</div>
                            
                            <div class="rec-specs">
                                <span class="spec-item">⛽ ${car.carburant.join('/')}</span>
                                <span class="spec-item">⚙️ ${car.transmission.join('/')}</span>
                                <span class="spec-item">📦 ${car.coffre}L</span>
                                <span class="spec-item">⛽ ${car.consommation.mixte}L/100</span>
                            </div>

                            <div class="rec-scores">
                                <span class="score-badge">Ville: ${car.scoring.ville}/10</span>
                                <span class="score-badge">Route: ${car.scoring.route}/10</span>
                                <span class="score-badge">Eco: ${car.scoring.economie}/10</span>
                            </div>
                        </div>
                    </div>
                    <div class="rec-actions">
                        <label class="compare-checkbox" style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; cursor: pointer;">
                            <input type="checkbox" onchange="window.carAdvisor.toggleComparison('${car.id}', this)" ${this.selectedForComparison.has(car.id) ? 'checked' : ''}>
                            Comparer
                        </label>
                        <a href="${avitoLink}" target="_blank" class="btn btn-primary">Voir sur Avito</a>
                        <a href="https://www.facebook.com/marketplace/search/?query=${car.marque}%20${car.modele}&maxPrice=${this.userPreferences.budget}" target="_blank" class="btn btn-secondary" style="background-color: #e7f5ff; color: #1877f2; border-color: #1877f2;">Facebook</a>
                        <a href="https://www.google.com/maps/search/Concessionnaire+${car.marque}" target="_blank" class="btn btn-secondary">📍 Concessionnaire</a>
                        <a href="${moteurLink}" target="_blank" class="btn btn-secondary" style="font-size: 0.9rem;">ℹ️ Fiche</a>
                    </div>
                </div>
            `;
        });

        html += '</div>';
        container.innerHTML = html;

        // Add Event Listener for AI Button
        setTimeout(() => {
            const btnAI = document.getElementById('btn-ask-ai');
            if (btnAI) {
                btnAI.onclick = async () => {
                    btnAI.disabled = true;
                    btnAI.textContent = "⏳ Analyse en cours...";

                    const adviceContainer = document.getElementById('ai-advice-container');
                    adviceContainer.style.display = 'block';

                    if (window.AIService) {
                        const advice = await window.AIService.getCarAdvice(this.userPreferences, recommendations);
                        document.getElementById('ai-advice-text').textContent = advice;
                        btnAI.style.display = 'none';
                    }
                };
            }
        }, 100);

        // Add Event Listener for Export Button
        setTimeout(() => {
            const btnExport = document.getElementById('btn-export-pdf');
            if (btnExport) {
                btnExport.onclick = () => this.exportAdvice(recommendations);
            }
        }, 100);
    }

    async exportAdvice(recommendations) {
        try {
            // Check for jsPDF in multiple possible locations
            let jsPDF;
            if (window.jspdf && window.jspdf.jsPDF) {
                jsPDF = window.jspdf.jsPDF;
            } else if (window.jsPDF) {
                jsPDF = window.jsPDF;
            } else {
                alert("❌ Erreur: La librairie PDF n'est pas chargée.\n\nVeuillez recharger la page et réessayer.");
                console.error("jsPDF not found. Checked window.jspdf.jsPDF and window.jsPDF");
                return;
            }

            const doc = new jsPDF();

            // Header
            doc.setFontSize(20);
            doc.setTextColor(37, 99, 235); // Primary Blue
            doc.text("AutoManager - Conseil d'Achat", 20, 20);

            doc.setFontSize(12);
            doc.setTextColor(100);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 30);

            // User Criteria
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text("Vos Critères", 20, 45);

            doc.setFontSize(10);
            doc.setTextColor(80);
            let y = 55;
            doc.text(`Budget: ${this.userPreferences.budget.toLocaleString()} DH`, 25, y); y += 7;
            doc.text(`Usage: ${this.userPreferences.usage}`, 25, y); y += 7;
            doc.text(`Type: ${this.userPreferences.type_achat}`, 25, y); y += 7;
            doc.text(`Préférences: ${this.userPreferences.marques.join(', ') || 'Aucune'}`, 25, y); y += 15;

            // Recommendations
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text("Recommandations", 20, y);
            y += 10;

            recommendations.forEach((car, index) => {
                if (y > 250) {
                    doc.addPage();
                    y = 20;
                }

                doc.setFontSize(12);
                doc.setTextColor(0);
                doc.text(`${index + 1}. ${car.marque} ${car.modele} (${car.match}% Match)`, 25, y);
                y += 7;

                doc.setFontSize(10);
                doc.setTextColor(80);
                doc.text(`Prix estimé: ~${car.estimatedPrice.toLocaleString()} DH`, 30, y); y += 5;
                doc.text(`Conso: ${car.consommation.mixte} L/100km | Coffre: ${car.coffre} L`, 30, y); y += 5;
                doc.text(`Scores: Ville ${car.scoring.ville}/10 | Route ${car.scoring.route}/10`, 30, y); y += 10;
            });

            // AI Advice if present
            const aiAdvice = document.getElementById('ai-advice-text');
            if (aiAdvice && aiAdvice.textContent && !aiAdvice.textContent.includes('Chargement')) {
                if (y > 230) {
                    doc.addPage();
                    y = 20;
                }
                doc.setFontSize(14);
                doc.setTextColor(0);
                doc.text("L'avis de l'Expert IA", 20, y);
                y += 10;

                doc.setFontSize(10);
                doc.setTextColor(80);
                const splitText = doc.splitTextToSize(aiAdvice.textContent, 170);
                doc.text(splitText, 25, y);
            }

            doc.save("conseil_achat_automanager.pdf");

            // Show success message
            const btn = document.getElementById('btn-export-pdf');
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = "✅ PDF Téléchargé !";
                btn.style.background = "#10b981";
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = "";
                }, 2000);
            }
        } catch (error) {
            console.error("Error exporting PDF:", error);
            alert(`❌ Erreur lors de l'export PDF:\n${error.message}\n\nVeuillez réessayer ou contacter le support.`);
        }
    }

    toggleComparison(carId, checkbox) {
        if (checkbox.checked) {
            if (this.selectedForComparison.size >= 3) {
                alert("Vous ne pouvez comparer que 3 véhicules maximum.");
                checkbox.checked = false;
                return;
            }
            this.selectedForComparison.add(carId);
        } else {
            this.selectedForComparison.delete(carId);
        }
        this.updateFab();
    }

    updateFab() {
        const fab = document.getElementById('fab-compare');
        const count = this.selectedForComparison.size;
        if (fab) {
            fab.querySelector('span').textContent = `⚖️ Comparer (${count})`;
            if (count > 0) {
                fab.classList.remove('hidden');
            } else {
                fab.classList.add('hidden');
            }
        }
    }

    openComparator() {
        const modal = document.getElementById('modal-comparator');
        const container = document.getElementById('comparator-content');
        const selectedCars = Array.from(this.selectedForComparison).map(id =>
            VEHICLES_DATABASE.find(c => c.id === id)
        );

        if (selectedCars.length === 0) return;

        // Build Table
        let html = `
            <table class="comparator-table">
                <thead>
                    <tr>
                        <th>Caractéristiques</th>
                        ${selectedCars.map(car => `<th>${car.marque} ${car.modele}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>Image</th>
                        ${selectedCars.map(car => `<td><img src="${car.image}"></td>`).join('')}
                    </tr>
                    <tr>
                        <th>Prix (2-5 ans)</th>
                        ${selectedCars.map(car => {
            const price = car.prix_occasion['2-5 ans'];
            const minPrice = Math.min(...selectedCars.map(c => c.prix_occasion['2-5 ans']));
            return `<td class="${price === minPrice ? 'cell-winner' : ''}">${price.toLocaleString()} DH</td>`;
        }).join('')}
                    </tr>
                    <tr>
                        <th>Consommation (Mixte)</th>
                        ${selectedCars.map(car => {
            const cons = car.consommation.mixte;
            const minCons = Math.min(...selectedCars.map(c => c.consommation.mixte));
            return `<td class="${cons === minCons ? 'cell-winner' : ''}">${cons} L/100km</td>`;
        }).join('')}
                    </tr>
                    <tr>
                        <th>Carburant</th>
                        ${selectedCars.map(car => `<td>${car.carburant.join(', ')}</td>`).join('')}
                    </tr>
                    <tr>
                        <th>Transmission</th>
                        ${selectedCars.map(car => `<td>${car.transmission.join(', ')}</td>`).join('')}
                    </tr>
                    <tr>
                        <th>Coffre</th>
                        ${selectedCars.map(car => {
            const coffre = car.coffre;
            const maxCoffre = Math.max(...selectedCars.map(c => c.coffre));
            return `<td class="${coffre === maxCoffre ? 'cell-winner' : ''}">${coffre} L</td>`;
        }).join('')}
                    </tr>
                    <tr>
                        <th>Fiabilité</th>
                        ${selectedCars.map(car => {
            const score = car.scoring.fiabilite;
            const maxScore = Math.max(...selectedCars.map(c => c.scoring.fiabilite));
            return `<td class="${score === maxScore ? 'cell-winner' : ''}">${score}/10</td>`;
        }).join('')}
                    </tr>
                </tbody>
            </table>
        `;

        container.innerHTML = html;
        modal.classList.remove('hidden');
    }

    static renderView(container) {
        if (!window.carAdvisor) {
            window.carAdvisor = new CarAdvisor();
            window.carAdvisor.init();
        }
        window.carAdvisor.openModal();
    }
}

// Expose class to window
window.CarAdvisor = CarAdvisor;

// Initialize instance on load if needed, but App.js handles view loading
window.addEventListener('DOMContentLoaded', () => {
    if (!window.carAdvisor) {
        window.carAdvisor = new CarAdvisor();
        window.carAdvisor.init();
    }
});
