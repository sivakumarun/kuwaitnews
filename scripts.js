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
        // Wrap header and navigation in a single flex container
        document.body.insertAdjacentHTML('afterbegin', '<div class="top-wrapper"></div>');
        const wrapper = document.querySelector('.top-wrapper');

        // Load header
        const headerLoaded = await loadComponent('/kuwaitnews/includes/header.html', '.top-wrapper', 'beforeend');
        if (!headerLoaded) throw new Error('Header failed to load');

        // Load navigation
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

        document.dispatchEvent(new Event('commonComponentsLoaded'));
        console.log('Common components loaded successfully');
    } catch (error) {
        console.error('Error in loadCommonComponents:', error);
    }
}

// Add mobile view styling
const style = document.createElement('style');
style.textContent = `
    .top-wrapper {
        width: 100%;
        position: relative;
    }
    @media (max-width: 768px) {
        .top-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            min-height: 80px; /* Match header height */
        }
        .header-bg {
            width: 100%;
            padding: 0; /* Let header-container handle padding */
            background: linear-gradient(135deg, #CE1126, #007A3D); /* Reinforce gradient */
        }
        .header-container {
            width: 100%;
            padding: 1rem;
            flex-direction: row; /* Keep logo and text inline */
            justify-content: center;
            align-items: center;
            gap: 1rem;
        }
        .logo-container {
            flex-grow: 1;
            justify-content: center;
        }
        .site-title {
            font-size: 1.2rem; /* Adjust for mobile */
        }
        .site-tagline {
            display: none; /* Hide tagline in mobile */
        }
    }
`;
document.head.appendChild(style);

// Start the process
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded, starting component load');
    loadCommonComponents();
});
