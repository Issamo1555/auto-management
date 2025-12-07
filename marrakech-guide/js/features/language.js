/**
 * Language Feature
 * Handles internationalization (i18n)
 */
class LanguageFeature {
    constructor() {
        this.currentLang = window.app.storage.get('language', 'fr');
        this.translations = {
            'fr': {
                'app.title': 'Marrakech Guide',
                'nav.home': 'Accueil',
                'nav.transport': 'Transport',
                'nav.parking': 'Parking',
                'nav.monuments': 'Monuments',
                'nav.restaurants': 'Restaurants',
                'nav.shopping': 'Shopping',
                'home.welcome': 'Bienvenue à Marrakech 🌴',
                'home.subtitle': 'Votre guide numérique complet pour explorer la ville ocre.',
                'module.transport.title': 'Transport',
                'module.transport.desc': 'Bus, Taxis et itinéraires',
                'module.parking.title': 'Parking',
                'module.parking.desc': 'Trouver une place',
                'module.route.title': 'Trajet',
                'module.route.desc': 'Calcul d\'itinéraire',
                'module.monuments.title': 'Monuments',
                'module.monuments.desc': 'Histoire et culture',
                'module.restaurants.title': 'Restaurants',
                'module.restaurants.desc': 'Gastronomie locale',
                'module.shopping.title': 'Shopping',
                'module.shopping.desc': 'Souks et artisanat',
                'btn.favorites': 'Favoris',
                'btn.language': 'Langue',

                // Common
                'common.loading': 'Chargement...',
                'common.error': 'Erreur',
                'common.address': 'Adresse',
                'common.price': 'Prix',
                'common.hours': 'Horaires',
                'common.open': 'Ouvert',
                'common.closed': 'Fermé',
                'common.rating': 'Note',
                'common.search': 'Rechercher',
                'common.geolocation_error': 'Erreur de géolocalisation',
                'common.geolocation_unsupported': 'Géolocalisation non supportée',

                // Transport
                'transport.stops_nearby': '📍 Arrêts près de moi',
                'transport.frequency': 'Fréquence',
                'transport.schedule': 'Horaires',
                'transport.min': 'min',
                'transport.searching': '⏳ Recherche...',
                'transport.position_found': 'Position trouvée',

                // Parking
                'parking.filter.all': 'Tous',
                'parking.filter.available': '🟢 Disponibles',
                'parking.filter.underground': '🏢 Souterrains',
                'parking.places': 'places',
                'parking.status.available': 'Disponible',
                'parking.status.full': 'Complet',
                'parking.status.busy': 'Occupé',
                'parking.go': 'Y aller 🗺️',
                'parking.search_btn': 'Rechercher des parkings',

                // Monuments
                'monuments.rating': 'Note',

                // Restaurants
                'restaurants.price_level': 'Prix',

                // Shopping
                'shopping.tips.title': '💡 Conseils de Négociation',
                'shopping.tips.1': 'Toujours négocier dans les souks (viser -30% à -50%)',
                'shopping.tips.2': 'L\'Ensemble Artisanal offre des prix fixes garantis',
                'shopping.tips.3': 'Gardez le sourire, c\'est un jeu social !',

                // Route Planner
                'route.from': 'Départ',
                'route.to': 'Destination',
                'route.current_location': '📍 Ma position',
                'route.calculate': 'Calculer l\'itinéraire 🚀',
                'route.suggested': 'Itinéraires suggérés',
                'route.type.recommended': 'Recommandé',
                'route.type.fastest': 'Le plus rapide',
                'route.type.cheapest': 'Le moins cher',

                // Favorites
                'favorites.empty': 'Aucun favori',
                'favorites.empty_desc': 'Ajoutez des lieux à vos favoris pour les retrouver ici.',
                'favorites.explore': 'Explorer',
                'favorites.remove': 'Retirer'
            },
            'en': {
                'app.title': 'Marrakech Guide',
                'nav.home': 'Home',
                'nav.transport': 'Transport',
                'nav.parking': 'Parking',
                'nav.monuments': 'Monuments',
                'nav.restaurants': 'Restaurants',
                'nav.shopping': 'Shopping',
                'home.welcome': 'Welcome to Marrakech 🌴',
                'home.subtitle': 'Your complete digital guide to explore the Red City.',
                'module.transport.title': 'Transport',
                'module.transport.desc': 'Bus, Taxis and routes',
                'module.parking.title': 'Parking',
                'module.parking.desc': 'Find a spot',
                'module.route.title': 'Route',
                'module.route.desc': 'Route planner',
                'module.monuments.title': 'Monuments',
                'module.monuments.desc': 'History and culture',
                'module.restaurants.title': 'Restaurants',
                'module.restaurants.desc': 'Local gastronomy',
                'module.shopping.title': 'Shopping',
                'module.shopping.desc': 'Souks and crafts',
                'btn.favorites': 'Favorites',
                'btn.language': 'Language',

                // Common
                'common.loading': 'Loading...',
                'common.error': 'Error',
                'common.address': 'Address',
                'common.price': 'Price',
                'common.hours': 'Hours',
                'common.open': 'Open',
                'common.closed': 'Closed',
                'common.rating': 'Rating',
                'common.search': 'Search',
                'common.geolocation_error': 'Geolocation error',
                'common.geolocation_unsupported': 'Geolocation not supported',

                // Transport
                'transport.stops_nearby': '📍 Stops near me',
                'transport.frequency': 'Frequency',
                'transport.schedule': 'Schedule',
                'transport.min': 'min',
                'transport.searching': '⏳ Searching...',
                'transport.position_found': 'Position found',

                // Parking
                'parking.filter.all': 'All',
                'parking.filter.available': '🟢 Available',
                'parking.filter.underground': '🏢 Underground',
                'parking.places': 'spaces',
                'parking.status.available': 'Available',
                'parking.status.full': 'Full',
                'parking.status.busy': 'Busy',
                'parking.go': 'Go there 🗺️',
                'parking.search_btn': 'Search parking',

                // Monuments
                'monuments.rating': 'Rating',

                // Restaurants
                'restaurants.price_level': 'Price',

                // Shopping
                'shopping.tips.title': '💡 Bargaining Tips',
                'shopping.tips.1': 'Always bargain in souks (aim for -30% to -50%)',
                'shopping.tips.2': 'Ensemble Artisanal offers fixed guaranteed prices',
                'shopping.tips.3': 'Keep smiling, it\'s a social game!',

                // Route Planner
                'route.from': 'From',
                'route.to': 'To',
                'route.current_location': '📍 My location',
                'route.calculate': 'Calculate Route 🚀',
                'route.suggested': 'Suggested Routes',
                'route.type.recommended': 'Recommended',
                'route.type.fastest': 'Fastest',
                'route.type.cheapest': 'Cheapest',

                // Favorites
                'favorites.empty': 'No favorites',
                'favorites.empty_desc': 'Add places to favorites to see them here.',
                'favorites.explore': 'Explore',
                'favorites.remove': 'Remove'
            },
            'ar': {
                'app.title': 'دليل مراكش',
                'nav.home': 'الرئيسية',
                'nav.transport': 'نقل',
                'nav.parking': 'موقف',
                'nav.monuments': 'معالم',
                'nav.restaurants': 'مطاعم',
                'nav.shopping': 'تسوق',
                'home.welcome': 'مرحباً بكم في مراكش 🌴',
                'home.subtitle': 'دليلك الرقمي الشامل لاستكشاف المدينة الحمراء.',
                'module.transport.title': 'نقل',
                'module.transport.desc': 'حافلات، سيارات أجرة ومسارات',
                'module.parking.title': 'موقف',
                'module.parking.desc': 'إيجاد مكان',
                'module.route.title': 'مسار',
                'module.route.desc': 'تخطيط المسار',
                'module.monuments.title': 'معالم',
                'module.monuments.desc': 'تاريخ وثقافة',
                'module.restaurants.title': 'مطاعم',
                'module.restaurants.desc': 'مأكولات محلية',
                'module.shopping.title': 'تسوق',
                'module.shopping.desc': 'أسواق وصناعة تقليدية',
                'btn.favorites': 'المفضلة',
                'btn.language': 'اللغة',

                // Common
                'common.loading': 'تحميل...',
                'common.error': 'خطأ',
                'common.address': 'العنوان',
                'common.price': 'السعر',
                'common.hours': 'ساعات العمل',
                'common.open': 'مفتوح',
                'common.closed': 'مغلق',
                'common.rating': 'التقييم',
                'common.search': 'بحث',
                'common.geolocation_error': 'خطأ في تحديد الموقع',
                'common.geolocation_unsupported': 'تحديد الموقع غير مدعوم',

                // Transport
                'transport.stops_nearby': '📍 محطات قريبة مني',
                'transport.frequency': 'التردد',
                'transport.schedule': 'التوقيت',
                'transport.min': 'دقيقة',
                'transport.searching': '⏳ جاري البحث...',
                'transport.position_found': 'تم تحديد الموقع',

                // Parking
                'parking.filter.all': 'الكل',
                'parking.filter.available': '🟢 متاح',
                'parking.filter.underground': '🏢 تحت الأرض',
                'parking.places': 'أماكن',
                'parking.status.available': 'متاح',
                'parking.status.full': 'ممتلئ',
                'parking.status.busy': 'مزدحم',
                'parking.go': 'الذهاب 🗺️',
                'parking.search_btn': 'البحث عن مواقف',

                // Monuments
                'monuments.rating': 'التقييم',

                // Restaurants
                'restaurants.price_level': 'مستوى السعر',

                // Shopping
                'shopping.tips.title': '💡 نصائح المساومة',
                'shopping.tips.1': 'ساوم دائماً في الأسواق (استهدف -30% إلى -50%)',
                'shopping.tips.2': 'مجمع الصناعة التقليدية يوفر أسعاراً ثابتة ومضمونة',
                'shopping.tips.3': 'حافظ على ابتسامتك، إنها لعبة اجتماعية!',

                // Route Planner
                'route.from': 'من',
                'route.to': 'إلى',
                'route.current_location': '📍 موقعي',
                'route.calculate': 'حساب المسار 🚀',
                'route.suggested': 'المسارات المقترحة',
                'route.type.recommended': 'موصى به',
                'route.type.fastest': 'الأسرع',
                'route.type.cheapest': 'الأرخص',

                // Favorites
                'favorites.empty': 'لا توجد مفضلات',
                'favorites.empty_desc': 'أضف أماكن إلى المفضلة لتجدها هنا.',
                'favorites.explore': 'تصفح',
                'favorites.remove': 'إزالة'
            },
            'es': {
                'app.title': 'Guía de Marrakech',
                'nav.home': 'Inicio',
                'nav.transport': 'Transporte',
                'nav.parking': 'Aparcamiento',
                'nav.monuments': 'Monumentos',
                'nav.restaurants': 'Restaurantes',
                'nav.shopping': 'Compras',
                'home.welcome': 'Bienvenido a Marrakech 🌴',
                'home.subtitle': 'Tu guía digital completa para explorar la Ciudad Roja.',
                'module.transport.title': 'Transporte',
                'module.transport.desc': 'Autobuses, Taxis y rutas',
                'module.parking.title': 'Aparcamiento',
                'module.parking.desc': 'Encontrar sitio',
                'module.route.title': 'Ruta',
                'module.route.desc': 'Planificador de rutas',
                'module.monuments.title': 'Monumentos',
                'module.monuments.desc': 'Historia y cultura',
                'module.restaurants.title': 'Restaurantes',
                'module.restaurants.desc': 'Gastronomía local',
                'module.shopping.title': 'Compras',
                'module.shopping.desc': 'Zocos y artesanía',
                'btn.favorites': 'Favoritos',
                'btn.language': 'Idioma',

                // Common
                'common.loading': 'Cargando...',
                'common.error': 'Error',
                'common.address': 'Dirección',
                'common.price': 'Precio',
                'common.hours': 'Horario',
                'common.open': 'Abierto',
                'common.closed': 'Cerrado',
                'common.rating': 'Valoración',
                'common.search': 'Buscar',
                'common.geolocation_error': 'Error de geolocalización',
                'common.geolocation_unsupported': 'Geolocalización no soportada',

                // Transport
                'transport.stops_nearby': '📍 Paradas cercanas',
                'transport.frequency': 'Frecuencia',
                'transport.schedule': 'Horario',
                'transport.min': 'min',
                'transport.searching': '⏳ Buscando...',
                'transport.position_found': 'Posición encontrada',

                // Parking
                'parking.filter.all': 'Todos',
                'parking.filter.available': '🟢 Disponibles',
                'parking.filter.underground': '🏢 Subterráneos',
                'parking.places': 'plazas',
                'parking.status.available': 'Disponible',
                'parking.status.full': 'Completo',
                'parking.status.busy': 'Ocupado',
                'parking.go': 'Ir allí 🗺️',
                'parking.search_btn': 'Buscar aparcamiento',

                // Monuments
                'monuments.rating': 'Valoración',

                // Restaurants
                'restaurants.price_level': 'Precio',

                // Shopping
                'shopping.tips.title': '💡 Consejos de Regateo',
                'shopping.tips.1': 'Regatea siempre en los zocos (apunta a -30% a -50%)',
                'shopping.tips.2': 'El Ensemble Artisanal ofrece precios fijos garantizados',
                'shopping.tips.3': '¡Sonríe, es un juego social!',

                // Route Planner
                'route.from': 'Origen',
                'route.to': 'Destino',
                'route.current_location': '📍 Mi ubicación',
                'route.calculate': 'Calcular Ruta 🚀',
                'route.suggested': 'Rutas sugeridas',
                'route.type.recommended': 'Recomendado',
                'route.type.fastest': 'Más rápido',
                'route.type.cheapest': 'Más barato',

                // Favorites
                'favorites.empty': 'Sin favoritos',
                'favorites.empty_desc': 'Añade lugares a favoritos para verlos aquí.',
                'favorites.explore': 'Explorar',
                'favorites.remove': 'Eliminar'
            },
            'de': {
                'app.title': 'Marrakesch Reiseführer',
                'nav.home': 'Startseite',
                'nav.transport': 'Verkehr',
                'nav.parking': 'Parken',
                'nav.monuments': 'Denkmäler',
                'nav.restaurants': 'Restaurants',
                'nav.shopping': 'Einkaufen',
                'home.welcome': 'Willkommen in Marrakesch 🌴',
                'home.subtitle': 'Ihr kompletter digitaler Reiseführer für die Rote Stadt.',
                'module.transport.title': 'Verkehr',
                'module.transport.desc': 'Busse, Taxis und Routen',
                'module.parking.title': 'Parken',
                'module.parking.desc': 'Parkplatz finden',
                'module.route.title': 'Route',
                'module.route.desc': 'Routenplaner',
                'module.monuments.title': 'Denkmäler',
                'module.monuments.desc': 'Geschichte und Kultur',
                'module.restaurants.title': 'Restaurants',
                'module.restaurants.desc': 'Lokale Gastronomie',
                'module.shopping.title': 'Einkaufen',
                'module.shopping.desc': 'Souks und Handwerk',
                'btn.favorites': 'Favoriten',
                'btn.language': 'Sprache',

                // Common
                'common.loading': 'Laden...',
                'common.error': 'Fehler',
                'common.address': 'Adresse',
                'common.price': 'Preis',
                'common.hours': 'Öffnungszeiten',
                'common.open': 'Geöffnet',
                'common.closed': 'Geschlossen',
                'common.rating': 'Bewertung',
                'common.search': 'Suchen',
                'common.geolocation_error': 'Geolokalisierungsfehler',
                'common.geolocation_unsupported': 'Geolokalisierung nicht unterstützt',

                // Transport
                'transport.stops_nearby': '📍 Haltestellen in der Nähe',
                'transport.frequency': 'Frequenz',
                'transport.schedule': 'Fahrplan',
                'transport.min': 'Min',
                'transport.searching': '⏳ Suche...',
                'transport.position_found': 'Position gefunden',

                // Parking
                'parking.filter.all': 'Alle',
                'parking.filter.available': '🟢 Verfügbar',
                'parking.filter.underground': '🏢 Tiefgarage',
                'parking.places': 'Plätze',
                'parking.status.available': 'Verfügbar',
                'parking.status.full': 'Voll',
                'parking.status.busy': 'Belegt',
                'parking.go': 'Hingehen 🗺️',
                'parking.search_btn': 'Parkplatz suchen',

                // Monuments
                'monuments.rating': 'Bewertung',

                // Restaurants
                'restaurants.price_level': 'Preisniveau',

                // Shopping
                'shopping.tips.title': '💡 Verhandlungstipps',
                'shopping.tips.1': 'Immer in den Souks handeln (Ziel -30% bis -50%)',
                'shopping.tips.2': 'Das Ensemble Artisanal bietet garantierte Festpreise',
                'shopping.tips.3': 'Lächeln Sie, es ist ein soziales Spiel!',

                // Route Planner
                'route.from': 'Von',
                'route.to': 'Nach',
                'route.current_location': '📍 Mein Standort',
                'route.calculate': 'Route berechnen 🚀',
                'route.suggested': 'Vorgeschlagene Routen',
                'route.type.recommended': 'Empfohlen',
                'route.type.fastest': 'Schnellste',
                'route.type.cheapest': 'Günstigste',

                // Favorites
                'favorites.empty': 'Keine Favoriten',
                'favorites.empty_desc': 'Fügen Sie Orte zu Favoriten hinzu, um sie hier zu sehen.',
                'favorites.explore': 'Erkunden',
                'favorites.remove': 'Entfernen'
            }
        };
    }

