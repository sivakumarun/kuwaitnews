/**
 * Kuwait News - Common Components Loader
 * Improved version with better error handling and navigation support
 */

class ComponentLoader {
    constructor() {
        this.basePath = window.location.hostname.includes('github.io') ? '/kuwaitnews' : '';
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.addGlobalStyles();
            this.loadCommonComponents();
        });

        // Re-initialize components when they're loaded dynamically
        document.addEventListener('commonComponentsLoaded', () => {
            this.initializeComponents();
        });
    }

    async loadComponent(url, targetSelector, position = 'beforeend') {
        try {
            console.log(`Loading component: ${url}`);
            const fullUrl = `${this.basePath}${url}`;
            const response = await fetch(fullUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const html = await response.text();
            const target = document.querySelector(targetSelector);
            
            if (!target) {
                throw new Error(`Target element '${targetSelector}' not found`);
            }

            target.insertAdjacentHTML(position, html);
            console.log(`Component loaded successfully: ${url}`);
            return true;
        } catch (error) {
            console.error(`Component load failed (${url}):`, error);
            this.showError(`Failed to load component: ${url.split('/').pop()}`);
            return false;
        }
    }

    async loadCommonComponents() {
        try {
            // Clear existing wrapper to prevent duplicates
            this.removeExistingWrapper();

            // Create wrapper structure
            document.body.insertAdjacentHTML('afterbegin', '<div class="top-wrapper"></div>');

            // Load components in sequence
            await this.loadComponent('/includes/header.html', '.top-wrapper');
            await this.loadComponent('/includes/navigation.html', '.top-wrapper');

            // Dispatch event when components are loaded
            document.dispatchEvent(new CustomEvent('commonComponentsLoaded'));
            console.log('All common components loaded successfully');
        } catch (error) {
            console.error('Failed to load common components:', error);
            this.showError('Failed to load page components');
        }
    }

    initializeComponents() {
        this.setupMobileMenu();
        this.setupDropdowns();
        this.setupSearch();
        this.setupNavLinks();
    }

    setupMobileMenu() {
        const menuBtn = document.querySelector('.menu-btn');
        const navMenu = document.querySelector('.nav-menu');

        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', () => {
                const isExpanded = navMenu.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', isExpanded);
                menuBtn.innerHTML = isExpanded ? 
                    '<i class="fas fa-times"></i>' : 
                    '<i class="fas fa-bars"></i>';
            });
        }
    }

    setupDropdowns() {
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    const dropdown = toggle.closest('.dropdown');
                    if (dropdown) {
                        dropdown.classList.toggle('active');
                    }
                }
            });
        });
    }

    setupSearch() {
        const searchBtn = document.querySelector('.search-btn');
        const searchInput = document.querySelector('.search-input');
        
        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', (e) => {
                e.preventDefault();
                searchInput.classList.toggle('active');
                if (searchInput.classList.contains('active')) {
                    searchInput.focus();
                }
            });
        }
    }

    setupNavLinks() {
        // Highlight current page in navigation
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            if (linkPath === currentPath) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    removeExistingWrapper() {
        const existingWrapper = document.querySelector('.top-wrapper');
        if (existingWrapper) {
            existingWrapper.remove();
            console.log('Removed existing wrapper');
        }
    }

    addGlobalStyles() {
        if (document.querySelector('#global-styles')) return;

        const style = document.createElement('style');
        style.id = 'global-styles';
        style.textContent = `
            .top-wrapper {
                width: 100%;
                position: relative;
                z-index: 1000;
            }
            .header-container, .nav-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 1rem;
            }
            .nav-menu.active {
                display: block !important;
            }
            .dropdown.active > .dropdown-menu {
                display: block;
            }
        `;
        document.head.appendChild(style);
    }

    showError(message) {
        const existingError = document.querySelector('.component-error');
        if (existingError) return;

        const errorDiv = document.createElement('div');
        errorDiv.className = 'component-error';
        errorDiv.style.cssText = `
            color: red;
            padding: 10px;
            background-color: #ffeeee;
            border: 1px solid #ffcccc;
            margin: 10px;
            border-radius: 4px;
        `;
        errorDiv.textContent = message;
        document.body.prepend(errorDiv);
    }
}

// Initialize the loader
new ComponentLoader();
