/**
 * I18n Manager
 * Centralized internationalization system for AutoManager
 * Supports: FR, EN, AR, ES, DE with RTL support for Arabic
 */
class I18nManager {
    constructor() {
        this.currentLang = this.getSavedLanguage() || 'fr';
        this.translations = {
            'fr': {
                // Navigation
                'nav.dashboard': 'Tableau de bord',
                'nav.vehicles': 'Véhicules',
                'nav.documents': 'Documents',
                'nav.providers': 'Fournisseurs',
                'nav.best_route': 'Meilleur trajet',
                'nav.transport': 'Transports',
                'nav.parking': 'Parking Marrakech',
                'nav.tourism': 'Tourisme',
                'nav.car_advisor': 'Conseiller d\'Achat',
                'nav.maintenance': 'Entretien',
                'nav.settings': 'Paramètres',

                // Common
                'common.search': 'Rechercher...',
                'common.save': 'Enregistrer',
                'common.cancel': 'Annuler',
                'common.delete': 'Supprimer',
                'common.edit': 'Modifier',
                'common.add': 'Ajouter',
                'common.close': 'Fermer',
                'common.confirm': 'Confirmer',
                'common.yes': 'Oui',
                'common.no': 'Non',
                'common.loading': 'Chargement...',
                'common.error': 'Erreur',
                'common.success': 'Succès',
                'common.warning': 'Attention',
                'common.info': 'Information',

                // Auth
                'auth.locked': 'Verrouillé',
                'auth.enter_pin': 'Entrez votre code PIN pour accéder',
                'auth.forgot_pin': 'Code oublié ?',

                // Dashboard
                'dashboard.welcome': 'Bienvenue sur AutoManager',
                'dashboard.hello': 'Bonjour',
                'dashboard.fleet_overview': 'Voici un aperçu de votre flotte.',
                'dashboard.total_vehicles': 'Véhicules',
                'dashboard.alerts': 'Alertes',
                'dashboard.total_expenses': 'Dépenses Totales',
                'dashboard.upcoming_title': 'Prochains Entretiens (Estimations)',
                'dashboard.no_upcoming': 'Aucun entretien prévu prochainement.',
                'dashboard.stats_title': 'Statistiques Détaillées',
                'dashboard.cost_over_time': 'Coût cumulé dans le temps',
                'dashboard.cost_by_vehicle': 'Coût par Véhicule',
                'dashboard.notifications_title': 'Notifications',
                'dashboard.no_notifications': 'Aucune notification',
                'dashboard.all_docs_valid': 'Tous vos documents sont à jour !',
                'dashboard.annual_service': 'Révision annuelle',
                'dashboard.in_days': 'Dans {days} jours',
                'dashboard.expired': 'expiré',
                'dashboard.to_renew': 'à renouveler',
                'dashboard.expires_in': 'Expire dans {days} jour(s)',
                'dashboard.expired_on': 'Expiré le',
                'dashboard.vehicle': 'Véhicule',

                // Vehicles
                'vehicles.title': 'Mes Véhicules',
                'vehicles.add': 'Ajouter un véhicule',
                'vehicles.new_vehicle': 'Nouveau Véhicule',
                'vehicles.edit_vehicle': 'Modifier le Véhicule',
                'vehicles.vehicle_details': 'Détails du véhicule',
                'vehicles.brand': 'Marque',
                'vehicles.model': 'Modèle',
                'vehicles.year': 'Année',
                'vehicles.plate': 'Immatriculation',
                'vehicles.plate_label': 'Plaque',
                'vehicles.type': 'Type',
                'vehicles.select_type': 'Sélectionner un type',
                'vehicles.select_brand': 'Sélectionner une marque',
                'vehicles.select_model': 'Sélectionner un modèle',
                'vehicles.select_first_type': 'Sélectionner d\'abord un type',
                'vehicles.select_first_brand': 'Sélectionner d\'abord une marque',
                'vehicles.fuel': 'Carburant',
                'vehicles.mileage': 'Kilométrage',
                'vehicles.current_mileage': 'Kilométrage actuel',
                'vehicles.purchase_date': 'Date d\'achat',
                'vehicles.purchase_price': 'Prix d\'achat',
                'vehicles.photo': 'Photo du véhicule (optionnel)',
                'vehicles.no_vehicles': 'Aucun véhicule enregistré.',
                'vehicles.add_first': 'Ajoutez votre premier véhicule pour commencer le suivi.',
                'vehicles.delete_confirm': 'Êtes-vous sûr de vouloir supprimer ce véhicule ? Cette action est irréversible.',
                'vehicles.created_on': 'Créé le',
                'vehicles.type_car': 'Voiture',
                'vehicles.type_motorcycle': 'Moto',
                'vehicles.type_truck': 'Camion',
                'vehicles.other': 'Autre / Inconnu',
                'vehicles.enter_brand': 'Saisir la marque',
                'vehicles.enter_model': 'Saisir le modèle',

                // Documents
                'documents.title': 'Documents',
                'documents.add': 'Ajouter un document',
                'documents.new_document': 'Nouveau Document',
                'documents.edit_document': 'Modifier le Document',
                'documents.type': 'Type',
                'documents.doc_type': 'Type de document',
                'documents.number': 'Numéro',
                'documents.issue_date': 'Date d\'émission',
                'documents.expiry_date': 'Date d\'expiration',
                'documents.expires_on': 'Expire le',
                'documents.status': 'Statut',
                'documents.notes': 'Notes (Optionnel)',
                'documents.notes_placeholder': 'Numéro de police, détails...',
                'documents.photo': 'Photo du document (optionnel)',
                'documents.valid': 'Valide',
                'documents.expired': 'Expiré',
                'documents.expiring_soon': 'Bientôt',
                'documents.unknown': 'N/A',
                'documents.no_documents': 'Aucun document pour ce véhicule.',
                'documents.no_vehicles': 'Aucun véhicule trouvé.',
                'documents.add_vehicle_first': 'Veuillez d\'abord ajouter un véhicule pour gérer ses documents.',
                'documents.go_to_vehicles': 'Aller aux Véhicules',
                'documents.delete_confirm': 'Êtes-vous sûr de vouloir supprimer ce document ?',
                'documents.type_license': 'Permis de conduire',
                'documents.type_insurance': 'Assurance',
                'documents.type_technical': 'Contrôle Technique',
                'documents.type_registration': 'Carte Grise',
                'documents.type_other': 'Autre',
                'documents.enter_type': 'Saisir le type de document',

                // Maintenance
                'maintenance.title': 'Entretien',
                'maintenance.add': 'Ajouter un entretien',
                'maintenance.new_maintenance': 'Nouvel Entretien',
                'maintenance.edit_maintenance': 'Modifier l\'Entretien',
                'maintenance.date': 'Date',
                'maintenance.type': 'Type',
                'maintenance.cost': 'Coût',
                'maintenance.provider': 'Fournisseur',
                'maintenance.notes': 'Notes',
                'maintenance.mileage': 'Kilométrage',
                'maintenance.km': 'km',
                'maintenance.optional': 'Optionnel',
                'maintenance.select_vehicle': 'Sélectionner un véhicule',

                // Maintenance Types
                'maintenance.type_oil_change': 'Vidange',
                'maintenance.type_tires': 'Pneus',
                'maintenance.type_brakes': 'Freins',
                'maintenance.type_filters': 'Filtres',
                'maintenance.type_battery': 'Batterie',
                'maintenance.type_service': 'Révision',
                'maintenance.type_repair': 'Réparation',
                'maintenance.type_other': 'Autre',

                // Maintenance Messages
                'maintenance.no_vehicles': 'Aucun véhicule trouvé.',
                'maintenance.add_vehicle_first': 'Veuillez d\'abord ajouter un véhicule pour gérer son entretien.',
                'maintenance.go_to_vehicles': 'Aller aux Véhicules',
                'maintenance.no_records': 'Aucun entretien pour ce véhicule.',
                'maintenance.delete_confirm': 'Êtes-vous sûr de vouloir supprimer cet entretien ?',

                // Maintenance Stats
                'maintenance.total_cost': 'Coût total',
                'maintenance.last_maintenance': 'Dernier entretien',
                'maintenance.upcoming': 'Prochains entretiens',
                'maintenance.predicted': 'Prévu',
                'maintenance.due_in': 'Dans',
                'maintenance.days': 'jours',
                'maintenance.or': 'ou',
                'maintenance.next': 'Prochain entretien',

                // Settings
                'settings.title': 'Paramètres',
                'settings.appearance': 'Apparence',
                'settings.dark_mode': 'Mode Sombre',
                'settings.dark_mode_desc': 'Basculer entre le thème clair et sombre',
                'settings.language': 'Langue',
                'settings.language_desc': 'Langue de l\'interface',
                'settings.profile': 'Profil',
                'settings.username': 'Nom d\'utilisateur',
                'settings.notifications': 'Notifications',
                'settings.enable_notifications': 'Activer les notifications',
                'settings.notifications_desc': 'Recevoir des alertes pour les documents',
                'settings.alert_days': 'Délai d\'alerte',
                'settings.alert_days_desc': 'Jours avant expiration',
                'settings.data_backup': 'Données & Sauvegarde',
                'settings.export': 'Sauvegarder',
                'settings.import': 'Restaurer',
                'settings.clear_all': 'Effacer tout',
                'settings.security': 'Sécurité',
                'settings.pin_code': 'Code PIN',
                'settings.pin_desc': 'Protéger l\'accès à l\'application',
                'settings.change_pin': 'Changer',
                'settings.disable_pin': 'Désactiver',
                'settings.set_pin': 'Définir un code',
                'settings.biometric': 'Face ID / Touch ID',
                'settings.biometric_desc': 'Déverrouillage biométrique',
                'settings.about': 'À propos',
                'settings.version': 'Version',
                'settings.developer': 'Développeur',
                'settings.save_changes': 'Enregistrer les modifications',

                // Providers
                'providers.title': 'Fournisseurs',
                'providers.search': 'Trouver un Fournisseur',
                'providers.city': 'Ville',
                'providers.service_type': 'Type de service',
                'providers.vehicle_brand': 'Marque du véhicule (optionnel)',
                'providers.budget': 'Budget (optionnel)',
                'providers.search_ai': 'Rechercher avec IA',

                // Car Advisor
                'advisor.title': 'Conseiller d\'Achat',
                'advisor.budget': 'Budget',
                'advisor.usage': 'Usage',
                'advisor.tech': 'Tech',
                'advisor.preferences': 'Préférences',
                'advisor.previous': 'Précédent',
                'advisor.next': 'Suivant',

                // Notifications
                'notifications.title': 'Notifications',
                'notifications.no_notifications': 'Aucune notification',

                // User Menu
                'user.my_account': 'Mon Compte',
                'user.settings': 'Paramètres',
                'user.export_data': 'Exporter les données',
                'user.about': 'À propos',

                // Modals
                'modal.confirmation': 'Confirmation',
                'modal.are_you_sure': 'Êtes-vous sûr ?',

                // Languages
                'lang.french': 'Français',
                'lang.english': 'English',
                'lang.arabic': 'العربية',
                'lang.spanish': 'Español',
                'lang.german': 'Deutsch'
            },
            'en': {
                // Navigation
                'nav.dashboard': 'Dashboard',
                'nav.vehicles': 'Vehicles',
                'nav.documents': 'Documents',
                'nav.providers': 'Providers',
                'nav.best_route': 'Best Route',
                'nav.transport': 'Transport',
                'nav.parking': 'Parking Marrakech',
                'nav.tourism': 'Tourism',
                'nav.car_advisor': 'Car Advisor',
                'nav.maintenance': 'Maintenance',
                'nav.settings': 'Settings',

                // Common
                'common.search': 'Search...',
                'common.save': 'Save',
                'common.cancel': 'Cancel',
                'common.delete': 'Delete',
                'common.edit': 'Edit',
                'common.add': 'Add',
                'common.close': 'Close',
                'common.confirm': 'Confirm',
                'common.yes': 'Yes',
                'common.no': 'No',
                'common.loading': 'Loading...',
                'common.error': 'Error',
                'common.success': 'Success',
                'common.warning': 'Warning',
                'common.info': 'Information',

                // Auth
                'auth.locked': 'Locked',
                'auth.enter_pin': 'Enter your PIN code to access',
                'auth.forgot_pin': 'Forgot PIN?',

                // Dashboard
                'dashboard.welcome': 'Welcome to AutoManager',
                'dashboard.hello': 'Hello',
                'dashboard.fleet_overview': 'Here is an overview of your fleet.',
                'dashboard.total_vehicles': 'Vehicles',
                'dashboard.alerts': 'Alerts',
                'dashboard.total_expenses': 'Total Expenses',
                'dashboard.upcoming_title': 'Upcoming Maintenance (Estimates)',
                'dashboard.no_upcoming': 'No upcoming maintenance scheduled.',
                'dashboard.stats_title': 'Detailed Statistics',
                'dashboard.cost_over_time': 'Cumulative Cost Over Time',
                'dashboard.cost_by_vehicle': 'Cost by Vehicle',
                'dashboard.notifications_title': 'Notifications',
                'dashboard.no_notifications': 'No notifications',
                'dashboard.all_docs_valid': 'All your documents are up to date!',
                'dashboard.annual_service': 'Annual service',
                'dashboard.in_days': 'In {days} days',
                'dashboard.expired': 'expired',
                'dashboard.to_renew': 'to renew',
                'dashboard.expires_in': 'Expires in {days} day(s)',
                'dashboard.expired_on': 'Expired on',
                'dashboard.vehicle': 'Vehicle',

                // Vehicles
                'vehicles.title': 'My Vehicles',
                'vehicles.add': 'Add Vehicle',
                'vehicles.new_vehicle': 'New Vehicle',
                'vehicles.edit_vehicle': 'Edit Vehicle',
                'vehicles.vehicle_details': 'Vehicle Details',
                'vehicles.brand': 'Brand',
                'vehicles.model': 'Model',
                'vehicles.year': 'Year',
                'vehicles.plate': 'License Plate',
                'vehicles.plate_label': 'Plate',
                'vehicles.type': 'Type',
                'vehicles.select_type': 'Select a type',
                'vehicles.select_brand': 'Select a brand',
                'vehicles.select_model': 'Select a model',
                'vehicles.select_first_type': 'Select a type first',
                'vehicles.select_first_brand': 'Select a brand first',
                'vehicles.fuel': 'Fuel',
                'vehicles.mileage': 'Mileage',
                'vehicles.current_mileage': 'Current Mileage',
                'vehicles.purchase_date': 'Purchase Date',
                'vehicles.purchase_price': 'Purchase Price',
                'vehicles.photo': 'Vehicle Photo (optional)',
                'vehicles.no_vehicles': 'No vehicles registered.',
                'vehicles.add_first': 'Add your first vehicle to start tracking.',
                'vehicles.delete_confirm': 'Are you sure you want to delete this vehicle? This action is irreversible.',
                'vehicles.created_on': 'Created on',
                'vehicles.type_car': 'Car',
                'vehicles.type_motorcycle': 'Motorcycle',
                'vehicles.type_truck': 'Truck',
                'vehicles.other': 'Other / Unknown',
                'vehicles.enter_brand': 'Enter brand',
                'vehicles.enter_model': 'Enter model',

                // Documents
                'documents.title': 'Documents',
                'documents.add': 'Add Document',
                'documents.new_document': 'New Document',
                'documents.edit_document': 'Edit Document',
                'documents.type': 'Type',
                'documents.doc_type': 'Document Type',
                'documents.number': 'Number',
                'documents.issue_date': 'Issue Date',
                'documents.expiry_date': 'Expiry Date',
                'documents.expires_on': 'Expires on',
                'documents.status': 'Status',
                'documents.notes': 'Notes (Optional)',
                'documents.notes_placeholder': 'Policy number, details...',
                'documents.photo': 'Document Photo (optional)',
                'documents.valid': 'Valid',
                'documents.expired': 'Expired',
                'documents.expiring_soon': 'Soon',
                'documents.unknown': 'N/A',
                'documents.no_documents': 'No documents for this vehicle.',
                'documents.no_vehicles': 'No vehicles found.',
                'documents.add_vehicle_first': 'Please add a vehicle first to manage its documents.',
                'documents.go_to_vehicles': 'Go to Vehicles',
                'documents.delete_confirm': 'Are you sure you want to delete this document?',
                'documents.type_license': 'Driver\'s License',
                'documents.type_insurance': 'Insurance',
                'documents.type_technical': 'Technical Inspection',
                'documents.type_registration': 'Registration Card',
                'documents.type_other': 'Other',
                'documents.enter_type': 'Enter document type',

                // Maintenance
                'maintenance.title': 'Maintenance',
                'maintenance.add': 'Add Maintenance',
                'maintenance.new_maintenance': 'New Maintenance',
                'maintenance.edit_maintenance': 'Edit Maintenance',
                'maintenance.date': 'Date',
                'maintenance.type': 'Type',
                'maintenance.cost': 'Cost',
                'maintenance.provider': 'Provider',
                'maintenance.notes': 'Notes',
                'maintenance.mileage': 'Mileage',
                'maintenance.km': 'km',
                'maintenance.optional': 'Optional',
                'maintenance.select_vehicle': 'Select a vehicle',

                // Maintenance Types
                'maintenance.type_oil_change': 'Oil Change',
                'maintenance.type_tires': 'Tires',
                'maintenance.type_brakes': 'Brakes',
                'maintenance.type_filters': 'Filters',
                'maintenance.type_battery': 'Battery',
                'maintenance.type_service': 'Service',
                'maintenance.type_repair': 'Repair',
                'maintenance.type_other': 'Other',

                // Maintenance Messages
                'maintenance.no_vehicles': 'No vehicles found.',
                'maintenance.add_vehicle_first': 'Please add a vehicle first to manage its maintenance.',
                'maintenance.go_to_vehicles': 'Go to Vehicles',
                'maintenance.no_records': 'No maintenance for this vehicle.',
                'maintenance.delete_confirm': 'Are you sure you want to delete this maintenance?',

                // Maintenance Stats
                'maintenance.total_cost': 'Total Cost',
                'maintenance.last_maintenance': 'Last Maintenance',
                'maintenance.upcoming': 'Upcoming Maintenance',
                'maintenance.predicted': 'Predicted',
                'maintenance.due_in': 'Due in',
                'maintenance.days': 'days',
                'maintenance.or': 'or',
                'maintenance.next': 'Next Maintenance',

                // Settings
                'settings.title': 'Settings',
                'settings.appearance': 'Appearance',
                'settings.dark_mode': 'Dark Mode',
                'settings.dark_mode_desc': 'Switch between light and dark theme',
                'settings.language': 'Language',
                'settings.language_desc': 'Interface language',
                'settings.profile': 'Profile',
                'settings.username': 'Username',
                'settings.notifications': 'Notifications',
                'settings.enable_notifications': 'Enable notifications',
                'settings.notifications_desc': 'Receive alerts for documents',
                'settings.alert_days': 'Alert delay',
                'settings.alert_days_desc': 'Days before expiration',
                'settings.data_backup': 'Data & Backup',
                'settings.export': 'Backup',
                'settings.import': 'Restore',
                'settings.clear_all': 'Clear All',
                'settings.security': 'Security',
                'settings.pin_code': 'PIN Code',
                'settings.pin_desc': 'Protect app access',
                'settings.change_pin': 'Change',
                'settings.disable_pin': 'Disable',
                'settings.set_pin': 'Set PIN',
                'settings.biometric': 'Face ID / Touch ID',
                'settings.biometric_desc': 'Biometric unlock',
                'settings.about': 'About',
                'settings.version': 'Version',
                'settings.developer': 'Developer',
                'settings.save_changes': 'Save Changes',

                // Providers
                'providers.title': 'Providers',
                'providers.search': 'Find a Provider',
                'providers.city': 'City',
                'providers.service_type': 'Service Type',
                'providers.vehicle_brand': 'Vehicle Brand (optional)',
                'providers.budget': 'Budget (optional)',
                'providers.search_ai': 'Search with AI',

                // Car Advisor
                'advisor.title': 'Car Advisor',
                'advisor.budget': 'Budget',
                'advisor.usage': 'Usage',
                'advisor.tech': 'Tech',
                'advisor.preferences': 'Preferences',
                'advisor.previous': 'Previous',
                'advisor.next': 'Next',

                // Notifications
                'notifications.title': 'Notifications',
                'notifications.no_notifications': 'No notifications',

                // User Menu
                'user.my_account': 'My Account',
                'user.settings': 'Settings',
                'user.export_data': 'Export Data',
                'user.about': 'About',

                // Modals
                'modal.confirmation': 'Confirmation',
                'modal.are_you_sure': 'Are you sure?',

                // Languages
                'lang.french': 'Français',
                'lang.english': 'English',
                'lang.arabic': 'العربية',
                'lang.spanish': 'Español',
                'lang.german': 'Deutsch'
            },
            'ar': {
                // Navigation
                'nav.dashboard': 'لوحة القيادة',
                'nav.vehicles': 'المركبات',
                'nav.documents': 'الوثائق',
                'nav.providers': 'مقدمو الخدمات',
                'nav.best_route': 'أفضل مسار',
                'nav.transport': 'النقل',
                'nav.parking': 'موقف مراكش',
                'nav.tourism': 'السياحة',
                'nav.car_advisor': 'مستشار السيارات',
                'nav.maintenance': 'الصيانة',
                'nav.settings': 'الإعدادات',

                // Common
                'common.search': 'بحث...',
                'common.save': 'حفظ',
                'common.cancel': 'إلغاء',
                'common.delete': 'حذف',
                'common.edit': 'تعديل',
                'common.add': 'إضافة',
                'common.close': 'إغلاق',
                'common.confirm': 'تأكيد',
                'common.yes': 'نعم',
                'common.no': 'لا',
                'common.loading': 'جاري التحميل...',
                'common.error': 'خطأ',
                'common.success': 'نجح',
                'common.warning': 'تحذير',
                'common.info': 'معلومات',

                // Auth
                'auth.locked': 'مقفل',
                'auth.enter_pin': 'أدخل رمز PIN للوصول',
                'auth.forgot_pin': 'نسيت الرمز؟',

                // Dashboard
                'dashboard.welcome': 'مرحباً بك في AutoManager',
                'dashboard.hello': 'مرحباً',
                'dashboard.fleet_overview': 'إليك نظرة عامة على أسطولك.',
                'dashboard.total_vehicles': 'المركبات',
                'dashboard.alerts': 'التنبيهات',
                'dashboard.total_expenses': 'المصروفات الإجمالية',
                'dashboard.upcoming_title': 'الصيانة القادمة (تقديرات)',
                'dashboard.no_upcoming': 'لا توجد صيانة مجدولة قريباً.',
                'dashboard.stats_title': 'إحصائيات مفصلة',
                'dashboard.cost_over_time': 'التكلفة التراكمية مع مرور الوقت',
                'dashboard.cost_by_vehicle': 'التكلفة حسب المركبة',
                'dashboard.notifications_title': 'الإشعارات',
                'dashboard.no_notifications': 'لا توجد إشعارات',
                'dashboard.all_docs_valid': 'جميع وثائقك محدثة!',
                'dashboard.annual_service': 'خدمة سنوية',
                'dashboard.in_days': 'في {days} أيام',
                'dashboard.expired': 'منتهي الصلاحية',
                'dashboard.to_renew': 'للتجديد',
                'dashboard.expires_in': 'ينتهي في {days} يوم',
                'dashboard.expired_on': 'انتهت صلاحيته في',
                'dashboard.vehicle': 'مركبة',

                // Vehicles
                'vehicles.title': 'مركباتي',
                'vehicles.add': 'إضافة مركبة',
                'vehicles.new_vehicle': 'مركبة جديدة',
                'vehicles.edit_vehicle': 'تعديل المركبة',
                'vehicles.vehicle_details': 'تفاصيل المركبة',
                'vehicles.brand': 'العلامة التجارية',
                'vehicles.model': 'الطراز',
                'vehicles.year': 'السنة',
                'vehicles.plate': 'لوحة الترخيص',
                'vehicles.plate_label': 'اللوحة',
                'vehicles.type': 'النوع',
                'vehicles.select_type': 'اختر نوعاً',
                'vehicles.select_brand': 'اختر علامة تجارية',
                'vehicles.select_model': 'اختر طرازاً',
                'vehicles.select_first_type': 'اختر النوع أولاً',
                'vehicles.select_first_brand': 'اختر العلامة التجارية أولاً',
                'vehicles.fuel': 'الوقود',
                'vehicles.mileage': 'المسافة المقطوعة',
                'vehicles.current_mileage': 'المسافة الحالية',
                'vehicles.purchase_date': 'تاريخ الشراء',
                'vehicles.purchase_price': 'سعر الشراء',
                'vehicles.photo': 'صورة المركبة (اختياري)',
                'vehicles.no_vehicles': 'لا توجد مركبات مسجلة.',
                'vehicles.add_first': 'أضف مركبتك الأولى لبدء التتبع.',
                'vehicles.delete_confirm': 'هل أنت متأكد من حذف هذه المركبة؟ هذا الإجراء لا يمكن التراجع عنه.',
                'vehicles.created_on': 'تم الإنشاء في',
                'vehicles.type_car': 'سيارة',
                'vehicles.type_motorcycle': 'دراجة نارية',
                'vehicles.type_truck': 'شاحنة',
                'vehicles.other': 'أخرى / غير معروف',
                'vehicles.enter_brand': 'أدخل العلامة التجارية',
                'vehicles.enter_model': 'أدخل الطراز',

                // Documents
                'documents.title': 'الوثائق',
                'documents.add': 'إضافة وثيقة',
                'documents.new_document': 'وثيقة جديدة',
                'documents.edit_document': 'تعديل الوثيقة',
                'documents.type': 'النوع',
                'documents.doc_type': 'نوع الوثيقة',
                'documents.number': 'الرقم',
                'documents.issue_date': 'تاريخ الإصدار',
                'documents.expiry_date': 'تاريخ الانتهاء',
                'documents.expires_on': 'ينتهي في',
                'documents.status': 'الحالة',
                'documents.notes': 'ملاحظات (اختياري)',
                'documents.notes_placeholder': 'رقم الوثيقة، تفاصيل...',
                'documents.photo': 'صورة الوثيقة (اختياري)',
                'documents.valid': 'صالح',
                'documents.expired': 'منتهي الصلاحية',
                'documents.expiring_soon': 'قريباً',
                'documents.unknown': 'غير متاح',
                'documents.no_documents': 'لا توجد وثائق لهذه المركبة.',
                'documents.no_vehicles': 'لا توجد مركبات.',
                'documents.add_vehicle_first': 'يرجى إضافة مركبة أولاً لإدارة وثائقها.',
                'documents.go_to_vehicles': 'الذهاب إلى المركبات',
                'documents.delete_confirm': 'هل أنت متأكد من حذف هذه الوثيقة؟',
                'documents.type_license': 'رخصة القيادة',
                'documents.type_insurance': 'التأمين',
                'documents.type_technical': 'الفحص الفني',
                'documents.type_registration': 'بطاقة التسجيل',
                'documents.type_other': 'أخرى',
                'documents.enter_type': 'أدخل نوع الوثيقة',

                // Maintenance
                'maintenance.title': 'الصيانة',
                'maintenance.add': 'إضافة صيانة',
                'maintenance.new_maintenance': 'صيانة جديدة',
                'maintenance.edit_maintenance': 'تعديل الصيانة',
                'maintenance.date': 'التاريخ',
                'maintenance.type': 'النوع',
                'maintenance.cost': 'التكلفة',
                'maintenance.provider': 'مقدم الخدمة',
                'maintenance.notes': 'ملاحظات',
                'maintenance.mileage': 'المسافة المقطوعة',
                'maintenance.km': 'كم',
                'maintenance.optional': 'اختياري',
                'maintenance.select_vehicle': 'اختر مركبة',

                // Maintenance Types
                'maintenance.type_oil_change': 'تغيير الزيت',
                'maintenance.type_tires': 'الإطارات',
                'maintenance.type_brakes': 'الفرامل',
                'maintenance.type_filters': 'الفلاتر',
                'maintenance.type_battery': 'البطارية',
                'maintenance.type_service': 'صيانة دورية',
                'maintenance.type_repair': 'إصلاح',
                'maintenance.type_other': 'أخرى',

                // Maintenance Messages
                'maintenance.no_vehicles': 'لم يتم العثور على مركبات.',
                'maintenance.add_vehicle_first': 'يرجى إضافة مركبة أولاً لإدارة صيانتها.',
                'maintenance.go_to_vehicles': 'الذهاب إلى المركبات',
                'maintenance.no_records': 'لا توجد صيانة لهذه المركبة.',
                'maintenance.delete_confirm': 'هل أنت متأكد من حذف هذه الصيانة؟',

                // Maintenance Stats
                'maintenance.total_cost': 'التكلفة الإجمالية',
                'maintenance.last_maintenance': 'آخر صيانة',
                'maintenance.upcoming': 'الصيانة القادمة',
                'maintenance.predicted': 'متوقع',
                'maintenance.due_in': 'خلال',
                'maintenance.days': 'أيام',
                'maintenance.or': 'أو',
                'maintenance.next': 'الصيانة القادمة',

                // Settings
                'settings.title': 'الإعدادات',
                'settings.appearance': 'المظهر',
                'settings.dark_mode': 'الوضع الداكن',
                'settings.dark_mode_desc': 'التبديل بين السمة الفاتحة والداكنة',
                'settings.language': 'اللغة',
                'settings.language_desc': 'لغة الواجهة',
                'settings.profile': 'الملف الشخصي',
                'settings.username': 'اسم المستخدم',
                'settings.notifications': 'الإشعارات',
                'settings.enable_notifications': 'تفعيل الإشعارات',
                'settings.notifications_desc': 'تلقي تنبيهات للوثائق',
                'settings.alert_days': 'مهلة التنبيه',
                'settings.alert_days_desc': 'أيام قبل الانتهاء',
                'settings.data_backup': 'البيانات والنسخ الاحتياطي',
                'settings.export': 'نسخ احتياطي',
                'settings.import': 'استعادة',
                'settings.clear_all': 'مسح الكل',
                'settings.security': 'الأمان',
                'settings.pin_code': 'رمز PIN',
                'settings.pin_desc': 'حماية الوصول إلى التطبيق',
                'settings.change_pin': 'تغيير',
                'settings.disable_pin': 'تعطيل',
                'settings.set_pin': 'تعيين رمز',
                'settings.biometric': 'Face ID / Touch ID',
                'settings.biometric_desc': 'فتح بيومتري',
                'settings.about': 'حول',
                'settings.version': 'الإصدار',
                'settings.developer': 'المطور',
                'settings.save_changes': 'حفظ التغييرات',

                // Providers
                'providers.title': 'مقدمو الخدمات',
                'providers.search': 'البحث عن مقدم خدمة',
                'providers.city': 'المدينة',
                'providers.service_type': 'نوع الخدمة',
                'providers.vehicle_brand': 'علامة المركبة (اختياري)',
                'providers.budget': 'الميزانية (اختياري)',
                'providers.search_ai': 'البحث بالذكاء الاصطناعي',

                // Car Advisor
                'advisor.title': 'مستشار السيارات',
                'advisor.budget': 'الميزانية',
                'advisor.usage': 'الاستخدام',
                'advisor.tech': 'التقنية',
                'advisor.preferences': 'التفضيلات',
                'advisor.previous': 'السابق',
                'advisor.next': 'التالي',

                // Notifications
                'notifications.title': 'الإشعارات',
                'notifications.no_notifications': 'لا توجد إشعارات',

                // User Menu
                'user.my_account': 'حسابي',
                'user.settings': 'الإعدادات',
                'user.export_data': 'تصدير البيانات',
                'user.about': 'حول',

                // Modals
                'modal.confirmation': 'تأكيد',
                'modal.are_you_sure': 'هل أنت متأكد؟',

                // Languages
                'lang.french': 'Français',
                'lang.english': 'English',
                'lang.arabic': 'العربية',
                'lang.spanish': 'Español',
                'lang.german': 'Deutsch'
            },
            'es': {
                // Navigation
                'nav.dashboard': 'Panel',
                'nav.vehicles': 'Vehículos',
                'nav.documents': 'Documentos',
                'nav.providers': 'Proveedores',
                'nav.best_route': 'Mejor Ruta',
                'nav.transport': 'Transporte',
                'nav.parking': 'Parking Marrakech',
                'nav.tourism': 'Turismo',
                'nav.car_advisor': 'Asesor de Coches',
                'nav.maintenance': 'Mantenimiento',
                'nav.settings': 'Configuración',

                // Common
                'common.search': 'Buscar...',
                'common.save': 'Guardar',
                'common.cancel': 'Cancelar',
                'common.delete': 'Eliminar',
                'common.edit': 'Editar',
                'common.add': 'Añadir',
                'common.close': 'Cerrar',
                'common.confirm': 'Confirmar',
                'common.yes': 'Sí',
                'common.no': 'No',
                'common.loading': 'Cargando...',
                'common.error': 'Error',
                'common.success': 'Éxito',
                'common.warning': 'Advertencia',
                'common.info': 'Información',

                // Auth
                'auth.locked': 'Bloqueado',
                'auth.enter_pin': 'Ingrese su código PIN para acceder',
                'auth.forgot_pin': '¿Olvidó el PIN?',

                // Dashboard
                'dashboard.welcome': 'Bienvenido a AutoManager',
                'dashboard.hello': 'Hola',
                'dashboard.fleet_overview': 'Aquí hay una descripción general de su flota.',
                'dashboard.total_vehicles': 'Vehículos',
                'dashboard.alerts': 'Alertas',
                'dashboard.total_expenses': 'Gastos Totales',
                'dashboard.upcoming_title': 'Próximo Mantenimiento (Estimaciones)',
                'dashboard.no_upcoming': 'No hay mantenimiento programado próximamente.',
                'dashboard.stats_title': 'Estadísticas Detalladas',
                'dashboard.cost_over_time': 'Costo Acumulado en el Tiempo',
                'dashboard.cost_by_vehicle': 'Costo por Vehículo',
                'dashboard.notifications_title': 'Notificaciones',
                'dashboard.no_notifications': 'Sin notificaciones',
                'dashboard.all_docs_valid': '¡Todos sus documentos están actualizados!',
                'dashboard.annual_service': 'Servicio anual',
                'dashboard.in_days': 'En {days} días',
                'dashboard.expired': 'vencido',
                'dashboard.to_renew': 'para renovar',
                'dashboard.expires_in': 'Vence en {days} día(s)',
                'dashboard.expired_on': 'Vencido el',
                'dashboard.vehicle': 'Vehículo',

                // Vehicles
                'vehicles.title': 'Mis Vehículos',
                'vehicles.add': 'Añadir Vehículo',
                'vehicles.new_vehicle': 'Nuevo Vehículo',
                'vehicles.edit_vehicle': 'Editar Vehículo',
                'vehicles.vehicle_details': 'Detalles del Vehículo',
                'vehicles.brand': 'Marca',
                'vehicles.model': 'Modelo',
                'vehicles.year': 'Año',
                'vehicles.plate': 'Matrícula',
                'vehicles.plate_label': 'Placa',
                'vehicles.type': 'Tipo',
                'vehicles.select_type': 'Seleccionar un tipo',
                'vehicles.select_brand': 'Seleccionar una marca',
                'vehicles.select_model': 'Seleccionar un modelo',
                'vehicles.select_first_type': 'Seleccionar primero un tipo',
                'vehicles.select_first_brand': 'Seleccionar primero una marca',
                'vehicles.fuel': 'Combustible',
                'vehicles.mileage': 'Kilometraje',
                'vehicles.current_mileage': 'Kilometraje Actual',
                'vehicles.purchase_date': 'Fecha de Compra',
                'vehicles.purchase_price': 'Precio de Compra',
                'vehicles.photo': 'Foto del Vehículo (opcional)',
                'vehicles.no_vehicles': 'No hay vehículos registrados.',
                'vehicles.add_first': 'Añade tu primer vehículo para comenzar el seguimiento.',
                'vehicles.delete_confirm': '¿Está seguro de que desea eliminar este vehículo? Esta acción es irreversible.',
                'vehicles.created_on': 'Creado el',
                'vehicles.type_car': 'Coche',
                'vehicles.type_motorcycle': 'Motocicleta',
                'vehicles.type_truck': 'Camión',
                'vehicles.other': 'Otro / Desconocido',
                'vehicles.enter_brand': 'Ingresar marca',
                'vehicles.enter_model': 'Ingresar modelo',

                // Documents
                'documents.title': 'Documentos',
                'documents.add': 'Añadir Documento',
                'documents.new_document': 'Nuevo Documento',
                'documents.edit_document': 'Editar Documento',
                'documents.type': 'Tipo',
                'documents.doc_type': 'Tipo de Documento',
                'documents.number': 'Número',
                'documents.issue_date': 'Fecha de Emisión',
                'documents.expiry_date': 'Fecha de Vencimiento',
                'documents.expires_on': 'Vence el',
                'documents.status': 'Estado',
                'documents.notes': 'Notas (Opcional)',
                'documents.notes_placeholder': 'Número de póliza, detalles...',
                'documents.photo': 'Foto del Documento (opcional)',
                'documents.valid': 'Válido',
                'documents.expired': 'Vencido',
                'documents.expiring_soon': 'Pronto',
                'documents.unknown': 'N/A',
                'documents.no_documents': 'No hay documentos para este vehículo.',
                'documents.no_vehicles': 'No se encontraron vehículos.',
                'documents.add_vehicle_first': 'Por favor, añada un vehículo primero para gestionar sus documentos.',
                'documents.go_to_vehicles': 'Ir a Vehículos',
                'documents.delete_confirm': '¿Está seguro de que desea eliminar este documento?',
                'documents.type_license': 'Licencia de Conducir',
                'documents.type_insurance': 'Seguro',
                'documents.type_technical': 'Inspección Técnica',
                'documents.type_registration': 'Tarjeta de Registro',
                'documents.type_other': 'Otro',
                'documents.enter_type': 'Ingresar tipo de documento',

                // Maintenance
                'maintenance.title': 'Mantenimiento',
                'maintenance.add': 'Agregar Mantenimiento',
                'maintenance.new_maintenance': 'Nuevo Mantenimiento',
                'maintenance.edit_maintenance': 'Editar Mantenimiento',
                'maintenance.date': 'Fecha',
                'maintenance.type': 'Tipo',
                'maintenance.cost': 'Costo',
                'maintenance.provider': 'Proveedor',
                'maintenance.notes': 'Notas',
                'maintenance.mileage': 'Kilometraje',
                'maintenance.km': 'km',
                'maintenance.optional': 'Opcional',
                'maintenance.select_vehicle': 'Seleccionar un vehículo',

                // Maintenance Types
                'maintenance.type_oil_change': 'Cambio de Aceite',
                'maintenance.type_tires': 'Neumáticos',
                'maintenance.type_brakes': 'Frenos',
                'maintenance.type_filters': 'Filtros',
                'maintenance.type_battery': 'Batería',
                'maintenance.type_service': 'Servicio',
                'maintenance.type_repair': 'Reparación',
                'maintenance.type_other': 'Otro',

                // Maintenance Messages
                'maintenance.no_vehicles': 'No se encontraron vehículos.',
                'maintenance.add_vehicle_first': 'Por favor, agregue un vehículo primero para gestionar su mantenimiento.',
                'maintenance.go_to_vehicles': 'Ir a Vehículos',
                'maintenance.no_records': 'Sin mantenimiento para este vehículo.',
                'maintenance.delete_confirm': '¿Está seguro de que desea eliminar este mantenimiento?',

                // Maintenance Stats
                'maintenance.total_cost': 'Costo Total',
                'maintenance.last_maintenance': 'Último Mantenimiento',
                'maintenance.upcoming': 'Próximo Mantenimiento',
                'maintenance.predicted': 'Previsto',
                'maintenance.due_in': 'En',
                'maintenance.days': 'días',
                'maintenance.or': 'o',
                'maintenance.next': 'Próximo Mantenimiento',

                // Settings
                'settings.title': 'Configuración',
                'settings.appearance': 'Apariencia',
                'settings.dark_mode': 'Modo Oscuro',
                'settings.dark_mode_desc': 'Cambiar entre tema claro y oscuro',
                'settings.language': 'Idioma',
                'settings.language_desc': 'Idioma de la interfaz',
                'settings.profile': 'Perfil',
                'settings.username': 'Nombre de Usuario',
                'settings.notifications': 'Notificaciones',
                'settings.enable_notifications': 'Activar notificaciones',
                'settings.notifications_desc': 'Recibir alertas de documentos',
                'settings.alert_days': 'Plazo de alerta',
                'settings.alert_days_desc': 'Días antes del vencimiento',
                'settings.data_backup': 'Datos y Respaldo',
                'settings.export': 'Respaldar',
                'settings.import': 'Restaurar',
                'settings.clear_all': 'Borrar Todo',
                'settings.security': 'Seguridad',
                'settings.pin_code': 'Código PIN',
                'settings.pin_desc': 'Proteger acceso a la aplicación',
                'settings.change_pin': 'Cambiar',
                'settings.disable_pin': 'Desactivar',
                'settings.set_pin': 'Establecer PIN',
                'settings.biometric': 'Face ID / Touch ID',
                'settings.biometric_desc': 'Desbloqueo biométrico',
                'settings.about': 'Acerca de',
                'settings.version': 'Versión',
                'settings.developer': 'Desarrollador',
                'settings.save_changes': 'Guardar Cambios',

                // Providers
                'providers.title': 'Proveedores',
                'providers.search': 'Buscar Proveedor',
                'providers.city': 'Ciudad',
                'providers.service_type': 'Tipo de Servicio',
                'providers.vehicle_brand': 'Marca del Vehículo (opcional)',
                'providers.budget': 'Presupuesto (opcional)',
                'providers.search_ai': 'Buscar con IA',

                // Car Advisor
                'advisor.title': 'Asesor de Coches',
                'advisor.budget': 'Presupuesto',
                'advisor.usage': 'Uso',
                'advisor.tech': 'Tecnología',
                'advisor.preferences': 'Preferencias',
                'advisor.previous': 'Anterior',
                'advisor.next': 'Siguiente',

                // Notifications
                'notifications.title': 'Notificaciones',
                'notifications.no_notifications': 'Sin notificaciones',

                // User Menu
                'user.my_account': 'Mi Cuenta',
                'user.settings': 'Configuración',
                'user.export_data': 'Exportar Datos',
                'user.about': 'Acerca de',

                // Modals
                'modal.confirmation': 'Confirmación',
                'modal.are_you_sure': '¿Está seguro?',

                // Languages
                'lang.french': 'Français',
                'lang.english': 'English',
                'lang.arabic': 'العربية',
                'lang.spanish': 'Español',
                'lang.german': 'Deutsch'
            },
            'de': {
                // Navigation
                'nav.dashboard': 'Dashboard',
                'nav.vehicles': 'Fahrzeuge',
                'nav.documents': 'Dokumente',
                'nav.providers': 'Anbieter',
                'nav.best_route': 'Beste Route',
                'nav.transport': 'Transport',
                'nav.parking': 'Parking Marrakesch',
                'nav.tourism': 'Tourismus',
                'nav.car_advisor': 'Auto-Berater',
                'nav.maintenance': 'Wartung',
                'nav.settings': 'Einstellungen',

                // Common
                'common.search': 'Suchen...',
                'common.save': 'Speichern',
                'common.cancel': 'Abbrechen',
                'common.delete': 'Löschen',
                'common.edit': 'Bearbeiten',
                'common.add': 'Hinzufügen',
                'common.close': 'Schließen',
                'common.confirm': 'Bestätigen',
                'common.yes': 'Ja',
                'common.no': 'Nein',
                'common.loading': 'Laden...',
                'common.error': 'Fehler',
                'common.success': 'Erfolg',
                'common.warning': 'Warnung',
                'common.info': 'Information',

                // Auth
                'auth.locked': 'Gesperrt',
                'auth.enter_pin': 'Geben Sie Ihren PIN-Code ein',
                'auth.forgot_pin': 'PIN vergessen?',

                // Dashboard
                'dashboard.welcome': 'Willkommen bei AutoManager',
                'dashboard.hello': 'Hallo',
                'dashboard.fleet_overview': 'Hier ist eine Übersicht über Ihre Flotte.',
                'dashboard.total_vehicles': 'Fahrzeuge',
                'dashboard.alerts': 'Warnungen',
                'dashboard.total_expenses': 'Gesamtausgaben',
                'dashboard.upcoming_title': 'Anstehende Wartung (Schätzungen)',
                'dashboard.no_upcoming': 'Keine Wartung in Kürze geplant.',
                'dashboard.stats_title': 'Detaillierte Statistiken',
                'dashboard.cost_over_time': 'Kumulierte Kosten im Zeitverlauf',
                'dashboard.cost_by_vehicle': 'Kosten pro Fahrzeug',
                'dashboard.notifications_title': 'Benachrichtigungen',
                'dashboard.no_notifications': 'Keine Benachrichtigungen',
                'dashboard.all_docs_valid': 'Alle Ihre Dokumente sind auf dem neuesten Stand!',
                'dashboard.annual_service': 'Jährlicher Service',
                'dashboard.in_days': 'In {days} Tagen',
                'dashboard.expired': 'abgelaufen',
                'dashboard.to_renew': 'zu erneuern',
                'dashboard.expires_in': 'Läuft in {days} Tag(en) ab',
                'dashboard.expired_on': 'Abgelaufen am',
                'dashboard.vehicle': 'Fahrzeug',

                // Vehicles
                'vehicles.title': 'Meine Fahrzeuge',
                'vehicles.add': 'Fahrzeug hinzufügen',
                'vehicles.new_vehicle': 'Neues Fahrzeug',
                'vehicles.edit_vehicle': 'Fahrzeug bearbeiten',
                'vehicles.vehicle_details': 'Fahrzeugdetails',
                'vehicles.brand': 'Marke',
                'vehicles.model': 'Modell',
                'vehicles.year': 'Jahr',
                'vehicles.plate': 'Kennzeichen',
                'vehicles.plate_label': 'Platte',
                'vehicles.type': 'Typ',
                'vehicles.select_type': 'Typ auswählen',
                'vehicles.select_brand': 'Marke auswählen',
                'vehicles.select_model': 'Modell auswählen',
                'vehicles.select_first_type': 'Zuerst Typ auswählen',
                'vehicles.select_first_brand': 'Zuerst Marke auswählen',
                'vehicles.fuel': 'Kraftstoff',
                'vehicles.mileage': 'Kilometerstand',
                'vehicles.current_mileage': 'Aktueller Kilometerstand',
                'vehicles.purchase_date': 'Kaufdatum',
                'vehicles.purchase_price': 'Kaufpreis',
                'vehicles.photo': 'Fahrzeugfoto (optional)',
                'vehicles.no_vehicles': 'Keine Fahrzeuge registriert.',
                'vehicles.add_first': 'Fügen Sie Ihr erstes Fahrzeug hinzu, um die Verfolgung zu starten.',
                'vehicles.delete_confirm': 'Sind Sie sicher, dass Sie dieses Fahrzeug löschen möchten? Diese Aktion ist unwiderruflich.',
                'vehicles.created_on': 'Erstellt am',
                'vehicles.type_car': 'Auto',
                'vehicles.type_motorcycle': 'Motorrad',
                'vehicles.type_truck': 'LKW',
                'vehicles.other': 'Andere / Unbekannt',
                'vehicles.enter_brand': 'Marke eingeben',
                'vehicles.enter_model': 'Modell eingeben',

                // Documents
                'documents.title': 'Dokumente',
                'documents.add': 'Dokument hinzufügen',
                'documents.new_document': 'Neues Dokument',
                'documents.edit_document': 'Dokument bearbeiten',
                'documents.type': 'Typ',
                'documents.doc_type': 'Dokumenttyp',
                'documents.number': 'Nummer',
                'documents.issue_date': 'Ausstellungsdatum',
                'documents.expiry_date': 'Ablaufdatum',
                'documents.expires_on': 'Läuft ab am',
                'documents.status': 'Status',
                'documents.notes': 'Notizen (Optional)',
                'documents.notes_placeholder': 'Policennummer, Details...',
                'documents.photo': 'Dokumentfoto (optional)',
                'documents.valid': 'Gültig',
                'documents.expired': 'Abgelaufen',
                'documents.expiring_soon': 'Bald',
                'documents.unknown': 'N/A',
                'documents.no_documents': 'Keine Dokumente für dieses Fahrzeug.',
                'documents.no_vehicles': 'Keine Fahrzeuge gefunden.',
                'documents.add_vehicle_first': 'Bitte fügen Sie zuerst ein Fahrzeug hinzu, um dessen Dokumente zu verwalten.',
                'documents.go_to_vehicles': 'Zu Fahrzeugen',
                'documents.delete_confirm': 'Sind Sie sicher, dass Sie dieses Dokument löschen möchten?',
                'documents.type_license': 'Führerschein',
                'documents.type_insurance': 'Versicherung',
                'documents.type_technical': 'Technische Prüfung',
                'documents.type_registration': 'Zulassungsbescheinigung',
                'documents.type_other': 'Andere',
                'documents.enter_type': 'Dokumenttyp eingeben',

                // Maintenance
                'maintenance.title': 'Wartung',
                'maintenance.add': 'Wartung hinzufügen',
                'maintenance.new_maintenance': 'Neue Wartung',
                'maintenance.edit_maintenance': 'Wartung bearbeiten',
                'maintenance.date': 'Datum',
                'maintenance.type': 'Typ',
                'maintenance.cost': 'Kosten',
                'maintenance.provider': 'Anbieter',
                'maintenance.notes': 'Notizen',
                'maintenance.mileage': 'Kilometerstand',
                'maintenance.km': 'km',
                'maintenance.optional': 'Optional',
                'maintenance.select_vehicle': 'Fahrzeug auswählen',

                // Maintenance Types
                'maintenance.type_oil_change': 'Ölwechsel',
                'maintenance.type_tires': 'Reifen',
                'maintenance.type_brakes': 'Bremsen',
                'maintenance.type_filters': 'Filter',
                'maintenance.type_battery': 'Batterie',
                'maintenance.type_service': 'Inspektion',
                'maintenance.type_repair': 'Reparatur',
                'maintenance.type_other': 'Andere',

                // Maintenance Messages
                'maintenance.no_vehicles': 'Keine Fahrzeuge gefunden.',
                'maintenance.add_vehicle_first': 'Bitte fügen Sie zuerst ein Fahrzeug hinzu, um seine Wartung zu verwalten.',
                'maintenance.go_to_vehicles': 'Zu Fahrzeugen',
                'maintenance.no_records': 'Keine Wartung für dieses Fahrzeug.',
                'maintenance.delete_confirm': 'Sind Sie sicher, dass Sie diese Wartung löschen möchten?',

                // Maintenance Stats
                'maintenance.total_cost': 'Gesamtkosten',
                'maintenance.last_maintenance': 'Letzte Wartung',
                'maintenance.upcoming': 'Bevorstehende Wartung',
                'maintenance.predicted': 'Vorhergesagt',
                'maintenance.due_in': 'Fällig in',
                'maintenance.days': 'Tage',
                'maintenance.or': 'oder',
                'maintenance.next': 'Nächste Wartung',

                // Settings
                'settings.title': 'Einstellungen',
                'settings.appearance': 'Aussehen',
                'settings.dark_mode': 'Dunkler Modus',
                'settings.dark_mode_desc': 'Zwischen hellem und dunklem Design wechseln',
                'settings.language': 'Sprache',
                'settings.language_desc': 'Oberflächensprache',
                'settings.profile': 'Profil',
                'settings.username': 'Benutzername',
                'settings.notifications': 'Benachrichtigungen',
                'settings.enable_notifications': 'Benachrichtigungen aktivieren',
                'settings.notifications_desc': 'Dokumentenwarnungen erhalten',
                'settings.alert_days': 'Warnfrist',
                'settings.alert_days_desc': 'Tage vor Ablauf',
                'settings.data_backup': 'Daten & Sicherung',
                'settings.export': 'Sichern',
                'settings.import': 'Wiederherstellen',
                'settings.clear_all': 'Alles löschen',
                'settings.security': 'Sicherheit',
                'settings.pin_code': 'PIN-Code',
                'settings.pin_desc': 'App-Zugriff schützen',
                'settings.change_pin': 'Ändern',
                'settings.disable_pin': 'Deaktivieren',
                'settings.set_pin': 'PIN festlegen',
                'settings.biometric': 'Face ID / Touch ID',
                'settings.biometric_desc': 'Biometrische Entsperrung',
                'settings.about': 'Über',
                'settings.version': 'Version',
                'settings.developer': 'Entwickler',
                'settings.save_changes': 'Änderungen speichern',

                // Providers
                'providers.title': 'Anbieter',
                'providers.search': 'Anbieter finden',
                'providers.city': 'Stadt',
                'providers.service_type': 'Servicetyp',
                'providers.vehicle_brand': 'Fahrzeugmarke (optional)',
                'providers.budget': 'Budget (optional)',
                'providers.search_ai': 'Mit KI suchen',

                // Car Advisor
                'advisor.title': 'Auto-Berater',
                'advisor.budget': 'Budget',
                'advisor.usage': 'Nutzung',
                'advisor.tech': 'Technik',
                'advisor.preferences': 'Präferenzen',
                'advisor.previous': 'Zurück',
                'advisor.next': 'Weiter',

                // Notifications
                'notifications.title': 'Benachrichtigungen',
                'notifications.no_notifications': 'Keine Benachrichtigungen',

                // User Menu
                'user.my_account': 'Mein Konto',
                'user.settings': 'Einstellungen',
                'user.export_data': 'Daten exportieren',
                'user.about': 'Über',

                // Modals
                'modal.confirmation': 'Bestätigung',
                'modal.are_you_sure': 'Sind Sie sicher?',

                // Languages
                'lang.french': 'Français',
                'lang.english': 'English',
                'lang.arabic': 'العربية',
                'lang.spanish': 'Español',
                'lang.german': 'Deutsch'
            }
        };
    }

