/**
 * AuthManager
 * Handles local PIN authentication.
 */
class AuthManager {
    constructor() {
        this.STORAGE_KEY = 'app_auth_pin';
        this.SESSION_KEY = 'app_auth_session';
        this.isAuthenticated = false;
    }

    /**
     * Check if a PIN is set.
     * @returns {boolean}
     */
    isSetup() {
        return !!localStorage.getItem(this.STORAGE_KEY);
    }

    /**
     * Verify the provided PIN.
     * @param {string} pin 
     * @returns {boolean}
     */
    login(pin) {
        const storedPin = localStorage.getItem(this.STORAGE_KEY);
        if (storedPin === pin) {
            this.isAuthenticated = true;
            sessionStorage.setItem(this.SESSION_KEY, 'true');
            return true;
        }
        return false;
    }

    /**
     * Set a new PIN.
     * @param {string} pin 
     */
    setPin(pin) {
        localStorage.setItem(this.STORAGE_KEY, pin);
        this.isAuthenticated = true;
        sessionStorage.setItem(this.SESSION_KEY, 'true');
    }

    /**
     * Remove the PIN (disable security).
     */
    removePin() {
        localStorage.removeItem(this.STORAGE_KEY);
        this.isAuthenticated = false;
        sessionStorage.removeItem(this.SESSION_KEY);
    }

    /**
     * Check if biometrics are enabled.
     * @returns {boolean}
     */
    isBiometricEnabled() {
        return !!localStorage.getItem('app_auth_biometric_id');
    }

    /**
     * Register a biometric credential (Face ID / Touch ID).
     */
    async enableBiometrics() {
        if (!window.PublicKeyCredential) {
            throw new Error("La biométrie n'est pas supportée sur cet appareil.");
        }

        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        const userId = 'user_' + Date.now();
        const userHandle = Uint8Array.from(userId, c => c.charCodeAt(0));

        const publicKey = {
            challenge: challenge,
            rp: { name: "AutoManager" },
            user: {
                id: userHandle,
                name: "Propriétaire",
                displayName: "Propriétaire du Véhicule"
            },
            pubKeyCredParams: [{ type: "public-key", alg: -7 }, { type: "public-key", alg: -257 }],
            authenticatorSelection: { userVerification: "required" },
            timeout: 60000,
            attestation: "none"
        };

        try {
            const credential = await navigator.credentials.create({ publicKey });
            // Store credential ID to verify later
            // We are simplifying here by just storing the ID and assuming OS handles the rest securely for local unlock
            // In a real server scenario, we would send the public key to the server.
            // For local-only "lock screen", existence of a valid signature from this credential proves presence.

            const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
            localStorage.setItem('app_auth_biometric_id', credentialId);
            return true;
        } catch (err) {
            console.error("Biometric registration failed", err);
            throw err;
        }
    }

    /**
     * Verify biometric credential.
     */
    async verifyBiometric() {
        if (!this.isBiometricEnabled()) return false;

        const savedId = localStorage.getItem('app_auth_biometric_id');
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);

        try {
            const assertion = await navigator.credentials.get({
                publicKey: {
                    challenge: challenge,
                    allowCredentials: [{
                        id: Uint8Array.from(atob(savedId), c => c.charCodeAt(0)),
                        type: "public-key"
                    }],
                    userVerification: "required"
                }
            });

            if (assertion) {
                this.isAuthenticated = true;
                sessionStorage.setItem(this.SESSION_KEY, 'true');
                return true;
            }
        } catch (err) {
            console.error("Biometric verification failed", err);
            return false;
        }
        return false;
    }

    /**
     * Disable biometrics.
     */
    disableBiometrics() {
        localStorage.removeItem('app_auth_biometric_id');
    }

    /**
     * Check if the user is currently authenticated or if no auth is required.
     * @returns {boolean}
     */
    checkAuth() {
        if (!this.isSetup() && !this.isBiometricEnabled()) {
            return true; // No security set
        }
        return sessionStorage.getItem(this.SESSION_KEY) === 'true';
    }

    /**
     * Log out (clear session).
     */
    logout() {
        sessionStorage.removeItem(this.SESSION_KEY);
        this.isAuthenticated = false;
        window.location.reload();
    }
}

window.AuthManager = new AuthManager();
