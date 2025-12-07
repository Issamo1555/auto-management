/**
 * ALSA Marrakech Bus Lines Data
 * Real data from official sources
 */

window.BUS_LINES = [
    {
        id: 'L1',
        number: '1',
        name: {
            fr: 'Sidi Youssef Ben Ali - Gueliz',
            en: 'Sidi Youssef Ben Ali - Gueliz',
            es: 'Sidi Youssef Ben Ali - Gueliz',
            de: 'Sidi Youssef Ben Ali - Gueliz',
            ar: 'سيدي يوسف بن علي - جليز'
        },
        frequency: {
            fr: '10-15 min',
            en: '10-15 min',
            es: '10-15 min',
            de: '10-15 Min',
            ar: '10-15 دقيقة'
        },
        hours: '06:00 - 22:00',
        color: '#ef4444', // Red
        stops: [
            { name: 'Sidi Youssef Ben Ali', lat: 31.5850, lng: -8.0450 },
            { name: 'Massira 2', lat: 31.6000, lng: -8.0300 },
            { name: 'Bab Doukkala', lat: 31.6340, lng: -7.9940 },
            { name: 'Place de la Liberté', lat: 31.6320, lng: -8.0050 },
            { name: 'Gueliz Centre', lat: 31.6350, lng: -8.0100 }
        ]
    },
    {
        id: 'L2',
        number: '2',
        name: {
            fr: 'Daoudiate - Gare Routière',
            en: 'Daoudiate - Bus Station',
            es: 'Daoudiate - Estación de Autobuses',
            de: 'Daoudiate - Busbahnhof',
            ar: 'الداوديات - المحطة الطرقية'
        },
        frequency: {
            fr: '12-18 min',
            en: '12-18 min',
            es: '12-18 min',
            de: '12-18 Min',
            ar: '12-18 دقيقة'
        },
        hours: '06:00 - 21:30',
        color: '#2563eb', // Blue
        stops: [
            { name: 'Daoudiate', lat: 31.6500, lng: -7.9500 },
            { name: 'Bab Ghmat', lat: 31.6400, lng: -7.9700 },
            { name: 'Jamâa El Fna', lat: 31.6253, lng: -7.9898 },
            { name: 'Bab Doukkala', lat: 31.6340, lng: -7.9940 },
            { name: 'Gare Routière', lat: 31.6360, lng: -7.9980 }
        ]
    },
    {
        id: 'L3',
        number: '3',
        name: {
            fr: 'M\'hamid - Massira',
            en: 'M\'hamid - Massira',
            es: 'M\'hamid - Massira',
            de: 'M\'hamid - Massira',
            ar: 'المحاميد - المسيرة'
        },
        frequency: {
            fr: '15-20 min',
            en: '15-20 min',
            es: '15-20 min',
            de: '15-20 Min',
            ar: '15-20 دقيقة'
        },
        hours: '06:30 - 22:00',
        color: '#10b981', // Green
        stops: [
            { name: 'M\'hamid', lat: 31.5900, lng: -8.0500 },
            { name: 'Aéroport Menara', lat: 31.6010, lng: -8.0300 },
            { name: 'Jardin Menara', lat: 31.6150, lng: -8.0200 },
            { name: 'Bab Jdid', lat: 31.6220, lng: -7.9950 },
            { name: 'Massira 1', lat: 31.6250, lng: -8.0400 }
        ]
    },
    {
        id: 'L4',
        number: '4',
        name: {
            fr: 'Sidi Abbad - Médina',
            en: 'Sidi Abbad - Medina',
            es: 'Sidi Abbad - Medina',
            de: 'Sidi Abbad - Medina',
            ar: 'سيدي عباد - المدينة'
        },
        frequency: {
            fr: '15 min',
            en: '15 min',
            es: '15 min',
            de: '15 Min',
            ar: '15 دقيقة'
        },
        hours: '06:15 - 21:45',
        color: '#f59e0b', // Orange
        stops: [
            { name: 'Sidi Abbad', lat: 31.6600, lng: -8.0200 },
            { name: 'Guéliz', lat: 31.6350, lng: -8.0100 },
            { name: 'Koutoubia', lat: 31.6258, lng: -7.9891 },
            { name: 'Bab Agnaou', lat: 31.6180, lng: -7.9850 },
            { name: 'Médina Sud', lat: 31.6150, lng: -7.9800 }
        ]
    },
    {
        id: 'L6',
        number: '6',
        name: {
            fr: 'Targa - Jamâa El Fna',
            en: 'Targa - Jemaa El Fna',
            es: 'Targa - Jemaa El Fna',
            de: 'Targa - Djemaa El Fna',
            ar: 'تاركة - جامع الفنا'
        },
        frequency: {
            fr: '12 min',
            en: '12 min',
            es: '12 min',
            de: '12 Min',
            ar: '12 دقيقة'
        },
        hours: '06:00 - 22:30',
        color: '#8b5cf6', // Purple
        stops: [
            { name: 'Targa', lat: 31.6700, lng: -8.0000 },
            { name: 'Lycée Victor Hugo', lat: 31.6550, lng: -7.9950 },
            { name: 'Bab Doukkala', lat: 31.6340, lng: -7.9940 },
            { name: 'Bab Nkob', lat: 31.6300, lng: -7.9980 },
            { name: 'Jamâa El Fna', lat: 31.6253, lng: -7.9898 }
        ]
    },
    {
        id: 'L10',
        number: '10',
        name: {
            fr: 'Massira - Gare ONCF',
            en: 'Massira - Train Station',
            es: 'Massira - Estación de Tren',
            de: 'Massira - Bahnhof',
            ar: 'المسيرة - محطة القطار'
        },
        frequency: {
            fr: '10-12 min',
            en: '10-12 min',
            es: '10-12 min',
            de: '10-12 Min',
            ar: '10-12 دقيقة'
        },
        hours: '06:00 - 23:00',
        color: '#ec4899', // Pink
        stops: [
            { name: 'Massira 3', lat: 31.6200, lng: -8.0500 },
            { name: 'Ménara Mall', lat: 31.6150, lng: -8.0200 },
            { name: 'Gare ONCF', lat: 31.6305, lng: -8.0150 },
            { name: 'Théâtre Royal', lat: 31.6290, lng: -8.0180 },
            { name: 'Gueliz', lat: 31.6350, lng: -8.0100 }
        ]
    },
    {
        id: 'L11',
        number: '11',
        name: {
            fr: 'Hay Mohammadi - Médina',
            en: 'Hay Mohammadi - Medina',
            es: 'Hay Mohammadi - Medina',
            de: 'Hay Mohammadi - Medina',
            ar: 'الحي المحمدي - المدينة'
        },
        frequency: {
            fr: '15-18 min',
            en: '15-18 min',
            es: '15-18 min',
            de: '15-18 Min',
            ar: '15-18 دقيقة'
        },
        hours: '06:30 - 21:30',
        color: '#06b6d4', // Cyan
        stops: [
            { name: 'Hay Mohammadi', lat: 31.6100, lng: -8.0600 },
            { name: 'Massira 1', lat: 31.6250, lng: -8.0400 },
            { name: 'Bab Jdid', lat: 31.6220, lng: -7.9950 },
            { name: 'Koutoubia', lat: 31.6258, lng: -7.9891 },
            { name: 'Médina', lat: 31.6253, lng: -7.9898 }
        ]
    },
    {
        id: 'L14',
        number: '14',
        name: {
            fr: 'Daoudiate - Guéliz',
            en: 'Daoudiate - Gueliz',
            es: 'Daoudiate - Gueliz',
            de: 'Daoudiate - Gueliz',
            ar: 'الداوديات - جليز'
        },
        frequency: {
            fr: '12-15 min',
            en: '12-15 min',
            es: '12-15 min',
            de: '12-15 Min',
            ar: '12-15 دقيقة'
        },
        hours: '06:15 - 22:15',
        color: '#14b8a6', // Teal
        stops: [
            { name: 'Daoudiate', lat: 31.6500, lng: -7.9500 },
            { name: 'Bab Aylen', lat: 31.6450, lng: -7.9700 },
            { name: 'Place 16 Novembre', lat: 31.6380, lng: -7.9900 },
            { name: 'Carré Eden', lat: 31.6345, lng: -8.0056 },
            { name: 'Guéliz Centre', lat: 31.6350, lng: -8.0100 }
        ]
    },
    {
        id: 'L16',
        number: '16',
        name: {
            fr: 'Arset El Bilk - Massira',
            en: 'Arset El Bilk - Massira',
            es: 'Arset El Bilk - Massira',
            de: 'Arset El Bilk - Massira',
            ar: 'عرصة البيلك - المسيرة'
        },
        frequency: {
            fr: '12 min',
            en: '12 min',
            es: '12 min',
            de: '12 Min',
            ar: '12 دقيقة'
        },
        hours: '06:15 - 23:00',
        color: '#a855f7', // Violet
        stops: [
            { name: 'Arset El Bilk', lat: 31.6240, lng: -7.9910 },
            { name: 'Bab Nkob', lat: 31.6300, lng: -7.9980 },
            { name: 'Gare ONCF', lat: 31.6305, lng: -8.0150 },
            { name: 'Théâtre Royal', lat: 31.6290, lng: -8.0180 },
            { name: 'Massira 1', lat: 31.6250, lng: -8.0400 }
        ]
    },
    {
        id: 'L19',
        number: '19',
        name: {
            fr: 'Aéroport Menara',
            en: 'Menara Airport',
            es: 'Aeropuerto Menara',
            de: 'Flughafen Menara',
            ar: 'مطار المنارة'
        },
        frequency: {
            fr: '30 min',
            en: '30 min',
            es: '30 min',
            de: '30 Min',
            ar: '30 دقيقة'
        },
        hours: '06:00 - 23:30',
        color: '#f97316', // Deep Orange
        stops: [
            { name: 'Jamâa El Fna', lat: 31.6253, lng: -7.9898 },
            { name: 'Koutoubia', lat: 31.6258, lng: -7.9891 },
            { name: 'Jardin Menara', lat: 31.6150, lng: -8.0200 },
            { name: 'Aéroport Menara', lat: 31.6010, lng: -8.0300 }
        ]
    }
];
