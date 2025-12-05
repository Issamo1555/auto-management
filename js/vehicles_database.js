/**
 * Base de données des véhicules pour le Conseiller d'Achat
 * Contient les specs techniques, prix indicatifs et scores de compatibilité
 */

const VEHICLES_DATABASE = [
    // --- BUDGET / ÉCONOMIQUE ---
    {
        id: "dacia-logan",
        marque: "Dacia",
        modele: "Logan",
        type: "Berline",
        segment: "Economique",
        prix_neuf: { min: 133000, max: 160000 },
        prix_occasion: { "< 2 ans": 115000, "2-5 ans": 90000, "5-10 ans": 65000 },
        carburant: ["Diesel", "Essence"],
        transmission: ["Manuelle"],
        consommation: { ville: 5.5, route: 4.2, mixte: 4.9 }, // Diesel
        performance: {
            puissance: 95, // ch
            couple: 220, // Nm
            vitesse_max: 179, // km/h
            acceleration: 12.0 // 0-100 km/h (s)
        },
        places: 5,
        coffre: 528, // Litres
        image: "assets/cars/dacia_logan.jpg", // Placeholder
        scoring: {
            ville: 7,
            route: 7,
            autoroute: 6,
            famille: 8,
            economie: 10,
            confort: 6,
            sport: 2,
            offroad: 3,
            fiabilite: 9
        }
    },
    {
        id: "dacia-sandero",
        marque: "Dacia",
        modele: "Sandero",
        type: "Citadine",
        segment: "Economique",
        prix_neuf: { min: 145000, max: 175000 },
        prix_occasion: { "< 2 ans": 125000, "2-5 ans": 95000, "5-10 ans": 70000 },
        carburant: ["Diesel", "Essence"],
        transmission: ["Manuelle", "Automatique"], // CVT sur Stepway
        consommation: { ville: 6.0, route: 4.5, mixte: 5.2 },
        performance: {
            puissance: 100,
            couple: 160,
            vitesse_max: 183,
            acceleration: 11.5
        },
        places: 5,
        coffre: 328,
        scoring: {
            ville: 9,
            route: 6,
            autoroute: 5,
            famille: 6,
            economie: 9,
            confort: 7,
            sport: 3,
            offroad: 4, // Stepway aide un peu
            fiabilite: 9
        }
    },
    {
        id: "hyundai-i10",
        marque: "Hyundai",
        modele: "i10",
        type: "Citadine",
        segment: "Economique",
        prix_neuf: { min: 135000, max: 155000 },
        prix_occasion: { "< 2 ans": 110000, "2-5 ans": 85000, "5-10 ans": 60000 },
        carburant: ["Essence"],
        transmission: ["Automatique", "Manuelle"],
        consommation: { ville: 6.5, route: 4.8, mixte: 5.5 },
        performance: {
            puissance: 84,
            couple: 118,
            vitesse_max: 171,
            acceleration: 12.6
        },
        places: 4, // Souvent 4 ou 5 serrées
        coffre: 252,
        scoring: {
            ville: 10,
            route: 4,
            autoroute: 3,
            famille: 4,
            economie: 8,
            confort: 6,
            sport: 2,
            offroad: 1,
            fiabilite: 8
        }
    },
    {
        id: "renault-clio",
        marque: "Renault",
        modele: "Clio 5",
        type: "Citadine",
        segment: "Intermediaire",
        prix_neuf: { min: 190000, max: 240000 },
        prix_occasion: { "< 2 ans": 160000, "2-5 ans": 130000, "5-10 ans": 90000 }, // Clio 4 pour les plus vieilles
        carburant: ["Diesel", "Essence", "Hybride"],
        transmission: ["Manuelle", "Automatique"],
        consommation: { ville: 5.2, route: 3.8, mixte: 4.4 }, // Diesel
        performance: {
            puissance: 100,
            couple: 260,
            vitesse_max: 188,
            acceleration: 11.4
        },
        places: 5,
        coffre: 391,
        scoring: {
            ville: 9,
            route: 8,
            autoroute: 7,
            famille: 6,
            economie: 8,
            confort: 8,
            sport: 5,
            offroad: 2,
            fiabilite: 7
        }
    },
    {
        id: "peugeot-208",
        marque: "Peugeot",
        modele: "208",
        type: "Citadine",
        segment: "Intermediaire",
        prix_neuf: { min: 195000, max: 250000 },
        prix_occasion: { "< 2 ans": 170000, "2-5 ans": 140000 },
        carburant: ["Diesel", "Essence", "Electrique"],
        transmission: ["Manuelle", "Automatique"],
        consommation: { ville: 5.0, route: 3.8, mixte: 4.2 }, // Diesel
        performance: {
            puissance: 100,
            couple: 250,
            vitesse_max: 188,
            acceleration: 10.9
        },
        places: 5,
        coffre: 311,
        scoring: {
            ville: 9,
            route: 7,
            autoroute: 7,
            famille: 5,
            economie: 8,
            confort: 8,
            sport: 6,
            offroad: 2,
            fiabilite: 7
        }
    },

    // --- SUV / FAMILIAL ---
    {
        id: "dacia-duster",
        marque: "Dacia",
        modele: "Duster",
        type: "SUV",
        segment: "Economique",
        prix_neuf: { min: 210000, max: 260000 },
        prix_occasion: { "< 2 ans": 180000, "2-5 ans": 140000, "5-10 ans": 95000 },
        carburant: ["Diesel"],
        transmission: ["Manuelle", "Automatique"], // EDC dispo
        consommation: { ville: 6.0, route: 4.8, mixte: 5.3 },
        performance: {
            puissance: 115,
            couple: 260,
            vitesse_max: 183,
            acceleration: 10.5
        },
        places: 5,
        coffre: 445,
        scoring: {
            ville: 7,
            route: 8,
            autoroute: 7,
            famille: 8,
            economie: 8,
            confort: 7,
            sport: 3,
            offroad: 8, // Bonnes capacités 4x4 si version 4x4
            fiabilite: 8
        }
    },
    {
        id: "hyundai-tucson",
        marque: "Hyundai",
        modele: "Tucson",
        type: "SUV",
        segment: "Intermediaire",
        prix_neuf: { min: 330000, max: 420000 },
        prix_occasion: { "< 2 ans": 290000, "2-5 ans": 220000 },
        carburant: ["Diesel", "Hybride"],
        transmission: ["Automatique"],
        consommation: { ville: 7.0, route: 5.5, mixte: 6.2 },
        performance: {
            puissance: 136,
            couple: 320,
            vitesse_max: 180,
            acceleration: 11.4
        },
        places: 5,
        coffre: 598,
        scoring: {
            ville: 7,
            route: 9,
            autoroute: 9,
            famille: 9,
            economie: 6,
            confort: 9,
            sport: 5,
            offroad: 5,
            fiabilite: 8
        }
    },
    {
        id: "peugeot-3008",
        marque: "Peugeot",
        modele: "3008",
        type: "SUV",
        segment: "Intermediaire",
        prix_neuf: { min: 340000, max: 450000 },
        prix_occasion: { "< 2 ans": 300000, "2-5 ans": 230000 },
        carburant: ["Diesel", "Hybride"],
        transmission: ["Automatique"],
        consommation: { ville: 6.5, route: 5.0, mixte: 5.8 },
        performance: {
            puissance: 130,
            couple: 300,
            vitesse_max: 192,
            acceleration: 10.8
        },
        places: 5,
        coffre: 520,
        scoring: {
            ville: 7,
            route: 9,
            autoroute: 9,
            famille: 8,
            economie: 6,
            confort: 9,
            sport: 6,
            offroad: 4,
            fiabilite: 7
        }
    },

    // --- PREMIUM ---
    {
        id: "bmw-serie-3",
        marque: "BMW",
        modele: "Série 3",
        type: "Berline",
        segment: "Premium",
        prix_neuf: { min: 550000, max: 800000 },
        prix_occasion: { "< 2 ans": 450000, "2-5 ans": 350000, "5-10 ans": 200000 },
        carburant: ["Diesel", "Hybride", "Essence"],
        transmission: ["Automatique"],
        consommation: { ville: 7.5, route: 5.2, mixte: 6.0 },
        performance: {
            puissance: 190,
            couple: 400,
            vitesse_max: 240,
            acceleration: 7.4
        },
        places: 5,
        coffre: 480,
        scoring: {
            ville: 6,
            route: 10,
            autoroute: 10,
            famille: 7,
            economie: 4,
            confort: 9,
            sport: 9,
            offroad: 1,
            fiabilite: 8
        }
    },
    {
        id: "mercedes-glc",
        marque: "Mercedes",
        modele: "GLC",
        type: "SUV",
        segment: "Premium",
        prix_neuf: { min: 600000, max: 900000 },
        prix_occasion: { "< 2 ans": 500000, "2-5 ans": 380000 },
        carburant: ["Diesel", "Hybride"],
        transmission: ["Automatique"],
        consommation: { ville: 8.0, route: 6.0, mixte: 7.0 },
        performance: {
            puissance: 194,
            couple: 400,
            vitesse_max: 215,
            acceleration: 7.9
        },
        places: 5,
        coffre: 550,
        scoring: {
            ville: 6,
            route: 9,
            autoroute: 10,
            famille: 8,
            economie: 4,
            confort: 10,
            sport: 7,
            offroad: 6,
            fiabilite: 8
        }
    }
];

// Expose to global scope
window.VEHICLES_DATABASE = VEHICLES_DATABASE;
