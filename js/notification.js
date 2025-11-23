/**
 * NotificationManager
 * Handles browser notifications and alert checking.
 */
class NotificationManager {
    constructor() {
        this.permission = 'default';
        this.checkInterval = null;
    }

    async requestPermission() {
        if (!('Notification' in window)) {
            console.warn('Ce navigateur ne supporte pas les notifications.');
            return false;
        }

        if (Notification.permission === 'granted') {
            this.permission = 'granted';
            return true;
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            this.permission = permission;
            return permission === 'granted';
        }

        return false;
    }

    sendNotification(title, options = {}) {
        if (this.permission === 'granted') {
            new Notification(title, {
                icon: '🚗',
                badge: '🔔',
                ...options
            });
        }
    }

    checkExpiringDocuments() {
        if (!window.DocumentManager || !window.SettingsManager) return;

        const settings = window.SettingsManager.getSettings();
        if (!settings.notifications) return;

        const documents = window.DocumentManager.getAll();
        const alertDays = settings.alertDays || 30;
        const today = new Date();

        let expiredCount = 0;
        let warningCount = 0;

        documents.forEach(doc => {
            const status = window.DocumentManager.getStatus(doc.expiryDate);

            if (status === 'expired') {
                expiredCount++;
            } else if (status === 'warning') {
                const expiry = new Date(doc.expiryDate);
                const diffTime = expiry - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= alertDays) {
                    warningCount++;
                }
            }
        });

        // Send notifications
        if (expiredCount > 0) {
            this.sendNotification('⚠️ Documents expirés!', {
                body: `${expiredCount} document(s) ont expiré. Veuillez les renouveler.`,
                tag: 'expired-docs',
                requireInteraction: true
            });
        }

        if (warningCount > 0) {
            this.sendNotification('🔔 Documents à renouveler bientôt', {
                body: `${warningCount} document(s) expirent dans moins de ${alertDays} jours.`,
                tag: 'warning-docs'
            });
        }

        return { expired: expiredCount, warning: warningCount };
    }

    updateBadge() {
        if (!window.DocumentManager) return;

        const documents = window.DocumentManager.getAll();
        let alertCount = 0;

        documents.forEach(doc => {
            const status = window.DocumentManager.getStatus(doc.expiryDate);
            if (status === 'expired' || status === 'warning') {
                alertCount++;
            }
        });

        const badge = document.querySelector('.notification-badge');
        if (badge) {
            if (alertCount > 0) {
                badge.innerHTML = `🔔 <span class="badge-count">${alertCount}</span>`;
            } else {
                badge.innerHTML = '🔔';
            }
        }

        return alertCount;
    }

    startPeriodicCheck(intervalMinutes = 60) {
        // Check immediately
        this.checkExpiringDocuments();
        this.updateBadge();

        // Then check periodically
        this.checkInterval = setInterval(() => {
            this.checkExpiringDocuments();
            this.updateBadge();
        }, intervalMinutes * 60 * 1000);
    }

    stopPeriodicCheck() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    async init() {
        const settings = window.SettingsManager ? window.SettingsManager.getSettings() : { notifications: true };

        if (settings.notifications) {
            await this.requestPermission();
            this.startPeriodicCheck(60); // Check every hour
        }

        this.updateBadge();
    }
}

window.NotificationManager = new NotificationManager();
