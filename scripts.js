// Update loadCommonComponents function
async function loadCommonComponents() {
    try {
        // Set preload state
        document.documentElement.classList.add('preload');
        
        // Create placeholders first
        document.body.insertAdjacentHTML('afterbegin', `
            <div class="top-wrapper">
                <div class="header-placeholder"></div>
                <div class="nav-placeholder"></div>
            </div>
        `);

        // Load components
        const basePath = window.location.hostname.includes('github.io') ? '/kuwaitnews' : '';
        
        // Load header and replace placeholder
        await loadComponentWithRetry(`${basePath}/includes/header.html`, '.header-placeholder', 'afterend');
        document.querySelector('.header-placeholder')?.remove();
        
        // Load navigation and replace placeholder
        await loadComponentWithRetry(`${basePath}/includes/navigation.html`, '.nav-placeholder', 'afterend');
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
async function loadComponentWithRetry(url, targetElement, retries = 3, delay = 1000) {
    try {
        return await loadComponent(url, targetElement);
    } catch (error) {
        if (retries > 0) {
            console.log(`Retrying ${url} (${retries} attempts left)`);
            await new Promise(resolve => setTimeout(resolve, delay));
            return loadComponentWithRetry(url, targetElement, retries - 1, delay * 2);
        }
        throw error;
    }
}

// Main component loader
async function loadCommonComponents() {
    try {
        // Show loading state
        document.body.insertAdjacentHTML('afterbegin', `
            <div class="loading-indicator">
                <div class="loader-spinner"></div>
                Loading page components...
            </div>
        `);

        // Clean existing wrapper
        document.querySelector('.top-wrapper')?.remove();

        // Create wrapper
        document.body.insertAdjacentHTML('afterbegin', '<div class="top-wrapper"></div>');

        // Determine base path
        const basePath = window.location.hostname.includes('github.io') ? '/kuwaitnews' : '';

        // Load components with retry
        await Promise.all([
            loadComponentWithRetry(`${basePath}/includes/header.html`, '.top-wrapper'),
            loadComponentWithRetry(`${basePath}/includes/navigation.html`, '.top-wrapper')
        ]);

        // Initialize components
        initializeComponents();

        // Dispatch loaded event
        document.dispatchEvent(new CustomEvent('componentsLoaded', {
            detail: { success: true }
        }));

    } catch (error) {
        console.error('Failed to load components:', error);
        document.dispatchEvent(new CustomEvent('componentsLoaded', {
            detail: { success: false, error }
        }));
        
        // Show user-friendly error
        document.querySelector('.loading-indicator')?.remove();
        document.body.insertAdjacentHTML('afterbegin', `
            <div class="load-error">
                <p>⚠️ Failed to load page components. Please try refreshing.</p>
                <button onclick="window.location.reload()">Retry</button>
            </div>
        `);
    } finally {
        // Remove loading indicator
        document.querySelector('.loading-indicator')?.remove();
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

// Add global styles
function addGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .top-wrapper { width: 100%; }
        .loading-indicator {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            padding: 15px;
            background: var(--primary);
            color: white;
            text-align: center;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }
        .loader-spinner {
            border: 3px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            border-top-color: white;
            width: 20px;
            height: 20px;
            animation: spin 1s ease-in-out infinite;
        }
        .load-error {
            padding: 20px;
            background: #ffebee;
            color: #c62828;
            text-align: center;
        }
        .load-error button {
            margin-top: 10px;
            padding: 8px 16px;
            background: var(--accent);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    addGlobalStyles();
    loadCommonComponents();
});
