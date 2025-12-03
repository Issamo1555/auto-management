/**
 * Tourism Data - Morocco
 * Database of rental agencies, monuments, and restaurants
 */

// Rental Agencies
window.RentalAgencies = [
    // Marrakech
    {
        id: "rent_mar_001",
        name: "Maroc Auto Location",
        city: "Marrakech",
        types: ["voiture", "moto"],
        vehicles: [
            { type: "voiture", category: "économique", models: ["Dacia Logan", "Renault Clio"], pricePerDay: 250 },
            { type: "voiture", category: "SUV", models: ["Dacia Duster", "Renault Captur"], pricePerDay: 450 },
            { type: "moto", category: "scooter", models: ["Yamaha NMAX", "Honda PCX"], pricePerDay: 200 }
        ],
        rating: 4.5,
        reviews: 120,
        services: ["assurance", "GPS", "livraison", "aéroport"],
        phone: "+212 524-123456",
        address: "Avenue Mohammed V, Guéliz, Marrakech",
        location: { lat: 31.6295, lng: -7.9811 }
    },
    {
        id: "rent_mar_002",
        name: "Atlas Rent",
        city: "Marrakech",
        types: ["voiture", "vélo"],
        vehicles: [
            { type: "voiture", category: "luxe", models: ["Mercedes Classe C", "BMW Série 3"], pricePerDay: 800 },
            { type: "vélo", category: "ville", models: ["VTC Confort"], pricePerDay: 80 },
            { type: "vélo", category: "électrique", models: ["E-Bike Premium"], pricePerDay: 150 }
        ],
        rating: 4.7,
        reviews: 85,
        services: ["assurance", "GPS", "chauffeur", "conciergerie"],
        phone: "+212 524-234567",
        address: "Rue de la Liberté, Hivernage, Marrakech",
        location: { lat: 31.6258, lng: -8.0089 }
    },

    // Casablanca
    {
        id: "rent_cas_001",
        name: "Casa Premium Cars",
        city: "Casablanca",
        types: ["voiture"],
        vehicles: [
            { type: "voiture", category: "économique", models: ["Dacia Sandero", "Peugeot 208"], pricePerDay: 280 },
            { type: "voiture", category: "SUV", models: ["Peugeot 3008", "Nissan Qashqai"], pricePerDay: 500 },
            { type: "voiture", category: "luxe", models: ["Audi A4", "Mercedes Classe E"], pricePerDay: 900 }
        ],
        rating: 4.6,
        reviews: 200,
        services: ["assurance", "GPS", "livraison", "aéroport", "24h"],
        phone: "+212 522-345678",
        address: "Boulevard Zerktouni, Casablanca",
        location: { lat: 33.5731, lng: -7.5898 }
    },
    {
        id: "rent_cas_002",
        name: "Moto Adventures Maroc",
        city: "Casablanca",
        types: ["moto"],
        vehicles: [
            { type: "moto", category: "scooter", models: ["Vespa Primavera"], pricePerDay: 180 },
            { type: "moto", category: "sportive", models: ["Kawasaki Ninja 400"], pricePerDay: 400 },
            { type: "moto", category: "touring", models: ["BMW GS 1200"], pricePerDay: 600 }
        ],
        rating: 4.8,
        reviews: 65,
        services: ["assurance", "équipement", "GPS", "assistance"],
        phone: "+212 522-456789",
        address: "Rue Prince Moulay Abdellah, Casablanca",
        location: { lat: 33.5892, lng: -7.6031 }
    },

    // Agadir
    {
        id: "rent_aga_001",
        name: "Agadir Beach Rentals",
        city: "Agadir",
        types: ["voiture", "vélo", "moto"],
        vehicles: [
            { type: "voiture", category: "économique", models: ["Hyundai i10"], pricePerDay: 220 },
            { type: "vélo", category: "VTT", models: ["VTT Sport"], pricePerDay: 100 },
            { type: "moto", category: "scooter", models: ["Honda SH 125"], pricePerDay: 150 }
        ],
        rating: 4.4,
        reviews: 95,
        services: ["assurance", "GPS", "livraison"],
        phone: "+212 528-567890",
        address: "Boulevard Mohammed V, Agadir",
        location: { lat: 30.4278, lng: -9.5981 }
    }
];

