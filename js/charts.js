// js/charts.js
// ChartsManager uses Chart.js (loaded via CDN) to render advanced statistics on the dashboard.
// It provides two static methods:
//   renderCostOverTime(canvas, data) – line chart of cumulative maintenance cost over time.
//   renderCostByType(canvas, data) – pie chart of cost distribution by maintenance type.

class ChartsManager {
    /**
     * Render a line chart showing total maintenance cost over time.
     * @param {HTMLCanvasElement} canvas - The canvas element to render into.
     * @param {Array} records - Array of maintenance records {date, cost, type}.
     */
    static renderCostOverTime(canvas, records) {
        if (!canvas || !records || records.length === 0) {
            // Show empty state
            canvas.parentElement.innerHTML = '<div class="empty-chart"><p>📊 Aucune donnée d\'entretien</p><p class="sub-text">Ajoutez des entretiens pour voir les statistiques</p></div>';
            return;
        }

        // Sort records by date ascending
        const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));

        // Aggregate cumulative cost per day
        const map = {};
        let cumulative = 0;
        sorted.forEach(rec => {
            const d = new Date(rec.date).toLocaleDateString('fr-FR');
            cumulative += parseFloat(rec.cost) || 0;
            map[d] = cumulative;
        });

        const labels = Object.keys(map);
        const data = Object.values(map);

        new Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Coût cumulé',
                    data,
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: '#3b82f6',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverBackgroundColor: '#2563eb',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            font: { size: 13, weight: '600' },
                            padding: 15,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        padding: 12,
                        titleFont: { size: 14, weight: '600' },
                        bodyFont: { size: 13 },
                        cornerRadius: 8,
                        displayColors: false,
                        callbacks: {
                            label: (context) => `Coût total: ${context.parsed.y.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}`
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false },
                        ticks: { font: { size: 11 } }
                    },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0, 0, 0, 0.05)' },
                        ticks: {
                            font: { size: 11 },
                            callback: (value) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    /**
     * Render a pie chart showing cost distribution by maintenance type.
     * @param {HTMLCanvasElement} canvas - The canvas element to render into.
     * @param {Array} records - Array of maintenance records {type, cost}.
     */
    static renderCostByType(canvas, records) {
        if (!canvas || !records || records.length === 0) {
            canvas.parentElement.innerHTML = '<div class="empty-chart"><p>📊 Aucune donnée d\'entretien</p><p class="sub-text">Ajoutez des entretiens pour voir la répartition</p></div>';
            return;
        }

        const typeMap = {};
        records.forEach(rec => {
            const type = rec.type || 'Autre';
            const cost = parseFloat(rec.cost) || 0;
            typeMap[type] = (typeMap[type] || 0) + cost;
        });

        const labels = Object.keys(typeMap);
        const data = Object.values(typeMap);

        // Modern color palette
        const backgroundColors = [
            '#3b82f6', // Blue
            '#8b5cf6', // Purple
            '#ec4899', // Pink
            '#f59e0b', // Amber
            '#10b981', // Green
            '#06b6d4', // Cyan
            '#f97316', // Orange
            '#6366f1'  // Indigo
        ];

        new Chart(canvas.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: backgroundColors.slice(0, labels.length),
                    borderWidth: 3,
                    borderColor: '#fff',
                    hoverBorderWidth: 4,
                    hoverBorderColor: '#fff',
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 12, weight: '600' },
                            padding: 15,
                            usePointStyle: true,
                            pointStyle: 'circle'
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.95)',
                        padding: 12,
                        titleFont: { size: 14, weight: '600' },
                        bodyFont: { size: 13 },
                        cornerRadius: 8,
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ${value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })} (${percentage}%)`;
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }
}

// Export to global namespace for easy access from dashboard.js
window.ChartsManager = ChartsManager;
