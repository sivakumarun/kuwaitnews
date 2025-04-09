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

// Main function to load components with retry mechanism
async function loadCommonComponents() {
    try {
        // Clear any existing top-wrapper to prevent duplicates
        const existingWrapper = document.querySelector('.top-wrapper');
        if (existingWrapper) existingWrapper.remove();

        // Create a single wrapper
        document.body.insertAdjacentHTML('afterbegin', '<div class="top-wrapper"></div>');
        const wrapper = document.querySelector('.top-wrapper');

        // Load header once
        const headerLoaded = await loadComponent('/kuwaitnews/includes/header.html', '.top-wrapper', 'beforeend');
        if (!headerLoaded) throw new Error('Header failed to load');

        // Load navigation once
        const navLoaded = await loadComponent('/kuwaitnews/includes/navigation.html', '.top-wrapper', 'beforeend');
        if (!navLoaded) throw new Error('Navigation failed to load');

        // Wait briefly for DOM to update
        await new Promise(resolve => setTimeout(resolve, 100));

        // Initialize mobile menu toggle
        const menuBtn = document.querySelector('.menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', () => {
                const isActive = navMenu.classList.toggle('active');
                menuBtn.setAttribute('aria-expanded', isActive);
                menuBtn.innerHTML = isActive ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
                document.body.classList.toggle('nav-open');
            });
        } else {
            console.warn('Mobile menu elements not found');
        }

        // Initialize search bar toggle
        const searchToggle = document.querySelector('.search-toggle');
        const searchBar = document.querySelector('.search-bar');
        if (searchToggle && searchBar) {
            searchToggle.addEventListener('click', () => {
                searchBar.classList.toggle('active');
            });
        } else {
            console.warn('Search bar elements not found');
        }

        document.dispatchEvent(new Event('commonComponentsLoaded'));
        console.log('Common components loaded successfully');
    } catch (error) {
        console.error('Error in loadCommonComponents:', error);
    }
}

// Add styling for both views
const style = document.createElement('style');
style.textContent = `
    .top-wrapper {
        width: 100%;
        background: linear-gradient(135deg, #CE1126, #007A3D);
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }
    .header-bg {
        background: transparent;
        width: 100%;
    }
    @media (max-width: 768px) {
        .top-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between; /* Spread elements */
            padding: 0.5rem;
            position: relative;
            min-height: 40px;
        }
        .menu-btn {
            order: 0; /* Leftmost */
            margin-right: 0.5rem;
        }
        .header-container {
            flex-grow: 1;
            justify-content: center;
            align-items: center;
            gap: 5px;
            order: 1; /* Middle */
        }
        .site-title {
            font-size: 1.3rem;
            white-space: nowrap;
        }
        .site-tagline {
            display: none;
        }
        .nav-container {
            background: transparent;
            padding: 0;
            order: 2; /* Right side with search */
        }
        nav {
            display: flex;
            justify-content: flex-end;
        }
        .search-bar {
            margin-left: 0.5rem;
            order: 2; /* Rightmost */
        }
    }
    @media (min-width: 769px) {
        .top-wrapper {
            display: block;
        }
        .nav-container {
            margin-top: 0;
        }
    }
`;
document.head.appendChild(style);

// Start the process
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, starting component load');
    loadCommonComponents();
});
