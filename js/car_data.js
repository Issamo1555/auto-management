/**
 * Car Data
 * List of popular brands and models for the dropdowns.
 * Logos are sourced from a public CDN (logo.clearbit.com or similar) or placeholders.
 */
const CAR_DATA = [
    { brand: "Alfa Romeo", logo: "https://logo.clearbit.com/alfaromeo.com", models: ["Giulia", "Stelvio", "Tonale", "Giulietta", "MiTo"] },
    { brand: "Audi", logo: "https://logo.clearbit.com/audi.com", models: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "e-tron", "TT", "R8"] },
    { brand: "BMW", logo: "https://logo.clearbit.com/bmw.com", models: ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "Série 7", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "iX"] },
    { brand: "Chevrolet", logo: "https://logo.clearbit.com/chevrolet.com", models: ["Camaro", "Corvette", "Spark", "Aveo", "Cruze", "Trax", "Tahoe", "Suburban"] },
    { brand: "Citroën", logo: "https://logo.clearbit.com/citroen.com", models: ["C1", "C3", "C3 Aircross", "C4", "C4 X", "C5 Aircross", "C5 X", "Berlingo", "SpaceTourer", "Ami"] },
    { brand: "Dacia", logo: "https://logo.clearbit.com/dacia.com", models: ["Sandero", "Duster", "Jogger", "Spring", "Logan", "Lodgy", "Dokker"] },
    { brand: "Dodge", logo: "https://logo.clearbit.com/dodge.com", models: ["Challenger", "Charger", "Durango", "Ram"] },
    { brand: "DS Automobiles", logo: "https://logo.clearbit.com/dsautomobiles.com", models: ["DS 3", "DS 4", "DS 7", "DS 9"] },
    { brand: "Fiat", logo: "https://logo.clearbit.com/fiat.com", models: ["500", "500X", "500L", "Panda", "Tipo", "Punto", "Doblo"] },
    { brand: "Ford", logo: "https://logo.clearbit.com/ford.com", models: ["Fiesta", "Focus", "Puma", "Kuga", "Mustang", "Mustang Mach-E", "Explorer", "Ranger", "Mondeo", "S-Max", "Galaxy"] },
    { brand: "Honda", logo: "https://logo.clearbit.com/honda.com", models: ["Civic", "Jazz", "HR-V", "CR-V", "ZR-V", "e:Ny1", "NSX"] },
    { brand: "Hyundai", logo: "https://logo.clearbit.com/hyundai.com", models: ["i10", "i20", "i30", "Bayon", "Kona", "Tucson", "Santa Fe", "Ioniq 5", "Ioniq 6", "Nexo"] },
    { brand: "Infiniti", logo: "https://logo.clearbit.com/infiniti.com", models: ["Q30", "Q50", "Q60", "QX30", "QX50", "QX55", "QX60", "QX80"] },
    { brand: "Isuzu", logo: "https://logo.clearbit.com/isuzu.com", models: ["D-Max"] },
    { brand: "Jaguar", logo: "https://logo.clearbit.com/jaguar.com", models: ["XE", "XF", "XJ", "E-Pace", "F-Pace", "I-Pace", "F-Type"] },
    { brand: "Jeep", logo: "https://logo.clearbit.com/jeep.com", models: ["Renegade", "Compass", "Wrangler", "Grand Cherokee", "Avenger", "Gladiator"] },
    { brand: "Kia", logo: "https://logo.clearbit.com/kia.com", models: ["Picanto", "Rio", "Stonic", "Ceed", "XCeed", "Niro", "Sportage", "Sorento", "EV6", "EV9", "Soul"] },
    { brand: "Lancia", logo: "https://logo.clearbit.com/lancia.com", models: ["Ypsilon"] },
    { brand: "Land Rover", logo: "https://logo.clearbit.com/landrover.com", models: ["Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque", "Discovery", "Discovery Sport", "Defender"] },
    { brand: "Lexus", logo: "https://logo.clearbit.com/lexus.com", models: ["UX", "NX", "RX", "RZ", "ES", "LS", "LC", "RC"] },
    { brand: "Maserati", logo: "https://logo.clearbit.com/maserati.com", models: ["Ghibli", "Quattroporte", "Levante", "Grecale", "MC20", "GranTurismo"] },
    { brand: "Mazda", logo: "https://logo.clearbit.com/mazda.com", models: ["Mazda2", "Mazda3", "Mazda6", "CX-30", "CX-5", "CX-60", "MX-5", "MX-30"] },
    { brand: "Mercedes-Benz", logo: "https://logo.clearbit.com/mercedes-benz.com", models: ["Classe A", "Classe B", "Classe C", "Classe E", "Classe S", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "Classe G", "EQA", "EQB", "EQC", "EQE", "EQS"] },
    { brand: "MG", logo: "https://logo.clearbit.com/mg.co.uk", models: ["MG3", "MG4", "MG5", "ZS", "HS", "Marvel R", "Cyberster"] },
    { brand: "Mini", logo: "https://logo.clearbit.com/mini.com", models: ["3 Portes", "5 Portes", "Cabrio", "Clubman", "Countryman"] },
    { brand: "Mitsubishi", logo: "https://logo.clearbit.com/mitsubishi-motors.com", models: ["Space Star", "ASX", "Eclipse Cross", "Outlander", "L200"] },
    { brand: "Nissan", logo: "https://logo.clearbit.com/nissan.com", models: ["Micra", "Juke", "Qashqai", "X-Trail", "Ariya", "Leaf", "Townstar", "Navara", "GT-R"] },
    { brand: "Opel", logo: "https://logo.clearbit.com/opel.com", models: ["Corsa", "Astra", "Mokka", "Crossland", "Grandland", "Combo", "Zafira Life"] },
    { brand: "Peugeot", logo: "https://logo.clearbit.com/peugeot.com", models: ["108", "208", "308", "408", "508", "2008", "3008", "5008", "Rifter", "Traveller"] },
    { brand: "Porsche", logo: "https://logo.clearbit.com/porsche.com", models: ["911", "718 Boxster", "718 Cayman", "Taycan", "Panamera", "Macan", "Cayenne"] },
    { brand: "Renault", logo: "https://logo.clearbit.com/renault.fr", models: ["Twingo", "Clio", "Captur", "Megane", "Arkana", "Austral", "Espace", "Rafale", "Kangoo", "Traffic", "Zoe", "Scenic"] },
    { brand: "Seat", logo: "https://logo.clearbit.com/seat.com", models: ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"] },
    { brand: "Skoda", logo: "https://logo.clearbit.com/skoda-auto.com", models: ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq"] },
    { brand: "Smart", logo: "https://logo.clearbit.com/smart.com", models: ["Fortwo", "Forfour", "#1", "#3"] },
    { brand: "SsangYong", logo: "https://logo.clearbit.com/ssangyong.com", models: ["Tivoli", "Korando", "Rexton", "Musso"] },
    { brand: "Subaru", logo: "https://logo.clearbit.com/subaru.com", models: ["Impreza", "XV", "Forester", "Outback", "Solterra", "BRZ"] },
    { brand: "Suzuki", logo: "https://logo.clearbit.com/suzuki.com", models: ["Ignis", "Swift", "Vitara", "S-Cross", "Swace", "Across", "Jimny"] },
    { brand: "Tesla", logo: "https://logo.clearbit.com/tesla.com", models: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"] },
    { brand: "Toyota", logo: "https://logo.clearbit.com/toyota.com", models: ["Aygo X", "Yaris", "Yaris Cross", "Corolla", "C-HR", "RAV4", "Highlander", "Land Cruiser", "Hilux", "Prius", "Mirai", "bZ4X", "Supra"] },
    { brand: "Volkswagen", logo: "https://logo.clearbit.com/vw.com", models: ["Up!", "Polo", "Golf", "Passat", "Arteon", "T-Cross", "Taigo", "T-Roc", "Tiguan", "Touareg", "Touran", "ID.3", "ID.4", "ID.5", "ID.Buzz"] },
    { brand: "Volvo", logo: "https://logo.clearbit.com/volvocars.com", models: ["C40", "XC40", "XC60", "XC90", "S60", "S90", "V60", "V90", "EX30", "EX90"] },
    { brand: "Autre", logo: "", models: [] }
];

const MOTORCYCLE_DATA = [
    {
        brand: "Yamaha",
        logo: "https://logo.clearbit.com/yamaha-motor.com",
        models: ["MT-07", "MT-09", "YZF-R1", "YZF-R6", "Tracer 900", "TMAX", "XSR700"]
    },
    {
        brand: "Honda",
        logo: "https://logo.clearbit.com/honda.com",
        models: ["CB500F", "CB650R", "CBR1000RR", "Africa Twin", "NC750X", "Forza 750", "PCX"]
    },
    {
        brand: "Kawasaki",
        logo: "https://logo.clearbit.com/kawasaki.com",
        models: ["Ninja 650", "Z900", "Ninja ZX-10R", "Versys 650", "Z H2", "Ninja 400"]
    },
    {
        brand: "Suzuki",
        logo: "https://logo.clearbit.com/suzuki.com",
        models: ["GSX-R1000", "GSX-S750", "V-Strom 650", "Hayabusa", "SV650", "Burgman 400"]
    },
    {
        brand: "Ducati",
        logo: "https://logo.clearbit.com/ducati.com",
        models: ["Panigale V4", "Monster", "Multistrada V4", "Scrambler", "Diavel", "SuperSport"]
    },
    {
        brand: "BMW",
        logo: "https://logo.clearbit.com/bmw.com",
        models: ["R 1250 GS", "S 1000 RR", "F 900 R", "R nineT", "C 400 GT", "G 310 R"]
    },
    {
        brand: "KTM",
        logo: "https://logo.clearbit.com/ktm.com",
        models: ["Duke 390", "Duke 790", "1290 Super Duke R", "Adventure 890", "RC 390"]
    },
    {
        brand: "Harley-Davidson",
        logo: "https://logo.clearbit.com/harley-davidson.com",
        models: ["Sportster S", "Street Bob", "Fat Boy", "Road Glide", "Pan America 1250"]
    },
    {
        brand: "Triumph",
        logo: "https://logo.clearbit.com/triumph.co.uk",
        models: ["Street Triple", "Speed Triple", "Tiger 900", "Bonneville", "Rocket 3"]
    },
    {
        brand: "Autre",
        logo: "",
        models: []
    }
];

const TRUCK_DATA = [
    {
        brand: "Renault Trucks",
        logo: "https://logo.clearbit.com/renault-trucks.com",
        models: ["T", "C", "K", "D", "D Wide"]
    },
    {
        brand: "Volvo Trucks",
        logo: "https://logo.clearbit.com/volvotrucks.com",
        models: ["FH", "FM", "FMX", "FL", "FE"]
    },
    {
        brand: "Scania",
        logo: "https://logo.clearbit.com/scania.com",
        models: ["R-Series", "S-Series", "P-Series", "G-Series", "L-Series"]
    },
    {
        brand: "Mercedes-Benz",
        logo: "https://logo.clearbit.com/mercedes-benz.com",
        models: ["Actros", "Arocs", "Atego", "Econic", "Sprinter"]
    },
    {
        brand: "MAN",
        logo: "https://logo.clearbit.com/man.eu",
        models: ["TGX", "TGS", "TGM", "TGL"]
    },
    {
        brand: "DAF",
        logo: "https://logo.clearbit.com/daf.com",
        models: ["XF", "XG", "XG+", "CF", "LF"]
    },
    {
        brand: "Iveco",
        logo: "https://logo.clearbit.com/iveco.com",
        models: ["S-Way", "X-Way", "Eurocargo", "Daily"]
    },
    {
        brand: "Ford",
        logo: "https://logo.clearbit.com/ford.com",
        models: ["Transit", "Ranger", "F-150", "F-250", "F-350"]
    },
    {
        brand: "Isuzu",
        logo: "https://logo.clearbit.com/isuzu.com",
        models: ["N-Series", "F-Series", "D-Max"]
    },
    {
        brand: "Autre",
        logo: "",
        models: []
    }
];

window.CarData = CAR_DATA;
window.MotorcycleData = MOTORCYCLE_DATA;
window.TruckData = TRUCK_DATA;
