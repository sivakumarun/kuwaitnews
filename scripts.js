// Function to load HTML components
async function loadComponent(url, targetElement, position = 'beforeend') {
    try {
        const cacheBuster = `?v=${new Date().getTime()}`;
        const response = await fetch(`${url}${cacheBuster}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        const target = document.querySelector(targetElement);
        if (!target) throw new Error(`Target element not found`);
        target.insertAdjacentHTML(position, html);
        return true;
    } catch (error) {
        console.error('Component load error:', error);
        throw error;
    }
}

// Main component loader
async function loadCommonComponents() {
    try {
        // Set initial state
        document.documentElement.classList.add('preload');
        
        // Create placeholders
        document.body.insertAdjacentHTML('afterbegin', `
            <div class="top-wrapper">
                <div class="header-placeholder"></div>
                <div class="nav-placeholder"></div>
            </div>
        `);

        // Load components
        const basePath = window.location.hostname.includes('github.io') ? '/kuwaitnews' : '';
        
        // Load header
        await loadComponent(`${basePath}/includes/header.html`, '.header-placeholder', 'afterend');
        document.querySelector('.header-placeholder')?.remove();
        
        // Load navigation
        await loadComponent(`${basePath}/includes/navigation.html`, '.nav-placeholder', 'afterend');
        document.querySelector('.nav-placeholder')?.remove();

        // Initialize components
        initializeComponents();

        // Mark as ready
        document.documentElement.classList.remove('preload');
        document.documentElement.classList.add('components-ready');

    } catch (error) {
        console.error('Load error:', error);
        // Fallback - still show the page
        document.documentElement.classList.remove('preload');
        document.documentElement.classList.add('components-ready');
    }
}

function initializeComponents() {
    // Menu toggle
    const menuBtn = document.querySelector('.menu-btn');
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu-toggle');
            if (navMenu) {
                const isActive = navMenu.classList.toggle('active');
                menuBtn.innerHTML = isActive ? 
                    '<i class="fas fa-times"></i>' : 
                    '<i class="fas fa-bars"></i>';
            }
        });
    }

    // Mobile dropdowns
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.nextElementSibling?.classList.toggle('active');
            }
        });
    });

    // Search functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.search-input')?.focus();
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCommonComponents();
});
