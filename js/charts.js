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
        if (!canvas || !records) return;
        // Sort records by date ascending
        const sorted = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));
        // Aggregate cumulative cost per day
        const map = {};
        let cumulative = 0;
        sorted.forEach(rec => {
            const d = new Date(rec.date).toISOString().split('T')[0]; // YYYY-MM-DD
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
                    label: 'Coût cumulé (€)',
                    data,
                    borderColor: 'var(--primary-color)',
                    backgroundColor: 'rgba(37,99,235,0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { title: { display: true, text: 'Date' } },
                    y: { title: { display: true, text: 'Coût (€)' } }
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
        if (!canvas || !records) return;
        const typeMap = {};
        records.forEach(rec => {
            const type = rec.type || 'Autre';
            const cost = parseFloat(rec.cost) || 0;
            typeMap[type] = (typeMap[type] || 0) + cost;
        });
        const labels = Object.keys(typeMap);
        const data = Object.values(typeMap);
        const backgroundColors = labels.map((_, i) => {
            // Generate a color palette based on index
            const hue = (i * 60) % 360;
            return `hsl(${hue}, 70%, 60%)`;
        });
        new Chart(canvas.getContext('2d'), {
            type: 'pie',
            data: {
                labels,
                datasets: [{ data, backgroundColor: backgroundColors }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' }
                }
            }
        });
    }
}

// Export to global namespace for easy access from dashboard.js
window.ChartsManager = ChartsManager;
