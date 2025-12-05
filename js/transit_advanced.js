/**
 * Transit Advanced Features Module
 * Gère les fonctionnalités avancées : favoris, statistiques, gamification, etc.
 */

class TransitAdvancedFeatures {
    constructor(parentManager) {
        this.parent = parentManager;
        this.STORAGE_KEYS = {
            FAVORITES: 'transit_favorites',
            STATISTICS: 'transit_statistics',
            SAVED_ROUTES: 'transit_saved_routes',
            PREFERENCES: 'transit_preferences',
            BADGES: 'transit_badges',
            POINTS: 'transit_points'
        };
    }

    // ==================== FAVORITES ====================

    loadFavorites() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.FAVORITES);
        return stored ? JSON.parse(stored) : [];
    }

    saveFavorites(favorites) {
        localStorage.setItem(this.STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    }

    addFavorite(stop) {
        const favorites = this.loadFavorites();
        const exists = favorites.find(f => f.lat === stop.lat && f.lng === stop.lng);

        if (!exists) {
            favorites.push({
                name: stop.name,
                lat: stop.lat,
                lng: stop.lng,
                lines: stop.lines || [],
                addedAt: new Date().toISOString()
            });
            this.saveFavorites(favorites);
            this.addPoints(10, 'favorite_added');
            return true;
        }
        return false;
    }

    removeFavorite(lat, lng) {
        let favorites = this.loadFavorites();
        favorites = favorites.filter(f => !(f.lat === lat && f.lng === lng));
        this.saveFavorites(favorites);
    }

    isFavorite(lat, lng) {
        const favorites = this.loadFavorites();
        return favorites.some(f => f.lat === lat && f.lng === lng);
    }

    // ==================== STATISTICS ====================

    loadStatistics() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.STATISTICS);
        return stored ? JSON.parse(stored) : {
            totalTrips: 0,
            totalDistance: 0,
            totalTime: 0,
            co2Saved: 0,
            monthlyData: {},
            lastUpdated: new Date().toISOString()
        };
    }

    saveStatistics(stats) {
        localStorage.setItem(this.STORAGE_KEYS.STATISTICS, JSON.stringify(stats));
    }

    recordTrip(distance, duration) {
        const stats = this.loadStatistics();
        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        stats.totalTrips++;
        stats.totalDistance += distance;
        stats.totalTime += duration;
        // CO2 saved: average car emits 120g CO2/km, bus emits 40g CO2/km per person
        stats.co2Saved += (distance * 0.08); // 80g saved per km
        stats.lastUpdated = now.toISOString();

        // Monthly data
        if (!stats.monthlyData[monthKey]) {
            stats.monthlyData[monthKey] = {
                trips: 0,
                distance: 0,
                time: 0,
                co2Saved: 0
            };
        }
        stats.monthlyData[monthKey].trips++;
        stats.monthlyData[monthKey].distance += distance;
        stats.monthlyData[monthKey].time += duration;
        stats.monthlyData[monthKey].co2Saved += (distance * 0.08);

        this.saveStatistics(stats);
        this.addPoints(5, 'trip_completed');
        this.checkBadges();
    }

    // ==================== SAVED ROUTES ====================

    loadSavedRoutes() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.SAVED_ROUTES);
        return stored ? JSON.parse(stored) : [];
    }

    saveSavedRoutes(routes) {
        localStorage.setItem(this.STORAGE_KEYS.SAVED_ROUTES, JSON.stringify(routes));
    }

    addSavedRoute(from, to, routeData) {
        const routes = this.loadSavedRoutes();
        const existing = routes.find(r => r.from === from && r.to === to);

        if (existing) {
            existing.usageCount++;
            existing.lastUsed = new Date().toISOString();
        } else {
            routes.push({
                from,
                to,
                routeData,
                usageCount: 1,
                createdAt: new Date().toISOString(),
                lastUsed: new Date().toISOString()
            });
        }

        this.saveSavedRoutes(routes);
    }

    getFrequentRoutes(limit = 5) {
        const routes = this.loadSavedRoutes();
        return routes
            .sort((a, b) => b.usageCount - a.usageCount)
            .slice(0, limit);
    }

    // ==================== PREFERENCES ====================

    loadPreferences() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.PREFERENCES);
        return stored ? JSON.parse(stored) : {
            accessibilityMode: false,
            showCalories: true,
            preferCoveredStops: false,
            language: 'fr'
        };
    }

    savePreferences(prefs) {
        localStorage.setItem(this.STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
    }

    updatePreference(key, value) {
        const prefs = this.loadPreferences();
        prefs[key] = value;
        this.savePreferences(prefs);
    }

    // ==================== GAMIFICATION ====================

    loadBadges() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.BADGES);
        return stored ? JSON.parse(stored) : [];
    }

    saveBadges(badges) {
        localStorage.setItem(this.STORAGE_KEYS.BADGES, JSON.stringify(badges));
    }

    loadPoints() {
        const stored = localStorage.getItem(this.STORAGE_KEYS.POINTS);
        return stored ? parseInt(stored) : 0;
    }

    savePoints(points) {
        localStorage.setItem(this.STORAGE_KEYS.POINTS, points.toString());
    }

    addPoints(amount, reason) {
        const currentPoints = this.loadPoints();
        const newPoints = currentPoints + amount;
        this.savePoints(newPoints);
        this.checkBadges();
        return newPoints;
    }

    checkBadges() {
        const stats = this.loadStatistics();
        const badges = this.loadBadges();
        const newBadges = [];

        const badgeDefinitions = [
            { id: 'first_trip', name: 'Premier Voyage', condition: stats.totalTrips >= 1, icon: '🎫', points: 50 },
            { id: 'eco_warrior', name: 'Éco-Guerrier', condition: stats.co2Saved >= 10, icon: '🌱', points: 100 },
            { id: 'regular', name: 'Habitué', condition: stats.totalTrips >= 10, icon: '🚌', points: 150 },
            { id: 'explorer', name: 'Explorateur', condition: stats.totalDistance >= 50, icon: '🗺️', points: 200 },
            { id: 'veteran', name: 'Vétéran', condition: stats.totalTrips >= 50, icon: '⭐', points: 500 },
            { id: 'planet_saver', name: 'Sauveur de Planète', condition: stats.co2Saved >= 100, icon: '🌍', points: 1000 }
        ];

        badgeDefinitions.forEach(def => {
            if (def.condition && !badges.find(b => b.id === def.id)) {
                newBadges.push({
                    ...def,
                    earnedAt: new Date().toISOString()
                });
                this.addPoints(def.points, `badge_${def.id}`);
            }
        });

        if (newBadges.length > 0) {
            this.saveBadges([...badges, ...newBadges]);
            return newBadges;
        }
        return [];
    }

    // ==================== ROUTE PLANNER ====================

    planRoute(fromLat, fromLng, toLat, toLng) {
        // Find all possible routes
        const routes = [];
        const maxWalkDistance = 500; // meters

        // Find nearby stops from origin
        const nearbyFromStops = this.parent.findNearbyStops(fromLat, fromLng, maxWalkDistance);
        const nearbyToStops = this.parent.findNearbyStops(toLat, toLng, maxWalkDistance);

        nearbyFromStops.forEach(fromStop => {
            nearbyToStops.forEach(toStop => {
                // Find common lines
                const commonLines = fromStop.lines.filter(fromLine =>
                    toStop.lines.some(toLine => toLine.id === fromLine.id)
                );

                commonLines.forEach(line => {
                    const walkToStop = fromStop.distance;
                    const walkFromStop = toStop.distance;
                    const busDistance = this.parent.calculateDistance(
                        fromStop.lat, fromStop.lng,
                        toStop.lat, toStop.lng
                    );

                    const totalDistance = walkToStop + busDistance + walkFromStop;
                    const walkTime = (walkToStop + walkFromStop) / 80; // 80m/min walking speed
                    const busTime = busDistance / 250; // 250m/min average bus speed
                    const waitTime = this.parent.estimateNextBusArrival(line.frequency);
                    const totalTime = walkTime + busTime + waitTime;

                    // Calculate calories (walking: 4 cal/min)
                    const calories = Math.round(walkTime * 4);

                    routes.push({
                        fromStop: fromStop.name,
                        toStop: toStop.name,
                        line: line,
                        walkToStop: Math.round(walkToStop),
                        walkFromStop: Math.round(walkFromStop),
                        busDistance: Math.round(busDistance),
                        totalDistance: Math.round(totalDistance),
                        totalTime: Math.round(totalTime),
                        waitTime: Math.round(waitTime),
                        calories,
                        steps: [
                            { type: 'walk', distance: walkToStop, duration: walkToStop / 80, to: fromStop.name },
                            { type: 'wait', duration: waitTime, line: line.number },
                            { type: 'bus', line: line, distance: busDistance, duration: busTime, from: fromStop.name, to: toStop.name },
                            { type: 'walk', distance: walkFromStop, duration: walkFromStop / 80, to: 'Destination' }
                        ]
                    });
                });
            });
        });

        // Sort by total time
        return routes.sort((a, b) => a.totalTime - b.totalTime).slice(0, 3);
    }
}

// Export
window.TransitAdvancedFeatures = TransitAdvancedFeatures;

console.log('✅ Transit Advanced Features loaded');