// Historical Monuments
window.HistoricalMonuments = [
    // Marrakech
    {
        id: "monument_mar_001",
        name: "Mosquée Koutoubia",
        city: "Marrakech",
        type: "mosquée",
        period: "XIIe siècle",
        description: "La Koutoubia est le monument emblématique de Marrakech. Son minaret de 77 mètres domine la médina et est visible de loin. Chef-d'œuvre de l'architecture almohade.",
        openingHours: "Extérieur accessible 24h/24",
        entryPrice: "Gratuit (extérieur uniquement)",
        rating: 4.8,
        reviews: 5420,
        visitDuration: "30 min",
        location: { lat: 31.6258, lng: -7.9891 },
        photos: ["koutoubia1.jpg", "koutoubia2.jpg"],
        tips: "Meilleure vue au coucher du soleil. Non-musulmans ne peuvent pas entrer."
    },
    {
        id: "monument_mar_002",
        name: "Palais de la Bahia",
        city: "Marrakech",
        type: "palais",
        period: "XIXe siècle",
        description: "Magnifique palais construit pour être le plus grand de son temps. Jardins luxuriants, cours intérieures et plafonds en bois de cèdre peint.",
        openingHours: "9h-17h (tous les jours)",
        entryPrice: "70 DH",
        rating: 4.6,
        reviews: 3850,
        visitDuration: "1h-1h30",
        location: { lat: 31.6214, lng: -7.9831 },
        photos: ["bahia1.jpg", "bahia2.jpg"],
        tips: "Arriver tôt le matin pour éviter la foule. Guide recommandé."
    },
    {
        id: "monument_mar_003",
        name: "Jardin Majorelle",
        city: "Marrakech",
        type: "jardin",
        period: "XXe siècle",
        description: "Jardin botanique créé par Jacques Majorelle, racheté par Yves Saint Laurent. Célèbre pour son bleu Majorelle unique et sa collection de cactus.",
        openingHours: "8h-18h (oct-avr), 8h-18h30 (mai-sept)",
        entryPrice: "150 DH (jardin + musée)",
        rating: 4.7,
        reviews: 4200,
        visitDuration: "1h-2h",
        location: { lat: 31.6414, lng: -8.0033 },
        photos: ["majorelle1.jpg", "majorelle2.jpg"],
        tips: "Réserver en ligne pour éviter la queue. Très photogénique."
    },

    // Casablanca
    {
        id: "monument_cas_001",
        name: "Mosquée Hassan II",
        city: "Casablanca",
        type: "mosquée",
        period: "XXe siècle (1993)",
        description: "L'une des plus grandes mosquées au monde. Son minaret de 210m est le plus haut du monde. Partiellement construite sur l'océan Atlantique.",
        openingHours: "Visites guidées: 9h, 10h, 11h, 14h",
        entryPrice: "130 DH (visite guidée)",
        rating: 4.9,
        reviews: 6800,
        visitDuration: "1h (visite guidée)",
        location: { lat: 33.6084, lng: -7.6325 },
        photos: ["hassan2_1.jpg", "hassan2_2.jpg"],
        tips: "Seule mosquée du Maroc accessible aux non-musulmans. Réservation recommandée."
    },
    {
        id: "monument_cas_002",
        name: "Quartier des Habous",
        city: "Casablanca",
        type: "quartier",
        period: "XXe siècle (1930)",
        description: "Quartier traditionnel construit par les Français, mélange d'architecture marocaine et française. Souks, artisans et pâtisseries traditionnelles.",
        openingHours: "Accessible 24h/24",
        entryPrice: "Gratuit",
        rating: 4.3,
        reviews: 1200,
        visitDuration: "1h-2h",
        location: { lat: 33.5842, lng: -7.6122 },
        photos: ["habous1.jpg", "habous2.jpg"],
        tips: "Idéal pour acheter des souvenirs authentiques. Goûter les pâtisseries."
    },

    // Fès
    {
        id: "monument_fes_001",
        name: "Médina de Fès el-Bali",
        city: "Fès",
        type: "médina",
        period: "VIIIe siècle",
        description: "La plus grande médina médiévale du monde, classée UNESCO. Labyrinthe de 9000 ruelles, souks traditionnels et monuments historiques.",
        openingHours: "Accessible 24h/24",
        entryPrice: "Gratuit (monuments payants)",
        rating: 4.7,
        reviews: 3500,
        visitDuration: "Demi-journée minimum",
        location: { lat: 34.0631, lng: -4.9758 },
        photos: ["fes_medina1.jpg", "fes_medina2.jpg"],
        tips: "Guide fortement recommandé pour ne pas se perdre. Porter des chaussures confortables."
    },

    // Rabat
    {
        id: "monument_rab_001",
        name: "Tour Hassan",
        city: "Rabat",
        type: "monument",
        period: "XIIe siècle",
        description: "Minaret inachevé d'une mosquée du XIIe siècle. Site emblématique avec le Mausolée Mohammed V. Vue panoramique sur Rabat.",
        openingHours: "9h-18h",
        entryPrice: "Gratuit",
        rating: 4.6,
        reviews: 2100,
        visitDuration: "45 min",
        location: { lat: 34.0233, lng: -6.8214 },
        photos: ["hassan_tower1.jpg", "hassan_tower2.jpg"],
        tips: "Coucher de soleil magnifique. Combiner avec le Mausolée Mohammed V."
    }
];

