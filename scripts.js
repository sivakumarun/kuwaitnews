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
        console.error('Error loading component:', error.message);
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
            <div class="mobile-overlay"></div>
        `);

        // Load header
        const headerLoaded = await loadComponent('/kuwaitnews/includes/header.html', '.top-wrapper');
        if (!headerLoaded) throw new Error('Header failed to load');

        // Load navigation
        const navLoaded = await loadComponent('/kuwaitnews/includes/navigation.html', '.top-wrapper');
        if (!navLoaded) throw new Error('Navigation failed to load');

        // Initialize mobile menu toggle
        const menuBtn = document.querySelector('.menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        const overlay = document.querySelector('.mobile-overlay');
        
        if (menuBtn && navMenu && overlay) {
            menuBtn.addEventListener('click', () => {
                const isActive = navMenu.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', isActive);
                menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
                overlay.classList.toggle('active');
                document.body.classList.toggle('nav-open');
            });
            
            overlay.addEventListener('click', () => {
                navMenu.classList.remove('active');
                overlay.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                menuBtn.setAttribute('aria-expanded', 'false');
                document.body.classList.remove('nav-open');
            });
        }

        // Initialize search bar toggle
        const searchBtn = document.querySelector('.search-btn');
        const searchBar = document.querySelector('.search-bar');
        
        if (searchBtn && searchBar) {
            searchBtn.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    searchBar.classList.toggle('active');
                    if (searchBar.classList.contains('active')) {
                        searchBar.querySelector('.search-input').focus();
                    }
                }
            });
        }

        document.dispatchEvent(new Event('commonComponentsLoaded'));
        console.log('Common components loaded successfully');
    } catch (error) {
        console.error('Error in loadCommonComponents:', error);
    }
}

// Add global styles
const style = document.createElement('style');
style.textContent = `
    .top-wrapper {
        width: 100%;
    }
    
    @media (min-width: 769px) {
        .header-container {
            justify-content: center;
        }
    }
`;
document.head.appendChild(style);

// Start the process
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, starting component load');
    loadCommonComponents();
});
