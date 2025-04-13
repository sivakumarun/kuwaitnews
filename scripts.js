// Function to load HTML components with retry logic
async function loadComponent(url, targetElement, position = 'beforeend') {
    try {
        const cacheBuster = `?v=${new Date().getTime()}`;
        console.log(`Attempting to load ${url}`);
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
