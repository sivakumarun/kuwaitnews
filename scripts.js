// Function to load HTML components
async function loadComponent(url, targetElement, position = 'beforeend') {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        const html = await response.text();
        const target = document.querySelector(targetElement);
        if (!target) throw new Error(`Target element not found`);
        target.insertAdjacentHTML(position, html);
        return true;
    } catch (error) {
        console.error('Error loading component:', error);
        return false;
    }
}

// Main function to load and initialize components
async function loadCommonComponents() {
    try {
        // Clear any existing wrappers
        const existingWrapper = document.querySelector('.top-wrapper');
        if (existingWrapper) existingWrapper.remove();

        // Create wrapper structure
        document.body.insertAdjacentHTML('afterbegin', `
            <div class="top-wrapper">
                <div class="mobile-overlay"></div>
            </div>
        `);

        // Load header and navigation
        await loadComponent('/kuwaitnews/includes/header.html', '.top-wrapper');
        await loadComponent('/kuwaitnews/includes/navigation.html', '.top-wrapper');

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

        // Initialize search functionality
        const searchBtn = document.querySelector('.search-btn');
        const searchBar = document.querySelector('.search-bar');
        
        if (searchBtn && searchBar) {
            searchBtn.addEventListener('click', function(e) {
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
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

// Add global styles
const style = document.createElement('style');
style.textContent = `
    .top-wrapper {
        width: 100%;
        position: relative;
    }
    
    .header-bg {
        width: 100%;
    }
    
    /* Desktop Styles */
    @media (min-width: 769px) {
        .header-container {
            justify-content: center;
        }
        
        .menu-btn {
            display: none !important;
        }
        
        .nav-menu {
            display: flex !important;
        }
    }
    
    /* Mobile Styles */
    @media (max-width: 768px) {
        .top-wrapper {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.5rem;
            min-height: 70px;
        }
        
        .menu-btn {
            order: -1;
        }
        
        .header-container {
            flex-grow: 1;
        }
        
        .nav-container {
            order: 1;
        }
    }
    
    .mobile-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 998;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
    }
    
    .mobile-overlay.active {
        opacity: 1;
        pointer-events: all;
    }
    
    body.nav-open {
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Start initialization
document.addEventListener('DOMContentLoaded', loadCommonComponents);

// Update the mobile menu initialization part:
const menuBtn = document.querySelector('.menu-btn');
const navContainer = document.querySelector('.nav-container');
const overlay = document.querySelector('.mobile-overlay');

if (menuBtn && navContainer && overlay) {
    menuBtn.addEventListener('click', () => {
        const isActive = navContainer.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', isActive);
        menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        overlay.classList.toggle('active');
        document.body.classList.toggle('nav-open');
    });
    
    overlay.addEventListener('click', () => {
        navContainer.classList.remove('active');
        overlay.classList.remove('active');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
    });
}
