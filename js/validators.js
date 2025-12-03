/**
 * Input Validators and Sanitizers
 * Security utilities for input validation and XSS protection
 */

class Validators {
    /**
     * Validate email format
     * @param {string} email - Email to validate
     * @returns {boolean} True if valid
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Validate phone number (Moroccan format)
     * @param {string} phone - Phone number to validate
     * @returns {boolean} True if valid
     */
    static isValidPhone(phone) {
        const phoneRegex = /^(\+212|0)[5-7]\d{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} Validation result with strength score
     */
    static validatePassword(password) {
        const result = {
            valid: false,
            strength: 0,
            message: '',
            requirements: {
                minLength: password.length >= 8,
                hasUpperCase: /[A-Z]/.test(password),
                hasLowerCase: /[a-z]/.test(password),
                hasNumber: /\d/.test(password),
                hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
            }
        };

        // Calculate strength
        const metRequirements = Object.values(result.requirements).filter(Boolean).length;
        result.strength = metRequirements;

        // Validate
        if (password.length < 6) {
            result.message = 'Le mot de passe doit contenir au moins 6 caractères';
        } else if (metRequirements < 3) {
            result.message = 'Mot de passe faible';
        } else if (metRequirements < 4) {
            result.message = 'Mot de passe moyen';
            result.valid = true;
        } else {
            result.message = 'Mot de passe fort';
            result.valid = true;
        }

        return result;
    }

    /**
     * Validate URL format
     * @param {string} url - URL to validate
     * @returns {boolean} True if valid
     */
    static isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Validate number range
     * @param {number} value - Value to validate
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {boolean} True if valid
     */
    static isInRange(value, min, max) {
        const num = parseFloat(value);
        return !isNaN(num) && num >= min && num <= max;
    }

    /**
     * Validate date format (YYYY-MM-DD)
     * @param {string} date - Date string to validate
     * @returns {boolean} True if valid
     */
    static isValidDate(date) {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) return false;

        const d = new Date(date);
        return d instanceof Date && !isNaN(d);
    }

    /**
     * Validate required field
     * @param {*} value - Value to validate
     * @returns {boolean} True if not empty
     */
    static isRequired(value) {
        if (value === null || value === undefined) return false;
        if (typeof value === 'string') return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        return true;
    }
}

class Sanitizers {
    /**
     * Sanitize HTML to prevent XSS
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized HTML
     */
    static sanitizeHTML(html) {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    static escapeHTML(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;',
            '/': '&#x2F;'
        };
        return String(text).replace(/[&<>"'/]/g, char => map[char]);
    }

    /**
     * Sanitize input for SQL-like queries
     * @param {string} input - Input to sanitize
     * @returns {string} Sanitized input
     */
    static sanitizeInput(input) {
        if (typeof input !== 'string') return input;

        // Remove potentially dangerous characters
        return input
            .replace(/[<>]/g, '')
            .replace(/javascript:/gi, '')
            .replace(/on\w+=/gi, '')
            .trim();
    }

    /**
     * Sanitize filename
     * @param {string} filename - Filename to sanitize
     * @returns {string} Sanitized filename
     */
    static sanitizeFilename(filename) {
        return filename
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .replace(/_{2,}/g, '_')
            .substring(0, 255);
    }

    /**
     * Sanitize phone number
     * @param {string} phone - Phone number to sanitize
     * @returns {string} Sanitized phone number
     */
    static sanitizePhone(phone) {
        return phone.replace(/[^\d+]/g, '');
    }

    /**
     * Sanitize number
     * @param {*} value - Value to sanitize
     * @param {number} decimals - Number of decimal places
     * @returns {number} Sanitized number
     */
    static sanitizeNumber(value, decimals = 2) {
        const num = parseFloat(value);
        if (isNaN(num)) return 0;
        return parseFloat(num.toFixed(decimals));
    }
}

/**
 * Form validator class
 */
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = {};
    }

    /**
     * Add validation rule
     * @param {string} fieldName - Field name
     * @param {Function} validator - Validator function
     * @param {string} errorMessage - Error message
     */
    addRule(fieldName, validator, errorMessage) {
        const field = this.form?.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        field.addEventListener('blur', () => {
            const value = field.value;
            if (!validator(value)) {
                this.setError(fieldName, errorMessage);
            } else {
                this.clearError(fieldName);
            }
        });
    }

    /**
     * Set error for field
     * @param {string} fieldName - Field name
     * @param {string} message - Error message
     */
    setError(fieldName, message) {
        this.errors[fieldName] = message;
        const field = this.form?.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.add('error');

            // Show error message
            let errorEl = field.parentElement.querySelector('.error-message');
            if (!errorEl) {
                errorEl = document.createElement('div');
                errorEl.className = 'error-message';
                field.parentElement.appendChild(errorEl);
            }
            errorEl.textContent = message;
        }
    }

    /**
     * Clear error for field
     * @param {string} fieldName - Field name
     */
    clearError(fieldName) {
        delete this.errors[fieldName];
        const field = this.form?.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.classList.remove('error');
            const errorEl = field.parentElement.querySelector('.error-message');
            if (errorEl) {
                errorEl.remove();
            }
        }
    }

    /**
     * Validate entire form
     * @returns {boolean} True if valid
     */
    validate() {
        this.errors = {};
        // Trigger blur on all fields to validate
        const fields = this.form?.querySelectorAll('input, textarea, select');
        fields?.forEach(field => {
            field.dispatchEvent(new Event('blur'));
        });
        return Object.keys(this.errors).length === 0;
    }

    /**
     * Get all errors
     * @returns {Object} Errors object
     */
    getErrors() {
        return this.errors;
    }
}

// Export
window.Validators = Validators;
window.Sanitizers = Sanitizers;
window.FormValidator = FormValidator;
