/**
 * Admin Dashboard Module
 * Manages admin interface for user management and statistics
 */

class AdminDashboard {
    constructor() {
        this.users = [];
        this.sessions = [];
        this.refreshInterval = null;
    }

    /**
     * Initialize admin dashboard
     */
    async init() {
        // Check if user is admin
        if (!window.AuthService) {
            this.showError('Service d\'authentification non disponible');
            return;
        }

        const currentUser = window.AuthService.getCurrentUser();
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        const isAdmin = await window.AuthService.isAdmin();
        if (!isAdmin) {
            alert('⛔ Accès refusé. Vous devez être administrateur pour accéder à cette page.');
            window.location.href = 'index.html';
            return;
        }

        // Load data
        await this.loadDashboardData();

        // Setup search and filters
        this.setupFilters();

        // Auto-refresh every 30 seconds
        this.refreshInterval = setInterval(() => {
            this.loadDashboardData();
        }, 30000);
    }

    /**
     * Load all dashboard data
     */
    async loadDashboardData() {
        try {
            await Promise.all([
                this.loadUsers(),
                this.loadSessions(),
                this.updateStatistics()
            ]);

            this.renderActiveUsers();
            this.renderAllUsers();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Erreur lors du chargement des données');
        }
    }

    /**
     * Load all users from Firestore
     */
    async loadUsers() {
        if (!window.FirebaseDB) return;

        const usersSnapshot = await window.FirebaseDB.collection('users').get();
        this.users = usersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    /**
     * Load active sessions from Firestore
     */
    async loadSessions() {
        if (!window.FirebaseDB) return;

        const sessionsSnapshot = await window.FirebaseDB.collection('sessions')
            .where('isActive', '==', true)
            .get();

        this.sessions = sessionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }

    /**
     * Update statistics
     */
    async updateStatistics() {
        const totalUsers = this.users.length;
        const onlineUsers = this.sessions.length;

        // Calculate new users (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const newUsers = this.users.filter(user => {
            if (!user.createdAt) return false;
            const createdDate = user.createdAt.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
            return createdDate >= sevenDaysAgo;
        }).length;

        // Update UI
        document.getElementById('stat-total-users').textContent = totalUsers;
        document.getElementById('stat-online-users').textContent = onlineUsers;
        document.getElementById('stat-new-users').textContent = newUsers;
        document.getElementById('stat-active-sessions').textContent = this.sessions.length;