    /**
     * Get saved language from localStorage
     */
    getSavedLanguage() {
        const settings = localStorage.getItem('app_settings');
        if (settings) {
            try {
                const parsed = JSON.parse(settings);
                return parsed.language || 'fr';
            } catch (e) {
                return 'fr';
            }
        }
        return 'fr';
    }

    /**
     * Set and apply language
     */
    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.error(`Language ${lang} not supported`);
            return;
        }

        this.currentLang = lang;

        // Save to settings
        const settings = localStorage.getItem('app_settings');
        let settingsObj = settings ? JSON.parse(settings) : {};
        settingsObj.language = lang;
        localStorage.setItem('app_settings', JSON.stringify(settingsObj));

        // Reload page to apply language change
        // This ensures all modules re-render with new language
        window.location.reload();
    }

    /**
     * Apply language to DOM
     */
    applyLanguage() {
        // Update HTML attributes
        document.documentElement.lang = this.currentLang;
        document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';

        // Update body class for RTL
        if (this.currentLang === 'ar') {
            document.body.classList.add('rtl');
        } else {
            document.body.classList.remove('rtl');
        }

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const translation = this.t(key);

            // Update text content or placeholder
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                if (el.placeholder) {
                    el.placeholder = translation;
                }
            } else {
                el.textContent = translation;
            }
        });

        // Trigger custom event for modules to re-render
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLang }
        }));
    }

    /**
     * Translate a key
     */
    t(key) {
        return this.translations[this.currentLang][key] || key;
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * Check if current language is RTL
     */
    isRTL() {
        return this.currentLang === 'ar';
    }
}

// Initialize and expose globally
window.I18n = new I18nManager();

// Apply language immediately when script loads
// This ensures all elements with data-i18n are translated on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.I18n.applyLanguage();
    });
} else {
    // DOM already loaded
    window.I18n.applyLanguage();
}