    toggleLanguage() {
        const langs = ['fr', 'en', 'ar', 'es', 'de'];
        const currentIndex = langs.indexOf(this.currentLang);
        this.currentLang = langs[(currentIndex + 1) % langs.length];
        window.app.storage.set('language', this.currentLang);
        this.applyLanguage();

        // Show toast
        const langNames = { 'fr': 'Français 🇫🇷', 'en': 'English 🇬🇧', 'ar': 'Arabe 🇲🇦', 'es': 'Español 🇪🇸', 'de': 'Deutsch 🇩🇪' };
        this.showToast(`Langue : ${langNames[this.currentLang]}`);
    }

    setLanguage(lang) {
        if (this.translations[lang]) {
            this.currentLang = lang;
            window.app.storage.set('language', this.currentLang);

            // Update flag and select value
            const flags = { 'fr': '🇫🇷', 'en': '🇬🇧', 'es': '🇪🇸', 'de': '🇩🇪', 'ar': '🇲🇦' };
            const selectEl = document.getElementById('language-select');
            if (selectEl) selectEl.value = lang;

            this.applyLanguage();

            const langNames = {
                'fr': 'Français 🇫🇷',
                'en': 'English 🇬🇧',
                'ar': 'العربية 🇲🇦',
                'es': 'Español 🇪🇸',
                'de': 'Deutsch 🇩🇪'
            };
            this.showToast(`Langue : ${langNames[this.currentLang]}`);
        }
    }

    applyLanguage() {
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLang;
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';

        // Update text content for elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            if (this.translations[this.currentLang][key]) {
                el.textContent = this.translations[this.currentLang][key];
            }
        });

        // Update specific elements that might not have data-i18n (dynamic content needs re-render)
        // For simplicity, we reload the current module to re-render with new language
        // But since data is static JS, we might need a more complex solution for data translation.
        // For now, let's just handle the static UI parts.

        // Force re-render of current view if possible
        const currentRoute = window.app.router.getCurrentRoute();
        window.app.loadModule(currentRoute);

        // Explicitly re-render home if we are on it, as loadModule might not trigger full re-render for static content
        if (currentRoute === 'home' || currentRoute === '') {
            const mainContent = document.getElementById('main-content');
            if (mainContent) window.app.renderHome(mainContent);
        }
    }

    t(key) {
        return this.translations[this.currentLang][key] || key;
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 2rem;
            z-index: 1000;
            animation: fadeInOut 2s ease forwards;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }
}

window.LanguageFeature = LanguageFeature;