        // Calculate changes (mock data for now)
        document.getElementById('stat-users-change').textContent = '+' + newUsers + ' cette semaine';
        document.getElementById('stat-online-change').textContent = onlineUsers + ' actifs';
        document.getElementById('stat-new-change').textContent = '+' + newUsers + ' nouveaux';
        document.getElementById('stat-sessions-change').textContent = this.sessions.length + ' sessions';
    }

    /**
     * Render active users
     */
    renderActiveUsers() {
        const container = document.getElementById('active-users-container');
        if (!container) return;

        // Get users with active sessions
        const activeUserIds = [...new Set(this.sessions.map(s => s.userId))];
        const activeUsers = this.users.filter(u => activeUserIds.includes(u.uid));

        if (activeUsers.length === 0) {
            container.innerHTML = '<div class="empty-state">Aucun utilisateur connecté actuellement</div>';
            return;
        }

        let html = '<table class="users-table"><thead><tr>';
        html += '<th>Utilisateur</th>';
        html += '<th>Email</th>';
        html += '<th>Rôle</th>';
        html += '<th>Dernière activité</th>';
        html += '<th>Durée session</th>';
        html += '</tr></thead><tbody>';

        activeUsers.forEach(user => {
            const userSessions = this.sessions.filter(s => s.userId === user.uid);
            const latestSession = userSessions.sort((a, b) =>
                (b.lastActivity?.seconds || 0) - (a.lastActivity?.seconds || 0)
            )[0];

            const lastActivity = latestSession?.lastActivity ?
                this.formatTimestamp(latestSession.lastActivity) : 'Inconnue';

            const sessionDuration = latestSession?.loginTime ?
                this.calculateDuration(latestSession.loginTime) : '-';

            html += '<tr>';
            html += `<td><strong>${user.displayName || 'Utilisateur'}</strong></td>`;
            html += `<td>${user.email}</td>`;
            html += `<td><span class="role-badge ${user.role}">${user.role === 'admin' ? 'Admin' : 'Utilisateur'}</span></td>`;
            html += `<td>${lastActivity}</td>`;
            html += `<td>${sessionDuration}</td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    /**
     * Render all users
     */
    renderAllUsers(filteredUsers = null) {
        const container = document.getElementById('all-users-container');
        if (!container) return;

        const usersToRender = filteredUsers || this.users;

        if (usersToRender.length === 0) {
            container.innerHTML = '<div class="empty-state">Aucun utilisateur trouvé</div>';
            return;
        }

        let html = '<table class="users-table"><thead><tr>';
        html += '<th>Utilisateur</th>';
        html += '<th>Email</th>';
        html += '<th>Rôle</th>';
        html += '<th>Statut</th>';
        html += '<th>Inscrit le</th>';
        html += '<th>Dernière connexion</th>';
        html += '<th>Actions</th>';
        html += '</tr></thead><tbody>';

        usersToRender.forEach(user => {
            const isOnline = this.sessions.some(s => s.userId === user.uid);
            const createdAt = user.createdAt ? this.formatTimestamp(user.createdAt) : 'Inconnue';
            const lastLogin = user.lastLogin ? this.formatTimestamp(user.lastLogin) : 'Jamais';

            html += '<tr>';
            html += `<td><strong>${user.displayName || 'Utilisateur'}</strong></td>`;
            html += `<td>${user.email}</td>`;
            html += `<td><span class="role-badge ${user.role}">${user.role === 'admin' ? 'Admin' : 'Utilisateur'}</span></td>`;
            html += `<td><span class="status-badge ${isOnline ? 'online' : 'offline'}">${isOnline ? '🟢 En ligne' : '⚪ Hors ligne'}</span></td>`;
            html += `<td>${createdAt}</td>`;
            html += `<td>${lastLogin}</td>`;
            html += `<td><div class="action-buttons">`;
            html += `<button class="btn-icon" onclick="window.adminDashboard.viewUser('${user.uid}')" title="Voir détails">👁️</button>`;
            html += `<button class="btn-icon" onclick="window.adminDashboard.toggleRole('${user.uid}')" title="Changer rôle">🔄</button>`;
            html += `<button class="btn-icon" onclick="window.adminDashboard.toggleActive('${user.uid}')" title="Activer/Désactiver">⚡</button>`;
            html += `</div></td>`;
            html += '</tr>';
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    /**
     * Setup search and filters
     */
    setupFilters() {
        const searchInput = document.getElementById('search-users');
        const roleFilter = document.getElementById('filter-role');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.applyFilters());
        }

        if (roleFilter) {
            roleFilter.addEventListener('change', () => this.applyFilters());
        }
    }

    /**
     * Apply filters
     */
    applyFilters() {
        const searchTerm = document.getElementById('search-users')?.value.toLowerCase() || '';
        const roleFilter = document.getElementById('filter-role')?.value || '';

        let filtered = this.users;

        // Apply search
        if (searchTerm) {
            filtered = filtered.filter(user =>
                (user.displayName?.toLowerCase().includes(searchTerm)) ||
                (user.email?.toLowerCase().includes(searchTerm))
            );
        }

        // Apply role filter
        if (roleFilter) {
            filtered = filtered.filter(user => user.role === roleFilter);
        }

        this.renderAllUsers(filtered);
    }

    /**
     * View user details
     */
    viewUser(userId) {
        const user = this.users.find(u => u.uid === userId);
        if (!user) return;

        alert(`Détails utilisateur:\n\nNom: ${user.displayName}\nEmail: ${user.email}\nRôle: ${user.role}\nActif: ${user.isActive ? 'Oui' : 'Non'}`);
    }

    /**
     * Toggle user role
     */
    async toggleRole(userId) {
        const user = this.users.find(u => u.uid === userId);
        if (!user) return;

        const newRole = user.role === 'admin' ? 'user' : 'admin';
        const confirm = window.confirm(`Changer le rôle de ${user.displayName} en ${newRole === 'admin' ? 'Administrateur' : 'Utilisateur'} ?`);

        if (!confirm) return;

        try {
            await window.FirebaseDB.collection('users').doc(userId).update({
                role: newRole
            });

            alert('✅ Rôle modifié avec succès');
            await this.loadDashboardData();
        } catch (error) {
            alert('❌ Erreur lors de la modification du rôle');
            console.error(error);
        }
    }

    /**
     * Toggle user active status
     */
    async toggleActive(userId) {
        const user = this.users.find(u => u.uid === userId);
        if (!user) return;

        const newStatus = !user.isActive;
        const confirm = window.confirm(`${newStatus ? 'Activer' : 'Désactiver'} le compte de ${user.displayName} ?`);

        if (!confirm) return;

        try {
            await window.FirebaseDB.collection('users').doc(userId).update({
                isActive: newStatus
            });

            alert(`✅ Compte ${newStatus ? 'activé' : 'désactivé'} avec succès`);
            await this.loadDashboardData();
        } catch (error) {
            alert('❌ Erreur lors de la modification du statut');
            console.error(error);
        }
    }

    /**
     * Format timestamp
     */
    formatTimestamp(timestamp) {
        if (!timestamp) return 'Inconnue';

        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Calculate duration since timestamp
     */
    calculateDuration(timestamp) {
        if (!timestamp) return '-';

        const start = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        const now = new Date();
        const diff = now - start;

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
            return `${hours}h ${minutes}min`;
        }
        return `${minutes}min`;
    }

    /**
     * Show error message
     */
    showError(message) {
        alert('❌ ' + message);
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// Initialize on load
window.adminDashboard = new AdminDashboard();

document.addEventListener('DOMContentLoaded', () => {
    window.adminDashboard.init();
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
    window.adminDashboard.destroy();
});