// Top Restaurants
window.TopRestaurants = [
    // Marrakech
    {
        id: "resto_mar_001",
        name: "Le Jardin",
        city: "Marrakech",
        cuisine: ["marocaine", "méditerranéenne"],
        priceRange: "$$",
        avgPrice: 200,
        rating: 4.6,
        reviews: 1850,
        specialties: ["Tajine d'agneau aux pruneaux", "Pastilla au poulet", "Couscous royal"],
        openingHours: "12h-23h",
        phone: "+212 524-378080",
        address: "32 Souk Jeld, Sidi Abdelaziz, Médina",
        location: { lat: 31.6295, lng: -7.9897 },
        features: ["terrasse", "jardin", "wifi", "végétarien"],
        reservationRequired: true
    },
    {
        id: "resto_mar_002",
        name: "Nomad",
        city: "Marrakech",
        cuisine: ["marocaine moderne", "fusion"],
        priceRange: "$$$",
        avgPrice: 300,
        rating: 4.7,
        reviews: 2100,
        specialties: ["Tajine revisité", "Calamars grillés", "Desserts maison"],
        openingHours: "12h-23h",
        phone: "+212 524-381609",
        address: "1 Derb Aarjane, Rahba Lakdima, Médina",
        location: { lat: 31.6285, lng: -7.9886 },
        features: ["rooftop", "vue médina", "wifi", "moderne"],
        reservationRequired: true
    },
    {
        id: "resto_mar_003",
        name: "Café des Épices",
        city: "Marrakech",
        cuisine: ["marocaine", "café"],
        priceRange: "$",
        avgPrice: 80,
        rating: 4.4,
        reviews: 1200,
        specialties: ["Salades fraîches", "Jus naturels", "Pâtisseries"],
        openingHours: "9h-22h",
        phone: "+212 524-391770",
        address: "75 Rahba Lakdima, Médina",
        location: { lat: 31.6289, lng: -7.9883 },
        features: ["terrasse", "vue souks", "wifi", "casual"],
        reservationRequired: false
    },

    // Casablanca
    {
        id: "resto_cas_001",
        name: "Rick's Café",
        city: "Casablanca",
        cuisine: ["internationale", "marocaine"],
        priceRange: "$$$",
        avgPrice: 350,
        rating: 4.5,
        reviews: 3200,
        specialties: ["Filet de bœuf", "Tajine de poisson", "Piano bar"],
        openingHours: "12h-15h, 18h30-23h",
        phone: "+212 522-274207",
        address: "248 Boulevard Sour Jdid, Ancienne Médina",
        location: { lat: 33.5942, lng: -7.6186 },
        features: ["piano bar", "ambiance film", "wifi", "élégant"],
        reservationRequired: true
    },
    {
        id: "resto_cas_002",
        name: "La Sqala",
        city: "Casablanca",
        cuisine: ["marocaine traditionnelle"],
        priceRange: "$$",
        avgPrice: 180,
        rating: 4.4,
        reviews: 1600,
        specialties: ["Couscous", "Tajine", "Pâtisseries marocaines"],
        openingHours: "12h-23h",
        phone: "+212 522-264260",
        address: "Boulevard des Almohades, Ancienne Médina",
        location: { lat: 33.5928, lng: -7.6203 },
        features: ["jardin", "traditionnel", "terrasse", "authentique"],
        reservationRequired: false
    },

    // Agadir
    {
        id: "resto_aga_001",
        name: "Pure Passion Restaurant",
        city: "Agadir",
        cuisine: ["fruits de mer", "internationale"],
        priceRange: "$$$",
        avgPrice: 280,
        rating: 4.6,
        reviews: 980,
        specialties: ["Poissons grillés", "Fruits de mer", "Homard"],
        openingHours: "12h-23h",
        phone: "+212 528-841234",
        address: "Boulevard du 20 Août, Agadir",
        location: { lat: 30.4202, lng: -9.5982 },
        features: ["vue mer", "terrasse", "wifi", "parking"],
        reservationRequired: true
    }
];

// Helper functions
window.TourismDataHelpers = {
    /**
     * Get rental agencies by city
     */
    getRentalsByCity(city) {
        return window.RentalAgencies.filter(agency => agency.city === city);
    },

    /**
     * Get rental agencies by type
     */
    getRentalsByType(type) {
        return window.RentalAgencies.filter(agency => agency.types.includes(type));
    },

    /**
     * Get monuments by city
     */
    getMonumentsByCity(city) {
        return window.HistoricalMonuments.filter(monument => monument.city === city);
    },

    /**
     * Get restaurants by city
     */
    getRestaurantsByCity(city) {
        return window.TopRestaurants.filter(resto => resto.city === city);
    },

    /**
     * Get restaurants by cuisine
     */
    getRestaurantsByCuisine(cuisine) {
        return window.TopRestaurants.filter(resto =>
            resto.cuisine.some(c => c.toLowerCase().includes(cuisine.toLowerCase()))
        );
    },

    /**
     * Get all cities
     */
    getAllCities() {
        const cities = new Set();
        window.RentalAgencies.forEach(a => cities.add(a.city));
        window.HistoricalMonuments.forEach(m => cities.add(m.city));
        window.TopRestaurants.forEach(r => cities.add(r.city));
        return Array.from(cities).sort();
    }
};

console.log('✅ Tourism data loaded:', {
    rentals: window.RentalAgencies.length,
    monuments: window.HistoricalMonuments.length,
    restaurants: window.TopRestaurants.length,
    cities: window.TourismDataHelpers.getAllCities()
});
