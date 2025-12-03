/**
 * Authentication Service
 * Handles user authentication, registration, and session management
 */

class AuthService {
    constructor() {
        this.currentUser = null;
        this.authStateListeners = [];

        // Listen to auth state changes
        if (window.isFirebaseAvailable()) {
            window.FirebaseAuth.onAuthStateChanged((user) => {
                this.currentUser = user;
                this.notifyAuthStateChange(user);

                if (user) {
                    this.trackSession(user);
                }
            });
        }
    }

    /**
     * Register a new user
     */
    async register(email, password, displayName) {
        try {
            if (!window.isFirebaseAvailable()) {
                throw new Error('Firebase not available. Please check your connection.');
            }

            const userCredential = await window.FirebaseAuth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Update profile
            await user.updateProfile({ displayName });

            // Create user document in Firestore
            await window.FirebaseDB.collection('users').doc(user.uid).set({
                uid: user.uid,
                email: email,
                displayName: displayName,
                role: 'user', // Default role
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                isActive: true,
                profile: {
                    phone: '',
                    avatar: ''
                }
            });

            console.log('✅ User registered successfully:', user.uid);
            return { success: true, user };
        } catch (error) {
            console.error('❌ Registration error:', error);
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    /**
     * Login user
     */
    async login(email, password) {
        try {
            if (!window.isFirebaseAvailable()) {
                throw new Error('Firebase not available. Please check your connection.');
            }

            const userCredential = await window.FirebaseAuth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Update last login
            await window.FirebaseDB.collection('users').doc(user.uid).update({
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('✅ User logged in:', user.uid);
            return { success: true, user };
        } catch (error) {
            console.error('❌ Login error:', error);
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    /**
     * Logout user
     */
    async logout() {
        try {
            if (!window.isFirebaseAvailable()) {
                throw new Error('Firebase not available.');
            }

            // End session
            if (this.currentUser) {
                await this.endSession(this.currentUser.uid);
            }

            await window.FirebaseAuth.signOut();
            console.log('✅ User logged out');
            return { success: true };
        } catch (error) {
            console.error('❌ Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Reset password
     */
    async resetPassword(email) {
        try {
            if (!window.isFirebaseAvailable()) {
                throw new Error('Firebase not available.');
            }

            await window.FirebaseAuth.sendPasswordResetEmail(email);
            console.log('✅ Password reset email sent');
            return { success: true };
        } catch (error) {
            console.error('❌ Password reset error:', error);
            return { success: false, error: this.getErrorMessage(error) };
        }
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is admin
     */
    async isAdmin() {
        if (!this.currentUser) return false;

        try {
            const userDoc = await window.FirebaseDB.collection('users').doc(this.currentUser.uid).get();
            return userDoc.exists && userDoc.data().role === 'admin';
        } catch (error) {
            console.error('Error checking admin status:', error);
            return false;
        }
    }

    /**
     * Track user session
     */
    async trackSession(user) {
        try {
            const sessionData = {
                userId: user.uid,
                loginTime: firebase.firestore.FieldValue.serverTimestamp(),
                lastActivity: firebase.firestore.FieldValue.serverTimestamp(),
                userAgent: navigator.userAgent,
                isActive: true
            };

            await window.FirebaseDB.collection('sessions').add(sessionData);
        } catch (error) {
            console.error('Error tracking session:', error);
        }
    }

    /**
     * End user session
     */
    async endSession(userId) {
        try {
            const sessions = await window.FirebaseDB.collection('sessions')
                .where('userId', '==', userId)
                .where('isActive', '==', true)
                .get();

            const batch = window.FirebaseDB.batch();
            sessions.forEach(doc => {
                batch.update(doc.ref, { isActive: false });
            });
            await batch.commit();
        } catch (error) {
            console.error('Error ending session:', error);
        }
    }

    /**
     * Listen to auth state changes
     */
    onAuthStateChange(callback) {
        this.authStateListeners.push(callback);
        // Immediately call with current state
        if (this.currentUser) {
            callback(this.currentUser);
        }
    }

    /**
     * Notify all listeners of auth state change
     */
    notifyAuthStateChange(user) {
        this.authStateListeners.forEach(callback => callback(user));
    }

    /**
     * Get user-friendly error message
     */
    getErrorMessage(error) {
        const errorMessages = {
            'auth/email-already-in-use': 'Cette adresse email est déjà utilisée.',
            'auth/invalid-email': 'Adresse email invalide.',
            'auth/operation-not-allowed': 'Opération non autorisée.',
            'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères.',
            'auth/user-disabled': 'Ce compte a été désactivé.',
            'auth/user-not-found': 'Aucun compte trouvé avec cette adresse email.',
            'auth/wrong-password': 'Mot de passe incorrect.',
            'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard.'
        };

        return errorMessages[error.code] || error.message || 'Une erreur est survenue.';
    }
}

// Initialize and export
window.AuthService = new AuthService();
