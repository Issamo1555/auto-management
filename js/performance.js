/**
 * Performance Utilities
 * Optimizations for better performance and user experience
 */

/**
 * Debounce function - Limits the rate at which a function can fire
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function - Ensures a function is called at most once in a specified time period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit = 300) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Lazy load images using Intersection Observer
 */
class LazyLoader {
    constructor() {
        this.images = [];
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        this.observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            this.observeImages();
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadAllImages();
        }
    }

    observeImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            this.observer.observe(img);
        });
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
        }
    }

    loadAllImages() {
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => this.loadImage(img));
    }
}

/**
 * Lazy load scripts dynamically
 * @param {string} src - Script source URL
 * @param {Object} options - Script options
 * @returns {Promise} Promise that resolves when script is loaded
 */
function loadScript(src, options = {}) {
    return new Promise((resolve, reject) => {
        // Check if script already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.async = options.async !== false;
        script.defer = options.defer || false;

        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

        document.head.appendChild(script);
    });
}

/**
 * Lazy load CSS
 * @param {string} href - CSS file URL
 * @returns {Promise} Promise that resolves when CSS is loaded
 */
function loadCSS(href) {
    return new Promise((resolve, reject) => {
        // Check if CSS already loaded
        if (document.querySelector(`link[href="${href}"]`)) {
            resolve();
            return;
        }

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;

        link.onload = () => resolve();
        link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));

        document.head.appendChild(link);
    });
}

/**
 * Load Google Maps API lazily
 * @param {string} apiKey - Google Maps API key
 * @returns {Promise} Promise that resolves when Google Maps is loaded
 */
async function loadGoogleMaps(apiKey) {
    if (window.google && window.google.maps) {
        return Promise.resolve();
    }

    return loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`,
        { async: true, defer: true }
    );
}

/**
 * Load Chart.js lazily
 * @returns {Promise} Promise that resolves when Chart.js is loaded
 */
async function loadChartJS() {
    if (window.Chart) {
        return Promise.resolve();
    }

    return loadScript(
        'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
        { async: true }
    );
}

/**
 * Load jsPDF lazily
 * @returns {Promise} Promise that resolves when jsPDF is loaded
 */
async function loadJsPDF() {
    if (window.jspdf) {
        return Promise.resolve();
    }

    return loadScript(
        'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
        { async: true }
    );
}

/**
 * Performance monitoring
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = {};
    }

    /**
     * Mark performance timing
     * @param {string} name - Mark name
     */
    mark(name) {
        if ('performance' in window && performance.mark) {
            performance.mark(name);
        }
    }

    /**
     * Measure performance between two marks
     * @param {string} name - Measure name
     * @param {string} startMark - Start mark name
     * @param {string} endMark - End mark name
     */
    measure(name, startMark, endMark) {
        if ('performance' in window && performance.measure) {
            try {
                performance.measure(name, startMark, endMark);
                const measure = performance.getEntriesByName(name)[0];
                this.metrics[name] = measure.duration;
                console.log(`⏱️ ${name}: ${measure.duration.toFixed(2)}ms`);
            } catch (error) {
                console.warn('Performance measure failed:', error);
            }
        }
    }

    /**
     * Get all metrics
     * @returns {Object} All performance metrics
     */
    getMetrics() {
        return this.metrics;
    }

    /**
     * Log page load metrics
     */
    logPageLoadMetrics() {
        if ('performance' in window && performance.timing) {
            const timing = performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
            const firstPaint = performance.getEntriesByType('paint')
                .find(entry => entry.name === 'first-contentful-paint');

            console.log('📊 Page Load Metrics:');
            console.log(`  - Load Time: ${loadTime}ms`);
            console.log(`  - DOM Ready: ${domReady}ms`);
            if (firstPaint) {
                console.log(`  - First Contentful Paint: ${firstPaint.startTime.toFixed(2)}ms`);
            }
        }
    }
}

/**
 * Cache manager for localStorage
 */
class CacheManager {
    constructor(prefix = 'automanager_cache_') {
        this.prefix = prefix;
    }

    /**
     * Set cache with expiration
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     * @param {number} ttl - Time to live in seconds
     */
    set(key, value, ttl = 3600) {
        const item = {
            value: value,
            expiry: Date.now() + (ttl * 1000)
        };

        try {
            localStorage.setItem(this.prefix + key, JSON.stringify(item));
        } catch (error) {
            console.warn('Cache set failed:', error);
        }
    }

    /**
     * Get cached value
     * @param {string} key - Cache key
     * @returns {*} Cached value or null
     */
    get(key) {
        try {
            const itemStr = localStorage.getItem(this.prefix + key);
            if (!itemStr) return null;

            const item = JSON.parse(itemStr);

            // Check if expired
            if (Date.now() > item.expiry) {
                this.remove(key);
                return null;
            }

            return item.value;
        } catch (error) {
            console.warn('Cache get failed:', error);
            return null;
        }
    }

    /**
     * Remove cached item
     * @param {string} key - Cache key
     */
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
        } catch (error) {
            console.warn('Cache remove failed:', error);
        }
    }

    /**
     * Clear all cache
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.warn('Cache clear failed:', error);
        }
    }
}

// Initialize and export
window.LazyLoader = new LazyLoader();
window.PerformanceMonitor = new PerformanceMonitor();
window.CacheManager = new CacheManager();

// Export utilities
window.PerformanceUtils = {
    debounce,
    throttle,
    loadScript,
    loadCSS,
    loadGoogleMaps,
    loadChartJS,
    loadJsPDF
};

// Log page load metrics when page is fully loaded
window.addEventListener('load', () => {
    setTimeout(() => {
        window.PerformanceMonitor.logPageLoadMetrics();
    }, 0);
});
