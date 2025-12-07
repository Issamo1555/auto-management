/**
 * Parking Data
 */
window.PARKING_LOCATIONS = [
    {
        id: 'p1',
        name: 'Parking Koutoubia',
        type: {
            fr: 'Souterrain',
            en: 'Underground',
            es: 'Subterráneo',
            de: 'Tiefgarage',
            ar: 'تحت الأرض'
        },
        capacity: 400,
        price: {
            fr: '5 DH/h',
            en: '5 DH/h',
            es: '5 DH/h',
            de: '5 DH/h',
            ar: '5 درهم/ساعة'
        },
        lat: 31.6245,
        lng: -7.9930,
        address: {
            fr: 'Avenue Mohammed V, près de la Mosquée',
            en: 'Mohammed V Avenue, near the Mosque',
            es: 'Avenida Mohammed V, cerca de la Mezquita',
            de: 'Mohammed V Avenue, in der Nähe der Moschee',
            ar: 'شارع محمد الخامس، قرب المسجد'
        },
        status: 'available' // available, full, busy
    },
    {
        id: 'p2',
        name: 'Parking Place Jemaa El Fna',
        type: {
            fr: 'Surface',
            en: 'Surface',
            es: 'Superficie',
            de: 'Oberfläche',
            ar: 'سطحي'
        },
        capacity: 150,
        price: {
            fr: '10 DH/h',
            en: '10 DH/h',
            es: '10 DH/h',
            de: '10 DH/h',
            ar: '10 درهم/ساعة'
        },
        lat: 31.626,
        lng: -7.988,
        address: {
            fr: 'Entrée Riad Zitoun',
            en: 'Riad Zitoun Entrance',
            es: 'Entrada Riad Zitoun',
            de: 'Eingang Riad Zitoun',
            ar: 'مدخل رياض الزيتون'
        },
        status: 'busy'
    },
    {
        id: 'p3',
        name: 'Parking Carré Eden',
        type: {
            fr: 'Souterrain',
            en: 'Underground',
            es: 'Subterráneo',
            de: 'Tiefgarage',
            ar: 'تحت الأرض'
        },
        capacity: 600,
        price: {
            fr: 'Gratuit 2h (si achat)',
            en: 'Free 2h (with purchase)',
            es: 'Gratis 2h (con compra)',
            de: 'Kostenlos 2h (bei Kauf)',
            ar: 'مجاني ساعتين (مع الشراء)'
        },
        lat: 31.6345,
        lng: -8.0056,
        address: {
            fr: 'Centre Commercial Carré Eden, Guéliz',
            en: 'Carré Eden Mall, Gueliz',
            es: 'Centro Comercial Carré Eden, Gueliz',
            de: 'Einkaufszentrum Carré Eden, Gueliz',
            ar: 'مركز تسوق كاري عدن، جليز'
        },
        status: 'available'
    },
    {
        id: 'p4',
        name: 'Parking Gare ONCF',
        type: {
            fr: 'Surface',
            en: 'Surface',
            es: 'Superficie',
            de: 'Oberfläche',
            ar: 'سطحي'
        },
        capacity: 200,
        price: {
            fr: '3 DH/h',
            en: '3 DH/h',
            es: '3 DH/h',
            de: '3 DH/h',
            ar: '3 درهم/ساعة'
        },
        lat: 31.6305,
        lng: -8.015,
        address: {
            fr: 'Avenue Hassan II',
            en: 'Hassan II Avenue',
            es: 'Avenida Hassan II',
            de: 'Hassan II Avenue',
            ar: 'شارع الحسن الثاني'
        },
        status: 'available'
    },
    {
        id: 'p5',
        name: 'Parking Bab Doukkala',
        type: {
            fr: 'Surface',
            en: 'Surface',
            es: 'Superficie',
            de: 'Oberfläche',
            ar: 'سطحي'
        },
        capacity: 300,
        price: {
            fr: '5 DH/h',
            en: '5 DH/h',
            es: '5 DH/h',
            de: '5 DH/h',
            ar: '5 درهم/ساعة'
        },
        lat: 31.634,
        lng: -7.994,
        address: {
            fr: 'Gare Routière',
            en: 'Bus Station',
            es: 'Estación de Autobuses',
            de: 'Busbahnhof',
            ar: 'المحطة الطرقية'
        },
        status: 'full'
    }
];
