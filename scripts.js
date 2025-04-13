// Function to load HTML components (header/nav)
async function loadComponent(url, targetElement, position = 'beforeend') {
    try {
        console.log(`Attempting to load ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load ${url}: ${response.statusText}`);
        }
        const html = await response.text();
        const target = document.querySelector(targetElement);
        if (!target) {
            throw new Error(`Target element '${targetElement}' not found`);
        }
        target.insertAdjacentHTML(position, html);
        console.log(`Successfully loaded ${url}`);
        return true;
    } catch (error) {
        console.error('Error loading component:', error);
        // Display error to user
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.padding = '10px';
        errorDiv.style.backgroundColor = '#ffeeee';
        errorDiv.textContent = `Error loading component: ${error.message}`;
        document.body.prepend(errorDiv);
        return false;
    }
}

// Main function to load components
async function loadCommonComponents() {
    try {
        // Clear any existing top-wrapper to prevent duplicates
        const existingWrapper = document.querySelector('.top-wrapper');
        if (existingWrapper) existingWrapper.remove();

        // Create wrapper structure
        document.body.insertAdjacentHTML('afterbegin', `
            <div class="top-wrapper"></div>
        `);

        // Use relative paths for GitHub Pages
        const basePath = window.location.hostname.includes('github.io') ? '/kuwaitnews' : '';
        
        // Load header
        const headerLoaded = await loadComponent(`${basePath}/includes/header.html`, '.top-wrapper');
        if (!headerLoaded) throw new Error('Header failed to load');

        // Load navigation
        const navLoaded = await loadComponent(`${basePath}/includes/navigation.html`, '.top-wrapper');
        if (!navLoaded) throw new Error('Navigation failed to load');

        // Initialize components after a small delay to ensure DOM is ready
        setTimeout(initializeComponents, 100);
        
        document.dispatchEvent(new Event('commonComponentsLoaded'));
        console.log('Common components loaded successfully');
    } catch (error) {
        console.error('Error in loadCommonComponents:', error);
        // Display error to user
        const errorDiv = document.createElement('div');
        errorDiv.style.color = 'red';
        errorDiv.style.padding = '10px';
        errorDiv.style.backgroundColor = '#ffeeee';
        errorDiv.textContent = `Error loading page components: ${error.message}`;
        document.body.prepend(errorDiv);
    }
}

function initializeComponents() {
    // Initialize menu toggle for vertical list
    const menuBtn = document.querySelector('.menu-btn');
    const navMenuToggle = document.querySelector('.nav-menu-toggle');
    
    if (menuBtn && navMenuToggle) {
        menuBtn.addEventListener('click', () => {
            const isActive = navMenuToggle.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', isActive);
            menuBtn.innerHTML = isActive ? 
                '<i class="fas fa-times"></i>' : 
                '<i class="fas fa-bars"></i>';
        });
    }

    // Initialize dropdown toggle for mobile
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const dropdownMenu = toggle.nextElementSibling;
                if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
                    dropdownMenu.classList.toggle('active');
                }
            }
        });
    });

    // Initialize search bar
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', (e) => {
            e.preventDefault();
            searchInput.focus();
        });
    }
}

// Add global styles
function addGlobalStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .top-wrapper {
            width: 100%;
        }
        .header-container, .nav-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 1rem;
        }
    `;
    document.head.appendChild(style);
}

// Start the process
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, starting component load');
    addGlobalStyles();
    loadCommonComponents();
});
