/**
 * Simple Router
 */
class Router {
    constructor() {
        this.routes = [];
    }

    init() {
        window.addEventListener('popstate', () => {
            this.handleRoute();
        });
    }

    navigate(path) {
        window.history.pushState({}, '', `#${path}`);
    }

    getCurrentRoute() {
        return window.location.hash.slice(1) || 'home';
    }

    handleRoute() {
        const route = this.getCurrentRoute();
        if (window.app) {
            window.app.loadModule(route);
        }
    }
}
